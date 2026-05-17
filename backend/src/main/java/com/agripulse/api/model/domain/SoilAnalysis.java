package com.agripulse.api.model.domain;

import com.agripulse.api.dto.soil_analysis.CropRecommendationResult;
import com.agripulse.api.model.enums.AnalysisStatus;
import com.agripulse.api.model.enums.CropType;
import com.agripulse.api.model.enums.SoilDepth;
import com.agripulse.api.model.enums.SoilTexture;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "soil_analyses")
@Getter
@Setter
@NoArgsConstructor
public class SoilAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SoilDepth soilDepth;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AnalysisStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "soil_profile_id", nullable = false)
    private SoilProfile soilProfile;


    private Double ph;

    // g/kg
    private Double nitrogen;

    // mmol_c/kg
    private Double cec;

    // g/kg
    private Double organicCarbon;

    // g/kg
    private Double sandContent;

    // g/kg
    private Double siltContent;

    // g/kg
    private Double clayContent;

    // kg/dm³
    private Double bulkDensity;

    // vol%
    private Double coarseFragments;

    // cm³/cm³
    private Double plantAvailableWater;

    @Enumerated(EnumType.STRING)
    private SoilTexture soilTexture;

    // Weather
    private Double temperatureAvgC;
    private Double temperatureMinC;
    private Double temperatureMaxC;
    private Double avgHumidityPercent;
    private Double totalPrecipitationMm;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<CropRecommendationResult> cropRecommendations;

    public SoilAnalysis(
            SoilProfile soilProfile,
            SoilDepth soilDepth
    ) {
        this.soilProfile = soilProfile;
        this.soilDepth = soilDepth;
        this.status = AnalysisStatus.PENDING;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}