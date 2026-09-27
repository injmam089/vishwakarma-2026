package com.landsafe;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.landsafe.dto.UpdateThresholdsRequest;
import com.landsafe.entity.ThresholdParameter;
import com.landsafe.security.JwtUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ThresholdAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    @DisplayName("Should allow normal USER to read zone thresholds")
    void testUserCanReadThresholds() throws Exception {
        String userToken = jwtUtil.generateToken("user@geomonitor.org", "USER");

        mockMvc.perform(get("/api/thresholds/ZONE-01")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)));
    }

    @Test
    @DisplayName("Should allow ADMIN to update zone thresholds")
    void testAdminCanUpdateThresholds() throws Exception {
        String adminToken = jwtUtil.generateToken("admin@geomonitor.org", "ADMIN");

        UpdateThresholdsRequest request = UpdateThresholdsRequest.builder()
                .thresholds(List.of(
                        UpdateThresholdsRequest.ThresholdItem.builder()
                                .parameter(ThresholdParameter.TILT)
                                .warningValue(5.5)
                                .criticalValue(13.0)
                                .build()
                ))
                .build();

        mockMvc.perform(put("/api/thresholds/ZONE-01")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].warningValue").value(5.5))
                .andExpect(jsonPath("$[0].criticalValue").value(13.0));
    }

    @Test
    @DisplayName("Should reject threshold update by normal USER with 403 Forbidden")
    void testUserCannotUpdateThresholds() throws Exception {
        String userToken = jwtUtil.generateToken("user@geomonitor.org", "USER");

        UpdateThresholdsRequest request = UpdateThresholdsRequest.builder()
                .thresholds(List.of(
                        UpdateThresholdsRequest.ThresholdItem.builder()
                                .parameter(ThresholdParameter.TILT)
                                .warningValue(6.0)
                                .criticalValue(15.0)
                                .build()
                ))
                .build();

        mockMvc.perform(put("/api/thresholds/ZONE-01")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Should reject invalid threshold where warning >= critical with 400 Bad Request")
    void testRejectInvalidThresholdOrder() throws Exception {
        String adminToken = jwtUtil.generateToken("admin@geomonitor.org", "ADMIN");

        UpdateThresholdsRequest request = UpdateThresholdsRequest.builder()
                .thresholds(List.of(
                        UpdateThresholdsRequest.ThresholdItem.builder()
                                .parameter(ThresholdParameter.TILT)
                                .warningValue(15.0) // Invalid: warning > critical
                                .criticalValue(10.0)
                                .build()
                ))
                .build();

        mockMvc.perform(put("/api/thresholds/ZONE-01")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
