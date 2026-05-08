package com.agripulse.api.web;

import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.service.SoilAnalysisService;
import com.agripulse.api.service.PdfGeneratorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/soil-profiles/{soilProfileId}/analyses")
@RequiredArgsConstructor
public class SoilAnalysisExportController {

    private final SoilAnalysisService soilAnalysisService;
    private final PdfGeneratorService pdfGeneratorService;
    private final TemplateEngine templateEngine;

    @GetMapping("/{analysisId}/export")
    public ResponseEntity<byte[]> exportReport(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID soilProfileId,
            @PathVariable UUID analysisId) {

        UserId userId = UserId.of(jwt.getSubject());

        SoilAnalysis analysis = soilAnalysisService.getAnalysis(userId, soilProfileId, analysisId);
        SoilProfile profile = analysis.getSoilProfile();

        Context context = new Context();
        context.setVariable("analyzedAt", analysis.getCreatedAt());
        context.setVariable("profileName", profile.getName());
        context.setVariable("latitude", profile.getLatitude());
        context.setVariable("longitude", profile.getLongitude());
        context.setVariable("city", profile.getCity());
        context.setVariable("country", profile.getCountry());
        context.setVariable("depthLayer", analysis.getSoilDepth().getLabel());
        context.setVariable("ph", analysis.getPh());
        context.setVariable("nitrogen", analysis.getNitrogen());
        context.setVariable("organicCarbon", analysis.getOrganicCarbon());
        context.setVariable("bulkDensity", analysis.getBulkDensity());
        context.setVariable("cec", analysis.getCec());
        context.setVariable("sandContent", analysis.getSandContent());
        context.setVariable("siltContent", analysis.getSiltContent());
        context.setVariable("clayContent", analysis.getClayContent());
        context.setVariable("coarseFragments", analysis.getCoarseFragments());
        context.setVariable("plantAvailableWater", analysis.getPlantAvailableWater());
        context.setVariable("temperatureAvgC", analysis.getTemperatureAvgC());
        context.setVariable("temperatureMinC", analysis.getTemperatureMinC());
        context.setVariable("temperatureMaxC", analysis.getTemperatureMaxC());
        context.setVariable("avgHumidityPercent", analysis.getAvgHumidityPercent());
        context.setVariable("totalPrecipitationMm", analysis.getTotalPrecipitationMm());
        context.setVariable("recommendations", List.of());

        String html = templateEngine.process("soil-analysis-report", context);
        byte[] pdf = pdfGeneratorService.generateFromHtml(html);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment",
                "soil-report-" + analysisId + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
}