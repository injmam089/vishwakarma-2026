package com.landsafe.config;

import com.landsafe.entity.*;
import com.landsafe.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ZoneRepository zoneRepository;
    private final DeviceRepository deviceRepository;
    private final ThresholdRepository thresholdRepository;
    private final SensorReadingRepository sensorReadingRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final AlertRepository alertRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(
            UserRepository userRepository,
            ZoneRepository zoneRepository,
            DeviceRepository deviceRepository,
            ThresholdRepository thresholdRepository,
            SensorReadingRepository sensorReadingRepository,
            SubscriptionRepository subscriptionRepository,
            AlertRepository alertRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.zoneRepository = zoneRepository;
        this.deviceRepository = deviceRepository;
        this.thresholdRepository = thresholdRepository;
        this.sensorReadingRepository = sensorReadingRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.alertRepository = alertRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedZonesAndDevices();
        seedThresholds();
        seedInitialReadings();
        seedSubscriptions();
        seedInitialAlerts();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@geomonitor.org")) {
            userRepository.save(User.builder()
                    .name("Marcus Vance (Geotechnical Specialist)")
                    .email("admin@geomonitor.org")
                    .passwordHash(passwordEncoder.encode("Admin@123456"))
                    .role(Role.ADMIN)
                    .createdAt(Instant.now())
                    .build());
        }

        if (!userRepository.existsByEmail("user@geomonitor.org")) {
            userRepository.save(User.builder()
                    .name("Elena Rostova (Field Inspector)")
                    .email("user@geomonitor.org")
                    .passwordHash(passwordEncoder.encode("User@123456"))
                    .role(Role.USER)
                    .createdAt(Instant.now())
                    .build());
        }
    }

    private void seedZonesAndDevices() {
        if (zoneRepository.count() == 0) {
            zoneRepository.saveAll(List.of(
                    Zone.builder()
                            .zoneId("ZONE-01")
                            .name("North Ridge")
                            .description("Colluvial soil slope above secondary highway and residential settlement")
                            .latitude(34.0522)
                            .longitude(-118.2437)
                            .elevation(842.0)
                            .createdAt(Instant.now())
                            .build(),
                    Zone.builder()
                            .zoneId("ZONE-02")
                            .name("Debris Basin")
                            .description("Drainage convergence channel with high saturation potential")
                            .latitude(34.0588)
                            .longitude(-118.2510)
                            .elevation(715.0)
                            .createdAt(Instant.now())
                            .build(),
                    Zone.builder()
                            .zoneId("ZONE-03")
                            .name("South Escarpment")
                            .description("Steep fractured sandstone face with active rockfall history")
                            .latitude(34.0450)
                            .longitude(-118.2380)
                            .elevation(920.0)
                            .createdAt(Instant.now())
                            .build()
            ));
        }

        if (deviceRepository.count() == 0) {
            deviceRepository.saveAll(List.of(
                    Device.builder().deviceId("ESP32-001").zoneId("ZONE-01").status(DeviceStatus.ONLINE).batteryLevel(91.0).lastSeen(Instant.now()).build(),
                    Device.builder().deviceId("ESP32-002").zoneId("ZONE-01").status(DeviceStatus.ONLINE).batteryLevel(88.0).lastSeen(Instant.now()).build(),
                    Device.builder().deviceId("ESP32-003").zoneId("ZONE-02").status(DeviceStatus.ONLINE).batteryLevel(94.0).lastSeen(Instant.now()).build(),
                    Device.builder().deviceId("ESP32-004").zoneId("ZONE-02").status(DeviceStatus.ONLINE).batteryLevel(79.0).lastSeen(Instant.now()).build(),
                    Device.builder().deviceId("ESP32-005").zoneId("ZONE-03").status(DeviceStatus.ONLINE).batteryLevel(85.0).lastSeen(Instant.now()).build()
            ));
        }
    }

    private void seedThresholds() {
        if (thresholdRepository.count() == 0) {
            thresholdRepository.saveAll(List.of(
                    // ZONE-01
                    Threshold.builder().zoneId("ZONE-01").parameter(ThresholdParameter.TILT).warningValue(5.0).criticalValue(12.0).build(),
                    Threshold.builder().zoneId("ZONE-01").parameter(ThresholdParameter.SOIL_MOISTURE).warningValue(75.0).criticalValue(90.0).build(),
                    Threshold.builder().zoneId("ZONE-01").parameter(ThresholdParameter.RAINFALL).warningValue(35.0).criticalValue(60.0).build(),
                    Threshold.builder().zoneId("ZONE-01").parameter(ThresholdParameter.VIBRATION).warningValue(0.50).criticalValue(1.20).build(),

                    // ZONE-02
                    Threshold.builder().zoneId("ZONE-02").parameter(ThresholdParameter.TILT).warningValue(4.5).criticalValue(10.0).build(),
                    Threshold.builder().zoneId("ZONE-02").parameter(ThresholdParameter.SOIL_MOISTURE).warningValue(70.0).criticalValue(85.0).build(),
                    Threshold.builder().zoneId("ZONE-02").parameter(ThresholdParameter.RAINFALL).warningValue(30.0).criticalValue(50.0).build(),
                    Threshold.builder().zoneId("ZONE-02").parameter(ThresholdParameter.VIBRATION).warningValue(0.45).criticalValue(1.00).build(),

                    // ZONE-03
                    Threshold.builder().zoneId("ZONE-03").parameter(ThresholdParameter.TILT).warningValue(6.0).criticalValue(14.0).build(),
                    Threshold.builder().zoneId("ZONE-03").parameter(ThresholdParameter.SOIL_MOISTURE).warningValue(80.0).criticalValue(92.0).build(),
                    Threshold.builder().zoneId("ZONE-03").parameter(ThresholdParameter.RAINFALL).warningValue(40.0).criticalValue(65.0).build(),
                    Threshold.builder().zoneId("ZONE-03").parameter(ThresholdParameter.VIBRATION).warningValue(0.60).criticalValue(1.50).build()
            ));
        }
    }

    private void seedInitialReadings() {
        if (sensorReadingRepository.count() == 0) {
            sensorReadingRepository.saveAll(List.of(
                    SensorReading.builder().timestamp(Instant.now().minusSeconds(3600)).deviceId("ESP32-001").tiltX(2.38).tiltY(1.80).tiltZ(0.90).soilMoisture(66.8).rainfall(17.5).vibration(0.205).battery(91.5).build(),
                    SensorReading.builder().timestamp(Instant.now().minusSeconds(1800)).deviceId("ESP32-001").tiltX(2.40).tiltY(1.82).tiltZ(0.91).soilMoisture(67.0).rainfall(17.8).vibration(0.210).battery(91.2).build(),
                    SensorReading.builder().timestamp(Instant.now()).deviceId("ESP32-001").tiltX(2.42).tiltY(1.83).tiltZ(0.92).soilMoisture(67.2).rainfall(18.0).vibration(0.212).battery(91.0).build(),
                    SensorReading.builder().timestamp(Instant.now()).deviceId("ESP32-002").tiltX(1.95).tiltY(1.45).tiltZ(0.88).soilMoisture(64.5).rainfall(16.5).vibration(0.180).battery(88.0).build(),
                    SensorReading.builder().timestamp(Instant.now()).deviceId("ESP32-003").tiltX(3.10).tiltY(2.20).tiltZ(1.05).soilMoisture(71.0).rainfall(21.0).vibration(0.250).battery(94.0).build()
            ));
        }
    }

    private void seedSubscriptions() {
        if (subscriptionRepository.count() == 0) {
            userRepository.findByEmail("user@geomonitor.org").ifPresent(user -> {
                subscriptionRepository.saveAll(List.of(
                        Subscription.builder()
                                .userId(user.getId())
                                .zoneId("ZONE-01")
                                .notificationEnabled(true)
                                .warningEnabled(true)
                                .criticalEnabled(true)
                                .deviceEnabled(true)
                                .build(),
                        Subscription.builder()
                                .userId(user.getId())
                                .zoneId("ZONE-02")
                                .notificationEnabled(true)
                                .warningEnabled(true)
                                .criticalEnabled(true)
                                .deviceEnabled(true)
                                .build()
                ));
            });
        }
    }

    private void seedInitialAlerts() {
        if (alertRepository.count() == 0) {
            alertRepository.saveAll(List.of(
                    Alert.builder()
                            .alertId("ALT-C4B821F0")
                            .eventId("EVT-C4B821F0")
                            .zoneId("ZONE-01")
                            .deviceId("ESP32-001")
                            .severity(AlertSeverity.WARNING)
                            .condition("Elevated ground tilt and pore-water saturation")
                            .reason("Ground tilt (4.8°) approaching calibrated safety limit")
                            .triggeringValues("tilt=4.8°, moisture=74.2%")
                            .status(AlertStatus.ACTIVE)
                            .createdAt(Instant.now().minusSeconds(1800))
                            .build(),
                    Alert.builder()
                            .alertId("ALT-D9E138A2")
                            .eventId("EVT-D9E138A2")
                            .zoneId("ZONE-02")
                            .deviceId("ESP32-003")
                            .severity(AlertSeverity.WARNING)
                            .condition("Elevated shear tremor activity")
                            .reason("Microseismic vibration shock (0.42g) detected in drainage zone")
                            .triggeringValues("vibration=0.42g")
                            .status(AlertStatus.ACKNOWLEDGED)
                            .createdAt(Instant.now().minusSeconds(7200))
                            .acknowledgedAt(Instant.now().minusSeconds(3600))
                            .acknowledgedBy("m.vance@geomonitor.org")
                            .build()
            ));
        }
    }
}
