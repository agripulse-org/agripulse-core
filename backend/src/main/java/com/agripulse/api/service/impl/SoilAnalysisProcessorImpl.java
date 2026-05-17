package com.agripulse.api.service.impl;

import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.domain.SoilProperties;
import com.agripulse.api.model.domain.WeatherData;
import com.agripulse.api.model.enums.AnalysisStatus;
import com.agripulse.api.model.enums.SoilTexture;
import com.agripulse.api.model.exceptions.SoilAnalysisNotFoundException;
import com.agripulse.api.model.exceptions.SoilProfileNotFoundException;
import com.agripulse.api.repository.SoilAnalysisRepository;
import com.agripulse.api.repository.SoilProfileRepository;
import com.agripulse.api.service.CropRecommendationService;
import com.agripulse.api.service.SoilAnalysisProcessor;
import com.agripulse.api.service.SoilPropertiesService;
import com.agripulse.api.service.WeatherService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class SoilAnalysisProcessorImpl implements SoilAnalysisProcessor {

    private static final Logger log = LoggerFactory.getLogger(SoilAnalysisProcessorImpl.class);

    private final SoilAnalysisRepository soilAnalysisRepository;
    private final SoilProfileRepository soilProfileRepository;
    private final SoilPropertiesService soilPropertiesService;
    private final WeatherService weatherService;
    private final CropRecommendationService cropRecommendationService;

    @Override
    public void process(UUID analysisId) throws Exception {
        SoilAnalysis analysis = soilAnalysisRepository
                .findById(analysisId)
                .orElseThrow(() -> new SoilAnalysisNotFoundException(analysisId));
        SoilProfile profile = soilProfileRepository
                .findById(analysis.getSoilProfile().getId())
                .orElseThrow(() -> new SoilProfileNotFoundException(analysis.getSoilProfile().getId()));

        if (analysis.getStatus() == AnalysisStatus.FINISHED) {
            log.info("Analysis {} is already finished, skipping processing", analysisId);
            return;
        }

        boolean needsSoil = !hasSoilData(analysis);
        boolean needsWeather = !hasWeatherData(analysis);

        if (needsSoil || needsWeather) {
            double latitude = profile.getLatitude();
            double longitude = profile.getLongitude();

            CompletableFuture<SoilProperties> soilFuture = needsSoil
                    ? CompletableFuture.supplyAsync(() ->
                        soilPropertiesService.getPropertiesForLocation(latitude, longitude, analysis.getSoilDepth().getLabel()))
                    : null;

            CompletableFuture<WeatherData> weatherFuture = needsWeather
                    ? CompletableFuture.supplyAsync(() ->
                        weatherService.getWeatherForecastForLocation(latitude, longitude))
                    : null;

            Throwable soilError = null;
            Throwable weatherError = null;

            if (soilFuture != null) {
                try {
                    applySoilProperties(analysis, soilFuture.get());
                    applyTexture(analysis);
                    soilAnalysisRepository.save(analysis);
                } catch (ExecutionException e) {
                    soilError = e.getCause();
                    log.warn("SoilGrids fetch failed for analysis {}: {}", analysisId, soilError.getMessage());
                }
            }

            if (weatherFuture != null) {
                try {
                    applyWeather(analysis, weatherFuture.get());
                    soilAnalysisRepository.save(analysis);
                } catch (ExecutionException e) {
                    weatherError = e.getCause();
                    log.warn("OpenWeather fetch failed for analysis {}: {}", analysisId, weatherError.getMessage());
                }
            }

            if (soilError != null) throw rethrow(soilError);
            if (weatherError != null) throw rethrow(weatherError);
        }

        if (analysis.getSoilTexture() == null) {
            applyTexture(analysis);
            soilAnalysisRepository.save(analysis);
        }

        if (!hasSoilData(analysis) || !hasWeatherData(analysis) || analysis.getSoilTexture() == null) {
            throw new IllegalStateException("Missing required parameters for crop recommendations");
        }

        var recommendations = cropRecommendationService.getRecommendations(
                analysis.getNitrogen(),
                analysis.getTemperatureAvgC(),
                analysis.getAvgHumidityPercent(),
                analysis.getPh(),
                analysis.getPlantAvailableWater().value(),
                analysis.getSoilTexture()
        );
        analysis.setCropRecommendations(recommendations);
        analysis.setStatus(AnalysisStatus.FINISHED);
        analysis.setFailureReason(null);
        
        soilAnalysisRepository.save(analysis);
    }

    @Override
    public void markFailed(UUID analysisId, String reason) {
        soilAnalysisRepository.findById(analysisId).ifPresent(analysis -> {
            analysis.setStatus(AnalysisStatus.FAILED);
            analysis.setFailureReason(reason);
            soilAnalysisRepository.save(analysis);
        });
    }

    private void applySoilProperties(SoilAnalysis analysis, SoilProperties soil) {
        analysis.setPh(soil.phH2o());
        analysis.setNitrogen(soil.nitrogen());
        analysis.setOrganicCarbon(soil.organicCarbon());
        analysis.setSandContent(soil.sand());
        analysis.setSiltContent(soil.silt());
        analysis.setClayContent(soil.clay());
        analysis.setBulkDensity(soil.bulkDensity());
        analysis.setCec(soil.cec());
        analysis.setCoarseFragments(soil.coarseFragments());

        if (soil.fieldCapacity() == null || soil.wiltingPoint() == null) {
            throw new IllegalStateException("Cannot calculate plant available water: missing field capacity or wilting point from SoilGrids");
        }
        
        analysis.setPlantAvailableWater(soil.fieldCapacity().minus(soil.wiltingPoint()));
    }

    private void applyTexture(SoilAnalysis analysis) {
        if (analysis.getSandContent() == null ||
            analysis.getSiltContent() == null ||
            analysis.getClayContent() == null) {
            return;
        }

        SoilTexture texture = SoilTexture.classify(
                analysis.getSandContent().value(),
                analysis.getSiltContent().value(),
                analysis.getClayContent().value()
        );

        analysis.setSoilTexture(texture);
    }

    private void applyWeather(SoilAnalysis analysis, WeatherData weather) {
        analysis.setTemperatureAvgC(weather.temperatureCelsius());
        analysis.setTemperatureMinC(weather.temperatureMinCelsius());
        analysis.setTemperatureMaxC(weather.temperatureMaxCelsius());
        analysis.setAvgHumidityPercent((double) weather.humidity());
        analysis.setTotalPrecipitationMm(weather.rainLastHourMm());
    }

    private boolean hasSoilData(SoilAnalysis analysis) {
        return analysis.getPh() != null
                && analysis.getNitrogen() != null
                && analysis.getSandContent() != null
                && analysis.getSiltContent() != null
                && analysis.getClayContent() != null
                && analysis.getPlantAvailableWater() != null;
    }

    private boolean hasWeatherData(SoilAnalysis analysis) {
        return analysis.getTemperatureAvgC() != null
                && analysis.getAvgHumidityPercent() != null;
    }

    private Exception rethrow(Throwable cause) {
        if (cause instanceof Exception e) return e;
        return new RuntimeException(cause);
    }
}
