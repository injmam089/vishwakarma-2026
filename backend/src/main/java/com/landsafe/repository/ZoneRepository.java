package com.landsafe.repository;

import com.landsafe.entity.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    Optional<Zone> findByZoneId(String zoneId);
    boolean existsByZoneId(String zoneId);
}
