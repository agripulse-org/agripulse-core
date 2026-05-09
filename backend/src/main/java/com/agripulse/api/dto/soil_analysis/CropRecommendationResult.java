package com.agripulse.api.dto.soil_analysis;

import com.agripulse.api.model.enums.CropType;

public record CropRecommendationResult(CropType crop, double recommendationScore) {}
