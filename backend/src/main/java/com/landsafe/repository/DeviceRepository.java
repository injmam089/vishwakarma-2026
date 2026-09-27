package com.landsafe.repository;

import com.landsafe.entity.Device;
import com.landsafe.entity.DeviceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    Optional<Device> findByDeviceId(String deviceId);
    List<Device> findByZoneId(String zoneId);
    List<Device> findByStatusAndLastSeenBefore(DeviceStatus status, Instant cutoff);
}
