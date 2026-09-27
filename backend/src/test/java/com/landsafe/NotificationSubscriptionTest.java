package com.landsafe;

import com.landsafe.dto.SensorDataRequest;
import com.landsafe.dto.UpdatePreferencesRequest;
import com.landsafe.entity.DeliveryStatus;
import com.landsafe.entity.NotificationDelivery;
import com.landsafe.entity.Subscription;
import com.landsafe.entity.User;
import com.landsafe.repository.NotificationDeliveryRepository;
import com.landsafe.repository.SubscriptionRepository;
import com.landsafe.repository.UserRepository;
import com.landsafe.service.SensorService;
import com.landsafe.service.SubscriptionService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class NotificationSubscriptionTest {

    @Autowired
    private SensorService sensorService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationDeliveryRepository notificationDeliveryRepository;

    @Test
    @DisplayName("Should deliver notifications only to users subscribed to the alert's zone")
    @Transactional
    void testZoneSubscriptionFiltering() {
        User user = userRepository.findByEmail("user@geomonitor.org").orElseThrow();

        int initialNotifs = notificationDeliveryRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).size();

        // Trigger warning on ZONE-01 (user is subscribed to ZONE-01)
        SensorDataRequest req = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(2.0)
                .tiltY(1.3)
                .tiltZ(0.9)
                .soilMoisture(82.0)
                .rainfall(18.0)
                .vibration(0.21)
                .battery(90.0)
                .build();
        sensorService.ingestSensorData(req);

        List<NotificationDelivery> deliveries = notificationDeliveryRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        assertTrue(deliveries.size() > initialNotifs, "User should receive notification for subscribed zone");
    }

    @Test
    @DisplayName("Should respect user notification preference filters (warning vs critical)")
    @Transactional
    void testNotificationPreferenceFiltering() {
        User user = userRepository.findByEmail("user@geomonitor.org").orElseThrow();

        // Disable warning notifications for ZONE-02
        UpdatePreferencesRequest prefReq = new UpdatePreferencesRequest(true, false, true, true);
        subscriptionService.updatePreferences(user.getId(), "ZONE-02", prefReq);

        int countBefore = notificationDeliveryRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).size();

        // Trigger warning on ZONE-02
        SensorDataRequest req = SensorDataRequest.builder()
                .deviceId("ESP32-003")
                .zoneId("ZONE-02")
                .timestamp(Instant.now())
                .tiltX(2.0)
                .tiltY(1.3)
                .tiltZ(0.9)
                .soilMoisture(76.0) // Warning on ZONE-02 (limit: 70)
                .rainfall(20.0)
                .vibration(0.20)
                .battery(90.0)
                .build();
        sensorService.ingestSensorData(req);

        int countAfter = notificationDeliveryRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).size();
        assertEquals(countBefore, countAfter, "Warning notification should be suppressed when warningEnabled=false");
    }

    @Test
    @DisplayName("Should receive no notifications after unsubscribing from a zone")
    @Transactional
    void testUnsubscribedUserReceivesNoAlerts() {
        User user = userRepository.findByEmail("user@geomonitor.org").orElseThrow();

        // Unsubscribe from ZONE-01
        subscriptionRepository.deleteByUserIdAndZoneId(user.getId(), "ZONE-01");

        int countBefore = notificationDeliveryRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).size();

        SensorDataRequest req = SensorDataRequest.builder()
                .deviceId("ESP32-001")
                .zoneId("ZONE-01")
                .timestamp(Instant.now())
                .tiltX(12.0)
                .tiltY(9.0)
                .tiltZ(0.9)
                .soilMoisture(92.0)
                .rainfall(55.0)
                .vibration(0.45)
                .battery(89.0)
                .build();
        sensorService.ingestSensorData(req);

        int countAfter = notificationDeliveryRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).size();
        assertEquals(countBefore, countAfter, "Unsubscribed user should receive no notifications");
    }
}