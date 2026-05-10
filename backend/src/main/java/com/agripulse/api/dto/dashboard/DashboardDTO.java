package com.agripulse.api.dto.dashboard;

import java.util.List;

public record DashboardDTO(

        long totalAnalysesCount,

        long soilsTrackedCount,

        double avgCompatibility,

        List<DashboardAnalysisCardDTO> analyses

) {
}