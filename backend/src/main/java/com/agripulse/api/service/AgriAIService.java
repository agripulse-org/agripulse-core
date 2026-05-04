package com.agripulse.api.service;

import com.agripulse.api.dto.chat.SoilContext;
import com.agripulse.api.model.domain.ChatMessage;
import jakarta.annotation.Nullable;
import reactor.core.publisher.Flux;

import java.util.List;

public interface AgriAIService {

    Flux<String> streamResponse(List<ChatMessage> history, String userMessage, @Nullable SoilContext soilContext);

    String generateTitle(String firstUserMessage);
}
