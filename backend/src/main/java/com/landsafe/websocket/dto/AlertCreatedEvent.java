package com.landsafe.websocket.dto;

import com.landsafe.entity.RiskLevel;

import java.time.Instant;

public class AlertCreatedEvent {

    private String type = "ALERT_CREATED";
    private String eventId;
    private String zoneId;
    private RiskLevel severity;
    private String reason;
    private Instant timestamp;

    public AlertCreatedEvent() {
    }

    public AlertCreatedEvent(String eventId, String zoneId, RiskLevel severity, String reason, Instant timestamp) {
        this.type = "ALERT_CREATED";
        this.eventId = eventId;
        this.zoneId = zoneId;
        this.severity = severity;
        this.reason = reason;
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

    public RiskLevel getSeverity() {
        return severity;
    }

    public void setSeverity(RiskLevel severity) {
        this.severity = severity;
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

    public static class Builder {
        private String eventId;
        private String zoneId;
        private RiskLevel severity;
        private String reason;
        private Instant timestamp;

        public Builder eventId(String eventId) {
            this.eventId = eventId;
            return this;
        }

        public Builder zoneId(String zoneId) {
            this.zoneId = zoneId;
            return this;
        }

        public Builder severity(RiskLevel severity) {
            this.severity = severity;
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

        public AlertCreatedEvent build() {
            return new AlertCreatedEvent(eventId, zoneId, severity, reason, timestamp);
        }
    }
}
