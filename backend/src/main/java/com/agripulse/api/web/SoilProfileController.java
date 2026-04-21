package com.agripulse.api.web;

import com.agripulse.api.dto.soil_profile.CreateSoilProfileDTO;
import com.agripulse.api.dto.soil_profile.SoilProfileDTO;
import com.agripulse.api.dto.soil_profile.UpdateSoilProfileDTO;
import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.service.SoilProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/soil-profiles")
@RequiredArgsConstructor
public class SoilProfileController {

    private final SoilProfileService soilProfileService;

    @GetMapping
    public List<SoilProfileDTO> getProfiles(@AuthenticationPrincipal Jwt jwt) {
        var userId = UserId.of(jwt.getSubject());
        return soilProfileService.getProfilesByUser(userId)
                .stream()
                .map(SoilProfileDTO::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SoilProfileDTO> getProfileById(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
        var userId = UserId.of(jwt.getSubject());
        SoilProfile profile = soilProfileService.getProfileById(userId, id);
        return ResponseEntity.ok(SoilProfileDTO.from(profile));
    }

    @PostMapping
    public ResponseEntity<SoilProfileDTO> createProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateSoilProfileDTO request
    ) {
        var userId = UserId.of(jwt.getSubject());
        SoilProfile profile = soilProfileService.createProfile(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(SoilProfileDTO.from(profile));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<SoilProfileDTO> updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateSoilProfileDTO request
    ) {
        var userId = UserId.of(jwt.getSubject());
        SoilProfile profile = soilProfileService.updateProfile(userId, id, request);
        return ResponseEntity.ok(SoilProfileDTO.from(profile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProfile(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id) {
        var userId = UserId.of(jwt.getSubject());
        soilProfileService.deleteProfile(userId, id);
        return ResponseEntity.noContent().build();
    }
}
