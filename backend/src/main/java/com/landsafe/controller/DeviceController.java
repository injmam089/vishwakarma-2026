package com.landsafe.controller;

import com.landsafe.dto.DeviceDto;
import com.landsafe.dto.DeviceStatusDto;
import com.landsafe.service.DeviceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
@Tag(name = "Devices", description = "ESP32 telemetry nodes and solar gateway management")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "List all field telemetry hardware devices")
    public ResponseEntity<List<DeviceDto>> getAllDevices() {
        return ResponseEntity.ok(deviceService.getAllDevices());
    }

    @GetMapping("/{deviceId}")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get specific device information by hardware ID")
    public ResponseEntity<DeviceDto> getDeviceById(@PathVariable String deviceId) {
        return ResponseEntity.ok(deviceService.getDeviceById(deviceId));
    }

    @GetMapping("/{deviceId}/status")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Check device connection status and last seen timestamp")
    public ResponseEntity<DeviceStatusDto> getDeviceStatus(@PathVariable String deviceId) {
        return ResponseEntity.ok(deviceService.getDeviceStatus(deviceId));
    }

    @PostMapping("/{deviceId}/heartbeat")
    @Operation(summary = "Ingest periodic heartbeat from ESP32 node to keep status ONLINE")
    public ResponseEntity<DeviceStatusDto> recordHeartbeat(@PathVariable String deviceId) {
        return ResponseEntity.ok(deviceService.recordHeartbeat(deviceId));
    }
}
