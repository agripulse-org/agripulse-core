package com.agripulse.api.model.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class SoilProfileNotFoundException extends RuntimeException {
    public SoilProfileNotFoundException(UUID profileId) {
        super("Soil profile not found: " + profileId);
    }
}

