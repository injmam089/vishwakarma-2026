package com.landsafe.dto;

import java.time.Instant;

public class SensorReadingDto {
    private Long id;
    private Instant timestamp;
    private String deviceId;
    private Double tiltX;
    private Double tiltY;
    private Double tiltZ;
    private Double compositeTilt;
    private Double soilMoisture;
    private Double rainfall;
    private Double vibration;
    private Double battery;

    public SensorReadingDto() {
    }

    public SensorReadingDto(Long id, Instant timestamp, String deviceId, Double tiltX, Double tiltY, Double tiltZ, Double compositeTilt, Double soilMoisture, Double rainfall, Double vibration, Double battery) {
        this.id = id;
        this.timestamp = timestamp;
        this.deviceId = deviceId;
        this.tiltX = tiltX;
        this.tiltY = tiltY;
        this.tiltZ = tiltZ;
        this.compositeTilt = compositeTilt;
        this.soilMoisture = soilMoisture;
        this.rainfall = rainfall;
        this.vibration = vibration;
        this.battery = battery;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
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

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Instant timestamp;
        private String deviceId;
        private Double tiltX;
        private Double tiltY;
        private Double tiltZ;
        private Double compositeTilt;
        private Double soilMoisture;
        private Double rainfall;
        private Double vibration;
        private Double battery;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder timestamp(Instant timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public Builder deviceId(String deviceId) {
            this.deviceId = deviceId;
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

        public SensorReadingDto build() {
            return new SensorReadingDto(id, timestamp, deviceId, tiltX, tiltY, tiltZ, compositeTilt, soilMoisture, rainfall, vibration, battery);
        }
    }
}
