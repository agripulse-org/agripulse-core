package com.agripulse.api.model.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "soil_notes")
@Getter
@Setter
@NoArgsConstructor
public class SoilNote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "soil_profile_id", nullable = false)
    private SoilProfile soilProfile;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "soil_note_tags", joinColumns = @JoinColumn(name = "soil_note_id"))
    @Column(name = "tag", nullable = false, length = 64)
    private Set<String> tags = new HashSet<>();

    public SoilNote(SoilProfile soilProfile, String title, String description, Set<String> tags) {
        this.soilProfile = soilProfile;
        this.title = title;
        this.description = description;
        this.tags = tags;
    }
}
