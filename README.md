# LANDSAFE — IoT Landslide Early Warning & Monitoring System

A commercial-grade geotechnical monitoring system featuring real-time sensor telemetry streaming over STOMP WebSocket, automated multi-parameter risk evaluation, device health monitoring, and a professional light/dark interface.

---

## Quick Start: How to Run

### Option 1: Standalone Development Mode (Zero Database Setup)
Uses an embedded H2 database running in PostgreSQL compatibility mode, pre-populated with zones, devices, thresholds, and accounts.

1. **Start the Spring Boot Backend**:
   ```powershell
   cd d:\Vishwakarma\backend
   mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
   ```
   *The backend will start on `http://localhost:8080` with STOMP WebSocket at `ws://localhost:8080/ws`.*

2. **Start the Frontend Dashboard** (in another terminal):
   ```powershell
   cd d:\Vishwakarma
   npm run dev
   ```
   *Access the dashboard at `http://localhost:5173`.*

---

### Option 2: Production Mode (PostgreSQL + Automated Flyway Migrations)

1. **Start PostgreSQL Container**:
   ```powershell
   cd d:\Vishwakarma
   docker-compose up -d postgres
   ```

2. **Start the Spring Boot Backend**:
   ```powershell
   cd d:\Vishwakarma\backend
   mvn spring-boot:run
   ```

3. **Start the Frontend**:
   ```powershell
   cd d:\Vishwakarma
   npm run dev
   ```

---

## Default Access Credentials

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@geomonitor.org` | `Admin@123456` |
| **Geotechnical Engineer** | `user@geomonitor.org` | `User@123456` |

---

## Operating Modes

- **API Mode** (Default): Connects live to Spring Boot REST API and STOMP WebSocket.
  - `Stream: LIVE` (pulsing green): Real-time STOMP connection active.
  - `Stream: CONNECTING` / `RECONNECTING` (amber): Auto-reconnect with exponential backoff (1s–15s).
  - `Stream: OFFLINE` (rose): WebSocket disconnected.
- **Mock Mode**: Fully standalone client-side geotechnical simulation for offline demos. Toggle between modes anytime via the **API / MOCK** button in the top navigation bar.

---

## Simulating Live Telemetry Ingestion

To push a live IoT sensor packet from an ESP32 node into the system and watch it stream in real time to the charts:

```powershell
curl -X POST http://localhost:8080/api/sensor-data `
  -H "Content-Type: application/json" `
  -d '{
    "deviceId": "ESP32-001",
    "zoneId": "ZONE-01",
    "tiltX": 2.1,
    "tiltY": 1.8,
    "soilMoisture": 42.5,
    "rainfall": 5.0,
    "vibration": 0.045,
    "batteryLevel": 88
  }'
```

To trigger a **CRITICAL** risk escalation and live emergency alert:

```powershell
curl -X POST http://localhost:8080/api/sensor-data `
  -H "Content-Type: application/json" `
  -d '{
    "deviceId": "ESP32-001",
    "zoneId": "ZONE-01",
    "tiltX": 11.2,
    "tiltY": 9.8,
    "soilMoisture": 92.5,
    "rainfall": 55.0,
    "vibration": 0.42,
    "batteryLevel": 78
  }'
```

---

## Automated Verification Tests

- **Backend Tests (32/32 tests green)**:
  ```powershell
  cd d:\Vishwakarma\backend
  mvn test
  ```
- **Frontend Production Build**:
  ```powershell
  cd d:\Vishwakarma
  npm run build
  ```

