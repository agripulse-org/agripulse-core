package com.agripulse.api.service.impl;

import com.agripulse.api.model.domain.SoilProperties;
import com.agripulse.api.model.exceptions.SoilGridsFetchException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.offset;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.queryParam;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class SoilPropertiesServiceImplTest {

    private static final String DEPTH = "0-5cm";

    private MockRestServiceServer server;
    private SoilPropertiesServiceImpl service;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder();
        server = MockRestServiceServer.bindTo(builder).build();
        service = new SoilPropertiesServiceImpl(builder);
    }

    @Test
    void getPropertiesForLocation_appliesCorrectUnitConversions() {
        // Raw mean values as SoilGrids returns them (before d_factor division)
        // phh2o ÷ 10, soc ÷ 10, nitrogen ÷ 100, clay/sand/silt ÷ 10, bdod ÷ 100
        String json = buildSoilGridsResponse(65.0, 28.0, 14.0, 200.0, 600.0, 200.0, 135.0);

        server.expect(requestTo(containsString("/properties/query")))
                .andExpect(queryParam("lat", "41.9973"))
                .andExpect(queryParam("lon", "21.428"))
                .andExpect(queryParam("depth", DEPTH))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        SoilProperties result = service.getPropertiesForLocation(41.9973, 21.428, DEPTH);

        System.out.println("=== getPropertiesForLocation_appliesCorrectUnitConversions ===");
        System.out.printf("  phH2o        : %.2f  (raw 65  ÷ 10)%n",  result.phH2o());
        System.out.printf("  organicCarbon: %.2f  (raw 28  ÷ 10)%n",  result.organicCarbon());
        System.out.printf("  nitrogen     : %.3f (raw 14  ÷ 100)%n", result.nitrogen());
        System.out.printf("  clay         : %.1f (raw 200 ÷ 10)%n",  result.clay());
        System.out.printf("  sand         : %.1f (raw 600 ÷ 10)%n",  result.sand());
        System.out.printf("  silt         : %.1f (raw 200 ÷ 10)%n",  result.silt());
        System.out.printf("  bulkDensity  : %.2f (raw 135 ÷ 100)%n", result.bulkDensity());

        assertThat(result.phH2o()).isCloseTo(6.5, offset(0.001));
        assertThat(result.organicCarbon()).isCloseTo(2.8, offset(0.001));
        assertThat(result.nitrogen()).isCloseTo(0.14, offset(0.001));
        assertThat(result.clay()).isCloseTo(20.0, offset(0.001));
        assertThat(result.sand()).isCloseTo(60.0, offset(0.001));
        assertThat(result.silt()).isCloseTo(20.0, offset(0.001));
        assertThat(result.bulkDensity()).isCloseTo(1.35, offset(0.001));
    }

    @Test
    void getPropertiesForLocation_withNullMean_returnsNullForThatProperty() {
        String json = """
                {
                  "properties": {
                    "layers": [
                      {
                        "name": "phh2o",
                        "depths": [{ "label": "0-5cm", "values": { "mean": null } }]
                      },
                      {
                        "name": "soc",
                        "depths": [{ "label": "0-5cm", "values": { "mean": 28.0 } }]
                      }
                    ]
                  }
                }
                """;

        server.expect(requestTo(containsString("/properties/query")))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        SoilProperties result = service.getPropertiesForLocation(41.9973, 21.428, DEPTH);

        System.out.println("=== getPropertiesForLocation_withNullMean ===");
        System.out.println("  phH2o        : " + result.phH2o() + " (expected null)");
        System.out.printf("  organicCarbon: %.2f%n", result.organicCarbon());

        assertThat(result.phH2o()).isNull();
        assertThat(result.organicCarbon()).isCloseTo(2.8, offset(0.001));
    }

    @Test
    void getPropertiesForLocation_withMismatchedDepthLabel_returnsNullForProperty() {
        // Response contains only "5-15cm" depth; we request "0-5cm" → no match → null
        String json = """
                {
                  "properties": {
                    "layers": [
                      {
                        "name": "phh2o",
                        "depths": [{ "label": "5-15cm", "values": { "mean": 65.0 } }]
                      }
                    ]
                  }
                }
                """;

        server.expect(requestTo(containsString("/properties/query")))
                .andRespond(withSuccess(json, MediaType.APPLICATION_JSON));

        SoilProperties result = service.getPropertiesForLocation(41.9973, 21.428, DEPTH);

        System.out.println("=== getPropertiesForLocation_withMismatchedDepthLabel ===");
        System.out.println("  phH2o: " + result.phH2o() + " (requested 0-5cm, response had 5-15cm → expected null)");

        assertThat(result.phH2o()).isNull();
    }

    @Test
    void getPropertiesForLocation_onApiError_throwsSoilGridsFetchException() {
        server.expect(requestTo(containsString("/properties/query")))
                .andRespond(withServerError());

        assertThatThrownBy(() -> service.getPropertiesForLocation(41.9973, 21.428, DEPTH))
                .isInstanceOf(SoilGridsFetchException.class)
                .hasMessageContaining("500")
                .satisfies(ex -> System.out.println("=== onApiError === exception: " + ex.getMessage()));
    }

    // Builds a full 7-layer SoilGrids response with the given raw mean values
    private String buildSoilGridsResponse(
            double phh2o, double soc, double nitrogen,
            double clay, double sand, double silt, double bdod) {
        return """
                {
                  "properties": {
                    "layers": [
                      { "name": "phh2o",    "depths": [{ "label": "0-5cm", "values": { "mean": %s } }] },
                      { "name": "soc",      "depths": [{ "label": "0-5cm", "values": { "mean": %s } }] },
                      { "name": "nitrogen", "depths": [{ "label": "0-5cm", "values": { "mean": %s } }] },
                      { "name": "clay",     "depths": [{ "label": "0-5cm", "values": { "mean": %s } }] },
                      { "name": "sand",     "depths": [{ "label": "0-5cm", "values": { "mean": %s } }] },
                      { "name": "silt",     "depths": [{ "label": "0-5cm", "values": { "mean": %s } }] },
                      { "name": "bdod",     "depths": [{ "label": "0-5cm", "values": { "mean": %s } }] }
                    ]
                  }
                }
                """.formatted(phh2o, soc, nitrogen, clay, sand, silt, bdod);
    }
}
