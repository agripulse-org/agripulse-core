package com.agripulse.api.dto.chat;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ChatMessageRequest(
        @NotBlank String message,
        @Valid List<ChatHistoryMessage> history
) {}
