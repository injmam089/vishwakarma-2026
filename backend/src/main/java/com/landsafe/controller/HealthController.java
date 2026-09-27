package com.landsafe.controller;

import com.landsafe.dto.HealthResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health", description = "System liveness and heartbeat verification endpoint")
public class HealthController {

    @GetMapping
    @Operation(summary = "Check backend service health status")
    public ResponseEntity<HealthResponse> checkHealth() {
        return ResponseEntity.ok(HealthResponse.builder()
                .status("UP")
                .service("LANDSAFE")
                .timestamp(Instant.now())
                .build());
    }
}
