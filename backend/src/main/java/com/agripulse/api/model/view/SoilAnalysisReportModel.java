package com.agripulse.api.model.view;

import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.value.Concentration;
import com.agripulse.api.model.value.VolumetricWater;

import java.time.LocalDateTime;
import java.util.List;

public record SoilAnalysisReportModel(
        LocalDateTime analyzedAt,
        String profileName,
        Double latitude,
        Double longitude,
        String city,
        String country,
        String depthLayer,

        Double ph,
        Double nitrogen,
        Double organicCarbon,
        Double bulkDensity,
        Double cec,

        Double sandContent,
        Double siltContent,
        Double clayContent,
        Double coarseFragments,
        Double plantAvailableWater,

        Double temperatureAvgC,
        Double temperatureMinC,
        Double temperatureMaxC,
        Double avgHumidityPercent,
        Double totalPrecipitationMm,

        List<?> recommendations
) {
    public static SoilAnalysisReportModel from(SoilAnalysis analysis) {
        SoilProfile profile = analysis.getSoilProfile();
        
        return new SoilAnalysisReportModel(
                analysis.getCreatedAt(),
                profile.getName(),
                profile.getLatitude(),
                profile.getLongitude(),
                profile.getCity(),
                profile.getCountry(),
                analysis.getSoilDepth().getLabel(),

                analysis.getPh(),
                Concentration.valueOf(analysis.getNitrogen()),
                Concentration.valueOf(analysis.getOrganicCarbon()),
                analysis.getBulkDensity(),
                analysis.getCec(),

                Concentration.valueOf(analysis.getSandContent()),
                Concentration.valueOf(analysis.getSiltContent()),
                Concentration.valueOf(analysis.getClayContent()),
                analysis.getCoarseFragments(),
                VolumetricWater.valueOf(analysis.getPlantAvailableWater()),

                analysis.getTemperatureAvgC(),
                analysis.getTemperatureMinC(),
                analysis.getTemperatureMaxC(),
                analysis.getAvgHumidityPercent(),
                analysis.getTotalPrecipitationMm(),

                List.of()
        );
    }
}
