package com.agripulse.api.model.domain;

import com.agripulse.api.model.value.Concentration;
import com.agripulse.api.model.value.VolumetricWater;

public record SoilProperties(
        Double phH2o,
        Concentration organicCarbon,
        Concentration nitrogen,
        Concentration clay,
        Concentration sand,
        Concentration silt,
        Double bulkDensity,
        Double cec,
        VolumetricWater coarseFragments,
        VolumetricWater fieldCapacity,
        VolumetricWater wiltingPoint
) {}
