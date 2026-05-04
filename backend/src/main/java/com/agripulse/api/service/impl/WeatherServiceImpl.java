package com.agripulse.api.service.impl;

import com.agripulse.api.client.openweather.OpenWeatherClient;
import com.agripulse.api.model.domain.WeatherData;
import com.agripulse.api.model.exceptions.WeatherFetchException;
import com.agripulse.api.service.WeatherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;

@Service
public class WeatherServiceImpl implements WeatherService {

    private static final Logger log = LoggerFactory.getLogger(WeatherServiceImpl.class);

    private final OpenWeatherClient openWeatherClient;

    public WeatherServiceImpl(OpenWeatherClient openWeatherClient) {
        this.openWeatherClient = openWeatherClient;
    }

    @Override
    public WeatherData getWeatherForLocation(double latitude, double longitude) {
        OpenWeatherClient.OpenWeatherResponse response;
        try {
            response = openWeatherClient.getWeather(latitude, longitude, "metric");
        } catch (WeatherFetchException e) {
            throw e;
        } catch (RestClientResponseException e) {
            throw new WeatherFetchException("OpenWeather API error: HTTP " + e.getStatusCode().value());
        } catch (RuntimeException e) {
            log.error("Failed to reach weather service", e);
            throw new WeatherFetchException("Failed to reach weather service");
        }

        if (response == null || response.main() == null) {
            throw new WeatherFetchException("OpenWeather API returned an empty response");
        }

        String description = (response.weather() != null && !response.weather().isEmpty())
                ? response.weather().getFirst().description()
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
}
