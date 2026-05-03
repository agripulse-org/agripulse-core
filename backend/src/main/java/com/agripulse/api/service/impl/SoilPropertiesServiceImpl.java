package com.agripulse.api.service.impl;

import com.agripulse.api.model.domain.SoilProperties;
import com.agripulse.api.model.exceptions.SoilGridsFetchException;
import com.agripulse.api.service.SoilPropertiesService;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SoilPropertiesServiceImpl implements SoilPropertiesService {

    private static final String BASE_URL = "https://rest.isric.org/soilgrids/v2.0";

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

    private final RestClient restClient;

    public SoilPropertiesServiceImpl(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.baseUrl(BASE_URL).build();
    }

    @Override
    public SoilProperties getPropertiesForLocation(double latitude, double longitude, String depth) {
        SoilGridsResponse response;
        try {
            response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/properties/query")
                            .queryParam("lat", latitude)
                            .queryParam("lon", longitude)
                            .queryParam("property", "phh2o", "soc", "nitrogen", "clay", "sand", "silt", "bdod")
                            .queryParam("depth", depth)
                            .queryParam("value", "mean")
                            .build())
                    .retrieve()
                    .onStatus(status -> !status.is2xxSuccessful(),
                            (req, res) -> {
                                throw new SoilGridsFetchException(
                                        "SoilGrids API error: HTTP " + res.getStatusCode().value());
                            })
                    .body(SoilGridsResponse.class);
        } catch (SoilGridsFetchException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new SoilGridsFetchException("Failed to reach SoilGrids service: " + e.getMessage());
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

    private Map<String, Double> extractAndConvert(List<SoilGridsResponse.Layer> layers, String depth) {
        Map<String, Double> result = new HashMap<>();
        for (SoilGridsResponse.Layer layer : layers) {
            if (layer.name() != null && DIVISORS.containsKey(layer.name())) {
                result.put(layer.name(), convertRaw(layer.name(), meanForDepth(layer, depth)));
            }
        }
        return result;
    }

    private Double meanForDepth(SoilGridsResponse.Layer layer, String depth) {
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

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record SoilGridsResponse(
            @JsonProperty("properties") Properties properties
    ) {
        @JsonIgnoreProperties(ignoreUnknown = true)
        record Properties(
                @JsonProperty("layers") List<Layer> layers
        ) {}

        @JsonIgnoreProperties(ignoreUnknown = true)
        record Layer(
                @JsonProperty("name") String name,
                @JsonProperty("depths") List<Depth> depths
        ) {}

        @JsonIgnoreProperties(ignoreUnknown = true)
        record Depth(
                @JsonProperty("label") String label,
                @JsonProperty("values") Values values
        ) {}

        @JsonIgnoreProperties(ignoreUnknown = true)
        record Values(
                @JsonProperty("mean") Double mean
        ) {}
    }
}
