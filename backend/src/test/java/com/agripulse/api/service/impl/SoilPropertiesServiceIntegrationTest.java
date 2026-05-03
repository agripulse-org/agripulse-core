package com.agripulse.api.service.impl;

import com.agripulse.api.model.domain.SoilProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;
class SoilPropertiesServiceIntegrationTest {

    // Rural Netherlands — confirmed to return non-null data for all 7 properties.
    // SoilGrids rasters have gaps; urban centres and some rural points return null.
    private static final double LAT = 52.0;
    private static final double LON = 5.0;
    private static final String DEPTH = "0-5cm";

    private SoilPropertiesServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new SoilPropertiesServiceImpl(RestClient.builder());
    }

    @Test
    void fetchesRealSoilPropertiesFromSoilGrids() {
        SoilProperties result = service.getPropertiesForLocation(LAT, LON, DEPTH);

        System.out.println("=== SoilGrids real response (lat=" + LAT + ", lon=" + LON + ", depth=" + DEPTH + ") ===");
        System.out.printf("  pH (H2O)       : %s%n", result.phH2o());
        System.out.printf("  Organic carbon : %s g/kg%n", result.organicCarbon());
        System.out.printf("  Nitrogen       : %s g/kg%n", result.nitrogen());
        System.out.printf("  Clay           : %s g/kg%n", result.clay());
        System.out.printf("  Sand           : %s g/kg%n", result.sand());
        System.out.printf("  Silt           : %s g/kg%n", result.silt());
        System.out.printf("  Bulk density   : %s g/cm³%n", result.bulkDensity());
    }
}
