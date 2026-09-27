-- Seed Zones
INSERT INTO zones (zone_id, name, description, latitude, longitude, elevation, created_at)
VALUES
('ZONE-01', 'North Ridge', 'Colluvial soil slope above secondary highway and residential settlement', 34.0522, -118.2437, 842.0, CURRENT_TIMESTAMP),
('ZONE-02', 'Debris Basin', 'Drainage convergence channel with high saturation potential', 34.0588, -118.2510, 715.0, CURRENT_TIMESTAMP),
('ZONE-03', 'South Escarpment', 'Steep fractured sandstone face with active rockfall history', 34.0450, -118.2380, 920.0, CURRENT_TIMESTAMP)
ON CONFLICT (zone_id) DO NOTHING;

-- Seed Devices
INSERT INTO devices (device_id, zone_id, status, last_seen, battery_level, created_at, updated_at)
VALUES
('ESP32-001', 'ZONE-01', 'ONLINE', CURRENT_TIMESTAMP, 91.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ESP32-002', 'ZONE-01', 'ONLINE', CURRENT_TIMESTAMP, 88.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ESP32-003', 'ZONE-02', 'ONLINE', CURRENT_TIMESTAMP, 94.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ESP32-004', 'ZONE-02', 'ONLINE', CURRENT_TIMESTAMP, 79.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ESP32-005', 'ZONE-03', 'ONLINE', CURRENT_TIMESTAMP, 85.0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (device_id) DO NOTHING;

-- Seed Default Thresholds
-- ZONE-01
INSERT INTO thresholds (zone_id, parameter, warning_value, critical_value)
VALUES
('ZONE-01', 'TILT', 5.0, 12.0),
('ZONE-01', 'SOIL_MOISTURE', 75.0, 90.0),
('ZONE-01', 'RAINFALL', 35.0, 60.0),
('ZONE-01', 'VIBRATION', 0.50, 1.20)
ON CONFLICT (zone_id, parameter) DO NOTHING;

-- ZONE-02
INSERT INTO thresholds (zone_id, parameter, warning_value, critical_value)
VALUES
('ZONE-02', 'TILT', 4.5, 10.0),
('ZONE-02', 'SOIL_MOISTURE', 70.0, 85.0),
('ZONE-02', 'RAINFALL', 30.0, 50.0),
('ZONE-02', 'VIBRATION', 0.45, 1.00)
ON CONFLICT (zone_id, parameter) DO NOTHING;

-- ZONE-03
INSERT INTO thresholds (zone_id, parameter, warning_value, critical_value)
VALUES
('ZONE-03', 'TILT', 6.0, 14.0),
('ZONE-03', 'SOIL_MOISTURE', 80.0, 92.0),
('ZONE-03', 'RAINFALL', 40.0, 65.0),
('ZONE-03', 'VIBRATION', 0.60, 1.50)
ON CONFLICT (zone_id, parameter) DO NOTHING;

-- Seed Initial Baseline Sensor Readings
INSERT INTO sensor_readings (timestamp, device_id, tilt_x, tilt_y, tilt_z, soil_moisture, rainfall, vibration, battery)
VALUES
(CURRENT_TIMESTAMP - INTERVAL '1 hour', 'ESP32-001', 2.38, 1.80, 0.90, 66.8, 17.5, 0.205, 91.5),
(CURRENT_TIMESTAMP - INTERVAL '30 minutes', 'ESP32-001', 2.40, 1.82, 0.91, 67.0, 17.8, 0.210, 91.2),
(CURRENT_TIMESTAMP, 'ESP32-001', 2.42, 1.83, 0.92, 67.2, 18.0, 0.212, 91.0),
(CURRENT_TIMESTAMP, 'ESP32-002', 1.95, 1.45, 0.88, 64.5, 16.5, 0.180, 88.0),
(CURRENT_TIMESTAMP, 'ESP32-003', 3.10, 2.20, 1.05, 71.0, 21.0, 0.250, 94.0),
(CURRENT_TIMESTAMP, 'ESP32-004', 2.85, 2.05, 1.01, 69.5, 19.5, 0.230, 79.0),
(CURRENT_TIMESTAMP, 'ESP32-005', 4.10, 2.90, 1.15, 58.0, 14.0, 0.280, 85.0);
