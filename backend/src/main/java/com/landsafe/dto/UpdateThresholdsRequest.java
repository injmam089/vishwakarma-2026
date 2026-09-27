package com.landsafe.dto;

import com.landsafe.entity.ThresholdParameter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class UpdateThresholdsRequest {

    @NotEmpty(message = "thresholds list cannot be empty")
    @Valid
    private List<ThresholdItem> thresholds;

    public UpdateThresholdsRequest() {
    }

    public UpdateThresholdsRequest(List<ThresholdItem> thresholds) {
        this.thresholds = thresholds;
    }

    public List<ThresholdItem> getThresholds() {
        return thresholds;
    }

    public void setThresholds(List<ThresholdItem> thresholds) {
        this.thresholds = thresholds;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private List<ThresholdItem> thresholds;

        public Builder thresholds(List<ThresholdItem> thresholds) {
            this.thresholds = thresholds;
            return this;
        }

        public UpdateThresholdsRequest build() {
            return new UpdateThresholdsRequest(thresholds);
        }
    }

    public static class ThresholdItem {
        @NotNull(message = "parameter is required")
        private ThresholdParameter parameter;

        @NotNull(message = "warningValue is required")
        @DecimalMin(value = "0.0", message = "warningValue must be >= 0")
        private Double warningValue;

        @NotNull(message = "criticalValue is required")
        @DecimalMin(value = "0.0", message = "criticalValue must be >= 0")
        private Double criticalValue;

        public ThresholdItem() {
        }

        public ThresholdItem(ThresholdParameter parameter, Double warningValue, Double criticalValue) {
            this.parameter = parameter;
            this.warningValue = warningValue;
            this.criticalValue = criticalValue;
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
            private ThresholdParameter parameter;
            private Double warningValue;
            private Double criticalValue;

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

            public ThresholdItem build() {
                return new ThresholdItem(parameter, warningValue, criticalValue);
            }
        }
    }
}
