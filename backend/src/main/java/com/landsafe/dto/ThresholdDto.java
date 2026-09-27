package com.landsafe.dto;

import com.landsafe.entity.ThresholdParameter;

public class ThresholdDto {
    private Long id;
    private String zoneId;
    private ThresholdParameter parameter;
    private Double warningValue;
    private Double criticalValue;

    public ThresholdDto() {
    }

    public ThresholdDto(Long id, String zoneId, ThresholdParameter parameter, Double warningValue, Double criticalValue) {
        this.id = id;
        this.zoneId = zoneId;
        this.parameter = parameter;
        this.warningValue = warningValue;
        this.criticalValue = criticalValue;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getZoneId() {
        return zoneId;
    }

    public void setZoneId(String zoneId) {
        this.zoneId = zoneId;
    }

    public ThresholdParameter getParameter() {
        return parameter;
    }

    public void setParameter(ThresholdParameter parameter) {
        this.parameter = parameter;
    }

    public Double getWarningValue() {
        return warningValue;
    }

    public void setWarningValue(Double warningValue) {
        this.warningValue = warningValue;
    }

    public Double getCriticalValue() {
        return criticalValue;
    }

    public void setCriticalValue(Double criticalValue) {
        this.criticalValue = criticalValue;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String zoneId;
        private ThresholdParameter parameter;
        private Double warningValue;
        private Double criticalValue;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder zoneId(String zoneId) {
            this.zoneId = zoneId;
            return this;
        }

        public Builder parameter(ThresholdParameter parameter) {
            this.parameter = parameter;
            return this;
        }

        public Builder warningValue(Double warningValue) {
            this.warningValue = warningValue;
            return this;
        }

        public Builder criticalValue(Double criticalValue) {
            this.criticalValue = criticalValue;
            return this;
        }

        public ThresholdDto build() {
            return new ThresholdDto(id, zoneId, parameter, warningValue, criticalValue);
        }
    }
}
