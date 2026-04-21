package com.agripulse.api.dto.soil_profile;

import com.agripulse.api.model.domain.SoilProfile;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;

public record UpdateSoilProfileDTO(
        @Size(min = 1, max = 255, message = "Name must be between 1 and 255 characters")
        String name,

        @Size(max = 1000, message = "Description must not exceed 1000 characters")
        String description,

        @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
        @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
        Double latitude,

        @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
        @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
        Double longitude
) {
    public SoilProfile toEntity() {
        return new SoilProfile(name, description, latitude, longitude, null);
    }
}

