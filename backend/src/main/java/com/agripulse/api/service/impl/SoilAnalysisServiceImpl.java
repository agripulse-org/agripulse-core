package com.agripulse.api.service.impl;

import com.agripulse.api.dto.soil_analysis.CreateSoilAnalysisDTO;
import com.agripulse.api.job.SoilAnalysisJob;
import com.agripulse.api.model.view.SoilAnalysisReportModel;
import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.model.exceptions.SoilAnalysisNotFoundException;
import com.agripulse.api.model.projections.ProfileLastAnalysisProjection;
import com.agripulse.api.repository.SoilAnalysisRepository;
import com.agripulse.api.service.PdfGeneratorService;
import com.agripulse.api.service.SoilAnalysisCsvParser;
import com.agripulse.api.service.SoilAnalysisService;
import com.agripulse.api.service.SoilProfileService;
import lombok.RequiredArgsConstructor;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SoilAnalysisServiceImpl implements SoilAnalysisService {

    private static final Logger log = LoggerFactory.getLogger(SoilAnalysisServiceImpl.class);

    private final SoilAnalysisRepository soilAnalysisRepository;
    private final SoilProfileService soilProfileService;
    private final SoilAnalysisCsvParser csvParser;
    private final PdfGeneratorService pdfGeneratorService;
    private final TemplateEngine templateEngine;
    private final Scheduler scheduler;

    @Override
    public List<SoilAnalysis> findAll(UserId userId, UUID soilProfileId) {
        return soilAnalysisRepository
                .findBySoilProfile_IdAndSoilProfile_UserIdOrderByCreatedAtDesc(soilProfileId, userId);
    }

    @Override
    public SoilAnalysis getAnalysis(UserId userId, UUID soilProfileId, UUID analysisId) {
        return soilAnalysisRepository
                .findByIdAndSoilProfile_IdAndSoilProfile_UserId(analysisId, soilProfileId, userId)
                .orElseThrow(()->new SoilAnalysisNotFoundException(analysisId));
    }

    @Override
    @Transactional
    public SoilAnalysis create(
            UserId userId,
            UUID soilProfileId,
            CreateSoilAnalysisDTO request
    ) {

        var profile = soilProfileService.getProfileById(userId, soilProfileId);

        SoilAnalysis analysis = new SoilAnalysis(profile, request.soilDepth());
        SoilAnalysis saved = soilAnalysisRepository.save(analysis);

        scheduleAnalysisProcessingJob(saved.getId());

        return saved;
    }

    @Override
    public void delete(UserId userId, UUID soilProfileId, UUID analysisId) {
        SoilAnalysis analysis = getAnalysis(userId, soilProfileId, analysisId);

        soilAnalysisRepository.delete(analysis);

    }

    @Override
    @Transactional
    public List<SoilAnalysis> uploadCsv(
            UserId userId,
            UUID soilProfileId,
            MultipartFile file
    ) {
        SoilProfile soilProfile = soilProfileService.getProfileById(userId, soilProfileId);

        List<SoilAnalysis> analyses = csvParser.parse(file, soilProfile);

        List<SoilAnalysis> saved = soilAnalysisRepository.saveAll(analyses);

        saved.forEach(a -> scheduleAnalysisProcessingJob(a.getId()));

        return saved;
    }

    @Override
    public byte[] exportReport(UserId userId, UUID soilProfileId, UUID analysisId) {
        SoilAnalysis analysis = getAnalysis(userId, soilProfileId, analysisId);

        Context context = new Context();
        context.setVariable("report", SoilAnalysisReportModel.from(analysis));

        String html = templateEngine.process("soil-analysis-report", context);
        return pdfGeneratorService.generateFromHtml(html);
    }

    @Override
    public Map<UUID, LocalDateTime> getLastFinishedAnalysisTimestampPerSoilByUser(UserId userId) {
        return soilAnalysisRepository.findLastFinishedAtPerProfile(userId)
                .stream()
                .collect(Collectors.toMap(
                        ProfileLastAnalysisProjection::getSoilProfileId,
                        ProfileLastAnalysisProjection::getLastAnalysisAt
                ));
    }

    private void scheduleAnalysisProcessingJob(UUID analysisId) {
        JobDetail jobDetail = JobBuilder.newJob(SoilAnalysisJob.class)
                .withIdentity("analysis-" + analysisId, "soil-analyses")
                .usingJobData(SoilAnalysisJob.ANALYSIS_ID_KEY, analysisId.toString())
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("analysis-trigger-" + analysisId, "soil-analyses")
                .startNow()
                .build();

        try {
            scheduler.scheduleJob(jobDetail, trigger);
        } catch (SchedulerException e) {
            log.error("Failed to schedule analysis processing job for {}", analysisId, e);
            throw new RuntimeException("Failed to schedule analysis processing", e);
        }
    }
}
