package com.agripulse.api.model.domain;

public record WeatherData(
        double temperatureCelsius,
        Double temperatureMinCelsius,
        Double temperatureMaxCelsius,
        int humidity,
        double windSpeedMs,
        String description,
        Double rainLastHourMm
) {}
