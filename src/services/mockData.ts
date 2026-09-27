import type {
  SensorTelemetry,
  HazardZone,
  DeviceNode,
  AlertRecord,
  SystemThresholds,
  HistoricalDataPoint,
  LivePacket,
  RiskLevel,
  TimeRange,
  NotificationEvent,
} from '../types';

export const INITIAL_NOTIFICATIONS: NotificationEvent[] = [
  {
    alertId: 'ALT-1092',
    zoneId: 'ZONE-02',
    deviceId: 'ESP32-003',
    severity: 'WARNING',
    condition: 'Soil moisture exceeded Warning limit',
    reason: 'Subsurface moisture saturation at 84% exceeds calibrated 80% threshold.',
    timestamp: '12 min ago',
    channel: 'IN_APP',
    read: false,
  },
  {
    alertId: 'ALT-1089',
    zoneId: 'ZONE-02',
    deviceId: 'ESP32-003',
    severity: 'WARNING',
    condition: 'Elevated sustained micro-vibrations',
    reason: 'Continuous acoustic emissions detected at 0.54g.',
    timestamp: '48 min ago',
    channel: 'IN_APP',
    read: false,
  },
  {
    alertId: 'ALT-1077',
    zoneId: 'ZONE-01',
    deviceId: 'ESP32-001',
    severity: 'WARNING',
    condition: 'Precipitation intensity surge',
    reason: 'Precipitation rate 16.5 mm/hr detected.',
    timestamp: '14 hr ago',
    channel: 'IN_APP',
    read: true,
  },
];


export const INITIAL_THRESHOLDS: SystemThresholds = {
  tilt: { warning: 5.0, critical: 12.0, unit: '°', min: 0, max: 30, step: 0.1 },
  soilMoisture: { warning: 80, critical: 92, unit: '%', min: 0, max: 100, step: 1 },
  rainfall: { warning: 35, critical: 75, unit: 'mm/24h', min: 0, max: 200, step: 1 },
  vibration: { warning: 0.5, critical: 1.2, unit: 'g', min: 0, max: 3.0, step: 0.05 },
};

export const MOCK_ZONES: HazardZone[] = [
  {
    id: 'ZONE-01',
    name: 'North Ridge Incline',
    subTitle: 'Upper Colluvial Slope',
    risk: 'NORMAL',
    riskScore: 18,
    advisory: 'Slope stable. Pore-water pressure and angular tilt velocity within nominal baseline limits.',
    primaryDeviceId: 'ESP32-001',
    deviceCount: 3,
    activeAlertsCount: 0,
    slopeAngle: 28.5,
    elevation: 842,
    coordinates: { lat: 34.0522, lng: -118.2437 },
  },
  {
    id: 'ZONE-02',
    name: 'Debris Basin Catchment',
    subTitle: 'Runout Channel Drainage',
    risk: 'WARNING',
    riskScore: 62,
    advisory: 'High sediment runoff detected. Saturated sub-stratum approaching fluidization boundary.',
    primaryDeviceId: 'ESP32-003',
    deviceCount: 2,
    activeAlertsCount: 2,
    slopeAngle: 18.2,
    elevation: 610,
    coordinates: { lat: 34.0589, lng: -118.2512 },
  },
  {
    id: 'ZONE-03',
    name: 'South Escarpment',
    subTitle: 'Fractured Sandstone Cliff',
    risk: 'NORMAL',
    riskScore: 24,
    advisory: 'Low acoustic emission activity. Rockfall mesh sensors reporting zero displacement.',
    primaryDeviceId: 'ESP32-004',
    deviceCount: 2,
    activeAlertsCount: 0,
    slopeAngle: 42.0,
    elevation: 915,
    coordinates: { lat: 34.0465, lng: -118.2389 },
  },
];

export const MOCK_DEVICES: DeviceNode[] = [
  {
    id: 'ESP32-001',
    zoneId: 'ZONE-01',
    name: 'North Ridge Master Node',
    type: 'Dual-Axis Inclinometer + Gateway',
    status: 'ONLINE',
    lastSeen: '1s ago',
    battery: 91,
    batteryVoltage: 4.12,
    solarInput: '14.2 W',
    signalRssi: -64,
    firmware: 'v2.4.1-esp32',
    packetsSent: 48920,
    crcErrors: 3,
    uptimeHours: 342,
  },
  {
    id: 'ESP32-002',
    zoneId: 'ZONE-01',
    name: 'Deep Borehole Piezometer',
    type: 'Pore Pressure & Soil Sensor Array',
    status: 'ONLINE',
    lastSeen: '3s ago',
    battery: 88,
    batteryVoltage: 4.05,
    solarInput: '12.8 W',
    signalRssi: -71,
    firmware: 'v2.4.1-esp32',
    packetsSent: 48890,
    crcErrors: 5,
    uptimeHours: 342,
  },
  {
    id: 'ESP32-003',
    zoneId: 'ZONE-02',
    name: 'Debris Basin Acoustic Station',
    type: 'High-Freq Hydrophone & Rain Gauge',
    status: 'ONLINE',
    lastSeen: '2s ago',
    battery: 79,
    batteryVoltage: 3.98,
    solarInput: '7.5 W (Clouded)',
    signalRssi: -68,
    firmware: 'v2.4.0-esp32',
    packetsSent: 32110,
    crcErrors: 12,
    uptimeHours: 218,
  },
  {
    id: 'ESP32-004',
    zoneId: 'ZONE-03',
    name: 'South Cliff Seismic Node',
    type: 'Tri-Axial MEMS Accelerometer',
    status: 'STANDBY',
    lastSeen: '14s ago',
    battery: 94,
    batteryVoltage: 4.18,
    solarInput: '15.1 W',
    signalRssi: -82,
    firmware: 'v2.4.1-esp32',
    packetsSent: 15400,
    crcErrors: 1,
    uptimeHours: 190,
  },
  {
    id: 'ESP32-005',
    zoneId: 'ZONE-01',
    name: 'Extensometer Surface Node',
    type: 'Displacement Wire Sensor',
    status: 'ONLINE',
    lastSeen: '4s ago',
    battery: 84,
    batteryVoltage: 4.01,
    solarInput: '13.0 W',
    signalRssi: -74,
    firmware: 'v2.4.1-esp32',
    packetsSent: 28400,
    crcErrors: 4,
    uptimeHours: 310,
  },
];

export const INITIAL_ALERTS: AlertRecord[] = [
  {
    id: 'ALT-1092',
    timestamp: '12 min ago',
    severity: 'WARNING',
    condition: 'Soil moisture exceeded Warning limit (84% > 80%)',
    zoneId: 'ZONE-02',
    deviceId: 'ESP32-003',
    value: '84%',
    threshold: '80%',
    status: 'ACTIVE',
    protocol: 'Alert maintenance crew to inspect hillside drainage culvert.',
  },
  {
    id: 'ALT-1089',
    timestamp: '48 min ago',
    severity: 'WARNING',
    condition: 'Elevated sustained micro-vibrations (0.54g > 0.50g)',
    zoneId: 'ZONE-02',
    deviceId: 'ESP32-003',
    value: '0.54 g',
    threshold: '0.50 g',
    status: 'ACKNOWLEDGED',
    protocol: 'Continuous acoustic monitoring logged for seismic frequency shift.',
  },
  {
    id: 'ALT-1084',
    timestamp: '3 hr ago',
    severity: 'NORMAL',
    condition: 'Solar array charge nominal - Battery restored to 91%',
    zoneId: 'ZONE-01',
    deviceId: 'ESP32-001',
    value: '91%',
    threshold: '30%',
    status: 'RESOLVED',
    protocol: 'System routine auto-cleared.',
  },
  {
    id: 'ALT-1077',
    timestamp: '14 hr ago',
    severity: 'WARNING',
    condition: 'Precipitation intensity surge: 16.5 mm/hr detected',
    zoneId: 'ZONE-01',
    deviceId: 'ESP32-001',
    value: '16.5 mm/h',
    threshold: '15.0 mm/h',
    status: 'RESOLVED',
    protocol: 'Storm front passed. Ground saturation level stabilizing.',
  },
  {
    id: 'ALT-1065',
    timestamp: '1 day ago',
    severity: 'CRITICAL',
    condition: 'Sudden shear strain acceleration (3.8 mm/hr) during storm crest',
    zoneId: 'ZONE-01',
    deviceId: 'ESP32-005',
    value: '3.8 mm/h',
    threshold: '3.0 mm/h',
    status: 'RESOLVED',
    protocol: 'Highway 102 precautionary lane closure completed. Resumed nominal.',
  }
];

export const BASELINE_TELEMETRY: Record<RiskLevel, SensorTelemetry> = {
  NORMAL: {
    timestamp: new Date().toISOString(),
    tilt: 2.4,
    tiltTrend: 0.02,
    displacement: 4.8,
    displacementRate: 0.04,
    soilMoisture: 67,
    soilMoistureTrend: 0.8,
    rainfall: 18,
    rainfallRate: 1.2,
    vibration: 0.21,
    vibrationTrend: -0.01,
    battery: 91,
    batteryVoltage: 4.12,
    solarCharging: true,
    solarPower: 14.2,
    temperature: 21.4,
    humidity: 78,
  },
  WARNING: {
    timestamp: new Date().toISOString(),
    tilt: 6.8,
    tiltTrend: 0.35,
    displacement: 18.4,
    displacementRate: 0.85,
    soilMoisture: 84,
    soilMoistureTrend: 3.2,
    rainfall: 54,
    rainfallRate: 14.8,
    vibration: 0.58,
    vibrationTrend: 0.12,
    battery: 88,
    batteryVoltage: 4.04,
    solarCharging: true,
    solarPower: 4.8,
    temperature: 18.2,
    humidity: 92,
  },
  CRITICAL: {
    timestamp: new Date().toISOString(),
    tilt: 14.7,
    tiltTrend: 1.45,
    displacement: 46.5,
    displacementRate: 4.80,
    soilMoisture: 96,
    soilMoistureTrend: 6.5,
    rainfall: 112,
    rainfallRate: 38.5,
    vibration: 1.42,
    vibrationTrend: 0.45,
    battery: 82,
    batteryVoltage: 3.92,
    solarCharging: false,
    solarPower: 0.4,
    temperature: 16.5,
    humidity: 98,
  }
};

export function generateHistoricalData(range: TimeRange, scenario: RiskLevel): HistoricalDataPoint[] {
  let count = 24;
  let intervalMinutes = 60;

  switch (range) {
    case '2H':
      count = 24;
      intervalMinutes = 5;
      break;
    case '6H':
      count = 36;
      intervalMinutes = 10;
      break;
    case '24H':
      count = 24;
      intervalMinutes = 60;
      break;
    case '7D':
      count = 28;
      intervalMinutes = 360;
      break;
    case 'CUSTOM':
      count = 30;
      intervalMinutes = 45;
      break;
  }

  const base = BASELINE_TELEMETRY[scenario];
  const now = Date.now();
  const data: HistoricalDataPoint[] = [];

  for (let i = count - 1; i >= 0; i--) {
    const t = new Date(now - i * intervalMinutes * 60 * 1000);
    const progress = 1 - (i / count);
    
    const noise = Math.sin(i * 0.4) * 0.1;
    const trendFactor = scenario === 'CRITICAL' ? Math.pow(progress, 2.2) : progress * 0.3;

    const tilt = Number(Math.max(1.8, (base.tilt * (0.8 + trendFactor * 0.4)) + noise).toFixed(2));
    const displacement = Number(Math.max(1.0, (base.displacement * (0.6 + trendFactor * 0.7)) + noise * 2).toFixed(1));
    const soilMoisture = Number(Math.min(99, Math.max(40, (base.soilMoisture * (0.85 + trendFactor * 0.25)) + Math.sin(i * 0.7) * 2)).toFixed(1));
    const rainfall = Number(Math.max(0, (base.rainfall * (0.3 + trendFactor * 0.8)) + Math.cos(i * 0.5) * 1.5).toFixed(1));
    const vibration = Number(Math.max(0.1, (base.vibration * (0.7 + trendFactor * 0.6)) + (Math.random() * 0.06 - 0.03)).toFixed(3));

    let riskScore = Math.round(
      (tilt / 15) * 35 +
      (soilMoisture / 100) * 30 +
      (rainfall / 120) * 20 +
      (vibration / 1.5) * 15
    );
    riskScore = Math.min(100, Math.max(5, riskScore));

    const hours = t.getHours().toString().padStart(2, '0');
    const mins = t.getMinutes().toString().padStart(2, '0');
    const day = t.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const timeLabel = range === '7D' ? `${day} ${hours}:00` : `${hours}:${mins}`;

    data.push({
      timestamp: t.toISOString(),
      timeLabel,
      tilt,
      displacement,
      soilMoisture,
      rainfall,
      vibration,
      riskScore,
    });
  }

  return data;
}

export function generateLivePacket(seq: number, scenario: RiskLevel): LivePacket {
  const base = BASELINE_TELEMETRY[scenario];
  const jitter = (Math.random() - 0.5) * 0.1;
  const hexChars = '0123456789ABCDEF';
  let hex = '4C53';
  for (let i = 0; i < 16; i++) {
    hex += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
  }

  return {
    id: `PKT-${seq}`,
    seq,
    timestamp: new Date().toLocaleTimeString(),
    deviceId: 'ESP32-001',
    zoneId: 'ZONE-01',
    rawPayloadHex: hex,
    tilt: Number((base.tilt + jitter).toFixed(2)),
    moisture: Number((base.soilMoisture + jitter * 2).toFixed(1)),
    vibe: Number((base.vibration + jitter * 0.05).toFixed(3)),
    status: Math.random() > 0.03 ? 'VALID' : 'CRC_WARN',
  };
}

export function exportToCSV(data: HistoricalDataPoint[], zoneId: string = 'ZONE-01') {
  const headers = [
    'Timestamp',
    'Zone_ID',
    'Primary_Device',
    'Ground_Tilt_Deg',
    'Displacement_mm',
    'Soil_Moisture_Pct',
    'Rainfall_Accum_mm',
    'Vibration_g',
    'Risk_Index_Score'
  ];

  const rows = data.map((d) => [
    `"${d.timestamp}"`,
    zoneId,
    'ESP32-001',
    d.tilt,
    d.displacement,
    d.soilMoisture,
    d.rainfall,
    d.vibration,
    d.riskScore
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `landsafe_${zoneId.toLowerCase()}_telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
