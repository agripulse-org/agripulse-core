package com.agripulse.api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CropType {
    MAIZE("maize"),
    SUGARCANE("sugarcane"),
    COTTON("cotton"),
    TOBACCO("tobacco"),
    PADDY("paddy"),
    BARLEY("barley"),
    WHEAT("wheat"),
    MILLETS("millets"),
    OIL_SEEDS("oil_seeds"),
    PULSES("pulses"),
    GROUND_NUTS("ground_nuts");

    private final String value;

    CropType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static CropType fromValue(String value) {
        for (CropType type : values()) {
            if (type.value.equals(value)) return type;
        }
        throw new IllegalArgumentException("Unknown crop type: " + value);
    }
}
