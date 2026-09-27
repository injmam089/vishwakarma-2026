package com.landsafe.dto;

public class SubscriptionDto {
    private Long id;
    private Long userId;
    private String zoneId;
    private Boolean notificationEnabled;
    private Boolean warningEnabled;
    private Boolean criticalEnabled;
    private Boolean deviceEnabled;

    public SubscriptionDto() {
    }

    public SubscriptionDto(Long id, Long userId, String zoneId, Boolean notificationEnabled,
                           Boolean warningEnabled, Boolean criticalEnabled, Boolean deviceEnabled) {
        this.id = id;
        this.userId = userId;
        this.zoneId = zoneId;
        this.notificationEnabled = notificationEnabled;
        this.warningEnabled = warningEnabled;
        this.criticalEnabled = criticalEnabled;
        this.deviceEnabled = deviceEnabled;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getZoneId() { return zoneId; }
    public void setZoneId(String zoneId) { this.zoneId = zoneId; }
    public Boolean getNotificationEnabled() { return notificationEnabled; }
    public void setNotificationEnabled(Boolean notificationEnabled) { this.notificationEnabled = notificationEnabled; }
    public Boolean getWarningEnabled() { return warningEnabled; }
    public void setWarningEnabled(Boolean warningEnabled) { this.warningEnabled = warningEnabled; }
    public Boolean getCriticalEnabled() { return criticalEnabled; }
    public void setCriticalEnabled(Boolean criticalEnabled) { this.criticalEnabled = criticalEnabled; }
    public Boolean getDeviceEnabled() { return deviceEnabled; }
    public void setDeviceEnabled(Boolean deviceEnabled) { this.deviceEnabled = deviceEnabled; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Long userId;
        private String zoneId;
        private Boolean notificationEnabled;
        private Boolean warningEnabled;
        private Boolean criticalEnabled;
        private Boolean deviceEnabled;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder zoneId(String zoneId) { this.zoneId = zoneId; return this; }
        public Builder notificationEnabled(Boolean notificationEnabled) { this.notificationEnabled = notificationEnabled; return this; }
        public Builder warningEnabled(Boolean warningEnabled) { this.warningEnabled = warningEnabled; return this; }
        public Builder criticalEnabled(Boolean criticalEnabled) { this.criticalEnabled = criticalEnabled; return this; }
        public Builder deviceEnabled(Boolean deviceEnabled) { this.deviceEnabled = deviceEnabled; return this; }

        public SubscriptionDto build() {
            return new SubscriptionDto(id, userId, zoneId, notificationEnabled, warningEnabled, criticalEnabled, deviceEnabled);
        }
    }
}
