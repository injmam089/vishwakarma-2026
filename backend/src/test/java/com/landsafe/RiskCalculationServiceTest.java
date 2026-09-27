package com.landsafe;

import com.landsafe.dto.RiskCalculationResultDto;
import com.landsafe.entity.RiskLevel;
import com.landsafe.entity.SensorReading;
import com.landsafe.service.RiskCalculationService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class RiskCalculationServiceTest {

    @Autowired
    private RiskCalculationService riskCalculationService;

    @Test
    @DisplayName("Should evaluate NORMAL risk for nominal baseline values (Tilt 2.4°, Moisture 67%, Rain 18mm, Vibe 0.21g)")
    void testCalculateRiskNormal() {
        SensorReading reading = SensorReading.builder()
                .timestamp(Instant.now())
                .deviceId("ESP32-001")
                .tiltX(2.0)
                .tiltY(1.3) // Composite tilt sqrt(4 + 1.69) = ~2.38° < 5.0°
                .tiltZ(0.9)
                .soilMoisture(67.0) // < 75.0%
                .rainfall(18.0)     // < 35.0 mm
                .vibration(0.21)    // < 0.50 g
                .battery(91.0)
                .build();

        RiskCalculationResultDto result = riskCalculationService.calculateRisk("ZONE-01", reading);

        assertNotNull(result);
        assertEquals(RiskLevel.NORMAL, result.getRiskLevel());
        assertTrue(result.getRiskIndex() < 40, "Normal risk index should be < 40, was: " + result.getRiskIndex());
        assertTrue(result.getReason().contains("nominal"));
    }

    @Test
    @DisplayName("Should evaluate WARNING risk when soil moisture breaches warning limit (80% >= 75%)")
    void testCalculateRiskWarning() {
        SensorReading reading = SensorReading.builder()
                .timestamp(Instant.now())
                .deviceId("ESP32-001")
                .tiltX(2.0)
                .tiltY(1.3)
                .tiltZ(0.9)
                .soilMoisture(80.0) // Breaches ZONE-01 warning (75.0%) but < critical (90.0%)
                .rainfall(18.0)
                .vibration(0.21)
                .battery(91.0)
                .build();

        RiskCalculationResultDto result = riskCalculationService.calculateRisk("ZONE-01", reading);

        assertNotNull(result);
        assertEquals(RiskLevel.WARNING, result.getRiskLevel());
        assertTrue(result.getRiskIndex() >= 40 && result.getRiskIndex() < 70, "Warning risk index should be 40-69, was: " + result.getRiskIndex());
        assertTrue(result.getReason().toLowerCase().contains("soil moisture"));
    }

    @Test
    @DisplayName("Should evaluate CRITICAL risk when tilt breaches critical threshold (composite > 12.0°)")
    void testCalculateRiskCritical() {
        SensorReading reading = SensorReading.builder()
                .timestamp(Instant.now())
                .deviceId("ESP32-001")
                .tiltX(10.0)
                .tiltY(8.0) // Composite = sqrt(100 + 64) = ~12.8° >= 12.0°
                .tiltZ(0.9)
                .soilMoisture(70.0)
                .rainfall(20.0)
                .vibration(0.25)
                .battery(88.0)
                .build();

        RiskCalculationResultDto result = riskCalculationService.calculateRisk("ZONE-01", reading);

        assertNotNull(result);
        assertEquals(RiskLevel.CRITICAL, result.getRiskLevel());
        assertTrue(result.getRiskIndex() >= 70, "Critical risk index should be >= 70, was: " + result.getRiskIndex());
        assertTrue(result.getReason().contains("CRITICAL HAZARD"));
    }
}
