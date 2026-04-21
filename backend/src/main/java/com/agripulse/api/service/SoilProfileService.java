package com.agripulse.api.service;

import com.agripulse.api.dto.soil_profile.CreateSoilProfileDTO;
import com.agripulse.api.dto.soil_profile.UpdateSoilProfileDTO;
import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.domain.UserId;

import java.util.List;
import java.util.UUID;

public interface SoilProfileService {
    List<SoilProfile> getProfilesByUser(UserId userId);

    SoilProfile getProfileById(UserId userId, UUID profileId);

    SoilProfile createProfile(UserId userId, CreateSoilProfileDTO request);

    SoilProfile updateProfile(UserId userId, UUID profileId, UpdateSoilProfileDTO request);

    void deleteProfile(UserId userId, UUID profileId);
}

