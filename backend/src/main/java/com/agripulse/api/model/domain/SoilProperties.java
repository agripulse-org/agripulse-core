package com.agripulse.api.model.domain;

/**
 * Soil property values returned from SoilGrids v2.0.
 * Units after conversion: phH2o (-), organicCarbon/nitrogen/clay/sand/silt (g/kg),
 * bulkDensity (g/cm³). Null means the API did not return a value for that property.
 */
public record SoilProperties(
        Double phH2o,
        Double organicCarbon,
        Double nitrogen,
        Double clay,
        Double sand,
        Double silt,
        Double bulkDensity
) {}
