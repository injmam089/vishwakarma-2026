package com.landsafe.dto;

public class UpdatePreferencesRequest {
    private Boolean notificationEnabled;
    private Boolean warningEnabled;
    private Boolean criticalEnabled;
    private Boolean deviceEnabled;

    public UpdatePreferencesRequest() {}

    public UpdatePreferencesRequest(Boolean notificationEnabled, Boolean warningEnabled, Boolean criticalEnabled, Boolean deviceEnabled) {
        this.notificationEnabled = notificationEnabled;
        this.warningEnabled = warningEnabled;
        this.criticalEnabled = criticalEnabled;
        this.deviceEnabled = deviceEnabled;
    }

    public Boolean getNotificationEnabled() { return notificationEnabled; }
    public void setNotificationEnabled(Boolean notificationEnabled) { this.notificationEnabled = notificationEnabled; }
    public Boolean getWarningEnabled() { return warningEnabled; }
    public void setWarningEnabled(Boolean warningEnabled) { this.warningEnabled = warningEnabled; }
    public Boolean getCriticalEnabled() { return criticalEnabled; }
    public void setCriticalEnabled(Boolean criticalEnabled) { this.criticalEnabled = criticalEnabled; }
    public Boolean getDeviceEnabled() { return deviceEnabled; }
    public void setDeviceEnabled(Boolean deviceEnabled) { this.deviceEnabled = deviceEnabled; }
}
