package com.agripulse.api.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "chat_sessions")
@Getter
@Setter
@NoArgsConstructor
public class ChatSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Embedded
    @AttributeOverride(name = "value", column = @Column(name = "user_id", nullable = false))
    private UserId userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "soil_profile_id")
    private SoilProfile soilProfile;

    private String title;

    @Column(nullable = false)
    private boolean isFavorite = false;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant lastActiveAt = Instant.now();

    @OneToMany(mappedBy = "chatSession", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("createdAt ASC")
    private List<ChatMessage> messages = new ArrayList<>();

    public ChatSession(UserId userId, SoilProfile soilProfile) {
        this.userId = userId;
        this.soilProfile = soilProfile;
    }
}
