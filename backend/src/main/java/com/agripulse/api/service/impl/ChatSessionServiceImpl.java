package com.agripulse.api.service.impl;

import com.agripulse.api.dto.chat.CreateChatSessionDTO;
import com.agripulse.api.dto.chat.SoilContext;
import com.agripulse.api.model.domain.*;
import com.agripulse.api.model.exceptions.ChatSessionNotFoundException;
import com.agripulse.api.model.exceptions.SoilProfileNotFoundException;
import com.agripulse.api.model.projections.ChatSessionWithStats;
import com.agripulse.api.repository.ChatMessageRepository;
import com.agripulse.api.repository.ChatSessionRepository;
import com.agripulse.api.repository.SoilNoteRepository;
import com.agripulse.api.repository.SoilProfileRepository;
import com.agripulse.api.service.AgriAIService;
import com.agripulse.api.service.ChatSessionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatSessionServiceImpl implements ChatSessionService {

    private final AgriAIService agriAIService;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final SoilProfileRepository soilProfileRepository;
    private final SoilNoteRepository soilNoteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ChatSessionWithStats> listSessions(UserId userId, Optional<UUID> soilProfileId) {
        List<ChatSession> sessions = chatSessionRepository.findSessions(userId, soilProfileId.orElse(null));
        return sessions.stream()
                .map(session -> {
                    long count = chatMessageRepository.countByChatSession(session);
                    String lastContent = chatMessageRepository
                            .findTopByChatSessionOrderByCreatedAtDesc(session)
                            .map(ChatMessage::getContent)
                            .orElse(null);
                    return new ChatSessionWithStats(session, count, lastContent);
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ChatSession getSession(UserId userId, UUID sessionId) {
        return getOwnedSessionWithMessages(userId, sessionId);
    }

    @Override
    @Transactional
    public ChatSession createSession(UserId userId, CreateChatSessionDTO request) {
        SoilProfile soilProfile = null;
        if (request.soilProfileId() != null) {
            soilProfile = soilProfileRepository.findById(request.soilProfileId())
                    .orElseThrow(() -> new SoilProfileNotFoundException(request.soilProfileId()));
            if (!soilProfile.getUserId().equals(userId)) {
                throw new SoilProfileNotFoundException(request.soilProfileId());
            }
        }
        return chatSessionRepository.save(new ChatSession(userId, soilProfile));
    }

    @Override
    @Transactional
    public void deleteSession(UserId userId, UUID sessionId) {
        ChatSession session = getOwnedSession(userId, sessionId);
        chatSessionRepository.delete(session);
    }

    @Override
    @Transactional
    public ChatSession setFavorite(UserId userId, UUID sessionId, boolean isFavorite) {
        ChatSession session = getOwnedSessionWithMessages(userId, sessionId);
        session.setFavorite(isFavorite);
        return chatSessionRepository.save(session);
    }

    @Override
    public Flux<String> sendMessage(UserId userId, UUID sessionId, String message) {
        ChatSession session = getOwnedSessionWithMessages(userId, sessionId);

        List<ChatMessage> history = new ArrayList<>(session.getMessages());
        boolean isFirstExchange = history.isEmpty();

        chatMessageRepository.save(new ChatMessage(session, ChatRole.USER, message));

        SoilProfile soilProfile = session.getSoilProfile();
        SoilContext soilContext = null;
        if (soilProfile != null) {
            List<SoilNote> notes = soilNoteRepository.findTop5BySoilProfileIdOrderByCreatedAtDesc(soilProfile.getId());
            soilContext = SoilContext.from(soilProfile, notes);
        }

        StringBuilder buffer = new StringBuilder();

        return agriAIService.streamResponse(history, message, soilContext)
                .doOnNext(buffer::append)
                .concatWith(Mono.<String>fromRunnable(() -> {
                    String content = buffer.toString();
                    if (!content.isBlank()) {
                        chatMessageRepository.save(new ChatMessage(session, ChatRole.ASSISTANT, content));
                    }
                    session.setLastActiveAt(Instant.now());
                    if (isFirstExchange && !content.isBlank()) {
                        try {
                            String title = agriAIService.generateTitle(message);

                            if (title != null && !title.isBlank()) {
                                session.setTitle(title.trim());
                            } else {
                                session.setTitle(message.substring(0, Math.min(60, message.length())));
                            }
                        } catch (Exception e) {
                            log.warn("Failed to generate title for session {}, falling back to truncated message", session.getId(), e);
                            session.setTitle(message.substring(0, Math.min(60, message.length())));
                        }
                    }
                    chatSessionRepository.save(session);
                }).subscribeOn(Schedulers.boundedElastic()));
    }

    private ChatSession getOwnedSession(UserId userId, UUID sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ChatSessionNotFoundException(sessionId));
        if (!session.getUserId().equals(userId)) {
            throw new ChatSessionNotFoundException(sessionId);
        }
        return session;
    }

    private ChatSession getOwnedSessionWithMessages(UserId userId, UUID sessionId) {
        ChatSession session = chatSessionRepository.findByIdWithMessages(sessionId)
                .orElseThrow(() -> new ChatSessionNotFoundException(sessionId));
        if (!session.getUserId().equals(userId)) {
            throw new ChatSessionNotFoundException(sessionId);
        }
        return session;
    }
}
