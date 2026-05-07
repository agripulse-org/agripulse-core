package com.agripulse.api.service;

import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.enums.SoilDepth;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SoilAnalysisCsvParser {
    List<SoilAnalysis> parse(
            MultipartFile file,
            SoilProfile soilProfile,
            SoilDepth soilDepth
    );
}