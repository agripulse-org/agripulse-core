package com.agripulse.api.repository;

import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.UserId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SoilAnalysisRepository extends JpaRepository<SoilAnalysis, UUID> {
    List<SoilAnalysis> findBySoilProfileIdOrderByCreatedAtDesc(UUID soilProfileId);
    List<SoilAnalysis> findAllBySoilProfile_IdAndSoilProfile_UserId(
            UUID soilProfileId,
            UserId userId
    );
    Optional<SoilAnalysis>
    findByIdAndSoilProfile_IdAndSoilProfile_UserId(
            UUID analysisId,
            UUID soilProfileId,
            UserId userId
    );
}
