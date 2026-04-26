package com.agripulse.api.model.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SoilNoteNotFoundException extends RuntimeException {
    public SoilNoteNotFoundException(UUID noteId) {
        super("Soil note not found: " + noteId);
    }
}
