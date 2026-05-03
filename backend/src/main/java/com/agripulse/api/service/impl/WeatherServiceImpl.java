package com.agripulse.api.service.impl;

import com.agripulse.api.config.OpenWeatherProperties;
import com.agripulse.api.model.domain.WeatherData;
import com.agripulse.api.model.exceptions.WeatherFetchException;
import com.agripulse.api.service.WeatherService;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class WeatherServiceImpl implements WeatherService {

    private static final String BASE_URL = "https://api.openweathermap.org/data/2.5";

    private final RestClient restClient;
    private final OpenWeatherProperties properties;

    public WeatherServiceImpl(RestClient.Builder restClientBuilder, OpenWeatherProperties properties) {
        this.restClient = restClientBuilder.baseUrl(BASE_URL).build();
        this.properties = properties;
    }

    @Override
    public WeatherData getWeatherForLocation(double latitude, double longitude) {
        OpenWeatherResponse response;
        try {
            response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/weather")
                            .queryParam("lat", latitude)
                            .queryParam("lon", longitude)
                            .queryParam("appid", properties.getApiKey())
                            .queryParam("units", "metric")
                            .build())
                    .retrieve()
                    .onStatus(status -> !status.is2xxSuccessful(),
                            (req, res) -> {
                                throw new WeatherFetchException(
                                        "OpenWeather API error: HTTP " + res.getStatusCode().value());
                            })
                    .body(OpenWeatherResponse.class);
        } catch (WeatherFetchException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new WeatherFetchException("Failed to reach weather service: " + e.getMessage());
        }

        if (response == null || response.main() == null) {
            throw new WeatherFetchException("OpenWeather API returned an empty response");
        }

        String description = (response.weather() != null && !response.weather().isEmpty())
                ? response.weather().get(0).description()
                : "";

        Double rain = (response.rain() != null) ? response.rain().oneHour() : null;

        return new WeatherData(
                response.main().temp(),
                response.main().humidity(),
                response.wind() != null ? response.wind().speed() : 0.0,
                description,
                rain
        );
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record OpenWeatherResponse(
            @JsonProperty("main") Main main,
            @JsonProperty("wind") Wind wind,
            @JsonProperty("weather") List<WeatherCondition> weather,
            @JsonProperty("rain") Rain rain
    ) {
        @JsonIgnoreProperties(ignoreUnknown = true)
        record Main(
                @JsonProperty("temp") double temp,
                @JsonProperty("humidity") int humidity
        ) {}

        @JsonIgnoreProperties(ignoreUnknown = true)
        record Wind(
                @JsonProperty("speed") double speed
        ) {}

        @JsonIgnoreProperties(ignoreUnknown = true)
        record WeatherCondition(
                @JsonProperty("description") String description
        ) {}

        @JsonIgnoreProperties(ignoreUnknown = true)
        record Rain(
                @JsonProperty("1h") Double oneHour
        ) {}
    }
}
