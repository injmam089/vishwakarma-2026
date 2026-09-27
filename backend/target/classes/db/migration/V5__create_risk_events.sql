CREATE TABLE risk_events (
    id BIGSERIAL PRIMARY KEY,
    event_id VARCHAR(50) NOT NULL UNIQUE,
    zone_id VARCHAR(50) NOT NULL REFERENCES zones(zone_id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    reason TEXT NOT NULL
);

CREATE INDEX idx_risk_events_zone_time ON risk_events(zone_id, timestamp DESC);
