package com.agripulse.api.service.impl;

import com.agripulse.api.client.openweather.OpenWeatherClient;
import com.agripulse.api.model.domain.WeatherData;
import com.agripulse.api.model.exceptions.WeatherFetchException;
import com.agripulse.api.service.WeatherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;

import java.util.List;
import java.util.OptionalDouble;

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
                response.main().tempMin(),
                response.main().tempMax(),
                response.main().humidity(),
                response.wind() != null ? response.wind().speed() : 0.0,
                description,
                rain
        );
    }

    @Override
    public WeatherData getWeatherForecastForLocation(double latitude, double longitude) {
        OpenWeatherClient.ForecastResponse response;

        try {
            response = openWeatherClient.getForecast(latitude, longitude, "metric");
        } catch (WeatherFetchException e) {
            throw e;
        } catch (RestClientResponseException e) {
            throw new WeatherFetchException("OpenWeather API error: HTTP " + e.getStatusCode().value());
        } catch (RuntimeException e) {
            log.error("Failed to reach weather service", e);
            throw new WeatherFetchException("Failed to reach weather service");
        }

        if (response == null || response.list() == null || response.list().isEmpty()) {
            throw new WeatherFetchException("OpenWeather API returned an empty forecast response");
        }

        var slots = response.list();

        double tempAvg = slots.stream()
                .mapToDouble(s -> s.main().temp())
                .average()
                .orElse(0.0);

        OptionalDouble tempMinOpt = slots.stream()
                .filter(s -> s.main().tempMin() != null)
                .mapToDouble(s -> s.main().tempMin())
                .min();
        Double tempMin = tempMinOpt.isPresent() ? tempMinOpt.getAsDouble() : null;

        OptionalDouble tempMaxOpt = slots.stream()
                .filter(s -> s.main().tempMax() != null)
                .mapToDouble(s -> s.main().tempMax())
                .max();
        Double tempMax = tempMaxOpt.isPresent() ? tempMaxOpt.getAsDouble() : null;

        int avgHumidity = (int) Math.round(slots.stream()
                .mapToInt(s -> s.main().humidity())
                .average()
                .orElse(0.0));

        double totalPrecipitation = slots.stream()
                .mapToDouble(s -> s.rain() != null && s.rain().threeHour() != null ? s.rain().threeHour() : 0.0)
                .sum();

        return new WeatherData(tempAvg, tempMin, tempMax, avgHumidity, 0.0, "", totalPrecipitation);
    }
}
