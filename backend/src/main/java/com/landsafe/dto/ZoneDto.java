package com.landsafe.dto;

import com.landsafe.entity.RiskLevel;
import java.time.Instant;

public class ZoneDto {
    private Long id;
    private String zoneId;
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;
    private Double elevation;
    private RiskLevel risk;
    private Integer riskScore;
    private String advisory;
    private Integer deviceCount;
    private Instant createdAt;

    public ZoneDto() {
    }

    public ZoneDto(Long id, String zoneId, String name, String description, Double latitude, Double longitude, Double elevation, RiskLevel risk, Integer riskScore, String advisory, Integer deviceCount, Instant createdAt) {
        this.id = id;
        this.zoneId = zoneId;
        this.name = name;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.elevation = elevation;
        this.risk = risk;
        this.riskScore = riskScore;
        this.advisory = advisory;
        this.deviceCount = deviceCount;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getElevation() {
        return elevation;
    }

    public void setElevation(Double elevation) {
        this.elevation = elevation;
    }

    public RiskLevel getRisk() {
        return risk;
    }

    public void setRisk(RiskLevel risk) {
        this.risk = risk;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getAdvisory() {
        return advisory;
    }

    public void setAdvisory(String advisory) {
        this.advisory = advisory;
    }

    public Integer getDeviceCount() {
        return deviceCount;
    }

    public void setDeviceCount(Integer deviceCount) {
        this.deviceCount = deviceCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String zoneId;
        private String name;
        private String description;
        private Double latitude;
        private Double longitude;
        private Double elevation;
        private RiskLevel risk;
        private Integer riskScore;
        private String advisory;
        private Integer deviceCount;
        private Instant createdAt;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder zoneId(String zoneId) {
            this.zoneId = zoneId;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder description(String description) {
            this.description = description;
            return this;
        }

        public Builder latitude(Double latitude) {
            this.latitude = latitude;
            return this;
        }

        public Builder longitude(Double longitude) {
            this.longitude = longitude;
            return this;
        }

        public Builder elevation(Double elevation) {
            this.elevation = elevation;
            return this;
        }

        public Builder risk(RiskLevel risk) {
            this.risk = risk;
            return this;
        }

        public Builder riskScore(Integer riskScore) {
            this.riskScore = riskScore;
            return this;
        }

        public Builder advisory(String advisory) {
            this.advisory = advisory;
            return this;
        }

        public Builder deviceCount(Integer deviceCount) {
            this.deviceCount = deviceCount;
            return this;
        }

        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ZoneDto build() {
            return new ZoneDto(id, zoneId, name, description, latitude, longitude, elevation, risk, riskScore, advisory, deviceCount, createdAt);
        }
    }
}
