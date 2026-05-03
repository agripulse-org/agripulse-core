package com.agripulse.api.service.impl;

import com.agripulse.api.config.OpenWeatherProperties;
import com.agripulse.api.model.domain.WeatherData;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

class WeatherServiceIntegrationTest {

    // Skopje, North Macedonia
    private static final double LAT = 41.9973;
    private static final double LON = 21.428;

    private WeatherServiceImpl service;

    @BeforeEach
    void setUp() {
        String apiKey = System.getenv("OPENWEATHER_API_KEY");
        Assumptions.assumeTrue(
                apiKey != null && !apiKey.isBlank(),
                "Skipping: OPENWEATHER_API_KEY environment variable is not set"
        );

        OpenWeatherProperties properties = new OpenWeatherProperties();
        properties.setApiKey(apiKey);
        service = new WeatherServiceImpl(RestClient.builder(), properties);
    }

    @Test
    void fetchesRealWeatherFromOpenWeather() {
        WeatherData result = service.getWeatherForLocation(LAT, LON);

        System.out.println("=== OpenWeather real response (lat=" + LAT + ", lon=" + LON + ") ===");
        System.out.printf("  Temperature  : %.1f °C%n", result.temperatureCelsius());
        System.out.printf("  Humidity     : %d%%%n", result.humidity());
        System.out.printf("  Wind speed   : %.1f m/s%n", result.windSpeedMs());
        System.out.printf("  Description  : %s%n", result.description());
        System.out.printf("  Rain (last 1h): %s mm%n", result.rainLastHourMm());
    }
}
