package com.landsafe.dto;

import com.landsafe.entity.RiskLevel;
import java.time.Instant;

public class RiskEventDto {
    private Long id;
    private String eventId;
    private String zoneId;
    private Instant timestamp;
    private RiskLevel riskLevel;
    private String reason;

    public RiskEventDto() {
    }

    public RiskEventDto(Long id, String eventId, String zoneId, Instant timestamp, RiskLevel riskLevel, String reason) {
        this.id = id;
        this.eventId = eventId;
        this.zoneId = zoneId;
        this.timestamp = timestamp;
        this.riskLevel = riskLevel;
        this.reason = reason;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
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

    public RiskLevel getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(RiskLevel riskLevel) {
        this.riskLevel = riskLevel;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String eventId;
        private String zoneId;
        private Instant timestamp;
        private RiskLevel riskLevel;
        private String reason;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder eventId(String eventId) {
            this.eventId = eventId;
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

        public Builder riskLevel(RiskLevel riskLevel) {
            this.riskLevel = riskLevel;
            return this;
        }

        public Builder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public RiskEventDto build() {
            return new RiskEventDto(id, eventId, zoneId, timestamp, riskLevel, reason);
        }
    }
}
