package com.agripulse.api.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ChatHistoryMessage(
        @NotBlank String content,
        @Pattern(regexp = "user|assistant") String role
) {}
