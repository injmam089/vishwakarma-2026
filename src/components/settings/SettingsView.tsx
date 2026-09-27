import React, { useState, useEffect } from 'react';
import { useMonitoring } from '../../context/MonitoringContext';
import type { SystemThresholds } from '../../types';
import { subscriptionApi } from '../../services/api';
import {
  Sliders,
  CheckCircle,
  Save,
  Volume2,
  Mail,
  Smartphone,
  Bell,
  Radio,
  CheckCheck,
  Globe,
} from 'lucide-react';


export const SettingsView: React.FC = () => {
  const { thresholds, updateThresholds, zones, selectedZone, appMode } = useMonitoring();

  const [formThresholds, setFormThresholds] = useState<SystemThresholds>(thresholds);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [activeSection, setActiveSection] = useState<'thresholds' | 'zones' | 'devices' | 'notifications'>('thresholds');

  const [samplingRate, setSamplingRate] = useState('2s');
  const [lowPowerMode, setLowPowerMode] = useState(false);

  const [emergencySms, setEmergencySms] = useState('+1 (555) 019-2834, +1 (555) 019-8821');
  const [emergencyEmail, setEmergencyEmail] = useState('hazard-dispatch@geomonitor.org, alert-team@county.gov');
  const [audibleBuzzer, setAudibleBuzzer] = useState(true);

  // Phase 4 Notification Preferences
  const [prefWarning, setPrefWarning] = useState(true);
  const [prefCritical, setPrefCritical] = useState(true);
  const [prefDevice, setPrefDevice] = useState(true);
  const [browserPushEnabled, setBrowserPushEnabled] = useState(() => {
    return typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted';
  });
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefSaveMsg, setPrefSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (appMode === 'API') {
      subscriptionApi.getMySubscriptions().then(subs => {
        const found = subs.find(s => s.zoneId === selectedZone.id);
        if (found) {
          if (found.warningEnabled !== undefined) setPrefWarning(found.warningEnabled);
          if (found.criticalEnabled !== undefined) setPrefCritical(found.criticalEnabled);
          if (found.deviceEnabled !== undefined) setPrefDevice(found.deviceEnabled);
        }
      }).catch(err => console.warn('Could not load subscriptions:', err));
    }
  }, [appMode, selectedZone.id]);

  const handleTogglePreference = async (key: 'warning' | 'critical' | 'device', value: boolean) => {
    const nextWarning = key === 'warning' ? value : prefWarning;
    const nextCritical = key === 'critical' ? value : prefCritical;
    const nextDevice = key === 'device' ? value : prefDevice;

    if (key === 'warning') setPrefWarning(value);
    if (key === 'critical') setPrefCritical(value);
    if (key === 'device') setPrefDevice(value);

    if (appMode === 'API') {
      try {
        setPrefSaving(true);
        await subscriptionApi.updatePreferences(selectedZone.id, {
          notificationEnabled: true,
          warningEnabled: nextWarning,
          criticalEnabled: nextCritical,
          deviceEnabled: nextDevice,
        });
        setPrefSaveMsg('Preferences saved to database');
        setTimeout(() => setPrefSaveMsg(null), 3000);
      } catch (err) {
        console.warn('Failed to update preferences:', err);
      } finally {
        setPrefSaving(false);
      }
    }
  };

  const handleToggleBrowserPush = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Browser notifications are not supported in this browser environment.');
      return;
    }

    if (Notification.permission === 'granted') {
      setBrowserPushEnabled(!browserPushEnabled);
    } else if (Notification.permission === 'denied') {
      alert('Browser notifications have been blocked in your browser site settings. Please enable them in your browser URL bar.');
    } else {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setBrowserPushEnabled(true);
        new Notification('LANDSAFE Alert System', {
          body: 'Browser push notifications successfully activated for emergency hazard events.',
          icon: '/favicon.ico',
        });
      } else {
        setBrowserPushEnabled(false);
      }
    }
  };

  const handleSaveThresholds = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholds(formThresholds);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };


  return (
    <div className="space-y-5 lg:space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800/80 shadow-card-light dark:shadow-none transition-colors duration-150">
        <div>
          <h2 className="text-[18px] font-semibold font-sans text-[#111827] dark:text-zinc-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#0F766E] dark:text-emerald-400" />
            SYSTEM CONFIGURATION & SAFETY PROTOCOLS
          </h2>
          <p className="text-[13px] text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">
            Geotechnical threshold triggers, zone allocation, hardware rates, and alert routing
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveSection('thresholds')}
            className={`px-3 py-1.5 rounded-md text-[13px] font-sans font-medium transition-all ${
              activeSection === 'thresholds'
                ? 'bg-white text-[#111827] border border-[#E2E8F0] shadow-sm dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'
                : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200'
            }`}
          >
            Thresholds
          </button>
          <button
            onClick={() => setActiveSection('zones')}
            className={`px-3 py-1.5 rounded-md text-[13px] font-sans font-medium transition-all ${
              activeSection === 'zones'
                ? 'bg-white text-[#111827] border border-[#E2E8F0] shadow-sm dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'
                : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200'
            }`}
          >
            Zones
          </button>
          <button
            onClick={() => setActiveSection('devices')}
            className={`px-3 py-1.5 rounded-md text-[13px] font-sans font-medium transition-all ${
              activeSection === 'devices'
                ? 'bg-white text-[#111827] border border-[#E2E8F0] shadow-sm dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'
                : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200'
            }`}
          >
            Hardware
          </button>
          <button
            onClick={() => setActiveSection('notifications')}
            className={`px-3 py-1.5 rounded-md text-[13px] font-sans font-medium transition-all ${
              activeSection === 'notifications'
                ? 'bg-white text-[#111827] border border-[#E2E8F0] shadow-sm dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'
                : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200'
            }`}
          >
            Dispatch
          </button>
        </div>
      </div>

      {activeSection === 'thresholds' && (
        <form onSubmit={handleSaveThresholds} className="space-y-5">
          <div className="p-3.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-[13px] font-sans text-amber-900 dark:text-amber-300 flex items-center justify-between">
            <span className="font-medium">
              PROTOTYPE SAFETY LIMITS: Values immediately govern visual alarm badges and live risk calculation.
            </span>
            <span className="text-xs font-mono text-amber-700 dark:text-zinc-400 font-semibold uppercase">NON-PERMANENT CONFIG</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800/80 shadow-card-light dark:shadow-none space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-zinc-800/80 pb-2.5">
                <span className="font-sans font-semibold text-sm text-[#111827] dark:text-zinc-100 uppercase tracking-wide">
                  GROUND TILT THRESHOLD
                </span>
                <span className="text-xs font-mono text-[#6B7280] dark:text-zinc-400">Unit: {formThresholds.tilt.unit}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#D97706] dark:text-amber-400 font-sans font-medium">Warning Limit:</span>
                    <span className="text-[#111827] dark:text-zinc-200 font-mono font-bold">{formThresholds.tilt.warning}°</span>
                  </div>
                  <input
                    type="range"
                    min={formThresholds.tilt.min}
                    max={formThresholds.tilt.max}
                    step={formThresholds.tilt.step}
                    value={formThresholds.tilt.warning}
                    onChange={(e) =>
                      setFormThresholds({
                        ...formThresholds,
                        tilt: { ...formThresholds.tilt, warning: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#DC2626] dark:text-rose-400 font-sans font-medium">Critical Limit:</span>
                    <span className="text-[#111827] dark:text-zinc-200 font-mono font-bold">{formThresholds.tilt.critical}°</span>
                  </div>
                  <input
                    type="range"
                    min={formThresholds.tilt.min}
                    max={formThresholds.tilt.max}
                    step={formThresholds.tilt.step}
                    value={formThresholds.tilt.critical}
                    onChange={(e) =>
                      setFormThresholds({
                        ...formThresholds,
                        tilt: { ...formThresholds.tilt, critical: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800/80 shadow-card-light dark:shadow-none space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-zinc-800/80 pb-2.5">
                <span className="font-sans font-semibold text-sm text-[#111827] dark:text-zinc-100 uppercase tracking-wide">
                  SOIL SATURATION THRESHOLD
                </span>
                <span className="text-xs font-mono text-[#6B7280] dark:text-zinc-400">Unit: {formThresholds.soilMoisture.unit}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#D97706] dark:text-amber-400 font-sans font-medium">Warning Saturation:</span>
                    <span className="text-[#111827] dark:text-zinc-200 font-mono font-bold">{formThresholds.soilMoisture.warning}%</span>
                  </div>
                  <input
                    type="range"
                    min={formThresholds.soilMoisture.min}
                    max={formThresholds.soilMoisture.max}
                    step={formThresholds.soilMoisture.step}
                    value={formThresholds.soilMoisture.warning}
                    onChange={(e) =>
                      setFormThresholds({
                        ...formThresholds,
                        soilMoisture: { ...formThresholds.soilMoisture, warning: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#DC2626] dark:text-rose-400 font-sans font-medium">Critical Fluidization:</span>
                    <span className="text-[#111827] dark:text-zinc-200 font-mono font-bold">{formThresholds.soilMoisture.critical}%</span>
                  </div>
                  <input
                    type="range"
                    min={formThresholds.soilMoisture.min}
                    max={formThresholds.soilMoisture.max}
                    step={formThresholds.soilMoisture.step}
                    value={formThresholds.soilMoisture.critical}
                    onChange={(e) =>
                      setFormThresholds({
                        ...formThresholds,
                        soilMoisture: { ...formThresholds.soilMoisture, critical: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800/80 shadow-card-light dark:shadow-none space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-zinc-800/80 pb-2.5">
                <span className="font-sans font-semibold text-sm text-[#111827] dark:text-zinc-100 uppercase tracking-wide">
                  RAINFALL ACCUMULATION THRESHOLD
                </span>
                <span className="text-xs font-mono text-[#6B7280] dark:text-zinc-400">Unit: {formThresholds.rainfall.unit}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#D97706] dark:text-amber-400 font-sans font-medium">Warning Precip:</span>
                    <span className="text-[#111827] dark:text-zinc-200 font-mono font-bold">{formThresholds.rainfall.warning} mm</span>
                  </div>
                  <input
                    type="range"
                    min={formThresholds.rainfall.min}
                    max={formThresholds.rainfall.max}
                    step={formThresholds.rainfall.step}
                    value={formThresholds.rainfall.warning}
                    onChange={(e) =>
                      setFormThresholds({
                        ...formThresholds,
                        rainfall: { ...formThresholds.rainfall, warning: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#DC2626] dark:text-rose-400 font-sans font-medium">Torrential Inundation:</span>
                    <span className="text-[#111827] dark:text-zinc-200 font-mono font-bold">{formThresholds.rainfall.critical} mm</span>
                  </div>
                  <input
                    type="range"
                    min={formThresholds.rainfall.min}
                    max={formThresholds.rainfall.max}
                    step={formThresholds.rainfall.step}
                    value={formThresholds.rainfall.critical}
                    onChange={(e) =>
                      setFormThresholds({
                        ...formThresholds,
                        rainfall: { ...formThresholds.rainfall, critical: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800/80 shadow-card-light dark:shadow-none space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-zinc-800/80 pb-2.5">
                <span className="font-sans font-semibold text-sm text-[#111827] dark:text-zinc-100 uppercase tracking-wide">
                  MICROSEISMIC ACCELERATION THRESHOLD
                </span>
                <span className="text-xs font-mono text-[#6B7280] dark:text-zinc-400">Unit: {formThresholds.vibration.unit}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#D97706] dark:text-amber-400 font-sans font-medium">Warning Acceleration:</span>
                    <span className="text-[#111827] dark:text-zinc-200 font-mono font-bold">{formThresholds.vibration.warning} g</span>
                  </div>
                  <input
                    type="range"
                    min={formThresholds.vibration.min}
                    max={formThresholds.vibration.max}
                    step={formThresholds.vibration.step}
                    value={formThresholds.vibration.warning}
                    onChange={(e) =>
                      setFormThresholds({
                        ...formThresholds,
                        vibration: { ...formThresholds.vibration, warning: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#DC2626] dark:text-rose-400 font-sans font-medium">Critical Impact/Collapse:</span>
                    <span className="text-[#111827] dark:text-zinc-200 font-mono font-bold">{formThresholds.vibration.critical} g</span>
                  </div>
                  <input
                    type="range"
                    min={formThresholds.vibration.min}
                    max={formThresholds.vibration.max}
                    step={formThresholds.vibration.step}
                    value={formThresholds.vibration.critical}
                    onChange={(e) =>
                      setFormThresholds({
                        ...formThresholds,
                        vibration: { ...formThresholds.vibration, critical: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {saveSuccess && (
              <span className="text-xs font-sans text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                <CheckCircle className="w-4 h-4" />
                THRESHOLDS PERSISTED SUCCESSFULLY
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-sans font-semibold text-xs transition-all shadow-sm"
            >
              <Save className="w-4 h-4" />
              SAVE THRESHOLDS
            </button>
          </div>
        </form>
      )}

      {activeSection === 'zones' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="p-5 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800/80 shadow-card-light dark:shadow-none space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-[#111827] dark:text-zinc-100">{zone.id}</span>
                <span
                  className={`text-xs font-sans px-2.5 py-0.5 rounded font-semibold ${
                    zone.risk === 'CRITICAL'
                      ? 'bg-rose-50 text-[#DC2626] border border-rose-200 dark:bg-rose-950 dark:text-rose-400'
                      : zone.risk === 'WARNING'
                      ? 'bg-amber-50 text-[#D97706] border border-amber-200 dark:bg-amber-950 dark:text-amber-400'
                      : 'bg-emerald-50 text-[#16A34A] border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400'
                  }`}
                >
                  {zone.risk}
                </span>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-[#111827] dark:text-zinc-200">{zone.name}</h3>
                <p className="text-xs text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">{zone.subTitle}</p>
              </div>

              <div className="pt-2.5 border-t border-[#E2E8F0] dark:border-zinc-800/80 text-xs font-sans text-[#4B5563] dark:text-zinc-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Slope Incline:</span>
                  <span className="font-mono font-medium text-[#111827]">{zone.slopeAngle}°</span>
                </div>
                <div className="flex justify-between">
                  <span>Elevation:</span>
                  <span className="font-mono font-medium text-[#111827]">{zone.elevation} m MSL</span>
                </div>
                <div className="flex justify-between">
                  <span>Installed Nodes:</span>
                  <span className="font-mono font-medium text-[#111827]">{zone.deviceCount} ESP32 strings</span>
                </div>
                <div className="flex justify-between">
                  <span>Coordinates:</span>
                  <span className="font-mono font-medium text-[#111827]">{zone.coordinates.lat.toFixed(4)}, {zone.coordinates.lng.toFixed(4)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'devices' && (
        <div className="p-6 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800/80 shadow-card-light dark:shadow-none space-y-6">
          <div className="border-b border-[#E2E8F0] dark:border-zinc-800 pb-3">
            <h3 className="font-sans font-semibold text-sm text-[#111827] dark:text-zinc-100 uppercase tracking-wide">
              ESP32 FIRMWARE & TELEMETRY INGRESS
            </h3>
            <p className="text-[13px] text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">
              UART/LoRaWAN radio baud rates, reporting frequency, and sleep states
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-sans font-semibold text-[#4B5563] dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                Sensor Sampling & Transmission Rate
              </label>
              <select
                value={samplingRate}
                onChange={(e) => setSamplingRate(e.target.value)}
                className="w-full bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-[#111827] dark:text-zinc-200 focus:outline-none focus:border-[#0F766E]"
              >
                <option value="1s">1 second (High-rate event capture)</option>
                <option value="2.5s">2.5 seconds (Standard continuous telemetry)</option>
                <option value="10s">10 seconds (Moderate power save)</option>
                <option value="60s">60 seconds (Extended battery reserve)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans font-semibold text-[#4B5563] dark:text-zinc-400 mb-1.5 uppercase tracking-wider">
                Low-Power Sleep Protocol
              </label>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 text-xs font-sans">
                <span className="text-[#111827] dark:text-zinc-300 font-medium">Enable Deep-Sleep on Low Solar</span>
                <input
                  type="checkbox"
                  checked={lowPowerMode}
                  onChange={(e) => setLowPowerMode(e.target.checked)}
                  className="rounded bg-white border-gray-300 text-teal-600 focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'notifications' && (
        <div className="space-y-6">
          {/* Zone Hazard Subscriptions */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800/80 shadow-card-light dark:shadow-none space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] dark:border-zinc-800 pb-3">
              <div>
                <h3 className="font-sans font-semibold text-sm text-[#111827] dark:text-zinc-100 uppercase tracking-wide flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#0F766E] dark:text-emerald-400" />
                  SECTOR ALERT PREFERENCES · {selectedZone.id}
                </h3>
                <p className="text-[13px] text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">
                  Custom subscription triggers for {selectedZone.name}
                </p>
              </div>
              {prefSaving && (
                <span className="flex items-center gap-1 text-xs text-[#6B7280] dark:text-zinc-400 font-medium">
                  Saving...
                </span>
              )}
              {prefSaveMsg && !prefSaving && (
                <span className="flex items-center gap-1 text-xs text-[#0F766E] dark:text-emerald-400 font-medium animate-in fade-in">
                  <CheckCheck className="w-3.5 h-3.5" />
                  {prefSaveMsg}
                </span>
              )}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Critical Toggle */}
              <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
                      CRITICAL ALERTS
                    </span>
                    <input
                      type="checkbox"
                      checked={prefCritical}
                      onChange={(e) => handleTogglePreference('critical', e.target.checked)}
                      className="rounded bg-white border-red-300 text-red-600 focus:ring-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-[12px] text-red-900/80 dark:text-red-300/80 leading-relaxed font-sans">
                    Immediate siren and emergency evacuation notifications on slope failure velocity.
                  </p>
                </div>
              </div>

              {/* Warning Toggle */}
              <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      WARNING ALERTS
                    </span>
                    <input
                      type="checkbox"
                      checked={prefWarning}
                      onChange={(e) => handleTogglePreference('warning', e.target.checked)}
                      className="rounded bg-white border-amber-300 text-amber-600 focus:ring-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-[12px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed font-sans">
                    Early hazard advisory when pore pressure or ground displacement trends accelerate.
                  </p>
                </div>
              </div>

              {/* Device Failure Toggle */}
              <div className="p-3.5 rounded-xl border border-orange-200 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-950/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-700 dark:text-orange-400">
                      NODE TELEMETRY ALERTS
                    </span>
                    <input
                      type="checkbox"
                      checked={prefDevice}
                      onChange={(e) => handleTogglePreference('device', e.target.checked)}
                      className="rounded bg-white border-orange-300 text-orange-600 focus:ring-0 cursor-pointer"
                    />
                  </div>
                  <p className="text-[12px] text-orange-900/80 dark:text-orange-300/80 leading-relaxed font-sans">
                    Operational notifications when sensor pods drop heartbeat (90s) or recover.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Channel Delivery Channels */}
          <div className="p-6 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800/80 shadow-card-light dark:shadow-none space-y-5">
            <div className="border-b border-[#E2E8F0] dark:border-zinc-800 pb-3">
              <h3 className="font-sans font-semibold text-sm text-[#111827] dark:text-zinc-100 uppercase tracking-wide">
                MULTI-CHANNEL NOTIFICATION ROUTING
              </h3>
              <p className="text-[13px] text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">
                Delivery protocol status across In-App, Browser Web Push, and Disaster Center
              </p>
            </div>

            <div className="space-y-4">
              {/* In-App Channel */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-50 dark:bg-emerald-950/40 border border-teal-200 dark:border-emerald-800/40 text-[#0F766E] dark:text-emerald-400">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-sans font-semibold text-[#111827] dark:text-zinc-200">
                      IN-APP STOMP WEBSOCKET STREAM
                    </div>
                    <div className="text-xs text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">
                      Targeted real-time notification queue (/topic/users/{'{userId}'}/notifications)
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-[#16A34A] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                  ALWAYS ON
                </span>
              </div>

              {/* Browser Push */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-sans font-semibold text-[#111827] dark:text-zinc-200">
                      DESKTOP BROWSER NOTIFICATIONS
                    </div>
                    <div className="text-xs text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">
                      OS-level alerts when tab is in background (activated via user action only)
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleBrowserPush}
                  className={`px-3 py-1 rounded-lg text-xs font-sans font-semibold transition-all ${
                    browserPushEnabled
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#16A34A] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-white dark:bg-zinc-800 text-[#4B5563] dark:text-zinc-300 border border-[#E2E8F0] dark:border-zinc-700 hover:bg-gray-50'
                  }`}
                >
                  {browserPushEnabled ? 'Enabled' : 'Request Permission'}
                </button>
              </div>

              {/* Emergency SMS */}
              <div>
                <label className="block text-xs font-sans font-semibold text-[#4B5563] dark:text-zinc-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#0F766E] dark:text-emerald-400" />
                  Emergency SMS Rapid Dispatch Recipients
                </label>
                <input
                  type="text"
                  value={emergencySms}
                  onChange={(e) => setEmergencySms(e.target.value)}
                  className="w-full bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-[#111827] dark:text-zinc-200 focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              {/* Emergency Email */}
              <div>
                <label className="block text-xs font-sans font-semibold text-[#4B5563] dark:text-zinc-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                  Disaster Command Center Email Notification List
                </label>
                <input
                  type="text"
                  value={emergencyEmail}
                  onChange={(e) => setEmergencyEmail(e.target.value)}
                  className="w-full bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-[#111827] dark:text-zinc-200 focus:outline-none focus:border-[#0F766E]"
                />
              </div>

              {/* Hillside Siren */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-[#DC2626] dark:text-rose-400" />
                  <div>
                    <div className="text-xs font-sans font-semibold text-[#111827] dark:text-zinc-200">
                      HILLSIDE ON-SITE AUDIBLE SIREN (110dB)
                    </div>
                    <div className="text-xs text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">
                      Arm solar-powered physical horn array on critical tilt breach
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={audibleBuzzer}
                  onChange={(e) => setAudibleBuzzer(e.target.checked)}
                  className="rounded bg-white border-gray-300 text-rose-600 focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
