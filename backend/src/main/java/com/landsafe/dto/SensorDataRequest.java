package com.landsafe.dto;

import jakarta.validation.constraints.*;
import java.time.Instant;

public class SensorDataRequest {

    @NotBlank(message = "deviceId is required")
    private String deviceId;

    @NotBlank(message = "zoneId is required")
    private String zoneId;

    @NotNull(message = "timestamp is required")
    private Instant timestamp;

    @NotNull(message = "tiltX is required")
    @DecimalMin(value = "-90.0", message = "tiltX cannot be less than -90.0 degrees")
    @DecimalMax(value = "90.0", message = "tiltX cannot exceed 90.0 degrees")
    private Double tiltX;

    @NotNull(message = "tiltY is required")
    @DecimalMin(value = "-90.0", message = "tiltY cannot be less than -90.0 degrees")
    @DecimalMax(value = "90.0", message = "tiltY cannot exceed 90.0 degrees")
    private Double tiltY;

    @NotNull(message = "tiltZ is required")
    @DecimalMin(value = "-90.0", message = "tiltZ cannot be less than -90.0 degrees")
    @DecimalMax(value = "90.0", message = "tiltZ cannot exceed 90.0 degrees")
    private Double tiltZ;

    @NotNull(message = "soilMoisture is required")
    @DecimalMin(value = "0.0", message = "soilMoisture must be >= 0.0%")
    @DecimalMax(value = "100.0", message = "soilMoisture must be <= 100.0%")
    private Double soilMoisture;

    @NotNull(message = "rainfall is required")
    @DecimalMin(value = "0.0", message = "rainfall must be >= 0.0 mm")
    private Double rainfall;

    @NotNull(message = "vibration is required")
    @DecimalMin(value = "0.0", message = "vibration must be >= 0.0 g")
    private Double vibration;

    @NotNull(message = "battery is required")
    @DecimalMin(value = "0.0", message = "battery must be >= 0.0%")
    @DecimalMax(value = "100.0", message = "battery must be <= 100.0%")
    private Double battery;

    public SensorDataRequest() {
    }

    public SensorDataRequest(String deviceId, String zoneId, Instant timestamp, Double tiltX, Double tiltY, Double tiltZ, Double soilMoisture, Double rainfall, Double vibration, Double battery) {
        this.deviceId = deviceId;
        this.zoneId = zoneId;
        this.timestamp = timestamp;
        this.tiltX = tiltX;
        this.tiltY = tiltY;
        this.tiltZ = tiltZ;
        this.soilMoisture = soilMoisture;
        this.rainfall = rainfall;
        this.vibration = vibration;
        this.battery = battery;
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
        private String deviceId;
        private String zoneId;
        private Instant timestamp;
        private Double tiltX;
        private Double tiltY;
        private Double tiltZ;
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

        public SensorDataRequest build() {
            return new SensorDataRequest(deviceId, zoneId, timestamp, tiltX, tiltY, tiltZ, soilMoisture, rainfall, vibration, battery);
        }
    }
}
