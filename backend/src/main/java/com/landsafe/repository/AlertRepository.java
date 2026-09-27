package com.landsafe.repository;

import com.landsafe.entity.Alert;
import com.landsafe.entity.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    Optional<Alert> findByAlertId(String alertId);

    List<Alert> findByZoneIdOrderByCreatedAtDesc(String zoneId);

    List<Alert> findByStatusOrderByCreatedAtDesc(AlertStatus status);

    List<Alert> findAllByOrderByCreatedAtDesc();

    List<Alert> findByZoneIdAndStatus(String zoneId, AlertStatus status);

    Optional<Alert> findFirstByZoneIdAndStatusOrderByCreatedAtDesc(String zoneId, AlertStatus status);

    Optional<Alert> findFirstByDeviceIdAndStatusOrderByCreatedAtDesc(String deviceId, AlertStatus status);

    List<Alert> findByCreatedAtAfterOrderByCreatedAtDesc(Instant timestamp);
}
