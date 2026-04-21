package com.agripulse.api.service.impl;

import com.agripulse.api.dto.soil_profile.CreateSoilProfileDTO;
import com.agripulse.api.dto.soil_profile.UpdateSoilProfileDTO;
import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.model.exceptions.SoilProfileNotFoundException;
import com.agripulse.api.repository.SoilProfileRepository;
import com.agripulse.api.service.SoilProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SoilProfileServiceImpl implements SoilProfileService {

    private final SoilProfileRepository soilProfileRepository;

    @Override
    public List<SoilProfile> getProfilesByUser(UserId userId) {
        return soilProfileRepository.findByUserId(userId);
    }

    @Override
    public SoilProfile getProfileById(UserId userId, UUID profileId) {
        return getOwnedProfileOrThrow(userId, profileId);
    }

    @Override
    public SoilProfile createProfile(UserId userId, CreateSoilProfileDTO request) {
        return soilProfileRepository.save(request.toEntity(userId));
    }

    @Override
    public SoilProfile updateProfile(UserId userId, UUID profileId, UpdateSoilProfileDTO request) {
        SoilProfile existingProfile = getOwnedProfileOrThrow(userId, profileId);
        SoilProfile patch = request.toEntity();

        if (patch.getName() != null) {
            existingProfile.setName(patch.getName());
        }
        if (patch.getDescription() != null) {
            existingProfile.setDescription(patch.getDescription());
        }
        if (patch.getLatitude() != null) {
            existingProfile.setLatitude(patch.getLatitude());
        }
        if (patch.getLongitude() != null) {
            existingProfile.setLongitude(patch.getLongitude());
        }

        return soilProfileRepository.save(existingProfile);
    }

    @Override
    public void deleteProfile(UserId userId, UUID profileId) {
        SoilProfile existingProfile = getOwnedProfileOrThrow(userId, profileId);
        soilProfileRepository.delete(existingProfile);
    }

    private SoilProfile getOwnedProfileOrThrow(UserId userId, UUID profileId) {
        SoilProfile profile = soilProfileRepository.findById(profileId)
                .orElseThrow(() -> new SoilProfileNotFoundException(profileId));

        if (!profile.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return profile;
    }
}

