package com.agripulse.api.model.value;

import jakarta.persistence.Embeddable;

/**
 * default unit: vol%
 */
@Embeddable
public record VolumetricWater(double value) {

    public static VolumetricWater ofMilliCm3PerCm3(Double raw) {
        if (raw == null) return null;
        return new VolumetricWater(raw / 10.0);
    }

    public VolumetricWater minus(VolumetricWater other) {
        return new VolumetricWater(this.value - other.value);
    }

    public static Double valueOf(VolumetricWater w) {
        return w != null ? w.value() : null;
    }
}
