package com.agripulse.api.client.soilgrids;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.util.List;

@HttpExchange
public interface SoilGridsClient {

    @GetExchange("/properties/query")
    SoilGridsResponse getSoilProperties(
            @RequestParam("lat") double lat,
            @RequestParam("lon") double lon,
            @RequestParam("property") List<String> property,
            @RequestParam("depth") String depth,
            @RequestParam("value") String value
    );

    @JsonIgnoreProperties(ignoreUnknown = true)
    record SoilGridsResponse(
            @JsonProperty("properties") Properties properties
    ) {
        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Properties(
                @JsonProperty("layers") List<Layer> layers
        ) {}

        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Layer(
                @JsonProperty("name") String name,
                @JsonProperty("depths") List<Depth> depths
        ) {}

        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Depth(
                @JsonProperty("label") String label,
                @JsonProperty("values") Values values
        ) {}

        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Values(
                @JsonProperty("mean") Double mean
        ) {}
    }
}
