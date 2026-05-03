package com.agripulse.api.dto.chat;

import jakarta.validation.constraints.NotBlank;

public record SendChatMessageDTO(@NotBlank String message) {}
