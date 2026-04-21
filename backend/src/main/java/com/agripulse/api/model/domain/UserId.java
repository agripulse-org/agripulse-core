package com.agripulse.api.model.domain;

import jakarta.persistence.Embeddable;
import com.fasterxml.jackson.annotation.JsonValue;

@Embeddable
public record UserId(@JsonValue String value) {

    public UserId {
        if (value != null && !value.isBlank()) {
            if (!value.matches("^user_[A-Za-z0-9]+$")) {
                throw new IllegalArgumentException("UserId has invalid Clerk format: " + value);
            }
        }
    }

    public static UserId of(String value) {
        return new UserId(value);
    }
}