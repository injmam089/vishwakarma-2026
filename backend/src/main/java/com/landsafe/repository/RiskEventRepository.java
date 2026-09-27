package com.landsafe.repository;

import com.landsafe.entity.RiskEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface RiskEventRepository extends JpaRepository<RiskEvent, Long> {
    List<RiskEvent> findByZoneIdOrderByTimestampDesc(String zoneId);
    Optional<RiskEvent> findFirstByZoneIdOrderByTimestampDesc(String zoneId);
    List<RiskEvent> findByZoneIdAndTimestampAfterOrderByTimestampDesc(String zoneId, Instant timestamp);
}
