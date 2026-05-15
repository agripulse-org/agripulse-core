package com.agripulse.api.dto.soil_analysis;

import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.enums.SoilDepth;
import com.agripulse.api.model.enums.AnalysisStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record SoilAnalysisDTO(
        UUID id,
        UUID soilProfileId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,

        SoilDepth soilDepth,
        AnalysisStatus status,

        Double ph,
        Double nitrogen,
        Double cec,
        Double organicCarbon,

        Double sandContent,
        Double siltContent,
        Double clayContent,
        Double bulkDensity,
        Double coarseFragments,

        Double plantAvailableWater,

        Double temperatureAvgC,
        Double temperatureMinC,
        Double temperatureMaxC,
        Double avgHumidityPercent,
        Double totalPrecipitationMm,

        @Schema(nullable = true)
        List<CropRecommendationResult> cropRecommendations
) {

    public static SoilAnalysisDTO from(
            SoilAnalysis analysis
    ) {

        return new SoilAnalysisDTO(
                analysis.getId(),
                analysis.getSoilProfile().getId(),
                analysis.getCreatedAt(),
                analysis.getUpdatedAt(),

                analysis.getSoilDepth(),
                analysis.getStatus(),

                analysis.getPh(),
                analysis.getNitrogen(),
                analysis.getCec(),
                analysis.getOrganicCarbon(),

                analysis.getSandContent(),
                analysis.getSiltContent(),
                analysis.getClayContent(),
                analysis.getBulkDensity(),
                analysis.getCoarseFragments(),

                analysis.getPlantAvailableWater(),

                analysis.getTemperatureAvgC(),
                analysis.getTemperatureMinC(),
                analysis.getTemperatureMaxC(),
                analysis.getAvgHumidityPercent(),
                analysis.getTotalPrecipitationMm(),

                analysis.getCropRecommendations()
        );
    }
}