package com.agripulse.api.service.impl;

import com.agripulse.api.config.OpenWeatherProperties;
import com.agripulse.api.model.domain.WeatherData;
import com.agripulse.api.model.exceptions.WeatherFetchException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.queryParam;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class WeatherServiceImplTest {

    private MockRestServiceServer server;
    private WeatherServiceImpl service;

    @BeforeEach
    void setUp() {
        OpenWeatherProperties properties = new OpenWeatherProperties();
        properties.setApiKey("test-api-key");

        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        service = new WeatherServiceImpl(builder, properties);
    }

    @Test
    void getWeatherForLocation_mapsAllFieldsIncludingRain() {
        String json = """
                {
                  "main": { "temp": 18.5, "humidity": 65 },
                  "wind": { "speed": 3.5 },
                  "weather": [{ "description": "clear sky" }],
                  "rain":   { "1h": 0.5 }
                }
                """;

        server.expect(requestTo(containsString("/weather")))
                .andExpect(queryParam("lat", "41.9973"))
                .andExpect(queryParam("lon", "21.428"))
                .andExpect(queryParam("units", "metric"))
                .andExpect(queryParam("appid", "test-api-key"))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        WeatherData result = service.getWeatherForLocation(41.9973, 21.428);

        System.out.println("=== getWeatherForLocation_mapsAllFieldsIncludingRain ===");
        System.out.println("  temperatureCelsius : " + result.temperatureCelsius());
        System.out.println("  humidity           : " + result.humidity() + "%");
        System.out.println("  windSpeedMs        : " + result.windSpeedMs());
        System.out.println("  description        : " + result.description());
        System.out.println("  rainLastHourMm     : " + result.rainLastHourMm());

        assertThat(result.temperatureCelsius()).isEqualTo(18.5);
        assertThat(result.humidity()).isEqualTo(65);
        assertThat(result.windSpeedMs()).isEqualTo(3.5);
        assertThat(result.description()).isEqualTo("clear sky");
        assertThat(result.rainLastHourMm()).isEqualTo(0.5);
    }

    @Test
    void getWeatherForLocation_withoutRainField_returnsNullRain() {
        String json = """
                {
                  "main": { "temp": 25.0, "humidity": 40 },
                  "wind": { "speed": 2.0 },
                  "weather": [{ "description": "sunny" }]
                }
                """;

        server.expect(requestTo(containsString("/weather")))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        WeatherData result = service.getWeatherForLocation(41.9973, 21.428);

        System.out.println("=== getWeatherForLocation_withoutRainField_returnsNullRain ===");
        System.out.println("  temperatureCelsius : " + result.temperatureCelsius());
        System.out.println("  humidity           : " + result.humidity() + "%");
        System.out.println("  windSpeedMs        : " + result.windSpeedMs());
        System.out.println("  description        : " + result.description());
        System.out.println("  rainLastHourMm     : " + result.rainLastHourMm() + " (expected null)");

        assertThat(result.rainLastHourMm()).isNull();
        assertThat(result.temperatureCelsius()).isEqualTo(25.0);
    }

    @Test
    void getWeatherForLocation_onServerError_throwsWeatherFetchException() {
        server.expect(requestTo(containsString("/weather")))
                .andRespond(withServerError());

        assertThatThrownBy(() -> service.getWeatherForLocation(41.9973, 21.428))
                .isInstanceOf(WeatherFetchException.class)
                .hasMessageContaining("500")
                .satisfies(ex -> System.out.println("=== onServerError === exception: " + ex.getMessage()));
    }

    @Test
    void getWeatherForLocation_onUnauthorized_throwsWeatherFetchException() {
        server.expect(requestTo(containsString("/weather")))
                .andRespond(withStatus(HttpStatus.UNAUTHORIZED));

        assertThatThrownBy(() -> service.getWeatherForLocation(41.9973, 21.428))
                .isInstanceOf(WeatherFetchException.class)
                .hasMessageContaining("401")
                .satisfies(ex -> System.out.println("=== onUnauthorized === exception: " + ex.getMessage()));
    }
}
