package com.landsafe.dto;

import com.landsafe.entity.DeviceStatus;
import java.time.Instant;

public class DeviceDto {
    private Long id;
    private String deviceId;
    private String zoneId;
    private DeviceStatus status;
    private Instant lastSeen;
    private Double batteryLevel;
    private Instant createdAt;
    private Instant updatedAt;

    public DeviceDto() {
    }

    public DeviceDto(Long id, String deviceId, String zoneId, DeviceStatus status, Instant lastSeen, Double batteryLevel, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.deviceId = deviceId;
        this.zoneId = zoneId;
        this.status = status;
        this.lastSeen = lastSeen;
        this.batteryLevel = batteryLevel;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public DeviceStatus getStatus() {
        return status;
    }

    public void setStatus(DeviceStatus status) {
        this.status = status;
    }

    public Instant getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(Instant lastSeen) {
        this.lastSeen = lastSeen;
    }

    public Double getBatteryLevel() {
        return batteryLevel;
    }

    public void setBatteryLevel(Double batteryLevel) {
        this.batteryLevel = batteryLevel;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String deviceId;
        private String zoneId;
        private DeviceStatus status;
        private Instant lastSeen;
        private Double batteryLevel;
        private Instant createdAt;
        private Instant updatedAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder deviceId(String deviceId) {
            this.deviceId = deviceId;
            return this;
        }

        public Builder zoneId(String zoneId) {
            this.zoneId = zoneId;
            return this;
        }

        public Builder status(DeviceStatus status) {
            this.status = status;
            return this;
        }

        public Builder lastSeen(Instant lastSeen) {
            this.lastSeen = lastSeen;
            return this;
        }

        public Builder batteryLevel(Double batteryLevel) {
            this.batteryLevel = batteryLevel;
            return this;
        }

        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder updatedAt(Instant updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public DeviceDto build() {
            return new DeviceDto(id, deviceId, zoneId, status, lastSeen, batteryLevel, createdAt, updatedAt);
        }
    }
}
