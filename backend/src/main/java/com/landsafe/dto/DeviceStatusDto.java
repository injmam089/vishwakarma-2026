package com.landsafe.dto;

import com.landsafe.entity.DeviceStatus;
import java.time.Instant;

public class DeviceStatusDto {
    private String deviceId;
    private String zoneId;
    private DeviceStatus status;
    private Instant lastSeen;
    private Double batteryLevel;
    private boolean isOnline;

    public DeviceStatusDto() {
    }

    public DeviceStatusDto(String deviceId, String zoneId, DeviceStatus status, Instant lastSeen, Double batteryLevel, boolean isOnline) {
        this.deviceId = deviceId;
        this.zoneId = zoneId;
        this.status = status;
        this.lastSeen = lastSeen;
        this.batteryLevel = batteryLevel;
        this.isOnline = isOnline;
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

    public boolean isOnline() {
        return isOnline;
    }

    public void setOnline(boolean online) {
        isOnline = online;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String deviceId;
        private String zoneId;
        private DeviceStatus status;
        private Instant lastSeen;
        private Double batteryLevel;
        private boolean isOnline;

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

        public Builder isOnline(boolean isOnline) {
            this.isOnline = isOnline;
            return this;
        }

        public DeviceStatusDto build() {
            return new DeviceStatusDto(deviceId, zoneId, status, lastSeen, batteryLevel, isOnline);
        }
    }
}
