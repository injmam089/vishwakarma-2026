package com.landsafe.service;

import com.landsafe.dto.AlertDto;
import com.landsafe.entity.*;
import com.landsafe.exception.ResourceNotFoundException;
import com.landsafe.repository.AlertRepository;
import com.landsafe.websocket.WebSocketEventPublisher;
import com.landsafe.websocket.dto.AlertCreatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AlertService {

    private static final Logger log = LoggerFactory.getLogger(AlertService.class);
    private static final long COOLDOWN_SECONDS = 300;

    private final AlertRepository alertRepository;
    private final NotificationService notificationService;
    private final WebSocketEventPublisher webSocketEventPublisher;
    private final AuditService auditService;

    public AlertService(
            AlertRepository alertRepository,
            NotificationService notificationService,
            WebSocketEventPublisher webSocketEventPublisher,
            AuditService auditService) {
        this.alertRepository = alertRepository;
        this.notificationService = notificationService;
        this.webSocketEventPublisher = webSocketEventPublisher;
        this.auditService = auditService;
    }

    public List<AlertDto> getAllAlerts() {
        return alertRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToAlertDto)
                .collect(Collectors.toList());
    }

    public List<AlertDto> getActiveAlerts() {
        return alertRepository.findByStatusOrderByCreatedAtDesc(AlertStatus.ACTIVE).stream()
                .map(this::mapToAlertDto)
                .collect(Collectors.toList());
    }

    public AlertDto getAlertById(String identifier) {
        Alert alert = alertRepository.findByAlertId(identifier)
                .or(() -> {
                    try {
                        Long id = Long.parseLong(identifier);
                        return alertRepository.findById(id);
                    } catch (NumberFormatException e) {
                        return Optional.empty();
                    }
                })
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with identifier: " + identifier));
        return mapToAlertDto(alert);
    }

    @Transactional
    public Alert createAlertFromRisk(RiskEvent event, SensorReading reading) {
        String zoneId = event.getZoneId();
        AlertSeverity severity = AlertSeverity.valueOf(event.getRiskLevel().name());

        // Check for existing ACTIVE alert in this zone
        Optional<Alert> existingActiveOpt = alertRepository.findFirstByZoneIdAndStatusOrderByCreatedAtDesc(zoneId, AlertStatus.ACTIVE);

        if (existingActiveOpt.isPresent()) {
            Alert existing = existingActiveOpt.get();

            // CRITICAL escalation check: If existing is WARNING and new is CRITICAL, escalate!
            if (existing.getSeverity() == AlertSeverity.WARNING && severity == AlertSeverity.CRITICAL) {
                log.info("[ALERT ESCALATION] Zone {} escalating from WARNING to CRITICAL", zoneId);
                existing.resolve("SYSTEM_ESCALATED_TO_CRITICAL");
                alertRepository.save(existing);
                webSocketEventPublisher.publishAlertUpdated(zoneId, mapToAlertDto(existing));
            } else if (existing.getSeverity() == severity) {
                // Duplicate prevention: same severity and within cooldown window -> suppress
                if (existing.getCreatedAt().isAfter(Instant.now().minus(COOLDOWN_SECONDS, ChronoUnit.SECONDS))) {
                    log.info("[ALERT SUPPRESSED] Duplicate {} alert for zone {} within cooldown window", severity, zoneId);
                    return existing;
                }
            }
        }

        String alertId = "ALT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String condition = severity == AlertSeverity.CRITICAL ? "Rapid ground movement detected" : "Elevated ground movement";
        String deviceId = reading != null ? reading.getDeviceId() : ("CLUSTER-" + zoneId);

        String triggeringValues = reading != null ? String.format(
                "tilt=%.1f°, moisture=%.1f%%, rainfall=%.1fmm, vibration=%.3fg",
                Math.sqrt(Math.pow(reading.getTiltX(), 2) + Math.pow(reading.getTiltY(), 2)),
                reading.getSoilMoisture(),
                reading.getRainfall(),
                reading.getVibration()) : "Telemetry breach limit reached";

        Alert alert = Alert.builder()
                .alertId(alertId)
                .eventId(event.getEventId())
                .zoneId(zoneId)
                .deviceId(deviceId)
                .severity(severity)
                .condition(condition)
                .reason(event.getReason())
                .triggeringValues(triggeringValues)
                .status(AlertStatus.ACTIVE)
                .createdAt(Instant.now())
                .build();

        Alert saved = alertRepository.save(alert);
        log.warn("[ALERT CREATED] ID: {} | Zone: {} | Severity: {}", saved.getAlertId(), zoneId, severity);

        // Broadcast to WebSocket /topic/zones/{zoneId}/alerts
        webSocketEventPublisher.publishAlertCreated(zoneId,
                AlertCreatedEvent.builder()
                        .eventId(saved.getAlertId())
                        .zoneId(zoneId)
                        .severity(RiskLevel.valueOf(severity.name()))
                        .reason(saved.getReason())
                        .timestamp(saved.getCreatedAt())
                        .build());

        auditService.logAction("SYSTEM", "ALERT_CREATED", "ZONE:" + zoneId, "Created " + severity + " alert " + saved.getAlertId());

        // Dispatch notifications to subscribers
        notificationService.dispatchAlertNotifications(saved);

        return saved;
    }

    @Transactional
    public Alert createDeviceAlert(String deviceId, String zoneId, AlertSeverity severity, String reason) {
        if (severity == AlertSeverity.DEVICE_OFFLINE) {
            // Check if active alert already exists for device
            Optional<Alert> existing = alertRepository.findFirstByDeviceIdAndStatusOrderByCreatedAtDesc(deviceId, AlertStatus.ACTIVE);
            if (existing.isPresent() && existing.get().getSeverity() == AlertSeverity.DEVICE_OFFLINE) {
                return existing.get();
            }
        }

        if (severity == AlertSeverity.DEVICE_RECOVERED) {
            // Resolve active OFFLINE alert for this device
            alertRepository.findFirstByDeviceIdAndStatusOrderByCreatedAtDesc(deviceId, AlertStatus.ACTIVE)
                    .ifPresent(activeOffline -> {
                        if (activeOffline.getSeverity() == AlertSeverity.DEVICE_OFFLINE) {
                            activeOffline.resolve("SYSTEM_RECOVERED");
                            alertRepository.save(activeOffline);
                            webSocketEventPublisher.publishAlertUpdated(zoneId != null ? zoneId : activeOffline.getZoneId(), mapToAlertDto(activeOffline));
                        }
                    });
        }

        String alertId = "ALT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String condition = severity == AlertSeverity.DEVICE_OFFLINE ? "Node telemetry heartbeat timeout" : "Node telemetry heartbeat restored";

        Alert alert = Alert.builder()
                .alertId(alertId)
                .eventId("DEV-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .zoneId(zoneId != null ? zoneId : "ZONE-01")
                .deviceId(deviceId)
                .severity(severity)
                .condition(condition)
                .reason(reason)
                .triggeringValues("Status=" + (severity == AlertSeverity.DEVICE_OFFLINE ? "OFFLINE" : "ONLINE"))
                .status(severity == AlertSeverity.DEVICE_RECOVERED ? AlertStatus.RESOLVED : AlertStatus.ACTIVE)
                .createdAt(Instant.now())
                .resolvedAt(severity == AlertSeverity.DEVICE_RECOVERED ? Instant.now() : null)
                .resolvedBy(severity == AlertSeverity.DEVICE_RECOVERED ? "SYSTEM" : null)
                .build();

        Alert saved = alertRepository.save(alert);
        log.warn("[DEVICE ALERT CREATED] ID: {} | Device: {} | Severity: {}", saved.getAlertId(), deviceId, severity);

        auditService.logAction("SYSTEM", "DEVICE_ALERT_CREATED", "DEVICE:" + deviceId, "Severity: " + severity + " on alert " + saved.getAlertId());

        notificationService.dispatchAlertNotifications(saved);

        return saved;
    }

    @Transactional
    public AlertDto acknowledgeAlert(String alertId, String username) {
        Alert alert = alertRepository.findByAlertId(alertId)
                .or(() -> {
                    try {
                        Long id = Long.parseLong(alertId);
                        return alertRepository.findById(id);
                    } catch (NumberFormatException e) {
                        return Optional.empty();
                    }
                })
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with identifier: " + alertId));

        if (alert.getStatus() == AlertStatus.ACTIVE) {
            alert.acknowledge(username != null ? username : "operator");
            Alert saved = alertRepository.save(alert);
            AlertDto dto = mapToAlertDto(saved);
            webSocketEventPublisher.publishAlertUpdated(saved.getZoneId(), dto);
            auditService.logAction(username, "ALERT_ACKNOWLEDGED", "ALERT:" + alertId, "Status updated to ACKNOWLEDGED");
            return dto;
        }

        return mapToAlertDto(alert);
    }

    @Transactional
    public AlertDto resolveAlert(String alertId, String username) {
        Alert alert = alertRepository.findByAlertId(alertId)
                .or(() -> {
                    try {
                        Long id = Long.parseLong(alertId);
                        return alertRepository.findById(id);
                    } catch (NumberFormatException e) {
                        return Optional.empty();
                    }
                })
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found with identifier: " + alertId));

        if (alert.getStatus() != AlertStatus.RESOLVED) {
            alert.resolve(username != null ? username : "operator");
            Alert saved = alertRepository.save(alert);
            AlertDto dto = mapToAlertDto(saved);
            webSocketEventPublisher.publishAlertUpdated(saved.getZoneId(), dto);
            auditService.logAction(username, "ALERT_RESOLVED", "ALERT:" + alertId, "Status updated to RESOLVED");
            return dto;
        }

        return mapToAlertDto(alert);
    }

    public AlertDto mapToAlertDto(Alert alert) {
        String protocol = alert.getSeverity() == AlertSeverity.CRITICAL
                ? "Immediate siren evacuation and geotechnical ground inspection protocol."
                : (alert.getSeverity() == AlertSeverity.DEVICE_OFFLINE
                ? "Dispatch field technician to inspect solar power and radio gateway transceiver."
                : (alert.getSeverity() == AlertSeverity.DEVICE_RECOVERED
                ? "Node operational. Standard telemetry stream confirmed."
                : "Verify drainage pathways and initiate elevated inspection interval."));

        return AlertDto.builder()
                .id(alert.getAlertId())
                .alertId(alert.getAlertId())
                .eventId(alert.getEventId())
                .timestamp(alert.getCreatedAt())
                .severity(alert.getSeverity().name())
                .condition(alert.getCondition())
                .reason(alert.getReason())
                .zoneId(alert.getZoneId())
                .deviceId(alert.getDeviceId())
                .value(alert.getTriggeringValues() != null ? alert.getTriggeringValues() : alert.getSeverity().name() + " THRESHOLD BREACH")
                .threshold("ZONE CALIBRATED LIMIT")
                .status(alert.getStatus().name())
                .protocol(protocol)
                .triggeringValues(alert.getTriggeringValues())
                .createdAt(alert.getCreatedAt())
                .acknowledgedAt(alert.getAcknowledgedAt())
                .acknowledgedBy(alert.getAcknowledgedBy())
                .resolvedAt(alert.getResolvedAt())
                .resolvedBy(alert.getResolvedBy())
                .build();
    }
}
