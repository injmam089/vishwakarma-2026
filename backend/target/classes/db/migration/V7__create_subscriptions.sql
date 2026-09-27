CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    zone_id VARCHAR(50) NOT NULL REFERENCES zones(zone_id) ON DELETE CASCADE,
    notification_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_user_zone UNIQUE (user_id, zone_id)
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
