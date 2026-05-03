package com.agripulse.api.model.projections;

import com.agripulse.api.model.domain.ChatSession;

public record ChatSessionWithStats(ChatSession session, long messageCount, String lastMessageContent) {}
