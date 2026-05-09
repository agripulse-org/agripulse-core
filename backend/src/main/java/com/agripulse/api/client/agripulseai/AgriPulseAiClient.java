package com.agripulse.api.client.agripulseai;

import com.agripulse.api.model.enums.CropType;
import com.agripulse.api.model.enums.SoilType;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import java.util.List;

@HttpExchange
public interface AgriPulseAiClient {

    @PostExchange("/api/recommendations/crops")
    CropsResponse recommendCrops(@RequestBody CropsRequest request);

    record CropsRequest(
            double nitrogen,
            double temperature,
            double humidity,
            double ph,
            double moisture,
            @JsonProperty("soil_type") SoilType soilType
    ) {}

    record CropsResponse(
            @JsonProperty("best_crop") CropType bestCrop,
            List<CropRecommendation> recommendations
    ) {}

    record CropRecommendation(
            CropType crop,
            @JsonProperty("recommendation_score") double recommendationScore
    ) {}
}
