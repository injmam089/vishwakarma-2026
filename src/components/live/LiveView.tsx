import React from 'react';
import { useMonitoring } from '../../context/MonitoringContext';
import { SlopeVisualizer } from './SlopeVisualizer';
import { LiveTelemetryGrid } from './LiveTelemetryGrid';
import { LivePacketTicker } from './LivePacketTicker';
import { StatusBadge } from '../common/StatusBadge';
import { Radio } from 'lucide-react';

export const LiveView: React.FC = () => {
  const { currentScenario, selectedZone } = useMonitoring();

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-10">
      {/* Top Banner: Minimal, high-impact status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light transition-colors duration-150">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-emerald-500/10 border border-teal-200 dark:border-emerald-500/30 text-[#0F766E] dark:text-emerald-400 shadow-sm">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] font-bold text-[#111827] dark:text-zinc-100 font-sans tracking-tight">
                Live Geotechnical Monitoring
              </h2>
              <span className="text-[12px] font-mono px-2 py-0.5 rounded bg-gray-100 text-[#4B5563] border border-[#E2E8F0] dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 font-semibold">
                {selectedZone.id}
              </span>
            </div>
            <p className="text-[13px] text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">
              Sub-second sensor telemetry & slope kinematics feed
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[13px] font-sans font-medium text-[#4B5563] dark:text-zinc-400">STATE:</span>
          <StatusBadge status={currentScenario} size="lg" showDot={true} />
        </div>
      </div>

      {/* Large Live Sensor Values */}
      <LiveTelemetryGrid />

      {/* Ground Movement 2D Stratum Visualizer */}
      <SlopeVisualizer />

      {/* Sub-second ESP32 Packet Activity */}
      <LivePacketTicker />
    </div>
  );
};
