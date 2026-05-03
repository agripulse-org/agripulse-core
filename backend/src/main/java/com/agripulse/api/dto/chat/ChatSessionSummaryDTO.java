package com.agripulse.api.dto.chat;

import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.projections.ChatSessionWithStats;

import java.time.Instant;
import java.util.UUID;

public record ChatSessionSummaryDTO(
        UUID id,
        String title,
        SoilProfileSummaryDTO soilProfile,
        boolean isFavorite,
        Instant createdAt,
        Instant lastActiveAt,
        long messageCount,
        String lastMessageContent
) {
    public record SoilProfileSummaryDTO(UUID id, String name) {}

    public static ChatSessionSummaryDTO from(ChatSessionWithStats stats) {
        var session = stats.session();
        SoilProfile sp = session.getSoilProfile();
        SoilProfileSummaryDTO soilProfile = sp != null ? new SoilProfileSummaryDTO(sp.getId(), sp.getName()) : null;
        return new ChatSessionSummaryDTO(
                session.getId(),
                session.getTitle(),
                soilProfile,
                session.isFavorite(),
                session.getCreatedAt(),
                session.getLastActiveAt(),
                stats.messageCount(),
                stats.lastMessageContent()
        );
    }
}
