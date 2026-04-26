package com.agripulse.api.dto.soil_note;

import jakarta.validation.constraints.Size;

import java.util.Set;

public record UpdateSoilNoteDTO(
        @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
        String title,

        @Size(max = 10000, message = "Description must not exceed 10000 characters")
        String description,

        @Size(max = 25, message = "No more than 25 tags are allowed")
        Set<@Size(min = 1, max = 64, message = "Tags must be between 1 and 64 characters") String> tags
) {
}
