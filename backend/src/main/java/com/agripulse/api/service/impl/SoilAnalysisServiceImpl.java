package com.agripulse.api.service.impl;

import com.agripulse.api.dto.soil_analysis.CreateSoilAnalysisDTO;
import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.SoilNote;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.model.exceptions.SoilAnalysisNotFoundException;
import com.agripulse.api.model.exceptions.SoilNoteNotFoundException;
import com.agripulse.api.model.exceptions.SoilProfileNotFoundException;
import com.agripulse.api.repository.SoilAnalysisRepository;
import com.agripulse.api.repository.SoilProfileRepository;
import com.agripulse.api.service.SoilAnalysisService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SoilAnalysisServiceImpl implements SoilAnalysisService {

    private final SoilAnalysisRepository soilAnalysisRepository;
    private final SoilProfileRepository soilProfileRepository;

    public SoilAnalysisServiceImpl(SoilAnalysisRepository soilAnalysisRepository, SoilProfileRepository soilProfileRepository) {
        this.soilAnalysisRepository = soilAnalysisRepository;
        this.soilProfileRepository = soilProfileRepository;
    }


    @Override
    public List<SoilAnalysis> findAll(UserId userId, UUID soilProfileId) {
        return soilAnalysisRepository.findAllBySoilProfile_IdAndSoilProfile_UserId(soilProfileId, userId);
    }

    @Override
    public SoilAnalysis getAnalysis(UserId userId, UUID soilProfileId, UUID analysisId) {
        return soilAnalysisRepository.findByIdAndSoilProfile_IdAndSoilProfile_UserId(analysisId, soilProfileId, userId).orElseThrow(()->new SoilAnalysisNotFoundException(analysisId));
    }

    @Override
    public SoilAnalysis create(UserId userId, UUID soilProfileId, CreateSoilAnalysisDTO request) {
        var profile = soilProfileRepository.findById(request.soilProfileId())
                .orElseThrow(() -> new SoilProfileNotFoundException(request.soilProfileId()));

        if (!profile.getUserId().equals(userId)) {
            throw new SoilProfileNotFoundException(request.soilProfileId());
        }

        SoilAnalysis analysis = request.toEntity(profile);
        return soilAnalysisRepository.save(analysis);
    }

    @Override
    public void delete(UserId userId, UUID soilProfileId, UUID analysisId) {
        SoilAnalysis analysis = getAnalysis(userId, soilProfileId, analysisId);

        soilAnalysisRepository.delete(analysis);

    }
}
