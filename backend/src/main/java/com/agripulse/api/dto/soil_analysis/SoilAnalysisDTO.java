package com.agripulse.api.dto.soil_analysis;

import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.enums.AnalysisStatus;
import com.agripulse.api.model.enums.CropType;
import com.agripulse.api.model.enums.SoilDepth;
import com.agripulse.api.model.enums.SoilTexture;
import com.agripulse.api.model.value.Concentration;
import com.agripulse.api.model.value.VolumetricWater;
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
        SoilTexture soilTexture,
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
        List<CropRecommendationDTO> cropRecommendations
) {

    public static SoilAnalysisDTO from(SoilAnalysis analysis) {
        return new SoilAnalysisDTO(
                analysis.getId(),
                analysis.getSoilProfile().getId(),
                analysis.getCreatedAt(),
                analysis.getUpdatedAt(),

                analysis.getSoilDepth(),
                analysis.getSoilTexture(),
                analysis.getStatus(),

                analysis.getPh(),
                Concentration.valueOf(analysis.getNitrogen()),
                analysis.getCec(),
                Concentration.valueOf(analysis.getOrganicCarbon()),

                Concentration.valueOf(analysis.getSandContent()),
                Concentration.valueOf(analysis.getSiltContent()),
                Concentration.valueOf(analysis.getClayContent()),
                analysis.getBulkDensity(),
                VolumetricWater.valueOf(analysis.getCoarseFragments()),

                VolumetricWater.valueOf(analysis.getPlantAvailableWater()),

                analysis.getTemperatureAvgC(),
                analysis.getTemperatureMinC(),
                analysis.getTemperatureMaxC(),
                analysis.getAvgHumidityPercent(),
                analysis.getTotalPrecipitationMm(),

                analysis.getCropRecommendations() != null
                        ? CropRecommendationDTO.from(analysis.getCropRecommendations())
                        : null
        );
    }

    record CropRecommendationDTO(
            CropType crop,
            double confidencePercentage
    ) {
        public static CropRecommendationDTO from(CropRecommendationResult result) {
            return new CropRecommendationDTO(result.crop(), result.recommendationScore() * 100.0);
        }

        public static List<CropRecommendationDTO> from(List<CropRecommendationResult> results) {
            return results.stream()
                    .map(CropRecommendationDTO::from)
                    .toList();
        }
    }
}
