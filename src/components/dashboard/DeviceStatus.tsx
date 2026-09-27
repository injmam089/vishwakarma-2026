import React from 'react';
import { useMonitoring } from '../../context/MonitoringContext';
import { StatusBadge } from '../common/StatusBadge';
import { Cpu, Wifi, BatteryCharging, Sun, RefreshCw } from 'lucide-react';

export const DeviceStatus: React.FC = () => {
  const { devices, selectedZone, pingDevice, pingStatus } = useMonitoring();

  const primaryDevice = devices.find((d) => d.id === selectedZone.primaryDeviceId) || devices[0];
  const zoneDevices = devices.filter((d) => d.zoneId === selectedZone.id);

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 p-5 flex flex-col justify-between shadow-card-light transition-colors duration-150">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#0F766E] dark:text-emerald-400" />
          <h3 className="text-[15px] font-semibold text-[#111827] dark:text-zinc-100 font-sans tracking-tight">
            PRIMARY GATEWAY & TELEMETRY
          </h3>
        </div>
        <StatusBadge status={primaryDevice.status} size="sm" showDot={true} />
      </div>

      <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/80 border border-[#E2E8F0] dark:border-zinc-800 mb-3 shadow-card-light">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-bold font-mono text-[#111827] dark:text-zinc-100 flex items-center gap-2">
              {primaryDevice.id}
              <span className="text-[13px] font-sans font-medium text-[#4B5563] dark:text-zinc-400">
                — {primaryDevice.name}
              </span>
            </div>
            <div className="text-[12px] font-sans text-[#6B7280] dark:text-zinc-400 mt-0.5">
              Firmware {primaryDevice.firmware} • Uptime {primaryDevice.uptimeHours}h
            </div>
          </div>

          <button
            onClick={() => pingDevice(primaryDevice.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 border border-[#E2E8F0] dark:border-zinc-700 text-[12px] font-sans font-semibold text-[#111827] dark:text-zinc-200 transition-colors shadow-card-light"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#0F766E] dark:text-emerald-400" />
            <span>PING</span>
          </button>
        </div>

        {pingStatus && pingStatus.deviceId === primaryDevice.id && (
          <div className="mt-2 text-[12px] font-mono text-[#16A34A] dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
            <span>PING ACK RECEIVED</span>
            <span>RTT: {pingStatus.pingMs}ms (CRC OK)</span>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3.5 pt-3.5 border-t border-[#E2E8F0] dark:border-zinc-800/80">
          <div>
            <span className="text-[12px] font-sans font-medium text-[#6B7280] dark:text-zinc-400 uppercase tracking-wider block">Last Seen</span>
            <span className="text-[13px] font-mono font-semibold text-[#111827] dark:text-zinc-200">
              {primaryDevice.lastSeen}
            </span>
          </div>

          <div>
            <span className="text-[12px] font-sans font-medium text-[#6B7280] dark:text-zinc-400 uppercase tracking-wider block">Signal (RSSI)</span>
            <span className="text-[13px] font-mono font-semibold text-[#111827] dark:text-zinc-200 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5 text-[#0F766E] dark:text-emerald-400" />
              {primaryDevice.signalRssi} dBm
            </span>
          </div>

          <div>
            <span className="text-[12px] font-sans font-medium text-[#6B7280] dark:text-zinc-400 uppercase tracking-wider block">Battery</span>
            <span className="text-[13px] font-mono font-semibold text-[#16A34A] dark:text-emerald-400 flex items-center gap-1">
              <BatteryCharging className="w-3.5 h-3.5" />
              {primaryDevice.battery}% ({primaryDevice.batteryVoltage}V)
            </span>
          </div>

          <div>
            <span className="text-[12px] font-sans font-medium text-[#6B7280] dark:text-zinc-400 uppercase tracking-wider block">Solar Array</span>
            <span className="text-[13px] font-mono font-semibold text-[#D97706] dark:text-amber-400 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5" />
              {primaryDevice.solarInput}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="text-[12px] font-sans font-semibold text-[#6B7280] dark:text-zinc-400 uppercase tracking-wider px-1">
          Cluster Sub-Nodes ({zoneDevices.length} Installed)
        </div>
        {zoneDevices.map((dev) => (
          <div
            key={dev.id}
            className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50/80 dark:bg-zinc-900/40 border border-[#E2E8F0] dark:border-zinc-800 text-[13px]"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  dev.status === 'ONLINE' ? 'bg-[#16A34A]' : 'bg-[#D97706]'
                }`}
              />
              <span className="font-mono font-semibold text-[#111827] dark:text-zinc-200">{dev.id}</span>
              <span className="text-[#4B5563] dark:text-zinc-400 font-sans text-[12px] hidden sm:inline truncate max-w-[150px]">
                {dev.type}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[#6B7280] dark:text-zinc-400 text-[12px] font-mono">
              <span>Bat: {dev.battery}%</span>
              <span>{dev.lastSeen}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
