package com.agripulse.api.dto.soil_analysis;

import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.SoilProfile;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateSoilAnalysisDTO(

        @NotNull(message = "Soil profile id is required")
        UUID soilProfileId

) {

    public SoilAnalysis toEntity(SoilProfile soilProfile) {
        return new SoilAnalysis(soilProfile);
    }
}