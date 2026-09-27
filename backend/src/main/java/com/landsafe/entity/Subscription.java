package com.landsafe.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "zone_id", nullable = false, length = 50)
    private String zoneId;

    @Column(name = "notification_enabled", nullable = false)
    private Boolean notificationEnabled = true;

    @Column(name = "warning_enabled", nullable = false)
    private Boolean warningEnabled = true;

    @Column(name = "critical_enabled", nullable = false)
    private Boolean criticalEnabled = true;

    @Column(name = "device_enabled", nullable = false)
    private Boolean deviceEnabled = true;

    public Subscription() {
    }

    public Subscription(Long id, Long userId, String zoneId, Boolean notificationEnabled,
                        Boolean warningEnabled, Boolean criticalEnabled, Boolean deviceEnabled) {
        this.id = id;
        this.userId = userId;
        this.zoneId = zoneId;
        this.notificationEnabled = notificationEnabled != null ? notificationEnabled : true;
        this.warningEnabled = warningEnabled != null ? warningEnabled : true;
        this.criticalEnabled = criticalEnabled != null ? criticalEnabled : true;
        this.deviceEnabled = deviceEnabled != null ? deviceEnabled : true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public Boolean getNotificationEnabled() {
        return notificationEnabled;
    }

    public void setNotificationEnabled(Boolean notificationEnabled) {
        this.notificationEnabled = notificationEnabled;
    }

    public Boolean getWarningEnabled() {
        return warningEnabled;
    }

    public void setWarningEnabled(Boolean warningEnabled) {
        this.warningEnabled = warningEnabled;
    }

    public Boolean getCriticalEnabled() {
        return criticalEnabled;
    }

    public void setCriticalEnabled(Boolean criticalEnabled) {
        this.criticalEnabled = criticalEnabled;
    }

    public Boolean getDeviceEnabled() {
        return deviceEnabled;
    }

    public void setDeviceEnabled(Boolean deviceEnabled) {
        this.deviceEnabled = deviceEnabled;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private Long userId;
        private String zoneId;
        private Boolean notificationEnabled = true;
        private Boolean warningEnabled = true;
        private Boolean criticalEnabled = true;
        private Boolean deviceEnabled = true;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public Builder zoneId(String zoneId) {
            this.zoneId = zoneId;
            return this;
        }

        public Builder notificationEnabled(Boolean notificationEnabled) {
            this.notificationEnabled = notificationEnabled;
            return this;
        }

        public Builder warningEnabled(Boolean warningEnabled) {
            this.warningEnabled = warningEnabled;
            return this;
        }

        public Builder criticalEnabled(Boolean criticalEnabled) {
            this.criticalEnabled = criticalEnabled;
            return this;
        }

        public Builder deviceEnabled(Boolean deviceEnabled) {
            this.deviceEnabled = deviceEnabled;
            return this;
        }

        public Subscription build() {
            return new Subscription(id, userId, zoneId, notificationEnabled, warningEnabled, criticalEnabled, deviceEnabled);
        }
    }
}
