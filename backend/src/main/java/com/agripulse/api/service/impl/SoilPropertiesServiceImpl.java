package com.agripulse.api.service.impl;

import com.agripulse.api.client.soilgrids.SoilGridsClient;
import com.agripulse.api.model.domain.SoilProperties;
import com.agripulse.api.model.exceptions.SoilGridsFetchException;
import com.agripulse.api.service.SoilPropertiesService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SoilPropertiesServiceImpl implements SoilPropertiesService {

    private static final Logger log = LoggerFactory.getLogger(SoilPropertiesServiceImpl.class);

    private static final List<String> SOIL_PROPERTIES = List.of(
            "phh2o", "soc", "nitrogen", "clay", "sand", "silt", "bdod");

    // SoilGrids stores values multiplied by a d_factor; divide to get standard units.
    // phh2o: pH×10 → ÷10 = pH (-)
    // soc:   dg/kg  → ÷10 = g/kg
    // nitrogen: cg/kg → ÷100 = g/kg
    // clay/sand/silt: g/kg×10 → ÷10 = g/kg
    // bdod:  cg/cm³ → ÷100 = g/cm³
    private static final Map<String, Double> DIVISORS = Map.of(
            "phh2o",    10.0,
            "soc",      10.0,
            "nitrogen", 100.0,
            "clay",     10.0,
            "sand",     10.0,
            "silt",     10.0,
            "bdod",     100.0
    );

    private final SoilGridsClient soilGridsClient;

    public SoilPropertiesServiceImpl(SoilGridsClient soilGridsClient) {
        this.soilGridsClient = soilGridsClient;
    }

    @Override
    public SoilProperties getPropertiesForLocation(double latitude, double longitude, String depth) {
        if (depth == null || depth.isBlank()) {
            throw new IllegalArgumentException("Soil depth is required. Please provide a valid depth value (e.g. \"0-5cm\").");
        }

        SoilGridsClient.SoilGridsResponse response;
        try {
            response = soilGridsClient.getSoilProperties(latitude, longitude, SOIL_PROPERTIES, depth, "mean");
        } catch (SoilGridsFetchException e) {
            throw e;
        } catch (RestClientResponseException e) {
            throw new SoilGridsFetchException("SoilGrids API error: HTTP " + e.getStatusCode().value());
        } catch (RuntimeException e) {
            log.error("Failed to reach SoilGrids service", e);
            throw new SoilGridsFetchException("Failed to reach SoilGrids service");
        }

        if (response == null
                || response.properties() == null
                || response.properties().layers() == null) {
            throw new SoilGridsFetchException("SoilGrids API returned an empty or invalid response");
        }

        Map<String, Double> converted = extractAndConvert(response.properties().layers(), depth);

        return new SoilProperties(
                converted.get("phh2o"),
                converted.get("soc"),
                converted.get("nitrogen"),
                converted.get("clay"),
                converted.get("sand"),
                converted.get("silt"),
                converted.get("bdod")
        );
    }

    private Map<String, Double> extractAndConvert(List<SoilGridsClient.SoilGridsResponse.Layer> layers, String depth) {
        Map<String, Double> result = new HashMap<>();
        for (SoilGridsClient.SoilGridsResponse.Layer layer : layers) {
            if (layer.name() != null && DIVISORS.containsKey(layer.name())) {
                result.put(layer.name(), convertRaw(layer.name(), meanForDepth(layer, depth)));
            }
        }
        return result;
    }

    private Double meanForDepth(SoilGridsClient.SoilGridsResponse.Layer layer, String depth) {
        if (layer.depths() == null) return null;
        return layer.depths().stream()
                .filter(d -> depth.equals(d.label()))
                .findFirst()
                .map(d -> d.values() != null ? d.values().mean() : null)
                .orElse(null);
    }

    private Double convertRaw(String property, Double raw) {
        if (raw == null) return null;
        return raw / DIVISORS.get(property);
    }
}
