package com.agripulse.api.model.projections;

import java.time.LocalDateTime;
import java.util.UUID;

public interface ProfileLastAnalysisProjection {
    UUID getSoilProfileId();
    LocalDateTime getLastAnalysisAt();
}
