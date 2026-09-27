package com.landsafe;

import com.landsafe.dto.AlertDto;
import com.landsafe.dto.SensorDataRequest;
import com.landsafe.entity.Alert;
import com.landsafe.entity.AlertSeverity;
import com.landsafe.entity.AlertStatus;
import com.landsafe.repository.AlertRepository;
import com.landsafe.service.AlertService;
import com.landsafe.service.SensorService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AlertLifecycleTest {

    @Autowired
    private SensorService sensorService;

    @Autowired
    private AlertService alertService;

    @Autowired
    private AlertRepository alertRepository;

    @Test
    @DisplayName("Should create active alert on threshold breach and prevent duplicate alerts within cooldown")
    @Transactional
    void testAlertCreationAndDuplicateSuppression() {
        int initialAlerts = alertRepository.findAll().size();

        // 1. Ingest warning reading
        SensorDataRequest warnReq1 = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(2.0)
                .tiltY(1.3)
                .tiltZ(0.9)
                .soilMoisture(82.0) // Warning breach
                .rainfall(18.0)
                .vibration(0.21)
                .battery(90.0)
                .build();
        sensorService.ingestSensorData(warnReq1);

        List<Alert> afterFirst = alertRepository.findByZoneIdOrderByCreatedAtDesc("ZONE-01");
        assertFalse(afterFirst.isEmpty(), "An alert should be created");
        Alert alert1 = afterFirst.get(0);
        assertEquals(AlertSeverity.WARNING, alert1.getSeverity());
        assertEquals(AlertStatus.ACTIVE, alert1.getStatus());

        int countAfterFirst = alertRepository.findAll().size();
        assertTrue(countAfterFirst > initialAlerts);

        // 2. Ingest another warning reading for same zone immediately
        SensorDataRequest warnReq2 = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(2.05)
                .tiltY(1.35)
                .tiltZ(0.9)
                .soilMoisture(82.5) // Warning breach
                .rainfall(18.0)
                .vibration(0.21)
                .battery(90.0)
                .build();
        sensorService.ingestSensorData(warnReq2);

        int countAfterSecond = alertRepository.findAll().size();
        assertEquals(countAfterFirst, countAfterSecond, "Duplicate alert should be suppressed within cooldown window");
    }

    @Test
    @DisplayName("Should escalate to CRITICAL when warning condition becomes critical")
    @Transactional
    void testCriticalEscalation() {
        // 1. Ingest warning
        SensorDataRequest warnReq = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(2.0)
                .tiltY(1.3)
                .tiltZ(0.9)
                .soilMoisture(82.0)
                .rainfall(18.0)
                .vibration(0.21)
                .battery(90.0)
                .build();
        sensorService.ingestSensorData(warnReq);

        // 2. Ingest critical reading
        SensorDataRequest critReq = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(12.0)
                .tiltY(9.0) // Tilt > 12.0°
                .tiltZ(0.9)
                .soilMoisture(92.0)
                .rainfall(55.0)
                .vibration(0.45)
                .battery(89.0)
                .build();
        sensorService.ingestSensorData(critReq);

        List<Alert> alerts = alertRepository.findByZoneIdOrderByCreatedAtDesc("ZONE-01");
        assertFalse(alerts.isEmpty());
        Alert latest = alerts.get(0);
        assertEquals(AlertSeverity.CRITICAL, latest.getSeverity(), "Latest alert should be CRITICAL");
        assertEquals(AlertStatus.ACTIVE, latest.getStatus());
    }

    @Test
    @DisplayName("Should acknowledge and resolve alert lifecycle transitions")
    @Transactional
    void testAlertAcknowledgeAndResolve() {
        // Create an alert
        SensorDataRequest req = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(12.0)
                .tiltY(9.0)
                .tiltZ(0.9)
                .soilMoisture(92.0)
                .rainfall(55.0)
                .vibration(0.45)
                .battery(89.0)
                .build();
        sensorService.ingestSensorData(req);

        List<Alert> active = alertRepository.findByZoneIdAndStatus("ZONE-01", AlertStatus.ACTIVE);
        assertFalse(active.isEmpty());
        Alert alert = active.get(0);

        // 1. Acknowledge
        AlertDto acked = alertService.acknowledgeAlert(alert.getAlertId(), "operator@geomonitor.org");
        assertEquals("ACKNOWLEDGED", acked.getStatus());
        assertNotNull(acked.getAcknowledgedAt());
        assertEquals("operator@geomonitor.org", acked.getAcknowledgedBy());

        // 2. Resolve
        AlertDto resolved = alertService.resolveAlert(alert.getAlertId(), "operator@geomonitor.org");
        assertEquals("RESOLVED", resolved.getStatus());
        assertNotNull(resolved.getResolvedAt());
        assertEquals("operator@geomonitor.org", resolved.getResolvedBy());
    }
}