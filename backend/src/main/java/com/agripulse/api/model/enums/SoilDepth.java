package com.agripulse.api.model.enums;

import lombok.Getter;

@Getter
public enum SoilDepth {

    DEPTH_0_5("0-5cm"),
    DEPTH_5_15("5-15cm"),
    DEPTH_15_30("15-30cm"),
    DEPTH_30_60("30-60cm");

    private final String label;

    SoilDepth(String label) {
        this.label = label;
    }

}