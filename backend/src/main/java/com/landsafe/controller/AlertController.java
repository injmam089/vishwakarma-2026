package com.landsafe.controller;

import com.landsafe.dto.AlertDto;
import com.landsafe.entity.AuditLog;
import com.landsafe.service.AlertService;
import com.landsafe.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@Tag(name = "Alerts", description = "Safety alerts, threshold breach records, and emergency protocols")
@SecurityRequirement(name = "Bearer Authentication")
public class AlertController {

    private final AlertService alertService;
    private final AuditService auditService;

    public AlertController(AlertService alertService, AuditService auditService) {
        this.alertService = alertService;
        this.auditService = auditService;
    }

    @GetMapping
    @Operation(summary = "List all triggered hazard alerts across all monitored zones")
    public ResponseEntity<List<AlertDto>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @GetMapping("/active")
    @Operation(summary = "List all active unresolved hazard alerts")
    public ResponseEntity<List<AlertDto>> getActiveAlerts() {
        return ResponseEntity.ok(alertService.getActiveAlerts());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific alert details and emergency protocol by alert ID")
    public ResponseEntity<AlertDto> getAlertById(@PathVariable String id) {
        return ResponseEntity.ok(alertService.getAlertById(id));
    }

    @PatchMapping("/{alertId}/acknowledge")
    @Operation(summary = "Acknowledge an active hazard alert")
    public ResponseEntity<AlertDto> acknowledgeAlert(
            @PathVariable String alertId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "anonymous";
        return ResponseEntity.ok(alertService.acknowledgeAlert(alertId, username));
    }

    @PatchMapping("/{alertId}/resolve")
    @Operation(summary = "Resolve an active or acknowledged hazard alert")
    public ResponseEntity<AlertDto> resolveAlert(
            @PathVariable String alertId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : "anonymous";
        return ResponseEntity.ok(alertService.resolveAlert(alertId, username));
    }

    @GetMapping("/audit")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "List system audit log trail (Admins only)")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditService.getAllAuditLogs());
    }
}
