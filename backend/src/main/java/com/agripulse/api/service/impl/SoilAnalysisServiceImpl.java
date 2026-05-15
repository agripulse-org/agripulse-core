package com.agripulse.api.service.impl;
import com.agripulse.api.dto.soil_analysis.CreateSoilAnalysisDTO;
import com.agripulse.api.model.view.SoilAnalysisReportModel;
import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.model.exceptions.SoilAnalysisNotFoundException;
import com.agripulse.api.repository.SoilAnalysisRepository;
import com.agripulse.api.service.PdfGeneratorService;
import com.agripulse.api.service.SoilAnalysisCsvParser;
import com.agripulse.api.service.SoilAnalysisService;
import com.agripulse.api.service.SoilProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SoilAnalysisServiceImpl implements SoilAnalysisService {

    private final SoilAnalysisRepository soilAnalysisRepository;
    private final SoilProfileService soilProfileService;
    private final SoilAnalysisCsvParser csvParser;
    private final PdfGeneratorService pdfGeneratorService;
    private final TemplateEngine templateEngine;

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
    public SoilAnalysis create(
            UserId userId,
            UUID soilProfileId,
            CreateSoilAnalysisDTO request
    ) {

        var profile = soilProfileService.getProfileById(userId, soilProfileId);

        SoilAnalysis analysis = new SoilAnalysis(profile, request.soilDepth());

        return soilAnalysisRepository.save(analysis);
    }

    @Override
    public void delete(UserId userId, UUID soilProfileId, UUID analysisId) {
        SoilAnalysis analysis = getAnalysis(userId, soilProfileId, analysisId);

        soilAnalysisRepository.delete(analysis);

    }

    @Override
    public List<SoilAnalysis> uploadCsv(
            UserId userId,
            UUID soilProfileId,
            MultipartFile file
    ) {
        SoilProfile soilProfile = soilProfileService.getProfileById(userId, soilProfileId);

        List<SoilAnalysis> analyses = csvParser.parse(file, soilProfile);

        return soilAnalysisRepository.saveAll(analyses);
    }

    @Override
    public byte[] exportReport(UserId userId, UUID soilProfileId, UUID analysisId) {
        SoilAnalysis analysis = getAnalysis(userId, soilProfileId, analysisId);

        Context context = new Context();
        context.setVariable("report", SoilAnalysisReportModel.from(analysis));

        String html = templateEngine.process("soil-analysis-report", context);
        return pdfGeneratorService.generateFromHtml(html);
    }
}
