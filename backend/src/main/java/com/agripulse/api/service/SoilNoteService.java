package com.agripulse.api.service;

import com.agripulse.api.dto.soil_note.CreateSoilNoteDTO;
import com.agripulse.api.dto.soil_note.UpdateSoilNoteDTO;
import com.agripulse.api.model.domain.SoilNote;
import com.agripulse.api.model.domain.UserId;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SoilNoteService {
    List<SoilNote> filterNotes(UserId userId, Optional<UUID> soilProfileId, Optional<String> q, Optional<String> tag);

    SoilNote getNote(UserId userId, UUID noteId);

    SoilNote createNote(UserId userId, CreateSoilNoteDTO request);

    SoilNote updateNote(UserId userId, UUID noteId, UpdateSoilNoteDTO request);

    void deleteNote(UserId userId, UUID noteId);
}
