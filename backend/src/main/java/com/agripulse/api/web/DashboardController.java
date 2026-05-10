package com.agripulse.api.web;

import com.agripulse.api.dto.dashboard.DashboardDTO;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.service.DashboardService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardDTO getDashboard(@AuthenticationPrincipal Jwt jwt) {
        UserId userId = UserId.of(jwt.getSubject());
        return dashboardService.getDashboard(userId);
    }
}