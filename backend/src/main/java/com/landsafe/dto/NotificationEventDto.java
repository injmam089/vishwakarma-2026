package com.landsafe.dto;

import java.time.Instant;

public class NotificationEventDto {
    private String alertId;
    private String eventId;
    private String zoneId;
    private String deviceId;
    private String severity;
    private String condition;
    private String reason;
    private String triggeringValues;
    private Instant timestamp;
    private String channel;

    public NotificationEventDto() {
    }

    public NotificationEventDto(String alertId, String eventId, String zoneId, String deviceId, String severity,
                                String condition, String reason, String triggeringValues, Instant timestamp, String channel) {
        this.alertId = alertId;
        this.eventId = eventId;
        this.zoneId = zoneId;
        this.deviceId = deviceId;
        this.severity = severity;
        this.condition = condition;
        this.reason = reason;
        this.triggeringValues = triggeringValues;
        this.timestamp = timestamp;
        this.channel = channel;
    }

    public String getAlertId() { return alertId; }
    public void setAlertId(String alertId) { this.alertId = alertId; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getZoneId() { return zoneId; }
    public void setZoneId(String zoneId) { this.zoneId = zoneId; }
    public String getDeviceId() { return deviceId; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getTriggeringValues() { return triggeringValues; }
    public void setTriggeringValues(String triggeringValues) { this.triggeringValues = triggeringValues; }
    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String alertId;
        private String eventId;
        private String zoneId;
        private String deviceId;
        private String severity;
        private String condition;
        private String reason;
        private String triggeringValues;
        private Instant timestamp = Instant.now();
        private String channel = "IN_APP";

        public Builder alertId(String alertId) { this.alertId = alertId; return this; }
        public Builder eventId(String eventId) { this.eventId = eventId; return this; }
        public Builder zoneId(String zoneId) { this.zoneId = zoneId; return this; }
        public Builder deviceId(String deviceId) { this.deviceId = deviceId; return this; }
        public Builder severity(String severity) { this.severity = severity; return this; }
        public Builder condition(String condition) { this.condition = condition; return this; }
        public Builder reason(String reason) { this.reason = reason; return this; }
        public Builder triggeringValues(String triggeringValues) { this.triggeringValues = triggeringValues; return this; }
        public Builder timestamp(Instant timestamp) { this.timestamp = timestamp; return this; }
        public Builder channel(String channel) { this.channel = channel; return this; }

        public NotificationEventDto build() {
            return new NotificationEventDto(alertId, eventId, zoneId, deviceId, severity, condition, reason, triggeringValues, timestamp, channel);
        }
    }
}
