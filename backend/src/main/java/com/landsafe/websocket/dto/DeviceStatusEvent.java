package com.landsafe.websocket.dto;

import com.landsafe.entity.DeviceStatus;

import java.time.Instant;

public class DeviceStatusEvent {

    private String type = "DEVICE_STATUS";
    private String deviceId;
    private String zoneId;
    private DeviceStatus status;
    private Instant lastSeen;
    private Instant timestamp;

    public DeviceStatusEvent() {
    }

    public DeviceStatusEvent(String deviceId, String zoneId, DeviceStatus status, Instant lastSeen, Instant timestamp) {
        this.type = "DEVICE_STATUS";
        this.deviceId = deviceId;
        this.zoneId = zoneId;
        this.status = status;
        this.lastSeen = lastSeen;
        this.timestamp = timestamp;
    }

    public static Builder builder() {
        return new Builder();
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public static class Builder {
        private String deviceId;
        private String zoneId;
        private DeviceStatus status;
        private Instant lastSeen;
        private Instant timestamp;

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

        public Builder timestamp(Instant timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public DeviceStatusEvent build() {
            return new DeviceStatusEvent(deviceId, zoneId, status, lastSeen, timestamp);
        }
    }
}
