package com.landsafe.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "alert_id", nullable = false, unique = true, length = 50)
    private String alertId;

    @Column(name = "event_id", length = 50)
    private String eventId;

    @Column(name = "zone_id", nullable = false, length = 50)
    private String zoneId;

    @Column(name = "device_id", length = 50)
    private String deviceId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AlertSeverity severity;

    @Column(nullable = false)
    private String condition;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "triggering_values", columnDefinition = "TEXT")
    private String triggeringValues;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AlertStatus status = AlertStatus.ACTIVE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "acknowledged_at")
    private Instant acknowledgedAt;

    @Column(name = "acknowledged_by", length = 150)
    private String acknowledgedBy;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "resolved_by", length = 150)
    private String resolvedBy;

    public Alert() {
    }

    public Alert(Long id, String alertId, String eventId, String zoneId, String deviceId, AlertSeverity severity,
                 String condition, String reason, String triggeringValues, AlertStatus status, Instant createdAt,
                 Instant acknowledgedAt, String acknowledgedBy, Instant resolvedAt, String resolvedBy) {
        this.id = id;
        this.alertId = alertId;
        this.eventId = eventId;
        this.zoneId = zoneId;
        this.deviceId = deviceId;
        this.severity = severity;
        this.condition = condition;
        this.reason = reason;
        this.triggeringValues = triggeringValues;
        this.status = status != null ? status : AlertStatus.ACTIVE;
        this.createdAt = createdAt != null ? createdAt : Instant.now();
        this.acknowledgedAt = acknowledgedAt;
        this.acknowledgedBy = acknowledgedBy;
        this.resolvedAt = resolvedAt;
        this.resolvedBy = resolvedBy;
    }

    public void acknowledge(String username) {
        this.status = AlertStatus.ACKNOWLEDGED;
        this.acknowledgedAt = Instant.now();
        this.acknowledgedBy = username;
    }

    public void resolve(String username) {
        this.status = AlertStatus.RESOLVED;
        this.resolvedAt = Instant.now();
        this.resolvedBy = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAlertId() {
        return alertId;
    }

    public void setAlertId(String alertId) {
        this.alertId = alertId;
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

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public AlertSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(AlertSeverity severity) {
        this.severity = severity;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getTriggeringValues() {
        return triggeringValues;
    }

    public void setTriggeringValues(String triggeringValues) {
        this.triggeringValues = triggeringValues;
    }

    public AlertStatus getStatus() {
        return status;
    }

    public void setStatus(AlertStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getAcknowledgedAt() {
        return acknowledgedAt;
    }

    public void setAcknowledgedAt(Instant acknowledgedAt) {
        this.acknowledgedAt = acknowledgedAt;
    }

    public String getAcknowledgedBy() {
        return acknowledgedBy;
    }

    public void setAcknowledgedBy(String acknowledgedBy) {
        this.acknowledgedBy = acknowledgedBy;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResolvedBy() {
        return resolvedBy;
    }

    public void setResolvedBy(String resolvedBy) {
        this.resolvedBy = resolvedBy;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String alertId;
        private String eventId;
        private String zoneId;
        private String deviceId;
        private AlertSeverity severity;
        private String condition;
        private String reason;
        private String triggeringValues;
        private AlertStatus status = AlertStatus.ACTIVE;
        private Instant createdAt = Instant.now();
        private Instant acknowledgedAt;
        private String acknowledgedBy;
        private Instant resolvedAt;
        private String resolvedBy;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder alertId(String alertId) {
            this.alertId = alertId;
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

        public Builder deviceId(String deviceId) {
            this.deviceId = deviceId;
            return this;
        }

        public Builder severity(AlertSeverity severity) {
            this.severity = severity;
            return this;
        }

        public Builder condition(String condition) {
            this.condition = condition;
            return this;
        }

        public Builder reason(String reason) {
            this.reason = reason;
            return this;
        }

        public Builder triggeringValues(String triggeringValues) {
            this.triggeringValues = triggeringValues;
            return this;
        }

        public Builder status(AlertStatus status) {
            this.status = status;
            return this;
        }

        public Builder createdAt(Instant createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Builder acknowledgedAt(Instant acknowledgedAt) {
            this.acknowledgedAt = acknowledgedAt;
            return this;
        }

        public Builder acknowledgedBy(String acknowledgedBy) {
            this.acknowledgedBy = acknowledgedBy;
            return this;
        }

        public Builder resolvedAt(Instant resolvedAt) {
            this.resolvedAt = resolvedAt;
            return this;
        }

        public Builder resolvedBy(String resolvedBy) {
            this.resolvedBy = resolvedBy;
            return this;
        }

        public Alert build() {
            return new Alert(id, alertId, eventId, zoneId, deviceId, severity, condition, reason, triggeringValues,
                    status, createdAt, acknowledgedAt, acknowledgedBy, resolvedAt, resolvedBy);
        }
    }
}
