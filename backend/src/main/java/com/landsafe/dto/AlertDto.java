package com.landsafe.dto;

import java.time.Instant;

public class AlertDto {
    private String id;
    private String alertId;
    private String eventId;
    private Instant timestamp;
    private String severity;
    private String condition;
    private String reason;
    private String zoneId;
    private String deviceId;
    private String value;
    private String threshold;
    private String status;
    private String protocol;
    private String triggeringValues;
    private Instant createdAt;
    private Instant acknowledgedAt;
    private String acknowledgedBy;
    private Instant resolvedAt;
    private String resolvedBy;

    public AlertDto() {
    }

    public AlertDto(String id, String alertId, String eventId, Instant timestamp, String severity, String condition,
                    String reason, String zoneId, String deviceId, String value, String threshold, String status,
                    String protocol, String triggeringValues, Instant createdAt, Instant acknowledgedAt,
                    String acknowledgedBy, Instant resolvedAt, String resolvedBy) {
        this.id = id;
        this.alertId = alertId;
        this.eventId = eventId;
        this.timestamp = timestamp;
        this.severity = severity;
        this.condition = condition;
        this.reason = reason;
        this.zoneId = zoneId;
        this.deviceId = deviceId;
        this.value = value;
        this.threshold = threshold;
        this.status = status;
        this.protocol = protocol;
        this.triggeringValues = triggeringValues;
        this.createdAt = createdAt;
        this.acknowledgedAt = acknowledgedAt;
        this.acknowledgedBy = acknowledgedBy;
        this.resolvedAt = resolvedAt;
        this.resolvedBy = resolvedBy;
    }

    public String getId() { return id != null ? id : alertId; }
    public void setId(String id) { this.id = id; if (this.alertId == null) this.alertId = id; }
    public String getAlertId() { return alertId != null ? alertId : id; }
    public void setAlertId(String alertId) { this.alertId = alertId; if (this.id == null) this.id = alertId; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public Instant getTimestamp() { return timestamp != null ? timestamp : createdAt; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getZoneId() { return zoneId; }
    public void setZoneId(String zoneId) { this.zoneId = zoneId; }
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    public String getThreshold() { return threshold; }
    public void setThreshold(String threshold) { this.threshold = threshold; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getProtocol() { return protocol; }
    public void setProtocol(String protocol) { this.protocol = protocol; }
    public String getTriggeringValues() { return triggeringValues; }
    public void setTriggeringValues(String triggeringValues) { this.triggeringValues = triggeringValues; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getAcknowledgedAt() { return acknowledgedAt; }
    public void setAcknowledgedAt(Instant acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; }
    public String getAcknowledgedBy() { return acknowledgedBy; }
    public void setAcknowledgedBy(String acknowledgedBy) { this.acknowledgedBy = acknowledgedBy; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
    public String getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String alertId;
        private String eventId;
        private Instant timestamp;
        private String severity;
        private String condition;
        private String reason;
        private String zoneId;
        private String deviceId;
        private String value;
        private String threshold;
        private String status;
        private String protocol;
        private String triggeringValues;
        private Instant createdAt;
        private Instant acknowledgedAt;
        private String acknowledgedBy;
        private Instant resolvedAt;
        private String resolvedBy;

        public Builder id(String id) { this.id = id; return this; }
        public Builder alertId(String alertId) { this.alertId = alertId; return this; }
        public Builder eventId(String eventId) { this.eventId = eventId; return this; }
        public Builder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }
        public Builder severity(String severity) { this.severity = severity; return this; }
        public Builder condition(String condition) { this.condition = condition; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }
        public Builder zoneId(String zoneId) { this.zoneId = zoneId; return this; }
        public Builder deviceId(String deviceId) { this.deviceId = deviceId; return this; }
        public Builder value(String value) { this.value = value; return this; }
        public Builder threshold(String threshold) { this.threshold = threshold; return this; }
        public Builder status(String status) { this.status = status; return this; }
        public Builder protocol(String protocol) { this.protocol = protocol; return this; }
        public Builder triggeringValues(String triggeringValues) { this.triggeringValues = triggeringValues; return this; }
        public Builder createdAt(Instant createdAt) { this.createdAt = createdAt; return this; }
        public Builder acknowledgedAt(Instant acknowledgedAt) { this.acknowledgedAt = acknowledgedAt; return this; }
        public Builder acknowledgedBy(String acknowledgedBy) { this.acknowledgedBy = acknowledgedBy; return this; }
        public Builder resolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; return this; }
        public Builder resolvedBy(String resolvedBy) { this.resolvedBy = resolvedBy; return this; }

        public AlertDto build() {
            String resolvedAlertId = alertId != null ? alertId : id;
            String resolvedId = id != null ? id : resolvedAlertId;
            return new AlertDto(resolvedId, resolvedAlertId, eventId, timestamp != null ? timestamp : createdAt,
                    severity, condition, reason, zoneId, deviceId, value, threshold, status, protocol,
                    triggeringValues, createdAt != null ? createdAt : timestamp, acknowledgedAt, acknowledgedBy,
                    resolvedAt, resolvedBy);
        }
    }
}
