package com.agripulse.api.job;

import com.agripulse.api.service.SoilAnalysisProcessor;
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

@DisallowConcurrentExecution
public class SoilAnalysisJob implements Job {

    public static final String ANALYSIS_ID_KEY = "analysisId";
    private static final int MAX_REFIRES = 3;

    private static final Logger log = LoggerFactory.getLogger(SoilAnalysisJob.class);

    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    @Autowired
    private SoilAnalysisProcessor analysisProcessor;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        UUID analysisId = UUID.fromString(context.getJobDetail().getJobDataMap().getString(ANALYSIS_ID_KEY));
        int refireCount = context.getRefireCount();

        try {
            analysisProcessor.process(analysisId);
        } catch (Exception e) {
            if (refireCount < MAX_REFIRES) {
                log.warn("Analysis {} attempt {} failed, refiring: {}", analysisId, refireCount + 1, e.getMessage());
                throw new JobExecutionException(e, true);
            }

            log.error("Analysis {} permanently failed after {} attempts", analysisId, refireCount + 1, e);
            analysisProcessor.markFailed(analysisId, e.getMessage());
        }
    }
}
