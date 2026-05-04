package com.agripulse.api.dto.chat;

import org.springframework.lang.Nullable;

import java.util.UUID;

public record CreateChatSessionDTO(@Nullable UUID soilProfileId) {}
