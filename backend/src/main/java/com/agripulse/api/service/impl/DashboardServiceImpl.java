package com.agripulse.api.service.impl;

import com.agripulse.api.dto.dashboard.DashboardAnalysisCardDTO;
import com.agripulse.api.dto.dashboard.DashboardDTO;
import com.agripulse.api.dto.soil_analysis.CropRecommendationResult;
import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.model.enums.AnalysisStatus;
import com.agripulse.api.repository.SoilAnalysisRepository;
import com.agripulse.api.repository.SoilProfileRepository;
import com.agripulse.api.service.DashboardService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardServiceImpl
        implements DashboardService {

    private final SoilAnalysisRepository soilAnalysisRepository;

    private final SoilProfileRepository soilProfileRepository;

    public DashboardServiceImpl(SoilAnalysisRepository soilAnalysisRepository, SoilProfileRepository soilProfileRepository) {
        this.soilAnalysisRepository = soilAnalysisRepository;

        this.soilProfileRepository = soilProfileRepository;
    }

    @Override
    public DashboardDTO getDashboard(UserId userId) {

        long totalAnalyses = soilAnalysisRepository.countBySoilProfile_UserId(userId);

        long soilsTracked = soilProfileRepository.countByUserId(userId);

        List<SoilAnalysis> analyses = soilAnalysisRepository.findTop3BySoilProfile_UserIdOrderByCreatedAtDesc(userId);

        List<SoilAnalysis> finishedAnalyses = soilAnalysisRepository.findBySoilProfile_UserIdAndStatus(userId, AnalysisStatus.FINISHED);

        double avgCompatibility = finishedAnalyses.stream()
                .filter(a -> a.getCropRecommendations() != null && !a.getCropRecommendations().isEmpty())
                .mapToDouble(a -> a.getCropRecommendations().stream().mapToDouble(CropRecommendationResult::recommendationScore).max().orElse(0))
                .average()
                .orElse(0);

        return new DashboardDTO(
            totalAnalyses, 
            soilsTracked, 
            avgCompatibility * 100, 
            analyses.stream().map(DashboardAnalysisCardDTO::from).toList()
        );
    }
}