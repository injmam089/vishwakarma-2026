CREATE TABLE alerts (
    id BIGSERIAL PRIMARY KEY,
    alert_id VARCHAR(50) NOT NULL UNIQUE,
    event_id VARCHAR(50),
    zone_id VARCHAR(50) NOT NULL REFERENCES zones(zone_id) ON DELETE CASCADE,
    device_id VARCHAR(50),
    severity VARCHAR(30) NOT NULL,
    condition VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    triggering_values TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by VARCHAR(150),
    resolved_at TIMESTAMPTZ,
    resolved_by VARCHAR(150)
);

CREATE INDEX idx_alerts_zone_status ON alerts(zone_id, status);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);

CREATE TABLE notification_deliveries (
    id BIGSERIAL PRIMARY KEY,
    alert_id VARCHAR(50) NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    sent_at TIMESTAMPTZ,
    failure_reason TEXT,
    retry_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_status ON notification_deliveries(user_id, status);
CREATE INDEX idx_notifications_alert_id ON notification_deliveries(alert_id);

ALTER TABLE subscriptions 
    ADD COLUMN warning_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN critical_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN device_enabled BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(150),
    action VARCHAR(50) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    details TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
