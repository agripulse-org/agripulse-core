package com.agripulse.api.dto.soil_analysis;

import com.agripulse.api.model.enums.SoilDepth;

import jakarta.validation.constraints.NotNull;

public record CreateSoilAnalysisDTO(

        @NotNull(message = "Soil depth is required")
        SoilDepth soilDepth,

        // Soil chemistry

        Double ph,
        Double nitrogen,
        Double cec,
        Double organicCarbon,

        // Soil structure

        Double sandContent,
        Double siltContent,
        Double clayContent,
        Double bulkDensity,
        Double coarseFragments,

        // Water

        Double plantAvailableWater

) {
}