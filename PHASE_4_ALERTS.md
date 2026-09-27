# LANDSAFE — Phase 4: Alerts & Notification System Documentation

## 1. Architectural Architecture & Conceptual Separation

Phase 4 introduces an operational and life-safety notification layer cleanly decoupled from raw IoT sensor ingestion:

```
[ ESP32 Sensor Pods / Gateway ]
              │ (Telemetry / Heartbeat)
              ▼
    [ Risk Engine & Ingress ]
              │
    ┌─────────┴────────────────────────┐
    ▼                                  ▼
[ Geological Risk Calculation ]   [ Device Monitor (90s) ]
    │                                  │
    │ (breach detected)                │ (offline / recovery)
    ▼                                  ▼
    └──────────────┬───────────────────┘
                   ▼
         [ Alert Lifecycle Service ]
                   │
                   ├── Deduplication & Cooldown (300s)
                   ├── Critical Escalation Bypass
                   └── Database Persistence (PostgreSQL Flyway V9)
                   │
                   ▼
         [ Multi-Channel Notification Dispatcher ]
                   │
         ┌─────────┼─────────────────────────┐
         ▼         ▼                         ▼
   [ WebSocket ] [ Resilient Email ]   [ Web Push (User Opt-in) ]
    /topic/users/   Async Executor      Browser Desktop
    {id}/notifs     (Non-blocking)      Notification API
```

### Core Entity Model:
1. **Risk Event**: A transient state calculated by the Risk Engine from incoming telemetry (e.g. soil moisture > 80%, composite tilt > 5.0°). Telemetry that returns to normal does **not** generate alerts.
2. **Alert**: A persistent, user-visible system record with an operational lifecycle:
   - `ACTIVE`: New alert created by risk threshold breach or device status event.
   - `ACKNOWLEDGED`: Operator has reviewed the condition and initiated protocols.
   - `RESOLVED`: Hazard condition has cleared or team has verified remediation.
3. **Notification**: Targeted message delivered across selected channels to authorized stakeholders subscribed to that zone.

---

## 2. Alert Lifecycle & User Attribution

Every alert transition is authenticated, logged in the audit trail, and broadcast across the network via WebSockets.

### State Transitions:
- `ACTIVE` $\to$ `ACKNOWLEDGED`: Triggered by operator via `PATCH /api/alerts/{alertId}/acknowledge`. Sets `acknowledged_at` and `acknowledged_by`.
- `ACKNOWLEDGED` $\to$ `RESOLVED`: Triggered by operator via `PATCH /api/alerts/{alertId}/resolve`. Sets `resolved_at` and `resolved_by`.
- `ACTIVE` $\to$ `RESOLVED`: Allowed for rapid resolution or system auto-clearing.
- **Escalation**: When a `WARNING` is active and incoming telemetry breaches `CRITICAL`, the active warning is automatically updated to `SYSTEM_ESCALATED_TO_CRITICAL` and resolved, and a new `CRITICAL` alert is immediately created and dispatched without cooldown suppression.

---

## 3. Duplicate Prevention & Hysteresis Rules

- **Cooldown (300s)**: Identical alerts for the same zone and condition are suppressed for 5 minutes to prevent alert flooding during prolonged storm events.
- **Critical Override**: Cooldown is automatically bypassed when severity escalates from `WARNING` to `CRITICAL`.
- **System Separation**: Device timeouts (90s stale heartbeat) are tagged as `DEVICE_OFFLINE` operational notices and are strictly isolated from geological landslide risk calculations.

---

## 4. Multi-Channel Notification Matrix

| Channel | Destination / Protocol | User Preferences | Failure Handling |
| :--- | :--- | :--- | :--- |
| **In-App Notification** | STOMP WebSocket: `/topic/users/{userId}/notifications` and `/topic/admin/notifications` | Always delivered if user is subscribed to zone | Stored in in-memory buffer and alert table |
| **Email Dispatch** | SMTP TLS dispatch via `spring-boot-starter-mail` | Subscribed users with email preference enabled | Resilient, non-blocking `CompletableFuture`. Delivery logged as `FAILED` in `notification_deliveries` without impacting sensor ingestion |
| **Web Push / Browser** | HTML5 Notifications API (`new Notification(...)`) | Requires explicit user click in **Settings $\to$ Dispatch** | Handled natively by browser permission system (never requested on page load) |

---

## 5. REST & WebSocket Endpoints

### Alert Operations:
- `GET /api/alerts`: List alerts (filterable by zone, severity, status).
- `GET /api/alerts/active`: Retrieve current active hazard alerts.
- `PATCH /api/alerts/{alertId}/acknowledge`: Operator acknowledgment.
- `PATCH /api/alerts/{alertId}/resolve`: Hazard resolution.
- `GET /api/alerts/audit`: Admin audit log of system transitions and dispatches.

### Zone Subscriptions & Preferences:
- `GET /api/subscriptions`: Current user zone subscriptions and preferences.
- `POST /api/subscriptions`: Subscribe to zone hazard alerts.
- `PUT /api/subscriptions/{zoneId}/preferences`: Update alert filters (`warningEnabled`, `criticalEnabled`, `deviceEnabled`).
- `DELETE /api/subscriptions/{zoneId}`: Unsubscribe from zone.

### WebSocket Topics:
- `/topic/alerts/updates`: Real-time alert lifecycle updates (acknowledge/resolve).
- `/topic/zones/{zoneId}/alerts`: New hazard alerts created in sector.
- `/topic/users/{userId}/notifications`: Personalized user notification feed.
- `/topic/admin/notifications`: Global administrator broadcast feed.

---

## 6. How to Verify & Test

### Backend Automated Test Suite:
Run in `backend/`:
```bash
mvn test
```
Verifies 43 comprehensive unit, integration, and security tests:
- `AlertLifecycleTest`: Verifies `ACTIVE` $\to$ `ACKNOWLEDGED` $\to$ `RESOLVED`, cooldown suppression, and `WARNING` $\to$ `CRITICAL` escalation.
- `NotificationSubscriptionTest`: Verifies preferences filtering (`warningEnabled`, `criticalEnabled`, `deviceEnabled`) and multi-user delivery.
- `DeviceAlertTest`: Verifies 90s device timeout creates `DEVICE_OFFLINE` without polluting geological risk score.
- `AlertSecurityTest`: Verifies non-admin users cannot access audit endpoints or subscribe to unauthorized user queues.

### Frontend UI Verification:
1. Start frontend:
   ```bash
   npm run dev
   ```
2. Switch scenario to `CRITICAL` in top bar:
   - Notice the non-blocking toast overlay appears at the top right.
   - Notice the notification bell `🔔` badge updates with unread count.
   - Click the bell icon to open the popover, inspect recent notifications, and click **Mark read**.
3. Navigate to **Alerts**:
   - Inspect active alerts with colored severity indicator.
   - Click **Acknowledge** and verify badge changes to `ACKNOWLEDGED` with operator attribution.
   - Click **Resolve** and verify status updates to `CLEARED`.
4. Navigate to **Settings $\to$ Dispatch**:
   - Toggle Warning, Critical, or Node Telemetry alerts. Notice real-time synchronization with subscription preferences.
   - Click **Request Permission** under Desktop Browser Notifications to test browser notification opt-in.