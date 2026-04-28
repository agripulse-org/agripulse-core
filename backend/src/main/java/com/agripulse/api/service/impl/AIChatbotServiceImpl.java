package com.agripulse.api.service.impl;

import com.agripulse.api.dto.chat.ChatHistoryMessage;
import com.agripulse.api.dto.chat.ChatMessageRequest;
import com.agripulse.api.service.AIChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AIChatbotServiceImpl implements AIChatbotService {

    private final ChatClient chatClient;

    private static final String SYSTEM_PROMPT = """
            You are AgriPulse Assistant, a specialized agricultural advisor. Your sole purpose is to help farmers and agricultural professionals with questions about:
            - Crops: varieties, cultivation techniques, growth stages, harvest timing
            - Planting seasons: optimal planting windows for different crops and regions
            - Soil conditions: analysis interpretation, soil health, pH, nutrients, amendments
            - Fertilization: types, application methods, schedules
            - Irrigation: techniques, scheduling, water management
            - Pest and disease management: identification, prevention, organic and conventional treatments
            - General farming best practices and sustainable agriculture

            Rules you must always follow:
            1. ONLY answer questions directly related to agriculture, farming, crops, soil, and horticulture.
            2. If asked about anything unrelated to agriculture, politely decline and redirect to agricultural topics. Do not provide any information outside of agriculture.
            3. NEVER generate code, scripts, programs, or technical computing content of any kind.
            4. NEVER reference, simulate, or describe the use of external tools, APIs, or systems.
            5. Detect the language of the user's message and respond exclusively in that language. Support only English and Macedonian (македонски). If the user writes in Macedonian, respond entirely in Macedonian. If the user writes in English, respond entirely in English. For any other language, respond in English and kindly inform the user that you only support English and Macedonian.
            6. Keep responses practical, clear, and useful for both beginner and experienced farmers.
            7. Be conversational and informative.
            """;

    @Override
    public Flux<String> chat(ChatMessageRequest request) {
        List<Message> messages = new ArrayList<>();

        if (request.history() != null) {
            for (ChatHistoryMessage entry : request.history()) {
                if ("user".equals(entry.role())) {
                    messages.add(new UserMessage(entry.content()));
                } else {
                    messages.add(new AssistantMessage(entry.content()));
                }
            }
        }

        messages.add(new UserMessage(request.message()));

        return chatClient.prompt()
                .system(SYSTEM_PROMPT)
                .messages(messages)
                .stream()
                .content();
    }
}
