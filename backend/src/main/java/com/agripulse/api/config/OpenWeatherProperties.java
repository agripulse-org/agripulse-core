package com.agripulse.api.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "agripulse.openweather")
@Getter
@Setter
public class OpenWeatherProperties {
    private String apiKey = "";
}
