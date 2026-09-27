package com.landsafe.dto;

import com.landsafe.entity.RiskLevel;
import java.time.Instant;

public class RiskCalculationResultDto {
    private String zoneId;
    private RiskLevel riskLevel;
    private Integer riskIndex;
    private String reason;
    private Instant timestamp;

    public RiskCalculationResultDto() {
    }

    public RiskCalculationResultDto(String zoneId, RiskLevel riskLevel, Integer riskIndex, String reason, Instant timestamp) {
        this.zoneId = zoneId;
        this.riskLevel = riskLevel;
        this.riskIndex = riskIndex;
        this.reason = reason;
        this.timestamp = timestamp;
    }

    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Integer getRiskIndex() {
        return riskIndex;
    }

    public void setRiskIndex(Integer riskIndex) {
        this.riskIndex = riskIndex;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String zoneId;
        private RiskLevel riskLevel;
        private Integer riskIndex;
        private String reason;
        private Instant timestamp;

        public Builder zoneId(String zoneId) {
            this.zoneId = zoneId;
            return this;
        }

        public Builder riskLevel(RiskLevel riskLevel) {
            this.riskLevel = riskLevel;
            return this;
        }

        public Builder riskIndex(Integer riskIndex) {
            this.riskIndex = riskIndex;
            return this;
        }

        public Builder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public Builder timestamp(Instant timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public RiskCalculationResultDto build() {
            return new RiskCalculationResultDto(zoneId, riskLevel, riskIndex, reason, timestamp);
        }
    }
}
