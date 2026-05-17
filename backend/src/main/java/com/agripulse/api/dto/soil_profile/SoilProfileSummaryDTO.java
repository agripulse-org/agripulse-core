package com.agripulse.api.dto.soil_profile;

import com.agripulse.api.model.domain.SoilProfile;

import java.time.LocalDateTime;
import java.util.UUID;

public record SoilProfileSummaryDTO(
        UUID id,
        String name,
        String description,
        Double latitude,
        Double longitude,
        String city,
        String country,
        LocalDateTime createdAt,
        LocalDateTime lastAnalysisAt
) {
    public static SoilProfileSummaryDTO from(SoilProfile profile, LocalDateTime lastAnalysisAt) {
        return new SoilProfileSummaryDTO(
                profile.getId(),
                profile.getName(),
                profile.getDescription(),
                profile.getLatitude(),
                profile.getLongitude(),
                profile.getCity(),
                profile.getCountry(),
                profile.getCreatedAt(),
                lastAnalysisAt
        );
    }
}
