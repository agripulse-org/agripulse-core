package com.agripulse.api.client.openweather;

import com.agripulse.api.model.exceptions.WeatherFetchException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OpenWeatherClientFallback implements OpenWeatherClient {

    private static final Logger log = LoggerFactory.getLogger(OpenWeatherClientFallback.class);

    @Override
    public OpenWeatherResponse getWeather(double lat, double lon, String units) {
        log.warn("Weather service circuit open, failing fast");
        throw new WeatherFetchException("Weather service is temporarily unavailable");
    }
}
