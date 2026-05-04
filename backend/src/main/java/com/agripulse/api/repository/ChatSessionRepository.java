package com.agripulse.api.repository;

import com.agripulse.api.model.domain.ChatSession;
import com.agripulse.api.model.domain.UserId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, UUID> {

    @Query("SELECT s FROM ChatSession s LEFT JOIN FETCH s.soilProfile WHERE s.userId = :userId " +
           "AND (:soilProfileId IS NULL OR s.soilProfile.id = :soilProfileId) " +
           "ORDER BY s.lastActiveAt DESC")
    List<ChatSession> findSessions(@Param("userId") UserId userId,
                                   @Param("soilProfileId") UUID soilProfileId);

    @Query("SELECT s FROM ChatSession s LEFT JOIN FETCH s.messages LEFT JOIN FETCH s.soilProfile WHERE s.id = :id")
    Optional<ChatSession> findByIdWithMessages(@Param("id") UUID id);
}
