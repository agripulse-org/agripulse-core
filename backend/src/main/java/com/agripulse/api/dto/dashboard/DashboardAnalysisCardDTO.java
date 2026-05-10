package com.agripulse.api.dto.dashboard;

import com.agripulse.api.dto.soil_analysis.CropRecommendationResult;
import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.SoilProfile;
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
        List<CropRecommendationResult> recommendations

) {

    public static DashboardAnalysisCardDTO from(
            SoilAnalysis analysis
    ) {

        return new DashboardAnalysisCardDTO(

                analysis.getId(),

                DashboardSoilProfileDTO.from(analysis.getSoilProfile()),

                analysis.getCreatedAt(),

                analysis.getSoilDepth().getLabel(),

                analysis.getCropRecommendations()
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
}