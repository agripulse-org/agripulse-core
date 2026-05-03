package com.agripulse.api.repository;

import com.agripulse.api.model.domain.ChatMessage;
import com.agripulse.api.model.domain.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {

    long countByChatSession(ChatSession chatSession);

    Optional<ChatMessage> findTopByChatSessionOrderByCreatedAtDesc(ChatSession chatSession);
}
