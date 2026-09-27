package com.landsafe.controller;

import com.landsafe.dto.RiskCalculationResultDto;
import com.landsafe.dto.RiskEventDto;
import com.landsafe.service.RiskCalculationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/risk")
@Tag(name = "Risk Engine", description = "Geological landslide risk evaluation and historical hazard events")
@SecurityRequirement(name = "Bearer Authentication")
public class RiskController {

    private final RiskCalculationService riskCalculationService;

    public RiskController(RiskCalculationService riskCalculationService) {
        this.riskCalculationService = riskCalculationService;
    }

    @GetMapping("/current")
    @Operation(summary = "Calculate current landslide risk index, level, and advisory reason for a zone")
    public ResponseEntity<RiskCalculationResultDto> getCurrentRisk(@RequestParam String zoneId) {
        return ResponseEntity.ok(riskCalculationService.getCurrentRisk(zoneId));
    }

    @GetMapping("/events")
    @Operation(summary = "Get historical warning and critical risk events logged for a zone")
    public ResponseEntity<List<RiskEventDto>> getRiskEvents(@RequestParam String zoneId) {
        return ResponseEntity.ok(riskCalculationService.getRiskEvents(zoneId));
    }
}
