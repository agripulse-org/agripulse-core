package com.agripulse.api.service.impl;

import com.agripulse.api.client.agripulseai.AgriPulseAiClient;
import com.agripulse.api.dto.soil_analysis.CropRecommendationResult;
import com.agripulse.api.model.enums.SoilType;
import com.agripulse.api.service.CropRecommendationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CropRecommendationServiceImpl implements CropRecommendationService {

    private static final Logger log = LoggerFactory.getLogger(CropRecommendationServiceImpl.class);

    private final AgriPulseAiClient agriPulseAiClient;

    @Override
    public List<CropRecommendationResult> getRecommendations(
            double nitrogen,
            double temperature,
            double humidity,
            double ph,
            double moisture,
            SoilType soilType
    ) {
        try {
            var requestBody = new AgriPulseAiClient.CropsRequest(nitrogen, temperature, humidity, ph, moisture, soilType);
            var response = agriPulseAiClient.recommendCrops(requestBody);

            return response.recommendations().stream()
                    .map(r -> new CropRecommendationResult(r.crop(), r.recommendationScore()))
                    .toList();
        } catch (RestClientException e) {
            log.error("Failed to fetch crop recommendations from AgriPulse AI", e);
            throw e;
        }
    }
}
