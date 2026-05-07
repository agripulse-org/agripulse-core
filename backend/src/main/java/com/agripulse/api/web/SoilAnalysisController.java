package com.agripulse.api.web;

import com.agripulse.api.dto.soil_analysis.CreateSoilAnalysisDTO;
import com.agripulse.api.dto.soil_analysis.SoilAnalysisDTO;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.service.SoilAnalysisService;

import jakarta.validation.Valid;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/soil-profiles/{soilProfileId}/analyses")
public class SoilAnalysisController {

    private final SoilAnalysisService soilAnalysisService;

    public SoilAnalysisController(
            SoilAnalysisService soilAnalysisService
    ) {
        this.soilAnalysisService = soilAnalysisService;
    }

    @GetMapping
    public List<SoilAnalysisDTO> findAll(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID soilProfileId
    ) {

        UserId userId = UserId.of(jwt.getSubject());

        return soilAnalysisService
                .findAll(userId, soilProfileId)
                .stream()
                .map(SoilAnalysisDTO::from)
                .toList();
    }

    @GetMapping("/{analysisId}")
    public SoilAnalysisDTO getAnalysis(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID soilProfileId,
            @PathVariable UUID analysisId
    ) {

        UserId userId = UserId.of(jwt.getSubject());

        return SoilAnalysisDTO.from(
                soilAnalysisService.getAnalysis(
                        userId,
                        soilProfileId,
                        analysisId
                )
        );
    }

    @PostMapping
    public SoilAnalysisDTO create(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID soilProfileId,
            @Valid @RequestBody CreateSoilAnalysisDTO request
    ) {

        UserId userId = UserId.of(jwt.getSubject());

        return SoilAnalysisDTO.from(
                soilAnalysisService.create(
                        userId,
                        soilProfileId,
                        request
                )
        );
    }

    @DeleteMapping("/{analysisId}")
    public void delete(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID soilProfileId,
            @PathVariable UUID analysisId
    ) {

        UserId userId = UserId.of(jwt.getSubject());

        soilAnalysisService.delete(
                userId,
                soilProfileId,
                analysisId
        );
    }
}