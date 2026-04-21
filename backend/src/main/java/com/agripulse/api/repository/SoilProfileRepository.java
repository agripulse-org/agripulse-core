package com.agripulse.api.repository;

import com.agripulse.api.model.domain.SoilProfile;
import com.agripulse.api.model.domain.UserId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SoilProfileRepository extends JpaRepository<SoilProfile, UUID> {
    List<SoilProfile> findByUserId(UserId userId);
}
