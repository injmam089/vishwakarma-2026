CREATE TABLE devices (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(50) NOT NULL UNIQUE,
    zone_id VARCHAR(50) NOT NULL REFERENCES zones(zone_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    last_seen TIMESTAMPTZ NOT NULL,
    battery_level DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_devices_device_id ON devices(device_id);
CREATE INDEX idx_devices_zone_id ON devices(zone_id);
CREATE INDEX idx_devices_last_seen ON devices(last_seen);
