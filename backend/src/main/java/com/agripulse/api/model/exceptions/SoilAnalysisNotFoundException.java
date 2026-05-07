package com.agripulse.api.model.exceptions;

import java.util.UUID;

public class SoilAnalysisNotFoundException extends RuntimeException {
    public SoilAnalysisNotFoundException(UUID id) {
        super("Soil analysis not found: " + id);
    }
}
