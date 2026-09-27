package com.landsafe.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateSubscriptionRequest {

    @NotBlank(message = "zoneId is required")
    private String zoneId;

    private Boolean notificationEnabled = true;

    public CreateSubscriptionRequest() {
    }

    public CreateSubscriptionRequest(String zoneId, Boolean notificationEnabled) {
        this.zoneId = zoneId;
        this.notificationEnabled = notificationEnabled != null ? notificationEnabled : true;
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

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private String zoneId;
        private Boolean notificationEnabled = true;

        public Builder zoneId(String zoneId) {
            this.zoneId = zoneId;
            return this;
        }

        public Builder notificationEnabled(Boolean notificationEnabled) {
            this.notificationEnabled = notificationEnabled;
            return this;
        }

        public CreateSubscriptionRequest build() {
            return new CreateSubscriptionRequest(zoneId, notificationEnabled);
        }
    }
}
