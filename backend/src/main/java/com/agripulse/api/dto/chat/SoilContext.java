package com.agripulse.api.dto.chat;

import com.agripulse.api.model.domain.SoilNote;
import com.agripulse.api.model.domain.SoilProfile;

import java.util.List;
import java.util.Set;

public record SoilContext(
        String name,
        String description,
        String city,
        String country,
        Double latitude,
        Double longitude,
        List<NoteContext> recentNotes
) {
    public record NoteContext(String title, String description, Set<String> tags) {
        public static NoteContext from(SoilNote note) {
            return new NoteContext(note.getTitle(), note.getDescription(), note.getTags());
        }
    }

    public static SoilContext from(SoilProfile profile, List<SoilNote> notes) {
        List<NoteContext> noteContexts = notes.stream()
                .map(NoteContext::from)
                .toList();
        return new SoilContext(
                profile.getName(),
                profile.getDescription(),
                profile.getCity(),
                profile.getCountry(),
                profile.getLatitude(),
                profile.getLongitude(),
                noteContexts
        );
    }
}
