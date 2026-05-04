package com.agripulse.api.service;

import com.agripulse.api.dto.chat.CreateChatSessionDTO;
import com.agripulse.api.model.domain.ChatSession;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.model.projections.ChatSessionWithStats;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ChatSessionService {

    ChatSession createSession(UserId userId, CreateChatSessionDTO request);

    List<ChatSessionWithStats> listSessions(UserId userId, Optional<UUID> soilProfileId);

    ChatSession getSession(UserId userId, UUID sessionId);

    void deleteSession(UserId userId, UUID sessionId);

    ChatSession setFavorite(UserId userId, UUID sessionId, boolean isFavorite);

    Flux<String> sendMessage(UserId userId, UUID sessionId, String message);
}
