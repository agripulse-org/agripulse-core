package com.agripulse.api.model.domain;

public record WeatherData(
        double temperatureCelsius,
        int humidity,
        double windSpeedMs,
        String description,
        Double rainLastHourMm
) {}
