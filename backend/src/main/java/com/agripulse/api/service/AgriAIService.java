package com.agripulse.api.service;

import com.agripulse.api.model.domain.ChatMessage;
import reactor.core.publisher.Flux;

import java.util.List;

public interface AgriAIService {

    Flux<String> streamResponse(List<ChatMessage> history, String userMessage);

    String generateTitle(String firstUserMessage);
}
