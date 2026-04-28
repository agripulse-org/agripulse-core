package com.agripulse.api.service;

import com.agripulse.api.dto.chat.ChatMessageRequest;
import reactor.core.publisher.Flux;

public interface AIChatbotService {
    Flux<String> chat(ChatMessageRequest request);
}
