package com.agripulse.api.web;

import com.agripulse.api.dto.soil_analysis.SoilAnalysisDTO;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.service.SoilAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/analyses")
@RequiredArgsConstructor
public class SoilAnalysisQueryController {

    private final SoilAnalysisService soilAnalysisService;

    @GetMapping("/{analysisId}")
    public SoilAnalysisDTO getAnalysisById(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID analysisId
    ) {
        UserId userId = UserId.of(jwt.getSubject());
        return SoilAnalysisDTO.from(
                soilAnalysisService.getAnalysisById(userId, analysisId)
        );
    }
}