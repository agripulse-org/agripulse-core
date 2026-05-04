package com.agripulse.api.service;

import com.agripulse.api.model.domain.WeatherData;

public interface WeatherService {
    WeatherData getWeatherForLocation(double latitude, double longitude);
}
