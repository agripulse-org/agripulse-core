package com.agripulse.api.service;

import com.agripulse.api.dto.soil_analysis.CreateSoilAnalysisDTO;
import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.UserId;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface SoilAnalysisService {

    List<SoilAnalysis> findAll(
            UserId userId,
            UUID soilProfileId
    );


    SoilAnalysis getAnalysis(
            UserId userId,
            UUID soilProfileId,
            UUID analysisId
    );

    SoilAnalysis create(
            UserId userId,
            UUID soilProfileId,
            CreateSoilAnalysisDTO request
    );

    void delete(
            UserId userId,
            UUID soilProfileId,
            UUID analysisId
    );

    List<SoilAnalysis> uploadCsv(
            UserId userId,
            UUID soilProfileId,
            MultipartFile file
    );

    byte[] exportReport(
            UserId userId,
            UUID soilProfileId,
            UUID analysisId
    );

    Map<UUID, LocalDateTime> getLastFinishedAnalysisTimestampPerSoilByUser(UserId userId);
}