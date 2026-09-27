import React from 'react';
import { useMonitoring } from '../../context/MonitoringContext';
import {
  Compass,
  Droplets,
  CloudRain,
  Activity,
  Clock,
  Wifi,
} from 'lucide-react';

export const LiveTelemetryGrid: React.FC = () => {
  const { telemetry, lastUpdatedSecondsAgo, isSimulating } = useMonitoring();

  return (
    <div className="space-y-4">
      {/* Top Telemetry Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light">
        <div className="flex items-center gap-2.5">
          <div className="flex h-2.5 w-2.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSimulating ? 'bg-[#16A34A]' : 'bg-gray-400'}`} />
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSimulating ? 'bg-[#16A34A]' : 'bg-gray-500'}`} />
          </div>
          <span className="font-sans text-[13px] font-semibold text-[#111827] dark:text-zinc-200">
            TRANSMISSION: {isSimulating ? 'High-Rate Telemetry Bus' : 'Telemetry Paused'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[12px] font-sans text-[#6B7280] dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-[#0F766E] dark:text-emerald-400" />
            99.8% RSSI Signal Integrity
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#6B7280] dark:text-zinc-400" />
            Tick: {lastUpdatedSecondsAgo}s
          </span>
        </div>
      </div>

      {/* Large Live Sensor Value Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tilt */}
        <div className={`p-5 rounded-2xl bg-white dark:bg-[#121217] border transition-all shadow-card-light ${
          telemetry.tilt >= 12
            ? 'border-[#E2E8F0] border-l-4 border-l-[#DC2626] dark:border-zinc-800 dark:border-l-[#DC2626]'
            : telemetry.tilt >= 5
            ? 'border-[#E2E8F0] border-l-4 border-l-[#D97706] dark:border-zinc-800 dark:border-l-[#D97706]'
            : 'border-[#E2E8F0] dark:border-zinc-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-sans uppercase font-semibold text-[#4B5563] dark:text-zinc-400 tracking-wider">Current Tilt</span>
            <Compass className={`w-4 h-4 ${telemetry.tilt >= 12 ? 'text-[#DC2626]' : telemetry.tilt >= 5 ? 'text-[#D97706]' : 'text-[#0F766E]'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono text-[#111827] dark:text-zinc-100 tracking-tight">
              {telemetry.tilt}
            </span>
            <span className="text-[15px] font-sans text-[#4B5563] dark:text-zinc-400 font-semibold">°</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[12px] font-sans pt-2 border-t border-gray-100 dark:border-zinc-800/80">
            <span className="text-[#6B7280] dark:text-zinc-500">Rate of Change</span>
            <span className="text-[#111827] dark:text-zinc-300 font-mono font-semibold">+{telemetry.tiltTrend}°/h</span>
          </div>
        </div>

        {/* Soil Moisture */}
        <div className={`p-5 rounded-2xl bg-white dark:bg-[#121217] border transition-all shadow-card-light ${
          telemetry.soilMoisture >= 92
            ? 'border-[#E2E8F0] border-l-4 border-l-[#DC2626] dark:border-zinc-800 dark:border-l-[#DC2626]'
            : telemetry.soilMoisture >= 80
            ? 'border-[#E2E8F0] border-l-4 border-l-[#D97706] dark:border-zinc-800 dark:border-l-[#D97706]'
            : 'border-[#E2E8F0] dark:border-zinc-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-sans uppercase font-semibold text-[#4B5563] dark:text-zinc-400 tracking-wider">Soil Saturation</span>
            <Droplets className={`w-4 h-4 ${telemetry.soilMoisture >= 92 ? 'text-[#DC2626]' : telemetry.soilMoisture >= 80 ? 'text-[#D97706]' : 'text-[#2563EB]'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono text-[#111827] dark:text-zinc-100 tracking-tight">
              {telemetry.soilMoisture}
            </span>
            <span className="text-[15px] font-sans text-[#4B5563] dark:text-zinc-400 font-semibold">%</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[12px] font-sans pt-2 border-t border-gray-100 dark:border-zinc-800/80">
            <span className="text-[#6B7280] dark:text-zinc-500">Volumetric Water</span>
            <span className="text-[#111827] dark:text-zinc-300 font-mono font-semibold">0.42 m³/m³</span>
          </div>
        </div>

        {/* Rainfall */}
        <div className={`p-5 rounded-2xl bg-white dark:bg-[#121217] border transition-all shadow-card-light ${
          telemetry.rainfall >= 75
            ? 'border-[#E2E8F0] border-l-4 border-l-[#DC2626] dark:border-zinc-800 dark:border-l-[#DC2626]'
            : telemetry.rainfall >= 35
            ? 'border-[#E2E8F0] border-l-4 border-l-[#D97706] dark:border-zinc-800 dark:border-l-[#D97706]'
            : 'border-[#E2E8F0] dark:border-zinc-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-sans uppercase font-semibold text-[#4B5563] dark:text-zinc-400 tracking-wider">Rainfall (24h)</span>
            <CloudRain className={`w-4 h-4 ${telemetry.rainfall >= 75 ? 'text-[#DC2626]' : telemetry.rainfall >= 35 ? 'text-[#D97706]' : 'text-[#0F766E]'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono text-[#111827] dark:text-zinc-100 tracking-tight">
              {telemetry.rainfall}
            </span>
            <span className="text-[15px] font-sans text-[#4B5563] dark:text-zinc-400 font-semibold">mm</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[12px] font-sans pt-2 border-t border-gray-100 dark:border-zinc-800/80">
            <span className="text-[#6B7280] dark:text-zinc-500">Precip Intensity</span>
            <span className="text-[#111827] dark:text-zinc-300 font-mono font-semibold">{telemetry.rainfallRate} mm/h</span>
          </div>
        </div>

        {/* Vibration */}
        <div className={`p-5 rounded-2xl bg-white dark:bg-[#121217] border transition-all shadow-card-light ${
          telemetry.vibration >= 1.2
            ? 'border-[#E2E8F0] border-l-4 border-l-[#DC2626] dark:border-zinc-800 dark:border-l-[#DC2626]'
            : telemetry.vibration >= 0.5
            ? 'border-[#E2E8F0] border-l-4 border-l-[#D97706] dark:border-zinc-800 dark:border-l-[#D97706]'
            : 'border-[#E2E8F0] dark:border-zinc-800'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] font-sans uppercase font-semibold text-[#4B5563] dark:text-zinc-400 tracking-wider">Microseismic Accel</span>
            <Activity className={`w-4 h-4 ${telemetry.vibration >= 1.2 ? 'text-[#DC2626]' : telemetry.vibration >= 0.5 ? 'text-[#D97706]' : 'text-[#2563EB]'}`} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono text-[#111827] dark:text-zinc-100 tracking-tight">
              {telemetry.vibration}
            </span>
            <span className="text-[15px] font-sans text-[#4B5563] dark:text-zinc-400 font-semibold">g</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[12px] font-sans pt-2 border-t border-gray-100 dark:border-zinc-800/80">
            <span className="text-[#6B7280] dark:text-zinc-500">Spectral Peak</span>
            <span className="text-[#111827] dark:text-zinc-300 font-mono font-semibold">14.2 Hz</span>
          </div>
        </div>
      </div>
    </div>
  );
};
