package com.agripulse.api.repository;

import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.model.enums.AnalysisStatus;
import com.agripulse.api.model.projections.ProfileLastAnalysisProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SoilAnalysisRepository extends JpaRepository<SoilAnalysis, UUID> {
    List<SoilAnalysis> findBySoilProfile_IdAndSoilProfile_UserIdOrderByCreatedAtDesc(
            UUID soilProfileId,
            UserId userId
    );
    Optional<SoilAnalysis> findByIdAndSoilProfile_IdAndSoilProfile_UserId(
            UUID analysisId,
            UUID soilProfileId,
            UserId userId
    );
    long countBySoilProfile_UserId(
            UserId userId
    );

    List<SoilAnalysis> findTop3BySoilProfile_UserIdOrderByCreatedAtDesc(
            UserId userId
    );

    List<SoilAnalysis> findBySoilProfile_UserIdAndStatus(
            UserId userId,
            AnalysisStatus status
    );

    @Query("""
            SELECT a.soilProfile.id as soilProfileId, MAX(a.createdAt) as lastAnalysisAt
            FROM SoilAnalysis a
            WHERE a.soilProfile.userId = :userId AND a.status = 'FINISHED'
            GROUP BY a.soilProfile.id
            """)
    List<ProfileLastAnalysisProjection> findLastFinishedAtPerProfile(@Param("userId") UserId userId);
}
