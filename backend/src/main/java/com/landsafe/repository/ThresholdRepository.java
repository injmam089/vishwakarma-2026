package com.landsafe.repository;

import com.landsafe.entity.Threshold;
import com.landsafe.entity.ThresholdParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ThresholdRepository extends JpaRepository<Threshold, Long> {
    List<Threshold> findByZoneId(String zoneId);
    Optional<Threshold> findByZoneIdAndParameter(String zoneId, ThresholdParameter parameter);
}
