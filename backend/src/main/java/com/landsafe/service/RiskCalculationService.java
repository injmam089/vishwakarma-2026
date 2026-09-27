package com.landsafe.service;

import com.landsafe.dto.RiskCalculationResultDto;
import com.landsafe.dto.RiskEventDto;
import com.landsafe.entity.*;
import com.landsafe.repository.RiskEventRepository;
import com.landsafe.repository.SensorReadingRepository;
import com.landsafe.repository.ThresholdRepository;
import com.landsafe.websocket.RiskWebSocketService;
import com.landsafe.websocket.dto.AlertCreatedEvent;
import com.landsafe.websocket.dto.RiskUpdateEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class RiskCalculationService {

    private final ThresholdRepository thresholdRepository;
    private final RiskEventRepository riskEventRepository;
    private final SensorReadingRepository sensorReadingRepository;
    private final RiskWebSocketService riskWebSocketService;
    private final AlertService alertService;

    // Cache latest risk level per zone to prevent duplicate risk events
    private final Map<String, RiskLevel> latestZoneRiskLevel = new ConcurrentHashMap<>();

    // 5-minute cooldown between duplicate risk event logs
    private static final long COOLDOWN_SECONDS = 300;

    public RiskCalculationService(
            ThresholdRepository thresholdRepository,
            RiskEventRepository riskEventRepository,
            SensorReadingRepository sensorReadingRepository,
            RiskWebSocketService riskWebSocketService,
            AlertService alertService) {
        this.thresholdRepository = thresholdRepository;
        this.riskEventRepository = riskEventRepository;
        this.sensorReadingRepository = sensorReadingRepository;
        this.riskWebSocketService = riskWebSocketService;
        this.alertService = alertService;
    }

    @Transactional
    public RiskCalculationResultDto evaluateAndRecord(String zoneId, SensorReading reading) {
        RiskCalculationResultDto result = calculateRisk(zoneId, reading);

        // Check if risk level changed (NORMAL -> WARNING, WARNING -> CRITICAL, etc.)
        RiskLevel previousLevel = latestZoneRiskLevel.get(zoneId);
        if (previousLevel == null) {
            Optional<RiskEvent> latestEvent = riskEventRepository.findFirstByZoneIdOrderByTimestampDesc(zoneId);
            previousLevel = latestEvent.map(RiskEvent::getRiskLevel).orElse(RiskLevel.NORMAL);
        }

        if (previousLevel != result.getRiskLevel()) {
            riskWebSocketService.broadcastRiskUpdate(zoneId,
                    RiskUpdateEvent.builder()
                            .zoneId(zoneId)
                            .riskLevel(result.getRiskLevel())
                            .riskIndex(result.getRiskIndex())
                            .reason(result.getReason())
                            .timestamp(result.getTimestamp() != null ? result.getTimestamp() : Instant.now())
                            .build());
        }
        latestZoneRiskLevel.put(zoneId, result.getRiskLevel());

        // Hysteresis & Cooldown: record a RiskEvent if status is WARNING or CRITICAL
        if (result.getRiskLevel() != RiskLevel.NORMAL) {
            recordRiskEventWithCooldown(zoneId, result, reading);
        }

        return result;
    }

    public RiskCalculationResultDto calculateRisk(String zoneId, SensorReading reading) {
        List<Threshold> thresholds = thresholdRepository.findByZoneId(zoneId);
        Map<ThresholdParameter, Threshold> threshMap = thresholds.stream()
                .collect(Collectors.toMap(Threshold::getParameter, t -> t));

        double compositeTilt = Math.sqrt(Math.pow(reading.getTiltX(), 2) + Math.pow(reading.getTiltY(), 2));

        List<String> criticalBreaches = new ArrayList<>();
        List<String> warningBreaches = new ArrayList<>();

        // 1. Tilt
        Threshold tiltThresh = threshMap.get(ThresholdParameter.TILT);
        if (tiltThresh != null) {
            if (compositeTilt >= tiltThresh.getCriticalValue()) {
                criticalBreaches.add(String.format("Ground tilt (%.1f°) exceeds critical threshold (%.1f°)", compositeTilt, tiltThresh.getCriticalValue()));
            } else if (compositeTilt >= tiltThresh.getWarningValue()) {
                warningBreaches.add(String.format("Elevated ground tilt (%.1f°) exceeds warning threshold (%.1f°)", compositeTilt, tiltThresh.getWarningValue()));
            }
        }

        // 2. Soil Moisture
        Threshold moistureThresh = threshMap.get(ThresholdParameter.SOIL_MOISTURE);
        if (moistureThresh != null) {
            if (reading.getSoilMoisture() >= moistureThresh.getCriticalValue()) {
                criticalBreaches.add(String.format("Soil moisture saturation (%.1f%%) exceeds critical limit (%.1f%%)", reading.getSoilMoisture(), moistureThresh.getCriticalValue()));
            } else if (reading.getSoilMoisture() >= moistureThresh.getWarningValue()) {
                warningBreaches.add(String.format("Elevated soil moisture (%.1f%%) exceeds warning threshold (%.1f%%)", reading.getSoilMoisture(), moistureThresh.getWarningValue()));
            }
        }

        // 3. Rainfall
        Threshold rainThresh = threshMap.get(ThresholdParameter.RAINFALL);
        if (rainThresh != null) {
            if (reading.getRainfall() >= rainThresh.getCriticalValue()) {
                criticalBreaches.add(String.format("Rainfall accumulation (%.1f mm) exceeds critical flood stage (%.1f mm)", reading.getRainfall(), rainThresh.getCriticalValue()));
            } else if (reading.getRainfall() >= rainThresh.getWarningValue()) {
                warningBreaches.add(String.format("Heavy rainfall (%.1f mm) exceeds warning threshold (%.1f mm)", reading.getRainfall(), rainThresh.getWarningValue()));
            }
        }

        // 4. Vibration
        Threshold vibeThresh = threshMap.get(ThresholdParameter.VIBRATION);
        if (vibeThresh != null) {
            if (reading.getVibration() >= vibeThresh.getCriticalValue()) {
                criticalBreaches.add(String.format("Microseismic vibration (%.2fg) exceeds critical shock limit (%.2fg)", reading.getVibration(), vibeThresh.getCriticalValue()));
            } else if (reading.getVibration() >= vibeThresh.getWarningValue()) {
                warningBreaches.add(String.format("Elevated microseismic tremor (%.2fg) exceeds warning threshold (%.2fg)", reading.getVibration(), vibeThresh.getWarningValue()));
            }
        }

        RiskLevel level;
        int riskIndex;
        String reason;

        if (!criticalBreaches.isEmpty() || warningBreaches.size() >= 2) {
            level = RiskLevel.CRITICAL;
            riskIndex = Math.min(98, 75 + (criticalBreaches.size() * 8) + (warningBreaches.size() * 5));
            List<String> combined = new ArrayList<>(criticalBreaches);
            combined.addAll(warningBreaches);
            reason = "CRITICAL HAZARD: " + String.join("; ", combined);
        } else if (!warningBreaches.isEmpty()) {
            level = RiskLevel.WARNING;
            riskIndex = Math.min(69, 45 + (warningBreaches.size() * 10));
            reason = "WARNING: " + String.join("; ", warningBreaches);
        } else {
            level = RiskLevel.NORMAL;
            riskIndex = Math.max(10, (int) Math.round((compositeTilt * 4) + (reading.getSoilMoisture() * 0.1)));
            reason = "Slope stable. All geotechnical telemetry remains within calibrated nominal baselines.";
        }

        return RiskCalculationResultDto.builder()
                .zoneId(zoneId)
                .riskLevel(level)
                .riskIndex(riskIndex)
                .reason(reason)
                .timestamp(reading.getTimestamp() != null ? reading.getTimestamp() : Instant.now())
                .build();
    }

    private void recordRiskEventWithCooldown(String zoneId, RiskCalculationResultDto result, SensorReading reading) {
        Instant cutoff = Instant.now().minus(COOLDOWN_SECONDS, ChronoUnit.SECONDS);
        Optional<RiskEvent> latestEvent = riskEventRepository.findFirstByZoneIdOrderByTimestampDesc(zoneId);

        boolean shouldRecord = false;
        if (latestEvent.isEmpty()) {
            shouldRecord = true;
        } else {
            RiskEvent event = latestEvent.get();
            // Record if risk escalated or if last recorded event is older than cooldown window
            if (event.getRiskLevel() != result.getRiskLevel() || event.getTimestamp().isBefore(cutoff)) {
                shouldRecord = true;
            }
        }

        if (shouldRecord) {
            RiskEvent newEvent = RiskEvent.builder()
                    .eventId("EVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                    .zoneId(zoneId)
                    .timestamp(Instant.now())
                    .riskLevel(result.getRiskLevel())
                    .reason(result.getReason())
                    .build();
            RiskEvent saved = riskEventRepository.save(newEvent);

            // Create persistent Alert entity, dispatch notifications and broadcast over WebSocket
            alertService.createAlertFromRisk(saved, reading);
        }
    }

    public RiskCalculationResultDto getCurrentRisk(String zoneId) {
        List<SensorReading> readings = sensorReadingRepository.findByZoneIdOrderByTimestampDesc(zoneId);
        if (readings.isEmpty()) {
            return RiskCalculationResultDto.builder()
                    .zoneId(zoneId)
                    .riskLevel(RiskLevel.NORMAL)
                    .riskIndex(15)
                    .reason("No active sensor telemetry available. Baseline default assumed.")
                    .timestamp(Instant.now())
                    .build();
        }

        return calculateRisk(zoneId, readings.get(0));
    }

    public List<RiskEventDto> getRiskEvents(String zoneId) {
        return riskEventRepository.findByZoneIdOrderByTimestampDesc(zoneId).stream()
                .map(this::mapToRiskEventDto)
                .collect(Collectors.toList());
    }

    public RiskEventDto mapToRiskEventDto(RiskEvent event) {
        return RiskEventDto.builder()
                .id(event.getId())
                .eventId(event.getEventId())
                .zoneId(event.getZoneId())
                .timestamp(event.getTimestamp())
                .riskLevel(event.getRiskLevel())
                .reason(event.getReason())
                .build();
    }
}
