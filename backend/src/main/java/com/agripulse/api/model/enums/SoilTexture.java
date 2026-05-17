package com.agripulse.api.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum SoilTexture {
    SAND("sand"),
    LOAMY_SAND("loamy_sand"),
    SANDY_LOAM("sandy_loam"),
    LOAM("loam"),
    SILT_LOAM("silt_loam"),
    SILT("silt"),
    SANDY_CLAY_LOAM("sandy_clay_loam"),
    CLAY_LOAM("clay_loam"),
    SILTY_CLAY_LOAM("silty_clay_loam"),
    SANDY_CLAY("sandy_clay"),
    SILTY_CLAY("silty_clay"),
    CLAY("clay");

    private final String value;

    SoilTexture(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static SoilTexture fromValue(String value) {
        for (SoilTexture type : values()) {
            if (type.value.equals(value)) return type;
        }
        throw new IllegalArgumentException("Unknown soil texture: " + value);
    }

    /**
     * Classifies soil into a USDA texture class from sand/silt/clay fractions.
     * Inputs may be expressed as g/kg, percentages, or any consistent unit — they
     * are normalised to percentages of the (sand+silt+clay) total before applying
     * the USDA triangle thresholds.
     */
    public static SoilTexture classify(double sand, double silt, double clay) {
        double total = sand + silt + clay;
        if (total <= 0) {
            throw new IllegalArgumentException("Sand, silt, and clay must sum to a positive value");
        }
        
        double sandPct = sand / total * 100.0;
        double siltPct = silt / total * 100.0;
        double clayPct = clay / total * 100.0;

        if (clayPct >= 40 && siltPct >= 40) return SILTY_CLAY;
        if (clayPct >= 35 && sandPct >= 45) return SANDY_CLAY;
        if (clayPct >= 40) return CLAY;
        if (clayPct >= 27 && sandPct <= 20) return SILTY_CLAY_LOAM;
        if (clayPct >= 27 && sandPct > 20 && sandPct <= 45) return CLAY_LOAM;
        if (clayPct >= 20 && clayPct < 35 && sandPct > 45 && siltPct < 28) return SANDY_CLAY_LOAM;
        if (siltPct >= 80 && clayPct < 12) return SILT;
        if (siltPct >= 50 && clayPct < 27) return SILT_LOAM;
        if (clayPct >= 7 && clayPct < 27 && siltPct >= 28 && siltPct < 50 && sandPct <= 52) return LOAM;
        if (sandPct >= 85 && (siltPct + 1.5 * clayPct) < 15) return SAND;
        if (sandPct >= 70 && sandPct < 90 && (siltPct + 1.5 * clayPct) >= 15 && (siltPct + 2 * clayPct) < 30)
            return LOAMY_SAND;
        return SANDY_LOAM;
    }

}
