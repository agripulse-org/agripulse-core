package com.agripulse.api.service;

import java.util.UUID;

public interface SoilAnalysisProcessor {

    void process(UUID analysisId) throws Exception;

    void markFailed(UUID analysisId, String reason);
}
