package com.landsafe.controller;

import com.landsafe.dto.ThresholdDto;
import com.landsafe.dto.UpdateThresholdsRequest;
import com.landsafe.service.ThresholdService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/thresholds")
@Tag(name = "Thresholds", description = "Geotechnical safety limits configuration (Tilt, Moisture, Rainfall, Vibration)")
@SecurityRequirement(name = "Bearer Authentication")
public class ThresholdController {

    private final ThresholdService thresholdService;

    public ThresholdController(ThresholdService thresholdService) {
        this.thresholdService = thresholdService;
    }

    @GetMapping("/{zoneId}")
    @Operation(summary = "Get configured warning and critical threshold limits for a hazard zone")
    public ResponseEntity<List<ThresholdDto>> getThresholds(@PathVariable String zoneId) {
        return ResponseEntity.ok(thresholdService.getThresholds(zoneId));
    }

    @PutMapping("/{zoneId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update warning and critical threshold limits for a zone (ADMINISTRATOR ONLY)")
    public ResponseEntity<List<ThresholdDto>> updateThresholds(
            @PathVariable String zoneId,
            @Valid @RequestBody UpdateThresholdsRequest request) {
        return ResponseEntity.ok(thresholdService.updateThresholds(zoneId, request));
    }
}
