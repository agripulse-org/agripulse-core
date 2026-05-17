package com.agripulse.api.service;

import com.agripulse.api.dto.soil_analysis.CropRecommendationResult;
import com.agripulse.api.model.enums.SoilTexture;

import java.util.List;

public interface CropRecommendationService {
    
    List<CropRecommendationResult> getRecommendations(
            double nitrogen,
            double temperature,
            double humidity,
            double ph,
            double moisture,
            SoilTexture soilTexture
    );
}
