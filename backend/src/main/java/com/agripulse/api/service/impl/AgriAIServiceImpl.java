package com.agripulse.api.service.impl;

import com.agripulse.api.dto.chat.SoilContext;
import com.agripulse.api.model.domain.ChatMessage;
import com.agripulse.api.model.domain.ChatRole;
import com.agripulse.api.service.AgriAIService;
import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgriAIServiceImpl implements AgriAIService {

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
            5. Detect the language of the user's message and respond exclusively in that language. Support only English and Macedonian (македонски). If the user writes in Macedonian, respond entirely in standard Macedonian — use only the 31-letter Macedonian Cyrillic alphabet (А Б В Г Д Ѓ Е Ж З Ѕ И Ј К Л Љ М Н Њ О П Р С Т Ќ У Ф Х Ц Ч Џ Ш). Never use Bulgarian letters (e.g. Ъ, Ь, Щ, Ю, Я) or Serbian Cyrillic letters (e.g. Ђ, Ћ) and never use Bulgarian or Serbian vocabulary or phrasing. If the user writes in English, respond entirely in English. For any other language, respond in English and kindly inform the user that you only support English and Macedonian.
            6. Keep responses practical, clear, and useful for both beginner and experienced farmers.
            7. Be conversational and informative.
            """;

    @Override
    public Flux<String> streamResponse(List<ChatMessage> history, String userMessage, @Nullable SoilContext soilContext) {
        List<Message> aiMessages = history.stream()
                .<Message>map(m -> m.getRole() == ChatRole.USER
                        ? new UserMessage(m.getContent())
                        : new AssistantMessage(m.getContent()))
                .toList();

        String effectiveSystem = soilContext != null
                ? SYSTEM_PROMPT + "\n\n" + buildSoilContextBlock(soilContext)
                : SYSTEM_PROMPT;

        return chatClient.prompt()
                .system(effectiveSystem)
                .messages(aiMessages)
                .user(userMessage)
                .stream()
                .content();
    }

    private String buildSoilContextBlock(SoilContext ctx) {
        String location = ctx.city() != null && ctx.country() != null
                ? "%s, %s (%s, %s)".formatted(ctx.city(), ctx.country(), ctx.latitude(), ctx.longitude())
                : "(%s, %s)".formatted(ctx.latitude(), ctx.longitude());

        String description = ctx.description() != null && !ctx.description().isBlank()
                ? "Description: %s\n".formatted(ctx.description())
                : "";

        String notes = ctx.recentNotes().isEmpty() ? "" : buildNotesSection(ctx.recentNotes());

        return """
                --- Soil Profile Context ---
                You are assisting the farmer with questions related to their registered soil profile. Use this context to give more personalized and relevant advice.

                Profile: %s
                Location: %s
                %s%s""".formatted(ctx.name(), location, description, notes);
    }

    private String buildNotesSection(List<SoilContext.NoteContext> notes) {
        var sb = new StringBuilder("\nRecent farmer observations:\n");
        for (int i = 0; i < notes.size(); i++) {
            SoilContext.NoteContext note = notes.get(i);
            String tags = note.tags() != null && !note.tags().isEmpty()
                    ? "  [tags: %s]".formatted(String.join(", ", note.tags()))
                    : "";
            sb.append("%d. %s%s\n   %s\n".formatted(i + 1, note.title(), tags, note.description()));
        }
        return sb.toString();
    }

    @Override
    public String generateTitle(String firstUserMessage) {
        return chatClient.prompt()
                .user("Generate a short title (max 6 words) for a chat conversation that starts with: \""
                        + firstUserMessage + "\". Return only the title, no quotes or punctuation.")
                .call()
                .content();
    }
}
