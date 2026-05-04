package com.agripulse.api.dto.chat;

import com.agripulse.api.model.domain.ChatMessage;
import com.agripulse.api.model.domain.ChatRole;
import com.agripulse.api.model.domain.ChatSession;
import com.agripulse.api.model.domain.SoilProfile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ChatSessionDetailsDTO(
        UUID id,
        String title,
        SoilProfileSummaryDTO soilProfile,
        boolean isFavorite,
        Instant createdAt,
        Instant lastActiveAt,
        List<ChatMessageDTO> messages
) {
    public record SoilProfileSummaryDTO(UUID id, String name) {}

    record ChatMessageDTO(UUID id, ChatRole role, String content, Instant createdAt) {
        public static ChatMessageDTO from(ChatMessage message) {
            return new ChatMessageDTO(message.getId(), message.getRole(), message.getContent(), message.getCreatedAt());
        }
    }

    public static ChatSessionDetailsDTO from(ChatSession session) {
        SoilProfile sp = session.getSoilProfile();
        SoilProfileSummaryDTO soilProfile = sp != null ? new SoilProfileSummaryDTO(sp.getId(), sp.getName()) : null;
        return new ChatSessionDetailsDTO(
                session.getId(),
                session.getTitle(),
                soilProfile,
                session.isFavorite(),
                session.getCreatedAt(),
                session.getLastActiveAt(),
                session.getMessages().stream().map(ChatMessageDTO::from).toList()
        );
    }
}
