import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type {
  AppTheme,
  AppMode,
  ApiStatus,
  WsStatus,
  RiskLevel,
  TimeRange,
  NavigationTab,
  SensorTelemetry,
  HazardZone,
  DeviceNode,
  AlertRecord,
  SystemThresholds,
  HistoricalDataPoint,
  LivePacket,
  UserProfile,
  NotificationEvent,
  ToastMessage,
} from '../types';
import {
  BASELINE_TELEMETRY,
  MOCK_ZONES,
  MOCK_DEVICES,
  INITIAL_ALERTS,
  INITIAL_THRESHOLDS,
  INITIAL_NOTIFICATIONS,
  generateLivePacket,
  generateHistoricalData,
} from '../services/mockData';
import {
  zoneApi,
  deviceApi,
  sensorApi,
  alertApi,
  thresholdApi,
  authApi,
} from '../services/api';
import {
  wsClient,
  subscribeZoneTelemetry,
  subscribeZoneRisk,
  subscribeZoneAlerts,
  subscribeDeviceStatus,
  subscribeAlertUpdates,
  subscribeUserNotifications,
  subscribeAdminNotifications,
} from '../services/websocket';

interface MonitoringContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedZone: HazardZone;
  setSelectedZone: (zone: HazardZone) => void;
  selectZoneById: (zoneId: string) => void;
  currentScenario: RiskLevel;
  setScenario: (level: RiskLevel) => void;
  telemetry: SensorTelemetry;
  chartData: HistoricalDataPoint[];
  zones: HazardZone[];
  devices: DeviceNode[];
  alerts: AlertRecord[];
  thresholds: SystemThresholds;
  updateThresholds: (thresholds: SystemThresholds) => void;
  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;
  isSimulating: boolean;
  toggleSimulation: () => void;
  livePackets: LivePacket[];
  acknowledgeAlert: (alertId: string) => Promise<void> | void;
  resolveAlert: (alertId: string) => Promise<void> | void;
  pingDevice: (deviceId: string) => void;
  pingStatus: { deviceId: string; pingMs: number; status: 'ok' | 'failed' } | null;
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  lastUpdatedSecondsAgo: number;
  theme: AppTheme;
  toggleTheme: () => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  toggleAppMode: () => void;
  apiStatus: ApiStatus;
  wsStatus: WsStatus;
  notifications: NotificationEvent[];
  unreadCount: number;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 1,
  name: 'Marcus Vance',
  email: 'admin@landsafe.io',
  role: 'ADMIN',
  avatarInitials: 'MV',
  assignedZone: 'ZONE-01',
};


const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

export const MonitoringProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [zones, setZones] = useState<HazardZone[]>(MOCK_ZONES);
  const [selectedZone, setSelectedZone] = useState<HazardZone>(MOCK_ZONES[0]);
  const [currentScenario, setCurrentScenario] = useState<RiskLevel>('NORMAL');
  const [telemetry, setTelemetry] = useState<SensorTelemetry>(BASELINE_TELEMETRY.NORMAL);
  const [devices, setDevices] = useState<DeviceNode[]>(MOCK_DEVICES);
  const [alerts, setAlerts] = useState<AlertRecord[]>(INITIAL_ALERTS);
  const [thresholds, setThresholds] = useState<SystemThresholds>(INITIAL_THRESHOLDS);
  const [timeRange, setTimeRange] = useState<TimeRange>('24H');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [livePackets, setLivePackets] = useState<LivePacket[]>([]);
  const [pingStatus, setPingStatus] = useState<{ deviceId: string; pingMs: number; status: 'ok' | 'failed' } | null>(null);
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [lastUpdatedSecondsAgo, setLastUpdatedSecondsAgo] = useState<number>(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationEvent[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastMessage = { ...toast, id };
    setToasts(prev => {
      if (prev.some(t => t.zoneId === toast.zoneId && t.condition === toast.condition)) {
        return prev;
      }
      return [newToast, ...prev.slice(0, 4)];
    });
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`LANDSAFE [${toast.severity}]: ${toast.zoneId}`, {
          body: toast.condition,
          icon: '/favicon.ico',
        });
      } catch (err) {
        console.warn('Native notification error:', err);
      }
    }
  }, []);

  // Fetch current user from API if token exists
  useEffect(() => {
    if (authApi.isAuthenticated()) {
      authApi.getMe().then(u => {
        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatarInitials: u.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
          assignedZone: 'ZONE-01',
        });
        setIsLoggedIn(true);
      }).catch(() => {
        // keep default
      });
    }
  }, []);

  // In-memory chart telemetry buffer
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>(() =>
    generateHistoricalData('24H', 'NORMAL')
  );

  // App Mode (API vs MOCK)
  const [appMode, setAppMode] = useState<AppMode>(() => {
    const envMode = import.meta.env.VITE_APP_MODE as AppMode | undefined;
    const saved = localStorage.getItem('landsafe_app_mode') as AppMode | null;
    return saved || envMode || 'API';
  });
  const [apiStatus, setApiStatus] = useState<ApiStatus>('CONNECTING');
  const [wsStatus, setWsStatus] = useState<WsStatus>('OFFLINE');

  // Theme Management (Light by default, persisted in localStorage)
  const [theme, setTheme] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('landsafe_theme') as AppTheme | null;
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('landsafe_theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const toggleAppMode = useCallback(() => {
    setAppMode(prev => {
      const next = prev === 'API' ? 'MOCK' : 'API';
      localStorage.setItem('landsafe_app_mode', next);
      return next;
    });
  }, []);

  // Fetch initial REST snapshot for dashboard & history
  const fetchApiData = useCallback(async () => {
    try {
      // 1. Fetch Zones
      const apiZones = await zoneApi.getZones();
      if (apiZones && apiZones.length > 0) {
        const mappedZones: HazardZone[] = apiZones.map(z => ({
          id: z.zoneId,
          name: z.name,
          subTitle: z.description,
          risk: z.risk,
          riskScore: z.riskScore,
          advisory: z.advisory,
          primaryDeviceId: `ESP32-${z.zoneId.replace('ZONE-', '')}01`,
          deviceCount: z.deviceCount,
          activeAlertsCount: z.risk === 'CRITICAL' ? 2 : (z.risk === 'WARNING' ? 1 : 0),
          slopeAngle: 38,
          elevation: z.elevation,
          coordinates: { lat: z.latitude, lng: z.longitude },
        }));
        setZones(mappedZones);

        const currentFound = mappedZones.find(z => z.id === selectedZone.id);
        if (currentFound) {
          setSelectedZone(currentFound);
          setCurrentScenario(currentFound.risk);
        }
      }

      // 2. Fetch Latest Telemetry for selectedZone
      try {
        const latestReading = await sensorApi.getLatest(selectedZone.id);
        if (latestReading) {
          setTelemetry(prev => ({
            ...prev,
            timestamp: latestReading.timestamp,
            tilt: Number(latestReading.compositeTilt.toFixed(2)),
            soilMoisture: Number(latestReading.soilMoisture.toFixed(1)),
            rainfall: Number(latestReading.rainfall.toFixed(1)),
            vibration: Number(latestReading.vibration.toFixed(3)),
            battery: latestReading.battery,
            displacement: Number((latestReading.compositeTilt * 1.8).toFixed(2)),
          }));
        }
      } catch {
        // Keep baseline
      }

      // 3. Fetch Historical Data Points for Chart Buffer
      try {
        const history = await sensorApi.getHistory(selectedZone.id);
        if (history && history.length > 0) {
          const mappedHistory: HistoricalDataPoint[] = history.map(r => ({
            timestamp: r.timestamp,
            timeLabel: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            tilt: Number(r.compositeTilt.toFixed(2)),
            displacement: Number((r.compositeTilt * 1.8).toFixed(2)),
            soilMoisture: r.soilMoisture,
            rainfall: r.rainfall,
            vibration: r.vibration,
            riskScore: selectedZone.riskScore || 20,
          }));
          setChartData(mappedHistory.slice(-100));
        } else {
          setChartData(generateHistoricalData(timeRange, selectedZone.risk));
        }
      } catch {
        setChartData(generateHistoricalData(timeRange, selectedZone.risk));
      }

      // 4. Fetch Devices
      try {
        const apiDevices = await deviceApi.getDevices();
        if (apiDevices && apiDevices.length > 0) {
          setDevices(apiDevices.map(d => ({
            id: d.deviceId,
            zoneId: d.zoneId,
            name: `Node ${d.deviceId}`,
            type: 'Multi-Sensor Geotechnical Pod',
            status: d.status,
            lastSeen: d.lastSeen ? new Date(d.lastSeen).toLocaleTimeString() : 'Offline',
            battery: d.batteryLevel ?? 85,
            batteryVoltage: 4.08,
            solarInput: 'Active (4.2V / 380mA)',
            signalRssi: -64,
            firmware: 'v2.4.1-rc3',
            packetsSent: 14208,
            crcErrors: 3,
            uptimeHours: 342,
          })));
        }
      } catch {
        // ignore
      }

      // 5. Fetch Alerts
      try {
        const apiAlerts = await alertApi.getAlerts();
        if (apiAlerts && apiAlerts.length > 0) {
          setAlerts(apiAlerts.map(a => ({
            id: a.id,
            timestamp: a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : 'Recent',
            severity: a.severity,
            condition: a.condition,
            zoneId: a.zoneId,
            deviceId: a.deviceId,
            value: a.value,
            threshold: a.threshold,
            status: a.status,
            protocol: a.protocol,
            acknowledgedAt: a.acknowledgedAt,
            acknowledgedBy: a.acknowledgedBy,
            resolvedAt: a.resolvedAt,
            resolvedBy: a.resolvedBy,
            triggeringValues: a.triggeringValues,
          })));
        }
      } catch {
        // ignore
      }


      // 6. Fetch Thresholds
      try {
        const apiThresholds = await thresholdApi.getThresholds(selectedZone.id);
        if (apiThresholds && apiThresholds.length > 0) {
          setThresholds(prev => {
            const updated = { ...prev };
            for (const t of apiThresholds) {
              if (t.parameter === 'TILT') {
                updated.tilt = { ...updated.tilt, warning: t.warningValue, critical: t.criticalValue };
              } else if (t.parameter === 'SOIL_MOISTURE') {
                updated.soilMoisture = { ...updated.soilMoisture, warning: t.warningValue, critical: t.criticalValue };
              } else if (t.parameter === 'RAINFALL') {
                updated.rainfall = { ...updated.rainfall, warning: t.warningValue, critical: t.criticalValue };
              } else if (t.parameter === 'VIBRATION') {
                updated.vibration = { ...updated.vibration, warning: t.warningValue, critical: t.criticalValue };
              }
            }
            return updated;
          });
        }
      } catch {
        // ignore
      }

      setApiStatus('CONNECTED');
      setLastUpdatedSecondsAgo(0);
    } catch {
      setApiStatus('DISCONNECTED');
    }
  }, [selectedZone.id, selectedZone.risk, selectedZone.riskScore, timeRange]);

  // WebSocket lifecycle & zone subscriptions
  useEffect(() => {
    if (appMode !== 'API') {
      wsClient.disconnect();
      setWsStatus('OFFLINE');
      setApiStatus('DISCONNECTED');
      return;
    }

    // 1. Initial REST snapshot
    fetchApiData();

    // 2. Connect WebSocket Client
    wsClient.connect();

    // 3. Status listener
    const unsubStatus = wsClient.onStatusChange(status => {
      setWsStatus(status);
      if (status === 'LIVE') {
        setApiStatus('CONNECTED');
        // Refresh REST snapshot on reconnect
        fetchApiData();
      } else if (status === 'OFFLINE') {
        setApiStatus('DISCONNECTED');
      }
    });

    // 4. Subscribe to Telemetry for current zone
    const unsubTelemetry = subscribeZoneTelemetry(selectedZone.id, event => {
      const composite = event.compositeTilt || Math.sqrt(event.tiltX ** 2 + event.tiltY ** 2);
      setTelemetry(prev => ({
        ...prev,
        timestamp: event.timestamp,
        tilt: Number(composite.toFixed(2)),
        tiltTrend: Number((composite - prev.tilt).toFixed(2)),
        displacement: Number((composite * 1.8).toFixed(2)),
        displacementRate: composite > 10 ? 3.8 : 0.4,
        soilMoisture: event.soilMoisture,
        soilMoistureTrend: Number((event.soilMoisture - prev.soilMoisture).toFixed(1)),
        rainfall: event.rainfall,
        vibration: event.vibration,
        battery: event.battery,
      }));

      // Append point to in-memory chart buffer (keep max 100 points)
      setChartData(prev => {
        const timeLabel = new Date(event.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        const newPoint: HistoricalDataPoint = {
          timestamp: event.timestamp,
          timeLabel,
          tilt: Number(composite.toFixed(2)),
          displacement: Number((composite * 1.8).toFixed(2)),
          soilMoisture: event.soilMoisture,
          rainfall: event.rainfall,
          vibration: event.vibration,
          riskScore: selectedZone.riskScore || 20,
        };
        return [...prev.slice(-99), newPoint];
      });

      setLastUpdatedSecondsAgo(0);
    });

    // 5. Subscribe to Risk Updates for current zone
    const unsubRisk = subscribeZoneRisk(selectedZone.id, event => {
      setCurrentScenario(event.riskLevel);
      setSelectedZone(prev => ({
        ...prev,
        risk: event.riskLevel,
        riskScore: event.riskIndex,
        advisory: event.reason,
      }));
      setZones(prev =>
        prev.map(z =>
          z.id === event.zoneId
            ? { ...z, risk: event.riskLevel, riskScore: event.riskIndex, advisory: event.reason }
            : z
        )
      );
    });

    // 6. Subscribe to Alerts for current zone (with ID deduplication)
    const unsubAlerts = subscribeZoneAlerts(selectedZone.id, event => {
      setAlerts(prev => {
        if (prev.some(a => a.id === event.eventId)) return prev;
        const newAlert: AlertRecord = {
          id: event.eventId,
          timestamp: 'Just now',
          severity: event.severity,
          condition: event.reason,
          zoneId: event.zoneId,
          deviceId: `CLUSTER-${event.zoneId}`,
          value: `${event.severity} THRESHOLD BREACH`,
          threshold: 'ZONE CALIBRATED LIMIT',
          status: 'ACTIVE',
          protocol:
            event.severity === 'CRITICAL'
              ? 'Immediate siren evacuation and geotechnical ground inspection protocol.'
              : 'Verify drainage pathways and initiate elevated inspection interval.',
        };
        return [newAlert, ...prev];
      });

      addToast({
        severity: event.severity,
        zoneId: event.zoneId,
        condition: event.reason,
        timestamp: 'Just now',
      });
    });

    // 6b. Subscribe to Alert Updates (acknowledgement / resolution across the network)
    const unsubAlertUpdates = subscribeAlertUpdates((updatedAlert: any) => {
      setAlerts(prev => {
        const targetId = updatedAlert.alertId || updatedAlert.id;
        const exists = prev.some(a => a.id === targetId);
        if (exists) {
          return prev.map(a => a.id === targetId ? {
            ...a,
            status: updatedAlert.status || a.status,
            acknowledgedAt: updatedAlert.acknowledgedAt || a.acknowledgedAt,
            acknowledgedBy: updatedAlert.acknowledgedBy || a.acknowledgedBy,
            resolvedAt: updatedAlert.resolvedAt || a.resolvedAt,
            resolvedBy: updatedAlert.resolvedBy || a.resolvedBy,
          } : a);
        }
        return [{
          id: targetId,
          timestamp: 'Just now',
          severity: updatedAlert.severity,
          condition: updatedAlert.condition,
          zoneId: updatedAlert.zoneId,
          deviceId: updatedAlert.deviceId,
          value: updatedAlert.value || '',
          threshold: updatedAlert.threshold || '',
          status: updatedAlert.status,
          protocol: updatedAlert.protocol || '',
          acknowledgedAt: updatedAlert.acknowledgedAt,
          acknowledgedBy: updatedAlert.acknowledgedBy,
          resolvedAt: updatedAlert.resolvedAt,
          resolvedBy: updatedAlert.resolvedBy,
        }, ...prev];
      });
    });

    // 6c. Subscribe to Targeted In-App Notifications
    const notifUnsubs: (() => void)[] = [];
    if (user?.id) {
      const unsubUserNotifs = subscribeUserNotifications(user.id, notif => {
        setNotifications(prev => [
          {
            ...notif,
            read: false,
            timestamp: notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString() : 'Just now',
          },
          ...prev,
        ]);
        if (notif.severity === 'WARNING' || notif.severity === 'CRITICAL' || notif.severity === 'DEVICE_OFFLINE') {
          addToast({
            severity: notif.severity,
            zoneId: notif.zoneId,
            condition: notif.condition || notif.reason,
            timestamp: 'Just now',
          });
        }
      });
      notifUnsubs.push(unsubUserNotifs);
    }

    if (user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN') {
      const unsubAdminNotifs = subscribeAdminNotifications(notif => {
        setNotifications(prev => [
          {
            ...notif,
            read: false,
            timestamp: notif.timestamp ? new Date(notif.timestamp).toLocaleTimeString() : 'Just now',
          },
          ...prev,
        ]);
        if (notif.severity === 'WARNING' || notif.severity === 'CRITICAL' || notif.severity === 'DEVICE_OFFLINE') {
          addToast({
            severity: notif.severity,
            zoneId: notif.zoneId,
            condition: notif.condition || notif.reason,
            timestamp: 'Just now',
          });
        }
      });
      notifUnsubs.push(unsubAdminNotifs);
    }

    // 7. Subscribe to Device Status for each device
    const deviceUnsubs = devices.map(device =>
      subscribeDeviceStatus(device.id, event => {
        setDevices(prev =>
          prev.map(d =>
            d.id === event.deviceId
              ? {
                  ...d,
                  status: event.status,
                  lastSeen: event.lastSeen ? new Date(event.lastSeen).toLocaleTimeString() : 'Offline',
                }
              : d
          )
        );
      })
    );

    return () => {
      unsubStatus();
      unsubTelemetry();
      unsubRisk();
      unsubAlerts();
      unsubAlertUpdates();
      notifUnsubs.forEach(u => u());
      deviceUnsubs.forEach(unsub => unsub());
    };
  }, [appMode, selectedZone.id, fetchApiData, user?.id, user?.role, addToast]);


  // Switch scenario (NORMAL, WARNING, CRITICAL)
  const setScenario = useCallback((level: RiskLevel) => {
    setCurrentScenario(level);
    const base = BASELINE_TELEMETRY[level];
    setTelemetry({
      ...base,
      timestamp: new Date().toISOString(),
    });

    setZones(prev => prev.map(z => {
      if (z.id === selectedZone.id) {
        let score = 18;
        let advisory = 'Slope stable. Ground pore pressure and tilt velocity within nominal baseline limits.';
        if (level === 'WARNING') {
          score = 64;
          advisory = 'Elevated shear strain detected. Sustained precipitation accelerating pore-water saturation.';
        } else if (level === 'CRITICAL') {
          score = 94;
          advisory = 'IMMINENT SHEAR COLLAPSE HAZARD. Slope deformation velocity exceeds 4.5 mm/hr. Sound sirens.';
        }
        return { ...z, risk: level, riskScore: score, advisory };
      }
      return z;
    }));

    if (appMode === 'MOCK') {
      setChartData(generateHistoricalData(timeRange, level));
    }

    setSelectedZone(prev => {
      let score = 18;
      let advisory = 'Slope stable. Ground pore pressure and tilt velocity within nominal baseline limits.';
      if (level === 'WARNING') {
        score = 64;
        advisory = 'Elevated shear strain detected. Sustained precipitation accelerating pore-water saturation.';
      } else if (level === 'CRITICAL') {
        score = 94;
        advisory = 'IMMINENT SHEAR COLLAPSE HAZARD. Slope deformation velocity exceeds 4.5 mm/hr. Sound sirens.';
      }
      return { ...prev, risk: level, riskScore: score, advisory };
    });

    if (level === 'CRITICAL' || level === 'WARNING') {
      const altId = `ALT-${Date.now().toString().slice(-4)}`;
      const isCrit = level === 'CRITICAL';
      const critAlert: AlertRecord = {
        id: altId,
        timestamp: 'Just now',
        severity: level,
        condition: isCrit
          ? 'Severe displacement velocity breach (> 4.5 mm/hr)'
          : 'Elevated pore-pressure and micro-displacement trend',
        zoneId: selectedZone.id,
        deviceId: selectedZone.primaryDeviceId,
        value: isCrit ? '14.7° / 4.8 mm/h' : '6.8° / 0.85 mm/h',
        threshold: isCrit ? '12.0° / 3.0 mm/h' : '5.0° / 0.5 mm/h',
        status: 'ACTIVE',
        protocol: isCrit
          ? 'Deploy geotechnical rapid assessment team and initiate perimeter clearance.'
          : 'Inspect drainage channels and increase measurement frequency.',
      };
      setAlerts(prev => [critAlert, ...prev]);

      setNotifications(prev => [
        {
          alertId: altId,
          zoneId: selectedZone.id,
          deviceId: selectedZone.primaryDeviceId,
          severity: level,
          condition: critAlert.condition,
          reason: critAlert.condition,
          timestamp: 'Just now',
          channel: 'IN_APP',
          read: false,
        },
        ...prev,
      ]);

      addToast({
        severity: level,
        zoneId: selectedZone.id,
        condition: critAlert.condition,
        timestamp: 'Just now',
      });
    }
  }, [selectedZone, appMode, timeRange, addToast]);

  const selectZoneById = useCallback((zoneId: string) => {
    const found = zones.find(z => z.id === zoneId);
    if (found) {
      setSelectedZone(found);
    }
  }, [zones]);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    const nowIso = new Date().toISOString();
    setAlerts(prev => prev.map(a => a.id === alertId ? {
      ...a,
      status: 'ACKNOWLEDGED',
      acknowledgedAt: nowIso,
      acknowledgedBy: user?.name || 'Operator',
    } : a));

    if (appMode === 'API') {
      try {
        const updated = await alertApi.acknowledgeAlert(alertId);
        setAlerts(prev => prev.map(a => a.id === alertId ? {
          ...a,
          status: updated.status,
          acknowledgedAt: updated.acknowledgedAt,
          acknowledgedBy: updated.acknowledgedBy,
        } : a));
      } catch (err) {
        console.warn('Failed to acknowledge alert via API:', err);
      }
    }
  }, [appMode, user]);

  const resolveAlert = useCallback(async (alertId: string) => {
    const nowIso = new Date().toISOString();
    setAlerts(prev => prev.map(a => a.id === alertId ? {
      ...a,
      status: 'RESOLVED',
      resolvedAt: nowIso,
      resolvedBy: user?.name || 'Operator',
    } : a));

    if (appMode === 'API') {
      try {
        const updated = await alertApi.resolveAlert(alertId);
        setAlerts(prev => prev.map(a => a.id === alertId ? {
          ...a,
          status: updated.status,
          resolvedAt: updated.resolvedAt,
          resolvedBy: updated.resolvedBy,
        } : a));
      } catch (err) {
        console.warn('Failed to resolve alert via API:', err);
      }
    }
  }, [appMode, user]);

  const updateThresholds = useCallback((newThresholds: SystemThresholds) => {
    setThresholds(newThresholds);
    if (appMode === 'API') {
      thresholdApi.updateThresholds(selectedZone.id, [
        { parameter: 'TILT', warningValue: newThresholds.tilt.warning, criticalValue: newThresholds.tilt.critical },
        { parameter: 'SOIL_MOISTURE', warningValue: newThresholds.soilMoisture.warning, criticalValue: newThresholds.soilMoisture.critical },
        { parameter: 'RAINFALL', warningValue: newThresholds.rainfall.warning, criticalValue: newThresholds.rainfall.critical },
        { parameter: 'VIBRATION', warningValue: newThresholds.vibration.warning, criticalValue: newThresholds.vibration.critical },
      ]).catch(err => console.warn('Could not persist thresholds to API:', err));
    }
  }, [appMode, selectedZone.id]);

  const toggleSimulation = useCallback(() => {
    setIsSimulating(prev => !prev);
  }, []);

  const pingDevice = useCallback(async (deviceId: string) => {
    setPingStatus(null);
    if (appMode === 'API' && apiStatus === 'CONNECTED') {
      try {
        const start = performance.now();
        await deviceApi.sendHeartbeat(deviceId);
        const pingMs = Math.round(performance.now() - start) || 36;
        setPingStatus({ deviceId, pingMs, status: 'ok' });
        setTimeout(() => setPingStatus(null), 4000);
        return;
      } catch {
        // Fall back to local mock ping
      }
    }
    setTimeout(() => {
      const pingMs = Math.floor(Math.random() * 25) + 38;
      setPingStatus({ deviceId, pingMs, status: 'ok' });
      setTimeout(() => setPingStatus(null), 4000);
    }, 400);
  }, [appMode, apiStatus]);

  const login = useCallback(() => {
    setUser(DEFAULT_USER);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setIsLoggedIn(false);
    setUser(null);
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdatedSecondsAgo(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live packet generator & simulated telemetry jitter (MOCK mode only)
  useEffect(() => {
    if (!isSimulating || appMode !== 'MOCK') return;

    let seqCounter = 1042;
    const interval = setInterval(() => {
      setLastUpdatedSecondsAgo(0);
      seqCounter += 1;
      const newPacket = generateLivePacket(seqCounter, currentScenario);
      setLivePackets(pkts => [newPacket, ...pkts.slice(0, 39)]);

      setTelemetry(prev => {
        const jitterTilt = (Math.random() - 0.49) * 0.04;
        const jitterMoist = (Math.random() - 0.49) * 0.15;
        const jitterVibe = (Math.random() - 0.49) * 0.015;
        const jitterRain = Math.random() > 0.8 ? 0.05 : 0;

        const nextTilt = Number((prev.tilt + jitterTilt).toFixed(2));
        const nextMoist = Number(Math.min(100, Math.max(0, prev.soilMoisture + jitterMoist)).toFixed(1));
        const nextRain = Number((prev.rainfall + jitterRain).toFixed(1));
        const nextVibe = Number(Math.max(0.01, prev.vibration + jitterVibe).toFixed(3));
        const nextDisp = Number((prev.displacement + (prev.displacementRate / 3600) * 2.5).toFixed(2));

        setChartData(cPrev => {
          const timeLabel = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          const newPoint: HistoricalDataPoint = {
            timestamp: new Date().toISOString(),
            timeLabel,
            tilt: nextTilt,
            displacement: nextDisp,
            soilMoisture: nextMoist,
            rainfall: nextRain,
            vibration: nextVibe,
            riskScore: selectedZone.riskScore || 20,
          };
          return [...cPrev.slice(-99), newPoint];
        });

        return {
          ...prev,
          timestamp: new Date().toISOString(),
          tilt: nextTilt,
          soilMoisture: nextMoist,
          rainfall: nextRain,
          vibration: nextVibe,
          displacement: nextDisp,
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating, currentScenario, appMode, selectedZone.riskScore]);

  return (
    <MonitoringContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedZone,
        setSelectedZone,
        selectZoneById,
        currentScenario,
        setScenario,
        telemetry,
        chartData,
        zones,
        devices,
        alerts,
        thresholds,
        updateThresholds,
        timeRange,
        setTimeRange,
        isSimulating,
        toggleSimulation,
        livePackets,
        acknowledgeAlert,
        resolveAlert,
        pingDevice,
        pingStatus,
        user,
        isLoggedIn,
        login,
        logout,
        lastUpdatedSecondsAgo,
        theme,
        toggleTheme,
        appMode,
        setAppMode,
        toggleAppMode,
        apiStatus,
        wsStatus,
        notifications,
        unreadCount,
        markAllNotificationsAsRead,
        clearNotifications,
        toasts,
        dismissToast,
      }}
    >
      {children}
    </MonitoringContext.Provider>

  );
};

export const useMonitoring = () => {
  const context = useContext(MonitoringContext);
  if (!context) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
};
