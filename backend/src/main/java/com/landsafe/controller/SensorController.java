package com.landsafe.controller;

import com.landsafe.dto.SensorDataRequest;
import com.landsafe.dto.SensorReadingDto;
import com.landsafe.service.SensorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping
@Tag(name = "Sensor Telemetry", description = "ESP32 data ingestion, latest readings, history, and CSV audit exports")
public class SensorController {

    private final SensorService sensorService;

    public SensorController(SensorService sensorService) {
        this.sensorService = sensorService;
    }

    @PostMapping("/api/sensor-data")
    @Operation(summary = "Ingest real-time ESP32 sensor telemetry packet (validates ranges and triggers risk engine)")
    public ResponseEntity<SensorReadingDto> ingestSensorData(@Valid @RequestBody SensorDataRequest request) {
        SensorReadingDto result = sensorService.ingestSensorData(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/api/sensors/latest")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Retrieve latest geotechnical sensor telemetry for a zone")
    public ResponseEntity<SensorReadingDto> getLatestReading(@RequestParam String zoneId) {
        return ResponseEntity.ok(sensorService.getLatestReading(zoneId));
    }

    @GetMapping("/api/sensors/history")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Query historical sensor readings for a zone within a specified time window")
    public ResponseEntity<List<SensorReadingDto>> getHistoricalReadings(
            @RequestParam String zoneId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {
        return ResponseEntity.ok(sensorService.getHistoricalReadings(zoneId, from, to));
    }

    @GetMapping("/api/sensors/export")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Export zone sensor telemetry as an audit-grade CSV file")
    public ResponseEntity<byte[]> exportSensorData(
            @RequestParam String zoneId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {

        byte[] csvData = sensorService.exportCsv(zoneId, from, to);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"landsafe-telemetry-" + zoneId + ".csv\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csvData);
    }
}
