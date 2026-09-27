package com.landsafe.service;

import com.landsafe.dto.SensorDataRequest;
import com.landsafe.dto.SensorReadingDto;
import com.landsafe.entity.AlertSeverity;
import com.landsafe.entity.Device;
import com.landsafe.entity.DeviceStatus;
import com.landsafe.entity.SensorReading;
import com.landsafe.exception.BadRequestException;
import com.landsafe.exception.ResourceNotFoundException;
import com.landsafe.repository.DeviceRepository;
import com.landsafe.repository.SensorReadingRepository;
import com.landsafe.repository.ZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import com.landsafe.websocket.DeviceWebSocketService;
import com.landsafe.websocket.TelemetryWebSocketService;
import com.landsafe.websocket.dto.DeviceStatusEvent;
import com.landsafe.websocket.dto.TelemetryUpdateEvent;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SensorService {

    private final SensorReadingRepository sensorReadingRepository;
    private final DeviceRepository deviceRepository;
    private final ZoneRepository zoneRepository;
    private final RiskCalculationService riskCalculationService;
    private final TelemetryWebSocketService telemetryWebSocketService;
    private final DeviceWebSocketService deviceWebSocketService;
    private final AlertService alertService;

    public SensorService(
            SensorReadingRepository sensorReadingRepository,
            DeviceRepository deviceRepository,
            ZoneRepository zoneRepository,
            RiskCalculationService riskCalculationService,
            TelemetryWebSocketService telemetryWebSocketService,
            DeviceWebSocketService deviceWebSocketService,
            AlertService alertService) {
        this.sensorReadingRepository = sensorReadingRepository;
        this.deviceRepository = deviceRepository;
        this.zoneRepository = zoneRepository;
        this.riskCalculationService = riskCalculationService;
        this.telemetryWebSocketService = telemetryWebSocketService;
        this.deviceWebSocketService = deviceWebSocketService;
        this.alertService = alertService;
    }

    @Transactional
    public SensorReadingDto ingestSensorData(SensorDataRequest request) {
        // 1. Verify zone exists
        if (!zoneRepository.existsByZoneId(request.getZoneId())) {
            throw new ResourceNotFoundException("Zone does not exist: " + request.getZoneId());
        }

        // 2. Verify device exists and belongs to the zone
        Device device = deviceRepository.findByDeviceId(request.getDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Device does not exist: " + request.getDeviceId()));

        if (!device.getZoneId().equalsIgnoreCase(request.getZoneId())) {
            throw new BadRequestException("Device " + request.getDeviceId() + " is registered to " + device.getZoneId() + ", not " + request.getZoneId());
        }

        // 3. Validate timestamp sanity (not future > 5m, not older than 60 days)
        Instant now = Instant.now();
        if (request.getTimestamp().isAfter(now.plus(5, ChronoUnit.MINUTES))) {
            throw new BadRequestException("Sensor timestamp cannot be in the future: " + request.getTimestamp());
        }
        if (request.getTimestamp().isBefore(now.minus(60, ChronoUnit.DAYS))) {
            throw new BadRequestException("Sensor timestamp is too old (>60 days): " + request.getTimestamp());
        }

        // 4. Save reading
        SensorReading reading = SensorReading.builder()
                .timestamp(request.getTimestamp())
                .deviceId(request.getDeviceId())
                .tiltX(request.getTiltX())
                .tiltY(request.getTiltY())
                .tiltZ(request.getTiltZ())
                .soilMoisture(request.getSoilMoisture())
                .rainfall(request.getRainfall())
                .vibration(request.getVibration())
                .battery(request.getBattery())
                .build();

        SensorReading saved = sensorReadingRepository.save(reading);

        DeviceStatus previousStatus = device.getStatus();

        // 5. Update device status, last_seen, and battery
        device.setLastSeen(request.getTimestamp());
        device.setStatus(DeviceStatus.ONLINE);
        device.setBatteryLevel(request.getBattery());
        device.setUpdatedAt(now);
        deviceRepository.save(device);

        // Broadcast device status transition if previously offline
        if (previousStatus != DeviceStatus.ONLINE) {
            deviceWebSocketService.broadcastDeviceStatus(device.getDeviceId(),
                    DeviceStatusEvent.builder()
                            .deviceId(device.getDeviceId())
                            .zoneId(device.getZoneId())
                            .status(DeviceStatus.ONLINE)
                            .lastSeen(device.getLastSeen())
                            .timestamp(now)
                            .build());

            alertService.createDeviceAlert(device.getDeviceId(), device.getZoneId(), AlertSeverity.DEVICE_RECOVERED,
                    "Node telemetry stream resumed");
        }

        // 6. Trigger risk calculation and event recording
        riskCalculationService.evaluateAndRecord(request.getZoneId(), saved);

        // 7. Broadcast telemetry update via WebSocket
        double compositeTilt = Math.sqrt(Math.pow(saved.getTiltX(), 2) + Math.pow(saved.getTiltY(), 2));
        telemetryWebSocketService.broadcastTelemetry(request.getZoneId(),
                TelemetryUpdateEvent.builder()
                        .deviceId(saved.getDeviceId())
                        .zoneId(request.getZoneId())
                        .timestamp(saved.getTimestamp())
                        .tiltX(saved.getTiltX())
                        .tiltY(saved.getTiltY())
                        .tiltZ(saved.getTiltZ())
                        .compositeTilt(compositeTilt)
                        .soilMoisture(saved.getSoilMoisture())
                        .rainfall(saved.getRainfall())
                        .vibration(saved.getVibration())
                        .battery(saved.getBattery())
                        .build());

        return mapToDto(saved);
    }

    public SensorReadingDto getLatestReading(String zoneId) {
        if (!zoneRepository.existsByZoneId(zoneId)) {
            throw new ResourceNotFoundException("Zone not found: " + zoneId);
        }

        List<SensorReading> readings = sensorReadingRepository.findByZoneIdOrderByTimestampDesc(zoneId);
        if (readings.isEmpty()) {
            throw new ResourceNotFoundException("No sensor readings available for zone: " + zoneId);
        }

        return mapToDto(readings.get(0));
    }

    public List<SensorReadingDto> getHistoricalReadings(String zoneId, Instant from, Instant to) {
        if (!zoneRepository.existsByZoneId(zoneId)) {
            throw new ResourceNotFoundException("Zone not found: " + zoneId);
        }

        Instant start = from != null ? from : Instant.now().minus(24, ChronoUnit.HOURS);
        Instant end = to != null ? to : Instant.now();

        if (start.isAfter(end)) {
            throw new BadRequestException("'from' timestamp cannot be after 'to' timestamp");
        }

        return sensorReadingRepository.findByZoneIdAndTimestampBetween(zoneId, start, end).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public byte[] exportCsv(String zoneId, Instant from, Instant to) {
        List<SensorReadingDto> readings = getHistoricalReadings(zoneId, from, to);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8);

        // CSV Header
        writer.println("timestamp,zone_id,device_id,tilt_x,tilt_y,tilt_z,composite_tilt,soil_moisture_percent,rainfall_mm,vibration_g,battery_percent");

        for (SensorReadingDto r : readings) {
            writer.printf("%s,%s,%s,%.2f,%.2f,%.2f,%.2f,%.1f,%.1f,%.3f,%.1f%n",
                    r.getTimestamp().toString(),
                    zoneId,
                    r.getDeviceId(),
                    r.getTiltX(),
                    r.getTiltY(),
                    r.getTiltZ(),
                    r.getCompositeTilt(),
                    r.getSoilMoisture(),
                    r.getRainfall(),
                    r.getVibration(),
                    r.getBattery());
        }

        writer.flush();
        return out.toByteArray();
    }

    public SensorReadingDto mapToDto(SensorReading r) {
        double compositeTilt = Math.sqrt(Math.pow(r.getTiltX(), 2) + Math.pow(r.getTiltY(), 2));

        return SensorReadingDto.builder()
                .id(r.getId())
                .timestamp(r.getTimestamp())
                .deviceId(r.getDeviceId())
                .tiltX(r.getTiltX())
                .tiltY(r.getTiltY())
                .tiltZ(r.getTiltZ())
                .compositeTilt(Math.round(compositeTilt * 100.0) / 100.0)
                .soilMoisture(r.getSoilMoisture())
                .rainfall(r.getRainfall())
                .vibration(r.getVibration())
                .battery(r.getBattery())
                .build();
    }
}
