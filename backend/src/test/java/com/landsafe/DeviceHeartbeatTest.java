package com.landsafe;

import com.landsafe.dto.DeviceStatusDto;
import com.landsafe.entity.Device;
import com.landsafe.entity.DeviceStatus;
import com.landsafe.repository.DeviceRepository;
import com.landsafe.security.JwtUtil;
import com.landsafe.service.DeviceService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class DeviceHeartbeatTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DeviceService deviceService;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    @DisplayName("Should update lastSeen and return ONLINE status on heartbeat POST")
    void testDeviceHeartbeatSuccess() throws Exception {
        mockMvc.perform(post("/api/devices/ESP32-001/heartbeat"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deviceId", is("ESP32-001")))
                .andExpect(jsonPath("$.status", is("ONLINE")))
                .andExpect(jsonPath("$.online", is(true)));
    }

    @Test
    @DisplayName("Should detect stale device and mark it OFFLINE during scan")
    void testOfflineDetectionScanner() {
        // Manually age the lastSeen of ESP32-004 to 5 minutes ago
        Device device = deviceRepository.findByDeviceId("ESP32-004").orElseThrow();
        device.setLastSeen(Instant.now().minus(300, ChronoUnit.SECONDS));
        device.setStatus(DeviceStatus.ONLINE);
        deviceRepository.save(device);

        // Run scanner
        deviceService.scanAndMarkOfflineDevices();

        // Verify status is now OFFLINE
        Device updated = deviceRepository.findByDeviceId("ESP32-004").orElseThrow();
        assertEquals(DeviceStatus.OFFLINE, updated.getStatus());
    }

    @Test
    @DisplayName("Should retrieve device status via protected endpoint")
    void testGetDeviceStatus() throws Exception {
        String token = jwtUtil.generateToken("user@geomonitor.org", "USER");

        mockMvc.perform(get("/api/devices/ESP32-001/status")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.deviceId", is("ESP32-001")))
                .andExpect(jsonPath("$.zoneId", is("ZONE-01")));
    }
}
