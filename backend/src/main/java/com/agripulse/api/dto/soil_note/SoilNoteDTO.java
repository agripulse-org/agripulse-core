package com.agripulse.api.dto.soil_note;

import com.agripulse.api.model.domain.SoilNote;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record SoilNoteDTO(
        UUID id,
        SoilProfileSummaryDTO soilProfile,
        String title,
        String description,
        Set<String> tags,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    
    public static SoilNoteDTO from(SoilNote note) {
        return new SoilNoteDTO(
                note.getId(),
                SoilProfileSummaryDTO.from(note),
                note.getTitle(),
                note.getDescription(),
                note.getTags(),
                note.getCreatedAt(),
                note.getUpdatedAt()
        );
    }

    record SoilProfileSummaryDTO(
        UUID id,
        String name
    ) {
        public static SoilProfileSummaryDTO from(SoilNote note) {
            return new SoilProfileSummaryDTO(
                    note.getSoilProfile().getId(),
                    note.getSoilProfile().getName()
            );
        }
    }
}
