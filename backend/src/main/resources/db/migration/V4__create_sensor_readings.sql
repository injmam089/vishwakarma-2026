CREATE TABLE sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    device_id VARCHAR(50) NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    tilt_x DOUBLE PRECISION NOT NULL,
    tilt_y DOUBLE PRECISION NOT NULL,
    tilt_z DOUBLE PRECISION NOT NULL,
    soil_moisture DOUBLE PRECISION NOT NULL,
    rainfall DOUBLE PRECISION NOT NULL,
    vibration DOUBLE PRECISION NOT NULL,
    battery DOUBLE PRECISION NOT NULL
);

CREATE INDEX idx_sensor_readings_device_time ON sensor_readings(device_id, timestamp DESC);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
