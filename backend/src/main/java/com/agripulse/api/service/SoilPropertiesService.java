package com.agripulse.api.service;

import com.agripulse.api.model.domain.SoilProperties;

public interface SoilPropertiesService {
    SoilProperties getPropertiesForLocation(double latitude, double longitude, String depth);
}
