package com.agripulse.api.service;

import com.agripulse.api.dto.dashboard.DashboardDTO;
import com.agripulse.api.model.domain.UserId;

public interface DashboardService {

    DashboardDTO getDashboard(
            UserId userId
    );
}