package com.agripulse.api.web;

import com.agripulse.api.dto.chat.ChatMessageRequest;
import com.agripulse.api.service.AIChatbotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class AIChatbotController {

    private final AIChatbotService aiChatbotService;

    @PostMapping(value = "/message", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> sendMessage(@Valid @RequestBody ChatMessageRequest request) {
        return aiChatbotService.chat(request);
    }
}
