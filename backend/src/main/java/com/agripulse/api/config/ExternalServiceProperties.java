package com.agripulse.api.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "agripulse")
@Getter
@Setter
public class ExternalServiceProperties {

    private OpenWeather openweather = new OpenWeather();
    private Soilgrids soilgrids = new Soilgrids();

    @Getter
    @Setter
    public static class OpenWeather {
        private String baseUrl = "https://api.openweathermap.org/data/2.5";
        private String apiKey = "";
    }

    @Getter
    @Setter
    public static class Soilgrids {
        private String baseUrl = "https://rest.isric.org/soilgrids/v2.0";
    }
}
