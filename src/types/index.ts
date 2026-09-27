export type AppTheme = 'light' | 'dark';
export type AppMode = 'API' | 'MOCK';
export type ApiStatus = 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
export type WsStatus = 'LIVE' | 'CONNECTING' | 'RECONNECTING' | 'OFFLINE';

export interface WsTelemetryEvent {
  type: 'TELEMETRY_UPDATE';
  deviceId: string;
  zoneId: string;
  timestamp: string;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  compositeTilt: number;
  soilMoisture: number;
  rainfall: number;
  vibration: number;
  battery: number;
}

export interface WsRiskEvent {
  type: 'RISK_UPDATE';
  zoneId: string;
  riskLevel: RiskLevel;
  riskIndex: number;
  reason: string;
  timestamp: string;
}

export interface WsAlertEvent {
  type: 'ALERT_CREATED';
  eventId: string;
  zoneId: string;
  severity: RiskLevel;
  reason: string;
  timestamp: string;
}

export interface WsDeviceStatusEvent {
  type: 'DEVICE_STATUS';
  deviceId: string;
  zoneId: string;
  status: 'ONLINE' | 'OFFLINE';
  lastSeen: string;
  timestamp: string;
}

export type RiskLevel = 'NORMAL' | 'WARNING' | 'CRITICAL';

export type TimeRange = '2H' | '6H' | '24H' | '7D' | 'CUSTOM';

export type NavigationTab = 'overview' | 'live' | 'history' | 'alerts' | 'devices' | 'settings';

export interface SensorTelemetry {
  timestamp: string;
  tilt: number;              // degrees (baseline 2.4°)
  tiltTrend: number;         // change per hour
  displacement: number;      // cumulative movement in mm
  displacementRate: number;  // mm/hr
  soilMoisture: number;      // percentage (baseline 67%)
  soilMoistureTrend: number; // % change
  rainfall: number;          // mm cumulative in 24h (baseline 18mm)
  rainfallRate: number;      // mm/hr current intensity
  vibration: number;         // g or acceleration index (baseline 0.21)
  vibrationTrend: number;
  battery: number;           // percentage (baseline 91%)
  batteryVoltage: number;    // volts, e.g. 4.12V
  solarCharging: boolean;
  solarPower: number;        // Watts
  temperature: number;       // °C
  humidity: number;          // %
}

export interface HazardZone {
  id: string;
  name: string;
  subTitle: string;
  risk: RiskLevel;
  riskScore: number;         // 0 - 100
  advisory: string;
  primaryDeviceId: string;
  deviceCount: number;
  activeAlertsCount: number;
  slopeAngle: number;        // base slope degrees
  elevation: number;         // meters above sea level
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface DeviceNode {
  id: string;
  zoneId: string;
  name: string;
  type: string;
  status: 'ONLINE' | 'OFFLINE' | 'STANDBY' | 'DEGRADED';
  lastSeen: string;
  battery: number;
  batteryVoltage: number;
  solarInput: string;
  signalRssi: number;        // dBm, e.g. -64
  firmware: string;
  packetsSent: number;
  crcErrors: number;
  uptimeHours: number;
}

export type AlertSeverity = 'WARNING' | 'CRITICAL' | 'DEVICE_OFFLINE' | 'DEVICE_RECOVERED' | RiskLevel;

export interface AlertRecord {
  id: string;
  alertId?: string;
  eventId?: string;
  timestamp: string;
  severity: AlertSeverity;
  condition: string;
  reason?: string;
  zoneId: string;
  deviceId: string;
  value: string;
  threshold: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  protocol: string;
  triggeringValues?: string;
  createdAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface NotificationEvent {
  alertId: string;
  eventId?: string;
  zoneId: string;
  deviceId: string;
  severity: AlertSeverity;
  condition: string;
  reason: string;
  triggeringValues?: string;
  timestamp: string;
  channel?: string;
  read?: boolean;
}

export interface ToastMessage {
  id: string;
  severity: AlertSeverity;
  zoneId: string;
  condition: string;
  timestamp: string;
}

export interface NotificationPreferences {
  notificationEnabled: boolean;
  warningEnabled: boolean;
  criticalEnabled: boolean;
  deviceEnabled: boolean;
}

export interface ThresholdConfig {
  warning: number;
  critical: number;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface SystemThresholds {
  tilt: ThresholdConfig;
  soilMoisture: ThresholdConfig;
  rainfall: ThresholdConfig;
  vibration: ThresholdConfig;
}

export interface HistoricalDataPoint {
  timestamp: string;
  timeLabel: string;
  tilt: number;
  displacement: number;
  soilMoisture: number;
  rainfall: number;
  vibration: number;
  riskScore: number;
}

export interface LivePacket {
  id: string;
  seq: number;
  timestamp: string;
  deviceId: string;
  zoneId: string;
  rawPayloadHex: string;
  tilt: number;
  moisture: number;
  vibe: number;
  status: 'VALID' | 'CRC_WARN';
}

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  role: 'GEOTECHNICAL_ENGINEER' | 'SITE_SUPERVISOR' | 'DISASTER_COMMANDER' | 'USER' | 'ADMIN' | 'ROLE_ADMIN' | 'ROLE_USER' | string;
  avatarInitials: string;
  assignedZone: string;
}

