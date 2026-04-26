package com.agripulse.api.dto.soil_note;

import com.agripulse.api.model.domain.SoilNote;
import com.agripulse.api.model.domain.SoilProfile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;
import java.util.UUID;

public record CreateSoilNoteDTO(
        UUID soilProfileId,

        @NotBlank(message = "Title is required")
        @Size(max = 255, message = "Title must not exceed 255 characters")
        String title,

        @Size(max = 10000, message = "Description must not exceed 10000 characters")
        String description,

        @Size(max = 25, message = "No more than 25 tags are allowed")
        Set<@Size(min = 1, max = 64, message = "Tags must be between 1 and 64 characters") String> tags
) {
    
    public SoilNote toEntity(SoilProfile soilProfile, Set<String> normalizedTags) {
        return new SoilNote(soilProfile, title, description, normalizedTags);
    }
}
