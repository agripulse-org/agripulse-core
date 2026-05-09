package com.agripulse.api.service;

import com.agripulse.api.dto.soil_analysis.CreateSoilAnalysisDTO;
import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.model.enums.SoilDepth;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
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
            MultipartFile file,
            SoilDepth soilDepth
    );

    byte[] exportReport(
            UserId userId,
            UUID soilProfileId,
            UUID analysisId
    );
}