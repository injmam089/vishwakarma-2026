package com.landsafe.controller;

import com.landsafe.dto.ZoneDto;
import com.landsafe.service.ZoneService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/zones")
@Tag(name = "Zones", description = "Geological monitoring zone configuration and telemetry overview")
@SecurityRequirement(name = "Bearer Authentication")
public class ZoneController {

    private final ZoneService zoneService;

    public ZoneController(ZoneService zoneService) {
        this.zoneService = zoneService;
    }

    @GetMapping
    @Operation(summary = "List all registered monitoring hazard zones")
    public ResponseEntity<List<ZoneDto>> getAllZones() {
        return ResponseEntity.ok(zoneService.getAllZones());
    }

    @GetMapping("/{zoneId}")
    @Operation(summary = "Get detailed profile and coordinates for a specific zone")
    public ResponseEntity<ZoneDto> getZoneById(@PathVariable String zoneId) {
        return ResponseEntity.ok(zoneService.getZoneById(zoneId));
    }
}
