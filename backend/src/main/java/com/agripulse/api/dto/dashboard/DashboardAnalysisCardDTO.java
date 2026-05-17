package com.agripulse.api.dto.dashboard;

import com.agripulse.api.dto.soil_analysis.CropRecommendationResult;
import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.enums.CropType;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record DashboardAnalysisCardDTO(

        UUID id,

        DashboardSoilProfileDTO soilProfile,

        LocalDateTime createdAt,

        String soilDepth,

        @Schema(nullable = true)
        List<DashboardCropRecommendationDTO> recommendations

) {

    public static DashboardAnalysisCardDTO from(
            SoilAnalysis analysis
    ) {

        return new DashboardAnalysisCardDTO(

                analysis.getId(),

                DashboardSoilProfileDTO.from(analysis.getSoilProfile()),

                analysis.getCreatedAt(),

                analysis.getSoilDepth().getLabel(),

                analysis.getCropRecommendations() != null
                        ? DashboardCropRecommendationDTO.from(analysis.getCropRecommendations())
                        : null
        );
    }

    record DashboardSoilProfileDTO(
            UUID id,

            String city,

            String country

    ) {

        public static DashboardSoilProfileDTO from(
                SoilProfile soilProfile
        ) {

            return new DashboardSoilProfileDTO(
                    soilProfile.getId(),

                    soilProfile.getCity(),

                    soilProfile.getCountry()
            );
        }
    }

    record DashboardCropRecommendationDTO(
            CropType crop,
            double confidencePercentage
    ) {
        static DashboardCropRecommendationDTO from(CropRecommendationResult result) {
            return new DashboardCropRecommendationDTO(result.crop(), result.recommendationScore() * 100.0);
        }

        static List<DashboardCropRecommendationDTO> from(List<CropRecommendationResult> results) {
            return results.stream()
                    .map(DashboardCropRecommendationDTO::from)
                    .toList();
        }
    }

}