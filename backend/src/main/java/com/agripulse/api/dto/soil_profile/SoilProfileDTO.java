package com.agripulse.api.dto.soil_profile;

import com.agripulse.api.model.domain.SoilProfile;

import java.util.UUID;

public record SoilProfileDTO(
        UUID id,
        String name,
        String description,
        Double latitude,
        Double longitude,
        String city,
        String country
) {
    public static SoilProfileDTO from(SoilProfile profile) {
        return new SoilProfileDTO(
                profile.getId(),
                profile.getName(),
                profile.getDescription(),
                profile.getLatitude(),
                profile.getLongitude(),
                profile.getCity(),
                profile.getCountry()
        );
    }
}

