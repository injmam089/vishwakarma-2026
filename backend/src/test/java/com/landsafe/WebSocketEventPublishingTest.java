package com.landsafe;

import com.landsafe.dto.SensorDataRequest;
import com.landsafe.entity.DeviceStatus;
import com.landsafe.entity.RiskLevel;
import com.landsafe.service.DeviceService;
import com.landsafe.service.SensorService;
import com.landsafe.websocket.WebSocketEventPublisher;
import com.landsafe.websocket.dto.AlertCreatedEvent;
import com.landsafe.websocket.dto.DeviceStatusEvent;
import com.landsafe.websocket.dto.RiskUpdateEvent;
import com.landsafe.websocket.dto.TelemetryUpdateEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class WebSocketEventPublishingTest {

    @Autowired
    private SensorService sensorService;

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private com.landsafe.repository.DeviceRepository deviceRepository;

    @Autowired
    private WebSocketEventPublisher eventPublisher;

    private final List<TelemetryUpdateEvent> telemetryEvents = new CopyOnWriteArrayList<>();
    private final List<RiskUpdateEvent> riskEvents = new CopyOnWriteArrayList<>();
    private final List<AlertCreatedEvent> alertEvents = new CopyOnWriteArrayList<>();
    private final List<DeviceStatusEvent> deviceStatusEvents = new CopyOnWriteArrayList<>();

    @BeforeEach
    void setUp() {
        telemetryEvents.clear();
        riskEvents.clear();
        alertEvents.clear();
        deviceStatusEvents.clear();

        eventPublisher.setEventListener(new WebSocketEventPublisher.WebSocketEventListener() {
            @Override
            public void onTelemetry(String zoneId, TelemetryUpdateEvent event) {
                telemetryEvents.add(event);
            }

            @Override
            public void onRiskUpdate(String zoneId, RiskUpdateEvent event) {
                riskEvents.add(event);
            }

            @Override
            public void onAlertCreated(String zoneId, AlertCreatedEvent event) {
                alertEvents.add(event);
            }

            @Override
            public void onDeviceStatus(String deviceId, DeviceStatusEvent event) {
                deviceStatusEvents.add(event);
            }
        });
    }

    @Test
    @DisplayName("Should publish TelemetryUpdateEvent to /topic/zones/{zoneId}/telemetry upon sensor data ingestion")
    void testTelemetryEventPublishing() {
        SensorDataRequest request = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(2.35)
                .tiltY(1.75)
                .tiltZ(0.92)
                .soilMoisture(66.5)
                .rainfall(18.0)
                .vibration(0.21)
                .battery(91.0)
                .build();

        sensorService.ingestSensorData(request);

        assertFalse(telemetryEvents.isEmpty(), "Telemetry event should have been published");
        TelemetryUpdateEvent event = telemetryEvents.get(telemetryEvents.size() - 1);
        assertEquals("TELEMETRY_UPDATE", event.getType());
        assertEquals("ESP32-001", event.getDeviceId());
        assertEquals("ZONE-01", event.getZoneId());
        assertEquals(2.35, event.getTiltX());
    }

    @Test
    @DisplayName("Should publish RiskUpdateEvent and AlertCreatedEvent when critical threshold is breached")
    void testCriticalRiskAndAlertPublishing() {
        SensorDataRequest request = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(11.5)
                .tiltY(9.5) // composite tilt > 12.0°
                .tiltZ(0.90)
                .soilMoisture(92.0)
                .rainfall(55.0)
                .vibration(0.48)
                .battery(88.0)
                .build();

        sensorService.ingestSensorData(request);

        assertFalse(riskEvents.isEmpty(), "Risk update event should have been published");
        RiskUpdateEvent riskEvent = riskEvents.get(riskEvents.size() - 1);
        assertEquals("RISK_UPDATE", riskEvent.getType());
        assertEquals(RiskLevel.CRITICAL, riskEvent.getRiskLevel());

        assertFalse(alertEvents.isEmpty(), "Alert created event should have been published");
        AlertCreatedEvent alertEvent = alertEvents.get(alertEvents.size() - 1);
        assertEquals("ALERT_CREATED", alertEvent.getType());
        assertEquals(RiskLevel.CRITICAL, alertEvent.getSeverity());
    }

    @Test
    @DisplayName("Should publish DeviceStatusEvent when device transitions from OFFLINE to ONLINE")
    void testDeviceStatusEventPublishing() {
        com.landsafe.entity.Device device = deviceRepository.findByDeviceId("ESP32-002").orElseThrow();
        device.setStatus(DeviceStatus.OFFLINE);
        deviceRepository.save(device);

        deviceService.recordHeartbeat("ESP32-002");

        assertFalse(deviceStatusEvents.isEmpty(), "Device status event should have been published");
        DeviceStatusEvent event = deviceStatusEvents.get(deviceStatusEvents.size() - 1);
        assertEquals("DEVICE_STATUS", event.getType());
        assertEquals("ESP32-002", event.getDeviceId());
        assertEquals(DeviceStatus.ONLINE, event.getStatus());
    }

    @Test
    @DisplayName("Should suppress duplicate risk events when risk level does not transition")
    void testDuplicateRiskEventsSuppressed() {
        // First reading with warning breach
        SensorDataRequest request1 = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(2.0)
                .tiltY(1.3)
                .tiltZ(0.9)
                .soilMoisture(80.0) // Warning breach
                .rainfall(18.0)
                .vibration(0.21)
                .battery(91.0)
                .build();

        sensorService.ingestSensorData(request1);
        int initialRiskEventsCount = riskEvents.size();

        // Second reading with identical risk level (still WARNING)
        SensorDataRequest request2 = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(2.05)
                .tiltY(1.35)
                .tiltZ(0.9)
                .soilMoisture(81.0) // Still warning
                .rainfall(18.5)
                .vibration(0.22)
                .battery(91.0)
                .build();

        sensorService.ingestSensorData(request2);

        // No duplicate risk event should have been published
        assertEquals(initialRiskEventsCount, riskEvents.size(), "Duplicate risk event should NOT be published");
    }
}
