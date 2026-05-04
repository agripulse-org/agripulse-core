package com.agripulse.api.repository;

import com.agripulse.api.model.domain.SoilNote;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SoilNoteRepository extends JpaSpecificationRepository<SoilNote, UUID> {

    Optional<SoilNote> findByIdAndSoilProfileId(UUID noteId, UUID soilProfileId);

    List<SoilNote> findTop5BySoilProfileIdOrderByCreatedAtDesc(UUID soilProfileId);
}
