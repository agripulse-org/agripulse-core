package com.agripulse.api.service.impl;

import com.agripulse.api.dto.soil_note.CreateSoilNoteDTO;
import com.agripulse.api.dto.soil_note.UpdateSoilNoteDTO;
import com.agripulse.api.model.domain.SoilNote;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.model.exceptions.SoilNoteNotFoundException;
import com.agripulse.api.model.exceptions.SoilProfileNotFoundException;
import com.agripulse.api.repository.SoilNoteRepository;
import com.agripulse.api.repository.SoilProfileRepository;
import com.agripulse.api.service.SoilNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.agripulse.api.service.specification.FieldFilterSpecification.filterCollectionContains;
import static com.agripulse.api.service.specification.FieldFilterSpecification.filterContainsText;
import static com.agripulse.api.service.specification.FieldFilterSpecification.filterEqualsV;

@Service
@RequiredArgsConstructor
public class SoilNoteServiceImpl implements SoilNoteService {

    private final SoilNoteRepository soilNoteRepository;
    private final SoilProfileRepository soilProfileRepository;

    @Override
    @Transactional(readOnly = true)
    public List<SoilNote> filterNotes(UserId userId, Optional<UUID> soilProfileId, Optional<String> search, Optional<String> tag) {
        String tagValue = tag.map(this::normalizeTag).orElse(null);

        Specification<SoilNote> specification = Specification.allOf(
                filterEqualsV(SoilNote.class, "soilProfile.userId", userId),
                filterCollectionContains(SoilNote.class, "tags", tagValue),
                Specification.anyOf(
                        filterContainsText(SoilNote.class, "title", search.orElse("")),
                        filterContainsText(SoilNote.class, "description", search.orElse(""))
                )
        );

        if (soilProfileId.isPresent()) {
            specification = specification.and(filterEqualsV(SoilNote.class, "soilProfile.id", soilProfileId.get()));
        }

        return soilNoteRepository.findAll(specification);
    }

    @Override
    @Transactional(readOnly = true)
    public SoilNote getNote(UserId userId, UUID noteId) {
        var note = soilNoteRepository
                .findById(noteId)
                .orElseThrow(() -> new SoilNoteNotFoundException(noteId));

        if (!note.getSoilProfile().getUserId().equals(userId)) {
            throw new SoilNoteNotFoundException(noteId);
        }

        return note;
    }

    @Override
    public SoilNote createNote(UserId userId, CreateSoilNoteDTO request) {
        var profile = soilProfileRepository.findById(request.soilProfileId())
                .orElseThrow(() -> new SoilProfileNotFoundException(request.soilProfileId()));

        if (!profile.getUserId().equals(userId)) {
            throw new SoilProfileNotFoundException(request.soilProfileId());
        }

        SoilNote note = request.toEntity(profile, normalizeTags(request.tags()));
        return soilNoteRepository.save(note);
    }

    @Override
    public SoilNote updateNote(UserId userId, UUID noteId, UpdateSoilNoteDTO request) {
        SoilNote note = soilNoteRepository
                .findById(noteId)
                .orElseThrow(() -> new SoilNoteNotFoundException(noteId));

        if (!note.getSoilProfile().getUserId().equals(userId)) {
            throw new SoilNoteNotFoundException(noteId);
        }

        if (request.title() != null) {
            note.setTitle(request.title());
        }
        if (request.description() != null) {
            note.setDescription(request.description());
        }
        if (request.tags() != null) {
            note.setTags(normalizeTags(request.tags()));
        }
        note.setUpdatedAt(LocalDateTime.now());

        return soilNoteRepository.save(note);
    }

    @Override
    public void deleteNote(UserId userId, UUID noteId) {
        SoilNote note = soilNoteRepository
                .findById(noteId)
                .orElseThrow(() -> new SoilNoteNotFoundException(noteId));

        if (!note.getSoilProfile().getUserId().equals(userId)) {
            throw new SoilNoteNotFoundException(noteId);
        }

        soilNoteRepository.delete(note);
    }

    private Set<String> normalizeTags(Set<String> raw) {
        if (raw == null) return Set.of();

        return raw.stream()
                .map(this::normalizeTag)
                .filter(Objects::nonNull)
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private String normalizeTag(String tag) {
        if (tag == null || tag.isBlank()) return null;

        // Normalize whitespace and store as lowercase to avoid duplicates case-insensitively.
        return tag.trim().toLowerCase(Locale.ROOT);
    }
}
