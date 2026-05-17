package com.agripulse.api.service.impl;

import com.agripulse.api.client.soilgrids.SoilGridsClient;
import com.agripulse.api.model.domain.SoilProperties;
import com.agripulse.api.model.exceptions.SoilGridsFetchException;
import com.agripulse.api.model.value.Concentration;
import com.agripulse.api.model.value.VolumetricWater;
import com.agripulse.api.service.SoilPropertiesService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;

@Service
public class SoilPropertiesServiceImpl implements SoilPropertiesService {

    private static final Logger log = LoggerFactory.getLogger(SoilPropertiesServiceImpl.class);

    private static final List<String> SOIL_PROPERTIES = List.of(
            "phh2o", "soc", "nitrogen", "clay", "sand", "silt", "bdod", "cec", "cfvo", "wv0033", "wv1500");

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

        List<SoilGridsClient.SoilGridsResponse.Layer> layers = response.properties().layers();

        return new SoilProperties(
                divide(mean(layers, "phh2o",    depth), 10.0),            // pH×10 → pH
                Concentration.ofDgPerKg(    mean(layers, "soc",      depth)), // dg/kg → g/kg
                Concentration.ofCgPerKg(    mean(layers, "nitrogen", depth)), // cg/kg → g/kg
                Concentration.ofTenthGPerKg(mean(layers, "clay",     depth)), // g/kg×10 → g/kg
                Concentration.ofTenthGPerKg(mean(layers, "sand",     depth)),
                Concentration.ofTenthGPerKg(mean(layers, "silt",     depth)),
                divide(mean(layers, "bdod",  depth), 100.0),              // cg/cm³ → g/cm³
                divide(mean(layers, "cec",   depth),  10.0),              // mmol_c/kg×10 → mmol_c/kg
                VolumetricWater.ofMilliCm3PerCm3(mean(layers, "cfvo",  depth)),
                VolumetricWater.ofMilliCm3PerCm3(mean(layers, "wv0033", depth)),
                VolumetricWater.ofMilliCm3PerCm3(mean(layers, "wv1500", depth))
        );
    }

    private Double mean(List<SoilGridsClient.SoilGridsResponse.Layer> layers, String property, String depth) {
        return layers.stream()
                .filter(l -> property.equals(l.name()))
                .findFirst()
                .map(l -> meanForDepth(l, depth))
                .orElse(null);
    }

    private Double meanForDepth(SoilGridsClient.SoilGridsResponse.Layer layer, String depth) {
        if (layer.depths() == null) return null;
        return layer.depths().stream()
                .filter(d -> depth.equals(d.label()))
                .findFirst()
                .map(d -> d.values() != null ? d.values().mean() : null)
                .orElse(null);
    }

    private static Double divide(Double raw, double divisor) {
        return raw != null ? raw / divisor : null;
    }
}
