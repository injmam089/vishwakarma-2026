package com.landsafe;

import com.landsafe.entity.*;
import com.landsafe.repository.AlertRepository;
import com.landsafe.repository.DeviceRepository;
import com.landsafe.service.DeviceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class DeviceAlertTest {

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private AlertRepository alertRepository;

    @Test
    @DisplayName("Should generate DEVICE_OFFLINE alert when stale monitor detects missing heartbeat")
    @Transactional
    void testDeviceOfflineAlertCreation() {
        Device device = deviceRepository.findByDeviceId("ESP32-004").orElseThrow();
        device.setStatus(DeviceStatus.ONLINE);
        device.setLastSeen(Instant.now().minus(120, ChronoUnit.SECONDS)); // > 90s stale
        deviceRepository.save(device);

        deviceService.scanAndMarkOfflineDevices();

        Device updated = deviceRepository.findByDeviceId("ESP32-004").orElseThrow();
        assertEquals(DeviceStatus.OFFLINE, updated.getStatus());

        List<Alert> deviceAlerts = alertRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(a -> "ESP32-004".equals(a.getDeviceId()))
                .toList();

        assertFalse(deviceAlerts.isEmpty(), "A device alert should be created");
        Alert latest = deviceAlerts.get(0);
        assertEquals(AlertSeverity.DEVICE_OFFLINE, latest.getSeverity());
        assertEquals(AlertStatus.ACTIVE, latest.getStatus());
    }

    @Test
    @DisplayName("Should resolve DEVICE_OFFLINE and create DEVICE_RECOVERED when heartbeat restored")
    @Transactional
    void testDeviceRecoveredAlertCreation() {
        Device device = deviceRepository.findByDeviceId("ESP32-005").orElseThrow();
        device.setStatus(DeviceStatus.OFFLINE);
        deviceRepository.save(device);

        // Pre-create an active DEVICE_OFFLINE alert
        Alert offlineAlert = Alert.builder()
                .alertId("ALT-TESTOFFLINE")
                .zoneId(device.getZoneId())
                .deviceId(device.getDeviceId())
                .severity(AlertSeverity.DEVICE_OFFLINE)
                .condition("Node offline")
                .reason("Stale timeout")
                .status(AlertStatus.ACTIVE)
                .createdAt(Instant.now().minusSeconds(60))
                .build();
        alertRepository.save(offlineAlert);

        // Restore heartbeat
        deviceService.recordHeartbeat("ESP32-005");

        // Verify previous offline alert resolved
        Alert checkedOffline = alertRepository.findByAlertId("ALT-TESTOFFLINE").orElseThrow();
        assertEquals(AlertStatus.RESOLVED, checkedOffline.getStatus());

        // Verify new recovered alert created
        List<Alert> recoveredAlerts = alertRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(a -> "ESP32-005".equals(a.getDeviceId()) && a.getSeverity() == AlertSeverity.DEVICE_RECOVERED)
                .toList();
        assertFalse(recoveredAlerts.isEmpty(), "DEVICE_RECOVERED alert should be created");
    }
}