package com.agripulse.api.dto.soil_analysis;

import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.enums.SoilDepth;
import com.agripulse.api.model.enums.Status;

import java.time.LocalDateTime;
import java.util.UUID;

public record SoilAnalysisDTO(

        UUID id,

        LocalDateTime createdAt,
        LocalDateTime updatedAt,

        SoilDepth soilDepth,
        Status status,

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

        Double plantAvailableWater,

        // Weather

        Double temperatureAvgC,
        Double temperatureMinC,
        Double temperatureMaxC,
        Double avgHumidityPercent,
        Double totalPrecipitationMm

) {

    public static SoilAnalysisDTO from(
            SoilAnalysis analysis
    ) {

        return new SoilAnalysisDTO(

                analysis.getId(),

                analysis.getCreatedAt(),
                analysis.getUpdatedAt(),

                analysis.getSoilDepth(),
                analysis.getStatus(),

                // Soil chemistry

                analysis.getPh(),
                analysis.getNitrogen(),
                analysis.getCec(),
                analysis.getOrganicCarbon(),

                // Soil structure

                analysis.getSandContent(),
                analysis.getSiltContent(),
                analysis.getClayContent(),
                analysis.getBulkDensity(),
                analysis.getCoarseFragments(),

                // Water

                analysis.getPlantAvailableWater(),

                // Weather

                analysis.getTemperatureAvgC(),
                analysis.getTemperatureMinC(),
                analysis.getTemperatureMaxC(),
                analysis.getAvgHumidityPercent(),
                analysis.getTotalPrecipitationMm()
        );
    }
}