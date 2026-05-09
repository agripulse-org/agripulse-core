package com.agripulse.api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum SoilType {
    SANDY("sandy"),
    LOAMY("loamy"),
    BLACK("black"),
    RED("red"),
    CLAYEY("clayey");

    private final String value;

    SoilType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static SoilType fromValue(String value) {
        for (SoilType type : values()) {
            if (type.value.equals(value)) return type;
        }
        throw new IllegalArgumentException("Unknown soil type: " + value);
    }
}
