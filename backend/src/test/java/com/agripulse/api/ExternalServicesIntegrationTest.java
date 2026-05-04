package com.agripulse.api;

import com.agripulse.api.model.domain.SoilProperties;
import com.agripulse.api.model.domain.WeatherData;
import com.agripulse.api.service.SoilPropertiesService;
import com.agripulse.api.service.WeatherService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class ExternalServicesIntegrationTest {

    private static final double LAT = 41.8780;  // Illinois
    private static final double LON = -93.0977; // Iowa area

    @Autowired
    WeatherService weatherService;

    @Autowired
    SoilPropertiesService soilPropertiesService;

    @Test
    @EnabledIfEnvironmentVariable(named = "OPENWEATHER_API_KEY", matches = ".+")
    void weatherService_returnsCurrentConditions() {
        WeatherData data = weatherService.getWeatherForLocation(LAT, LON);

        System.out.println("Retrieved weather data: " + data);

        assertThat(data).isNotNull();
        assertThat(data.temperatureCelsius()).isBetween(-60.0, 60.0);
        assertThat(data.humidity()).isBetween(0, 100);
        assertThat(data.windSpeedMs()).isGreaterThanOrEqualTo(0.0);
        assertThat(data.description()).isNotNull();
    }

    @Test
    void soilGridsService_returnsSoilPropertiesForTopsoil() {
        SoilProperties props = soilPropertiesService.getPropertiesForLocation(LAT, LON, "0-5cm");

        System.out.println("Retrieved soil properties: " + props);

        assertThat(props).isNotNull();
        assertThat(props.phH2o()).isNotNull().isBetween(0.0, 14.0);
        assertThat(props.organicCarbon()).isNotNull().isGreaterThanOrEqualTo(0.0);
        assertThat(props.clay()).isNotNull().isBetween(0.0, 1000.0);
        assertThat(props.sand()).isNotNull().isBetween(0.0, 1000.0);
        assertThat(props.silt()).isNotNull().isBetween(0.0, 1000.0);
    }
}
