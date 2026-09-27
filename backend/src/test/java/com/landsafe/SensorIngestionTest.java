package com.landsafe;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.landsafe.dto.SensorDataRequest;
import com.landsafe.security.JwtUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class SensorIngestionTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    @DisplayName("Should successfully ingest valid ESP32 sensor telemetry packet")
    void testIngestSensorDataSuccess() throws Exception {
        SensorDataRequest request = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(2.4)
                .tiltY(1.8)
                .tiltZ(0.9)
                .soilMoisture(67.0)
                .rainfall(18.0)
                .vibration(0.21)
                .battery(91.0)
                .build();

        mockMvc.perform(post("/api/sensor-data")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.deviceId", is("ESP32-001")))
                .andExpect(jsonPath("$.soilMoisture", is(67.0)))
                .andExpect(jsonPath("$.compositeTilt", notNullValue()));
    }

    @Test
    @DisplayName("Should reject impossible sensor data (soil moisture > 100%) with 400 Bad Request")
    void testIngestSensorDataInvalidMoisture() throws Exception {
        SensorDataRequest request = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(2.4)
                .tiltY(1.8)
                .tiltZ(0.9)
                .soilMoisture(145.0) // Invalid: > 100%
                .rainfall(18.0)
                .vibration(0.21)
                .battery(91.0)
                .build();

        mockMvc.perform(post("/api/sensor-data")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status", is(400)));
    }

    @Test
    @DisplayName("Should reject negative rainfall or vibration with 400 Bad Request")
    void testIngestSensorDataNegativeValues() throws Exception {
        SensorDataRequest request = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(2.4)
                .tiltY(1.8)
                .tiltZ(0.9)
                .soilMoisture(50.0)
                .rainfall(-5.0) // Invalid
                .vibration(0.21)
                .battery(91.0)
                .build();

        mockMvc.perform(post("/api/sensor-data")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Should reject sensor data from unregistered device with 404 Not Found")
    void testIngestSensorDataMissingDevice() throws Exception {
        SensorDataRequest request = SensorDataRequest.builder()
                .deviceId("UNKNOWN-ESP32-999")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(2.4)
                .tiltY(1.8)
                .tiltZ(0.9)
                .soilMoisture(50.0)
                .rainfall(10.0)
                .vibration(0.21)
                .battery(80.0)
                .build();

        mockMvc.perform(post("/api/sensor-data")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message", containsString("Device does not exist")));
    }

    @Test
    @DisplayName("Should reject sensor data when device does not match zone")
    void testIngestSensorDataMismatchedZone() throws Exception {
        SensorDataRequest request = SensorDataRequest.builder()
                .deviceId("ESP32-001") // Belongs to ZONE-01
                .zoneId("ZONE-03")     // Incorrect zone
                .timestamp(Instant.now())
                .tiltX(2.4)
                .tiltY(1.8)
                .tiltZ(0.9)
                .soilMoisture(50.0)
                .rainfall(10.0)
                .vibration(0.21)
                .battery(80.0)
                .build();

        mockMvc.perform(post("/api/sensor-data")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("is registered to ZONE-01")));
    }

    @Test
    @DisplayName("Should retrieve latest sensor reading with valid JWT token")
    void testGetLatestReading() throws Exception {
        String token = jwtUtil.generateToken("user@geomonitor.org", "USER");

        mockMvc.perform(get("/api/sensors/latest")
                        .param("zoneId", "ZONE-01")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deviceId", notNullValue()))
                .andExpect(jsonPath("$.soilMoisture", notNullValue()));
    }

    @Test
    @DisplayName("Should export historical sensor data as CSV")
    void testExportCsv() throws Exception {
        String token = jwtUtil.generateToken("user@geomonitor.org", "USER");

        mockMvc.perform(get("/api/sensors/export")
                        .param("zoneId", "ZONE-01")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", containsString("text/csv")))
                .andExpect(header().string("Content-Disposition", containsString("landsafe-telemetry-ZONE-01.csv")))
                .andExpect(content().string(containsString("timestamp,zone_id,device_id,tilt_x")));
    }
}
