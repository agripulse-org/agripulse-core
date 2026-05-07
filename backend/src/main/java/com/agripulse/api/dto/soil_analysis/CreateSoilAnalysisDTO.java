package com.agripulse.api.dto.soil_analysis;

import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.SoilProfile;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreateSoilAnalysisDTO(

) {

    public SoilAnalysis toEntity(SoilProfile soilProfile) {
        return new SoilAnalysis(soilProfile);
    }
}