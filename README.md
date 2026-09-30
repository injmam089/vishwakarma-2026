# 🌍 LANDSAFE --- IoT Landslide Early Warning & Monitoring System

> A full-stack IoT monitoring prototype for collecting ground and
> environmental sensor data, evaluating configurable risk levels,
> visualizing live telemetry, and generating warning/critical alerts.

**LANDSAFE** is a collaborative Vishwakarma 2026 project that combines
an IoT sensor layer, Spring Boot backend, PostgreSQL/H2 database
support, real-time STOMP WebSocket telemetry, and a responsive web
dashboard.

The project is designed as an **educational/college prototype** for
demonstrating landslide monitoring and early-warning logic. It should
not be treated as a certified public-safety or evacuation system without
proper geotechnical validation, redundant sensing, communication
reliability, field testing, and regulatory approval.
fileciteturn1file0L7-L12

------------------------------------------------------------------------

## 🎯 Project Objective

LANDSAFE monitors ground and environmental conditions and turns sensor
measurements into understandable risk information.

The planned monitoring workflow includes:

``` text
Sensors
   ↓
ESP32
   ↓
Wi-Fi / Internet
   ↓
Spring Boot Backend
   ↓
Database
   ↓
Risk Calculation Engine
   ↓
Web Dashboard
   ↓
Alerts & Notifications
```

The requirements define monitoring of tilt/movement, soil moisture,
rainfall/environmental conditions, and vibration, with risk
classification into **Normal, Warning, and Critical**.
fileciteturn1file0L13-L26

------------------------------------------------------------------------

## ✨ Key Features

### 📡 Real-Time Monitoring

-   Live sensor telemetry
-   Ground tilt/movement monitoring
-   Soil moisture monitoring
-   Rainfall monitoring
-   Vibration monitoring
-   Device/node connection status
-   Last-seen information
-   Battery-level monitoring when available

### ⚠️ Risk Classification

LANDSAFE uses a three-level risk model:

  -----------------------------------------------------------------------
  Level                   Meaning                 System Response
  ----------------------- ----------------------- -----------------------
  🟢 **NORMAL**           Values remain within    Continue monitoring
                          the calibrated baseline 

  🟡 **WARNING**          Abnormal or sustained   Dashboard warning and
                          changes detected        optional notification

  🔴 **CRITICAL**         Large/rapid or combined Critical notification
                          abnormal changes        and event logging
  -----------------------------------------------------------------------

The requirements recommend configurable thresholds, a
calibration/baseline phase, and hysteresis/cooldown to reduce repeated
alerts. fileciteturn1file0L92-L98

### 📊 Dashboard

The dashboard provides:

-   Current risk status
-   Live sensor cards
-   Ground movement/tilt graphs
-   Soil moisture graphs
-   Rainfall graphs
-   Vibration graphs
-   Historical time-range selection
-   Alert history
-   Device/node status
-   Last updated timestamp
-   Threshold configuration
-   Historical CSV export

These dashboard capabilities are part of the project requirements.
fileciteturn1file0L99-L112

### 🔌 IoT Data Ingestion

The backend accepts sensor readings from ESP32 monitoring nodes.

Example telemetry:

``` json
{
  "deviceId": "ESP32-001",
  "zoneId": "ZONE-01",
  "tiltX": 2.1,
  "tiltY": 1.8,
  "soilMoisture": 42.5,
  "rainfall": 5.0,
  "vibration": 0.045,
  "batteryLevel": 88
}
```

### 🔴 Live Critical Alert Simulation

A high-risk telemetry packet can be submitted to test the risk engine
and live alert workflow:

``` json
{
  "deviceId": "ESP32-001",
  "zoneId": "ZONE-01",
  "tiltX": 11.2,
  "tiltY": 9.8,
  "soilMoisture": 92.5,
  "rainfall": 55.0,
  "vibration": 0.42,
  "batteryLevel": 78
}
```

This makes it possible to demonstrate the complete sensor → backend →
risk engine → dashboard/alert flow without waiting for an actual
environmental event.

------------------------------------------------------------------------

## 🔄 Operating Modes

LANDSAFE supports two dashboard modes.

### 🟢 API Mode

Connects to the Spring Boot backend using:

-   REST API
-   STOMP WebSocket
-   Live sensor telemetry

Connection states include:

``` text
LIVE
CONNECTING
RECONNECTING
OFFLINE
```

The frontend automatically attempts reconnection using backoff when the
WebSocket connection is interrupted.

### 🧪 Mock Mode

Provides a standalone client-side geotechnical simulation for
demonstrations where the backend or physical sensors are unavailable.

The dashboard can switch between API and MOCK modes from the interface.

------------------------------------------------------------------------

## 🏗️ System Architecture

``` text
┌───────────────────────────────┐
│      Physical Environment     │
│                               │
│  Tilt │ Moisture │ Rain │ Vib │
└───────────────┬───────────────┘
                │
                ▼
        ┌───────────────┐
        │     ESP32     │
        │ IoT Controller│
        └───────┬───────┘
                │
             Wi-Fi
                │
                ▼
┌───────────────────────────────┐
│       Spring Boot Backend     │
│                               │
│ REST API + Risk Engine        │
│ Authentication + Validation   │
│ Device Health + WebSocket     │
└───────────────┬───────────────┘
                │
       ┌────────┴────────┐
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│ PostgreSQL  │   │ STOMP / WS  │
│ / H2        │   │ Live Stream │
└─────────────┘   └──────┬──────┘
                         │
                         ▼
              ┌────────────────────┐
              │ LANDSAFE Dashboard │
              │                    │
              │ Risk • Sensors     │
              │ Charts • Alerts    │
              │ Devices • History  │
              └────────────────────┘
```

The original project requirements describe the sensor → ESP32 →
Internet/Cloud → database → risk engine → web/mobile → alerts flow.
fileciteturn1file0L249-L280

------------------------------------------------------------------------

## 🧰 Technology Stack

### Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   Recharts / charting components
-   STOMP WebSocket client

### Backend

-   Java
-   Spring Boot
-   Spring Security
-   REST APIs
-   STOMP WebSocket
-   Hibernate / JPA

### Database

-   PostgreSQL
-   H2 development database
-   Flyway database migrations

### IoT

-   ESP32
-   MPU6050 / IMU
-   Soil moisture sensor
-   Rain sensor / rain gauge
-   Vibration sensor
-   OLED/LCD
-   Buzzer and LEDs

The requirements identify ESP32, an IMU, soil-moisture sensing, rainfall
sensing, vibration sensing, local display, and local warning hardware as
the core prototype hardware. fileciteturn1file0L27-L46

### Development & Deployment

-   Maven
-   Docker
-   Docker Compose
-   Git
-   GitHub

------------------------------------------------------------------------

## 📂 Repository Structure

``` text
vishwakarma-2026/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── public/
│
├── src/
│   ├── components/
│   ├── views/
│   ├── services/
│   ├── hooks/
│   └── ...
│
├── .env.example
├── docker-compose.yml
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
├── PHASE_4_ALERTS.md
└── README.md
```

------------------------------------------------------------------------

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

-   Node.js
-   npm
-   Java / JDK
-   Maven
-   PostgreSQL (for production-style mode)
-   Docker Desktop (optional)
-   Git

------------------------------------------------------------------------

## 🧪 Option 1 --- Development Mode

Development mode uses an embedded **H2 database** and does not require a
separate PostgreSQL installation.

### Start Backend

``` bash
cd backend
mvn spring-boot:run "-Dspring-boot.run.profiles=dev"
```

Backend:

``` text
http://localhost:8080
```

WebSocket:

``` text
ws://localhost:8080/ws
```

### Start Frontend

Open another terminal:

``` bash
npm install
npm run dev
```

Dashboard:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

## 🐘 Option 2 --- PostgreSQL Mode

Start PostgreSQL using Docker Compose:

``` bash
docker-compose up -d postgres
```

Then start the backend:

``` bash
cd backend
mvn spring-boot:run
```

Start the frontend:

``` bash
npm run dev
```

Flyway manages the database migrations in this mode.

------------------------------------------------------------------------

## 🔐 Demo Accounts

  Role                    Email                    Password
  ----------------------- ------------------------ ----------------
  Administrator           `admin@geomonitor.org`   `Admin@123456`
  Geotechnical Engineer   `user@geomonitor.org`    `User@123456`

> These are development/demo credentials. Change credentials and secrets
> before any real deployment.

------------------------------------------------------------------------

## 📡 Sensor Data API

### Endpoint

``` text
POST /api/sensor-data
```

### Example

``` bash
curl -X POST http://localhost:8080/api/sensor-data \
  -H "Content-Type: application/json" \
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

The data can then be processed by the backend risk engine and streamed
to the dashboard.

------------------------------------------------------------------------

## 🔴 Testing a Critical Scenario

Use a deliberately high-risk test payload:

``` bash
curl -X POST http://localhost:8080/api/sensor-data \
  -H "Content-Type: application/json" \
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

Use this only as a controlled software demonstration of the alert
workflow.

------------------------------------------------------------------------

## 🧠 Risk Engine

The risk engine follows a configurable threshold/baseline approach.

``` text
Sensor Reading
      │
      ▼
Validate Data
      │
      ▼
Compare With Baseline
      │
      ▼
Compare With Thresholds
      │
      ▼
Abnormal?
  ┌───┴────┐
 NO       YES
  │         │
  ▼         ▼
Normal   Sustained /
          Critical?
          │
      ┌───┴────┐
      ▼        ▼
   Warning   Critical
      │        │
      ▼        ▼
 Dashboard   Alert +
 Update      Event Log
```

The requirements specifically recommend validating sensor values before
evaluation and avoiding alerts for every small fluctuation.
fileciteturn1file0L275-L304

------------------------------------------------------------------------

## 🗃️ Suggested Data Model

The system is designed around entities such as:

``` text
users
  │
  └── subscriptions
          │
          ▼
        zones
          │
          ├── devices
          │      │
          │      └── sensor_readings
          │
          ├── thresholds
          │
          └── risk_events
```

The project requirements define suggested structures for users, devices,
sensor readings, risk events, subscriptions, and configurable
thresholds. fileciteturn1file0L132-L148

------------------------------------------------------------------------

## 📈 Data Logging

For the physical prototype, sensors can be sampled frequently while a
defined summary interval is stored.

Recommended demonstration strategy:

``` text
Sensor Sampling
10–30 seconds
      ↓
Validation
      ↓
Measurement Summary
      ↓
Database
      ↓
Historical Graphs
```

The requirements suggest frequent sensor readings such as every 10--30
seconds and storing a defined measurement/summary interval such as every
5 minutes. fileciteturn1file0L85-L91

Supported history views can include:

-   2 hours
-   6 hours
-   24 hours
-   7 days
-   Custom time range

------------------------------------------------------------------------

## 🔔 Alert Workflow

``` text
Sensor Reading
      ↓
Validate
      ↓
Compare Baseline
      ↓
Compare Threshold
      ↓
┌───────────────┐
│ Risk Detected │
└───────┬───────┘
        ↓
 ┌─────────────┐
 │   WARNING   │
 └──────┬──────┘
        │
        ▼
 Dashboard + Optional Alert

        OR

 ┌─────────────┐
 │  CRITICAL   │
 └──────┬──────┘
        │
        ▼
 Critical Alert
        ↓
 Event Logging
```

The requirements specify that warning notifications should be triggered
when conditions persist or cross configured thresholds, while critical
conditions should generate high-priority notifications.
fileciteturn1file0L123-L129

------------------------------------------------------------------------

## 🔌 Failure & Recovery

Internet connectivity failure should be treated as a **device/network
state**, not as a landslide event.

``` text
ESP32
  ↓
Wi-Fi Lost?
  ↓
Offline / Retry
  ↓
Reconnect
  ↓
Upload Pending Data
  ↓
Dashboard Updated
```

The project requirements recommend last-seen/device-health tracking and
recovery after reconnection. fileciteturn1file0L345-L360

------------------------------------------------------------------------

## 🧪 Testing

### Backend Tests

The repository currently documents a backend test suite with:

``` text
32 / 32 tests passing
```

Run:

``` bash
cd backend
mvn test
```

### Frontend Build

``` bash
npm run build
```

### Testing Areas

-   Sensor data validation
-   Risk calculation
-   Warning conditions
-   Critical conditions
-   WebSocket connection
-   Reconnection behavior
-   Device heartbeat
-   Historical data
-   Dashboard updates
-   Authentication
-   Database operations

The requirements also call for testing Wi-Fi recovery, duplicate
readings, timestamps, invalid sensor values, dashboard updates,
historical data, warning/critical alerts, and device offline detection.
fileciteturn1file0L190-L201

------------------------------------------------------------------------

## 🧪 Physical Demonstration Model

The project can be demonstrated using a controlled slope model made from
safe materials such as:

-   Thermocol
-   Cardboard
-   Clay
-   Soil
-   Sand

Sensors can be placed on the model to demonstrate changes in:

-   Tilt
-   Soil moisture
-   Rainfall simulation
-   Controlled movement

The requirements recommend using controlled movement and water/rain
simulation rather than unsafe physical failure tests.
fileciteturn1file0L149-L157

------------------------------------------------------------------------

## 📱 Planned Mobile / PWA Experience

The project requirements include a responsive mobile interface or
installable PWA with:

-   User registration/login
-   Monitoring-zone subscription
-   Current risk status
-   Live sensor values
-   Historical graphs
-   Push-notification permission
-   Warning/critical alert screens
-   Alert history
-   Optional alert acknowledgement

fileciteturn1file0L113-L122

------------------------------------------------------------------------

## 👥 Team Responsibility Model

The project requirements define a four-member responsibility model:

  -----------------------------------------------------------------------
  Team Role               Area                    Main Responsibility
  ----------------------- ----------------------- -----------------------
  Member 1                Hardware + Sensors      ESP32 wiring, sensor
                                                  testing, calibration

  Member 2                Backend + Database      API/cloud, data
                                                  storage, authentication

  Member 3                Website/App             Dashboard, graphs,
                                                  history, responsive UI

  Member 4                Alerts + Testing        Risk logic, push
                                                  notifications, test
                                                  cases

  All Members             Documentation + Demo    Report, PPT, diagrams,
                                                  presentation
  -----------------------------------------------------------------------

fileciteturn1file0L361-L372

------------------------------------------------------------------------

## 💰 Prototype Budget

The requirements estimate the overall prototype budget at approximately:

  Category                                  Estimated Budget
  ----------------------------------- ----------------------
  Basic electronics + sensors                 ₹1,500--₹3,000
  Better sensors / extra components             ₹500--₹1,500
  Physical demonstration model                  ₹300--₹1,000
  Cloud/backend                                   ₹0--₹1,000
  Website / PWA                         ₹0 if self-developed
  Miscellaneous / spares                          ₹300--₹800
  **Recommended Total**                   **₹3,000--₹6,500**

fileciteturn1file0L202-L210

------------------------------------------------------------------------

## 📋 Development Roadmap

``` text
Phase 1
Requirements & Architecture
        ↓
Phase 2
Sensor Testing
        ↓
Phase 3
ESP32 Integration
        ↓
Phase 4
Calibration & Baseline
        ↓
Phase 5
Cloud / Backend Integration
        ↓
Phase 6
Database & Data Logging
        ↓
Phase 7
Web Dashboard
        ↓
Phase 8
Historical Graphs
        ↓
Phase 9
Risk Engine
        ↓
Phase 10
Alerts & Notifications
        ↓
Phase 11
Mobile / PWA
        ↓
Phase 12
Physical Model Integration
        ↓
Phase 13
Testing & Validation
        ↓
Phase 14
Documentation & Demonstration
```

The project requirements define these fourteen development phases from
architecture and sensor testing through integration, risk logic,
notifications, testing, and final documentation.
fileciteturn1file0L175-L189

------------------------------------------------------------------------

## 📸 Screenshots & Demo

Recommended screenshots for the repository:

``` text
docs/
├── dashboard.png
├── live-monitoring.png
├── risk-normal.png
├── risk-warning.png
├── risk-critical.png
├── sensor-history.png
├── alert-history.png
├── admin-settings.png
└── physical-model.jpg
```

A short demo video is also recommended for a college submission.

------------------------------------------------------------------------

## ⚠️ Important Limitation

LANDSAFE is an **educational monitoring and early-warning prototype**.

Actual landslide behavior depends on many factors including:

-   Soil type
-   Slope geometry
-   Groundwater
-   Geology
-   Rainfall intensity
-   Drainage
-   Site-specific conditions

Therefore, the system must **not be presented as a certified real-world
public evacuation or safety system** based solely on this prototype.
Proper geotechnical validation, redundant sensors, communication
reliability, field testing, and regulatory approval would be required
for real-world deployment. fileciteturn1file0L239-L246

------------------------------------------------------------------------

## 🎓 Project Learning Outcomes

This project demonstrates practical experience with:

-   IoT sensor integration
-   ESP32 development
-   Real-time telemetry
-   REST API development
-   WebSocket communication
-   Spring Boot
-   React and TypeScript
-   Database design
-   PostgreSQL
-   H2 development environments
-   Flyway migrations
-   Authentication and authorization
-   Risk/threshold engines
-   Data visualization
-   Alert systems
-   Docker
-   Automated testing
-   Responsive dashboard design

------------------------------------------------------------------------

## 📄 Project Type

**Vishwakarma 2026 --- College Prototype**

**Domain:** IoT + Cloud/Backend + Web Dashboard + Monitoring + Alerts

**Primary Use:** Educational demonstration of sensor-based landslide
monitoring and configurable early-warning logic.

------------------------------------------------------------------------

## 👨‍💻 Author

**Injmam**

BCA Student \| Cybersecurity & Software Development

GitHub: https://github.com/injmam089

------------------------------------------------------------------------

## 📄 License

This project is licensed under the MIT License.

------------------------------------------------------------------------

⭐ If you find LANDSAFE interesting, consider giving the repository a
star.
