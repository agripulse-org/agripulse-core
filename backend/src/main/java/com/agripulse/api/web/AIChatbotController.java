package com.agripulse.api.web;

import com.agripulse.api.dto.chat.ChatSessionDetailsDTO;
import com.agripulse.api.dto.chat.ChatSessionSummaryDTO;
import com.agripulse.api.dto.chat.CreateChatSessionDTO;
import com.agripulse.api.dto.chat.FavoriteStatusDTO;
import com.agripulse.api.dto.chat.SendChatMessageDTO;
import com.agripulse.api.dto.chat.SetFavoriteDTO;
import com.agripulse.api.model.domain.UserId;
import com.agripulse.api.service.ChatSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat/sessions")
@RequiredArgsConstructor
public class AIChatbotController {

    private final ChatSessionService chatSessionService;

    @PostMapping
    public ResponseEntity<ChatSessionDetailsDTO> createSession(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody CreateChatSessionDTO request) {
        var userId = UserId.of(jwt.getSubject());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ChatSessionDetailsDTO.from(chatSessionService.createSession(userId, request)));
    }

    @GetMapping
    public List<ChatSessionSummaryDTO> listSessions(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) UUID soilProfileId) {
        var userId = UserId.of(jwt.getSubject());
        return chatSessionService.listSessions(userId, Optional.ofNullable(soilProfileId))
                .stream()
                .map(ChatSessionSummaryDTO::from)
                .toList();
    }

    @GetMapping("/{sessionId}")
    public ChatSessionDetailsDTO getSession(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID sessionId) {
        var userId = UserId.of(jwt.getSubject());
        return ChatSessionDetailsDTO.from(chatSessionService.getSession(userId, sessionId));
    }

    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSession(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID sessionId) {
        var userId = UserId.of(jwt.getSubject());
        chatSessionService.deleteSession(userId, sessionId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{sessionId}/favorite")
    public FavoriteStatusDTO setFavorite(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID sessionId,
            @RequestBody SetFavoriteDTO request) {
        var userId = UserId.of(jwt.getSubject());
        return new FavoriteStatusDTO(chatSessionService.setFavorite(userId, sessionId, request.isFavorite()).isFavorite());
    }

    @PostMapping(value = "/{sessionId}/message", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> sendMessage(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID sessionId,
            @Valid @RequestBody SendChatMessageDTO request) {
        var userId = UserId.of(jwt.getSubject());
        return chatSessionService.sendMessage(userId, sessionId, request.message());
    }
}
