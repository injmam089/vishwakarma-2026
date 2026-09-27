package com.landsafe.repository;

import com.landsafe.entity.SensorReading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface SensorReadingRepository extends JpaRepository<SensorReading, Long> {

    @Query("SELECT r FROM SensorReading r WHERE r.deviceId IN (SELECT d.deviceId FROM Device d WHERE d.zoneId = :zoneId) ORDER BY r.timestamp DESC")
    List<SensorReading> findByZoneIdOrderByTimestampDesc(@Param("zoneId") String zoneId);

    @Query("SELECT r FROM SensorReading r WHERE r.deviceId IN (SELECT d.deviceId FROM Device d WHERE d.zoneId = :zoneId) AND r.timestamp BETWEEN :from AND :to ORDER BY r.timestamp ASC")
    List<SensorReading> findByZoneIdAndTimestampBetween(@Param("zoneId") String zoneId, @Param("from") Instant from, @Param("to") Instant to);

    Optional<SensorReading> findFirstByDeviceIdOrderByTimestampDesc(String deviceId);
}
