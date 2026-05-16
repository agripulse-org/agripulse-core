package com.agripulse.api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CropType {
    WHEAT("wheat"),
    BARLEY("barley"),
    RYE("rye"),
    OATS("oats"),
    CORN("corn"),
    RAPESEED("rapeseed"),
    SUNFLOWER("sunflower"),
    SOYBEAN("soybean"),
    POTATO("potato"),
    SUGAR_BEET("sugar_beet"),
    TOMATO("tomato"),
    CHERRY("cherry"),
    PEACH("peach");

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