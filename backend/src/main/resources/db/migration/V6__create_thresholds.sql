CREATE TABLE thresholds (
    id BIGSERIAL PRIMARY KEY,
    zone_id VARCHAR(50) NOT NULL REFERENCES zones(zone_id) ON DELETE CASCADE,
    parameter VARCHAR(30) NOT NULL,
    warning_value DOUBLE PRECISION NOT NULL,
    critical_value DOUBLE PRECISION NOT NULL,
    CONSTRAINT uq_zone_parameter UNIQUE (zone_id, parameter)
);

CREATE INDEX idx_thresholds_zone_id ON thresholds(zone_id);
