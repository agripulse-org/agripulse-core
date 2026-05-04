package com.agripulse.api.client.openweather;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

import java.util.List;

@HttpExchange
public interface OpenWeatherClient {

    @GetExchange("/weather")
    OpenWeatherResponse getWeather(
            @RequestParam("lat") double lat,
            @RequestParam("lon") double lon,
            @RequestParam("units") String units
    );

    @JsonIgnoreProperties(ignoreUnknown = true)
    record OpenWeatherResponse(
            @JsonProperty("main") Main main,
            @JsonProperty("wind") Wind wind,
            @JsonProperty("weather") List<WeatherCondition> weather,
            @JsonProperty("rain") Rain rain
    ) {
        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Main(
                @JsonProperty("temp") double temp,
                @JsonProperty("humidity") int humidity
        ) {}

        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Wind(
                @JsonProperty("speed") double speed
        ) {}

        @JsonIgnoreProperties(ignoreUnknown = true)
        public record WeatherCondition(
                @JsonProperty("description") String description
        ) {}

        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Rain(
                @JsonProperty("1h") Double oneHour
        ) {}
    }
}
