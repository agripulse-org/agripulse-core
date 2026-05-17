package com.agripulse.api.model.value;

import jakarta.persistence.Embeddable;

/**
 * default unit: g/kg
 */
@Embeddable
public record Concentration(double value) {

    public static Concentration ofCgPerKg(Double raw) {
        if (raw == null) return null;
        return new Concentration(raw / 100.0);
    }

    public static Concentration ofDgPerKg(Double raw) {
        if (raw == null) return null;
        return new Concentration(raw / 10.0);
    }

    public static Concentration ofTenthGPerKg(Double raw) {
        if (raw == null) return null;
        return new Concentration(raw / 10.0);
    }

    public double toCgPerKg() {
        return value * 100.0;
    }

    public static Double valueOf(Concentration c) {
        return c != null ? c.value() : null;
    }
}
