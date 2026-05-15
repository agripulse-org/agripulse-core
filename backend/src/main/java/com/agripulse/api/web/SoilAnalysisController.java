package com.agripulse.api.web;

import com.agripulse.api.dto.soil_analysis.CreateSoilAnalysisDTO;
import com.agripulse.api.dto.soil_analysis.SoilAnalysisDTO;
import com.agripulse.api.model.domain.SoilAnalysis;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.service.SoilAnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<SoilAnalysisDTO> create(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID soilProfileId,
            @Valid @RequestBody CreateSoilAnalysisDTO request
    ) {

        UserId userId = UserId.of(jwt.getSubject());

        SoilAnalysis analysis = soilAnalysisService.create(
                userId,
                soilProfileId,
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(SoilAnalysisDTO.from(analysis));
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

    @GetMapping("/{analysisId}/export")
    public ResponseEntity<byte[]> exportReport(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID soilProfileId,
            @PathVariable UUID analysisId
    ) {
        UserId userId = UserId.of(jwt.getSubject());

        byte[] pdf = soilAnalysisService.exportReport(userId, soilProfileId, analysisId);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "soil-report-" + analysisId + ".pdf");

        return ResponseEntity.ok().headers(headers).body(pdf);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<List<SoilAnalysisDTO>> uploadCsv(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID soilProfileId,
            @RequestParam("file") MultipartFile file
    ) {
        UserId userId = UserId.of(jwt.getSubject());

        List<SoilAnalysis> analyses = soilAnalysisService.uploadCsv(
                userId,
                soilProfileId,
                file
        );

        List<SoilAnalysisDTO> result = analyses.stream()
                .map(SoilAnalysisDTO::from)
                .toList();

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }
}