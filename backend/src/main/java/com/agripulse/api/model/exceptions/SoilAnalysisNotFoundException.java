package com.agripulse.api.model.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SoilAnalysisNotFoundException extends RuntimeException {

    public SoilAnalysisNotFoundException(UUID id) {
        super("Soil analysis not found: " + id);
    }
}