package com.agripulse.api.dto.soil_analysis;

import com.agripulse.api.model.domain.SoilAnalysis;

import java.time.LocalDateTime;
import java.util.UUID;

public record SoilAnalysisDTO(

        UUID id,
        LocalDateTime createdAt,
        LocalDateTime updatedAt

) {

    public static SoilAnalysisDTO from(SoilAnalysis analysis) {
        return new SoilAnalysisDTO(
                analysis.getId(),
                analysis.getCreatedAt(),
                analysis.getUpdatedAt()
        );
    }
}