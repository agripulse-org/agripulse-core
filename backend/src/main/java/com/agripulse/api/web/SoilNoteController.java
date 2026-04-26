package com.agripulse.api.web;

import com.agripulse.api.dto.soil_note.CreateSoilNoteDTO;
import com.agripulse.api.dto.soil_note.SoilNoteDTO;
import com.agripulse.api.dto.soil_note.UpdateSoilNoteDTO;
import com.agripulse.api.model.domain.SoilNote;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.service.SoilNoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/soil-notes")
@RequiredArgsConstructor
public class SoilNoteController {

    private final SoilNoteService soilNoteService;

    @GetMapping
    public List<SoilNoteDTO> filterNotes(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(name = "soilProfileId", required = false) UUID soilProfileId,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "tag", required = false) String tag
    ) {
        var userId = UserId.of(jwt.getSubject());
        return soilNoteService
                .filterNotes(userId, Optional.ofNullable(soilProfileId), Optional.ofNullable(search), Optional.ofNullable(tag))
                .stream()
                .map(SoilNoteDTO::from)
                .toList();
    }

    @GetMapping("/{noteId}")
    public SoilNoteDTO getNote(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID noteId) {
        var userId = UserId.of(jwt.getSubject());
        SoilNote note = soilNoteService.getNote(userId, noteId);
        return SoilNoteDTO.from(note);
    }

    @PostMapping
    public ResponseEntity<SoilNoteDTO> createNote(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CreateSoilNoteDTO request) {
        var userId = UserId.of(jwt.getSubject());
        SoilNote note = soilNoteService.createNote(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SoilNoteDTO.from(note));
    }

    @PatchMapping("/{noteId}")
    public SoilNoteDTO updateNote(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID noteId, @Valid @RequestBody UpdateSoilNoteDTO request) {
        var userId = UserId.of(jwt.getSubject());
        SoilNote note = soilNoteService.updateNote(userId, noteId, request);
        return SoilNoteDTO.from(note);
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<Void> deleteNote(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID noteId) {
        var userId = UserId.of(jwt.getSubject());
        soilNoteService.deleteNote(userId, noteId);
        return ResponseEntity.noContent().build();
    }
}
