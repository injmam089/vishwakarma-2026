package com.landsafe.websocket.dto;

import java.time.Instant;

public class TelemetryUpdateEvent {

    private String type = "TELEMETRY_UPDATE";
    private String deviceId;
    private String zoneId;
    private Instant timestamp;
    private Double tiltX;
    private Double tiltY;
    private Double tiltZ;
    private Double compositeTilt;
    private Double soilMoisture;
    private Double rainfall;
    private Double vibration;
    private Double battery;

    public TelemetryUpdateEvent() {
    }

    public TelemetryUpdateEvent(String deviceId, String zoneId, Instant timestamp, Double tiltX, Double tiltY,
                                Double tiltZ, Double compositeTilt, Double soilMoisture, Double rainfall,
                                Double vibration, Double battery) {
        this.type = "TELEMETRY_UPDATE";
        this.deviceId = deviceId;
        this.zoneId = zoneId;
        this.timestamp = timestamp;
        this.tiltX = tiltX;
        this.tiltY = tiltY;
        this.tiltZ = tiltZ;
        this.compositeTilt = compositeTilt;
        this.soilMoisture = soilMoisture;
        this.rainfall = rainfall;
        this.vibration = vibration;
        this.battery = battery;
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

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Double getTiltX() {
        return tiltX;
    }

    public void setTiltX(Double tiltX) {
        this.tiltX = tiltX;
    }

    public Double getTiltY() {
        return tiltY;
    }

    public void setTiltY(Double tiltY) {
        this.tiltY = tiltY;
    }

    public Double getTiltZ() {
        return tiltZ;
    }

    public void setTiltZ(Double tiltZ) {
        this.tiltZ = tiltZ;
    }

    public Double getCompositeTilt() {
        return compositeTilt;
    }

    public void setCompositeTilt(Double compositeTilt) {
        this.compositeTilt = compositeTilt;
    }

    public Double getSoilMoisture() {
        return soilMoisture;
    }

    public void setSoilMoisture(Double soilMoisture) {
        this.soilMoisture = soilMoisture;
    }

    public Double getRainfall() {
        return rainfall;
    }

    public void setRainfall(Double rainfall) {
        this.rainfall = rainfall;
    }

    public Double getVibration() {
        return vibration;
    }

    public void setVibration(Double vibration) {
        this.vibration = vibration;
    }

    public Double getBattery() {
        return battery;
    }

    public void setBattery(Double battery) {
        this.battery = battery;
    }

    public static class Builder {
        private String deviceId;
        private String zoneId;
        private Instant timestamp;
        private Double tiltX;
        private Double tiltY;
        private Double tiltZ;
        private Double compositeTilt;
        private Double soilMoisture;
        private Double rainfall;
        private Double vibration;
        private Double battery;

        public Builder deviceId(String deviceId) {
            this.deviceId = deviceId;
            return this;
        }

        public Builder zoneId(String zoneId) {
            this.zoneId = zoneId;
            return this;
        }

        public Builder timestamp(Instant timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public Builder tiltX(Double tiltX) {
            this.tiltX = tiltX;
            return this;
        }

        public Builder tiltY(Double tiltY) {
            this.tiltY = tiltY;
            return this;
        }

        public Builder tiltZ(Double tiltZ) {
            this.tiltZ = tiltZ;
            return this;
        }

        public Builder compositeTilt(Double compositeTilt) {
            this.compositeTilt = compositeTilt;
            return this;
        }

        public Builder soilMoisture(Double soilMoisture) {
            this.soilMoisture = soilMoisture;
            return this;
        }

        public Builder rainfall(Double rainfall) {
            this.rainfall = rainfall;
            return this;
        }

        public Builder vibration(Double vibration) {
            this.vibration = vibration;
            return this;
        }

        public Builder battery(Double battery) {
            this.battery = battery;
            return this;
        }

        public TelemetryUpdateEvent build() {
            return new TelemetryUpdateEvent(deviceId, zoneId, timestamp, tiltX, tiltY, tiltZ, compositeTilt,
                    soilMoisture, rainfall, vibration, battery);
        }
    }
}
