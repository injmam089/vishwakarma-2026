package com.landsafe.service;

import com.landsafe.dto.DeviceDto;
import com.landsafe.dto.DeviceStatusDto;
import com.landsafe.entity.AlertSeverity;
import com.landsafe.entity.Device;
import com.landsafe.entity.DeviceStatus;
import com.landsafe.exception.ResourceNotFoundException;
import com.landsafe.repository.DeviceRepository;
import com.landsafe.websocket.DeviceWebSocketService;
import com.landsafe.websocket.dto.DeviceStatusEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final DeviceWebSocketService deviceWebSocketService;
    private final AlertService alertService;

    @Value("${landsafe.device.offline-timeout-seconds:90}")
    private int offlineTimeoutSeconds;

    public DeviceService(
            DeviceRepository deviceRepository,
            DeviceWebSocketService deviceWebSocketService,
            AlertService alertService) {
        this.deviceRepository = deviceRepository;
        this.deviceWebSocketService = deviceWebSocketService;
        this.alertService = alertService;
    }

    public List<DeviceDto> getAllDevices() {
        return deviceRepository.findAll().stream()
                .map(this::mapToDeviceDto)
                .collect(Collectors.toList());
    }

    public DeviceDto getDeviceById(String deviceId) {
        Device device = deviceRepository.findByDeviceId(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with ID: " + deviceId));
        return mapToDeviceDto(device);
    }

    public DeviceStatusDto getDeviceStatus(String deviceId) {
        Device device = deviceRepository.findByDeviceId(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with ID: " + deviceId));

        return DeviceStatusDto.builder()
                .deviceId(device.getDeviceId())
                .zoneId(device.getZoneId())
                .status(device.getStatus())
                .lastSeen(device.getLastSeen())
                .batteryLevel(device.getBatteryLevel())
                .isOnline(device.getStatus() == DeviceStatus.ONLINE)
                .build();
    }

    @Transactional
    public DeviceStatusDto recordHeartbeat(String deviceId) {
        Device device = deviceRepository.findByDeviceId(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with ID: " + deviceId));

        DeviceStatus previousStatus = device.getStatus();
        Instant now = Instant.now();
        device.setLastSeen(now);
        device.setStatus(DeviceStatus.ONLINE);
        device.setUpdatedAt(now);

        Device updated = deviceRepository.save(device);

        if (previousStatus != DeviceStatus.ONLINE) {
            deviceWebSocketService.broadcastDeviceStatus(deviceId,
                    DeviceStatusEvent.builder()
                            .deviceId(deviceId)
                            .zoneId(updated.getZoneId())
                            .status(DeviceStatus.ONLINE)
                            .lastSeen(now)
                            .timestamp(now)
                            .build());

            // Create device recovered alert
            alertService.createDeviceAlert(deviceId, updated.getZoneId(), AlertSeverity.DEVICE_RECOVERED,
                    "Hardware node heartbeat restored and online");
        }

        return DeviceStatusDto.builder()
                .deviceId(updated.getDeviceId())
                .zoneId(updated.getZoneId())
                .status(updated.getStatus())
                .lastSeen(updated.getLastSeen())
                .batteryLevel(updated.getBatteryLevel())
                .isOnline(true)
                .build();
    }

    @Scheduled(fixedDelayString = "${landsafe.device.scan-rate-ms:15000}")
    @Transactional
    public void scanAndMarkOfflineDevices() {
        Instant cutoff = Instant.now().minus(offlineTimeoutSeconds, ChronoUnit.SECONDS);
        List<Device> staleDevices = deviceRepository.findByStatusAndLastSeenBefore(DeviceStatus.ONLINE, cutoff);
        Instant now = Instant.now();

        for (Device device : staleDevices) {
            device.setStatus(DeviceStatus.OFFLINE);
            device.setUpdatedAt(now);
            deviceRepository.save(device);

            deviceWebSocketService.broadcastDeviceStatus(device.getDeviceId(),
                    DeviceStatusEvent.builder()
                            .deviceId(device.getDeviceId())
                            .zoneId(device.getZoneId())
                            .status(DeviceStatus.OFFLINE)
                            .lastSeen(device.getLastSeen())
                            .timestamp(now)
                            .build());

            // Create device offline alert
            alertService.createDeviceAlert(device.getDeviceId(), device.getZoneId(), AlertSeverity.DEVICE_OFFLINE,
                    "Hardware node ceased reporting heartbeat (timeout > " + offlineTimeoutSeconds + "s)");
        }
    }

    public DeviceDto mapToDeviceDto(Device device) {
        return DeviceDto.builder()
                .id(device.getId())
                .deviceId(device.getDeviceId())
                .zoneId(device.getZoneId())
                .status(device.getStatus())
                .lastSeen(device.getLastSeen())
                .batteryLevel(device.getBatteryLevel())
                .createdAt(device.getCreatedAt())
                .updatedAt(device.getUpdatedAt())
                .build();
    }
}
