import React, { useState } from 'react';
import { useMonitoring } from '../../context/MonitoringContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  Cpu,
  Wifi,
  BatteryCharging,
  Sun,
  LayoutGrid,
  Table as TableIcon,
  RefreshCw,
  Clock,
} from 'lucide-react';

export const DevicesView: React.FC = () => {
  const { devices, pingDevice, pingStatus } = useMonitoring();
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  return (
    <div className="space-y-5 lg:space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header with View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800/80 shadow-card-light dark:shadow-none transition-colors duration-150">
        <div>
          <h2 className="text-[18px] font-semibold font-sans text-[#111827] dark:text-zinc-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#0F766E] dark:text-emerald-400" />
            FIELD TELEMETRY HARDWARE & NODES
          </h2>
          <p className="text-[13px] text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">
            ESP32 microcontrollers, borehole sensor strings, and solar battery nodes
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-[#111827] shadow-sm border border-[#E2E8F0] dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'
                : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200'
            }`}
            title="Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-white text-[#111827] shadow-sm border border-[#E2E8F0] dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'
                : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200'
            }`}
            title="Table View"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card View */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => {
            const isPinging = pingStatus?.deviceId === device.id;

            return (
              <div
                key={device.id}
                className="p-5 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800/80 hover:border-gray-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between shadow-card-light dark:shadow-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-base font-bold font-mono text-[#111827] dark:text-zinc-100">
                        {device.id}
                      </div>
                      <div className="text-[13px] text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">
                        {device.name}
                      </div>
                    </div>
                    <StatusBadge status={device.status} size="sm" showDot={true} />
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[12px] font-mono px-2 py-0.5 rounded bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 text-[#111827] dark:text-zinc-300 font-semibold">
                      {device.zoneId}
                    </span>
                    <span className="text-[12px] font-sans px-2 py-0.5 rounded bg-[#F6F8FA] dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 text-[#4B5563] dark:text-zinc-400 truncate">
                      {device.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 p-3 rounded-lg bg-[#F6F8FA] dark:bg-zinc-950/60 border border-[#E2E8F0] dark:border-zinc-900 text-xs mb-4">
                    <div>
                      <span className="text-[12px] text-[#4B5563] dark:text-zinc-500 uppercase font-sans font-medium block">Battery</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1 mt-0.5">
                        <BatteryCharging className="w-3.5 h-3.5" />
                        {device.battery}% ({device.batteryVoltage}V)
                      </span>
                    </div>

                    <div>
                      <span className="text-[12px] text-[#4B5563] dark:text-zinc-500 uppercase font-sans font-medium block">Solar Array</span>
                      <span className="text-amber-700 dark:text-amber-400 font-mono font-semibold flex items-center gap-1 mt-0.5">
                        <Sun className="w-3.5 h-3.5" />
                        {device.solarInput}
                      </span>
                    </div>

                    <div>
                      <span className="text-[12px] text-[#4B5563] dark:text-zinc-500 uppercase font-sans font-medium block">Signal (RSSI)</span>
                      <span className="text-[#111827] dark:text-zinc-300 font-mono font-semibold flex items-center gap-1 mt-0.5">
                        <Wifi className="w-3.5 h-3.5 text-[#0F766E] dark:text-emerald-400" />
                        {device.signalRssi} dBm
                      </span>
                    </div>

                    <div>
                      <span className="text-[12px] text-[#4B5563] dark:text-zinc-500 uppercase font-sans font-medium block">Last Seen</span>
                      <span className="text-[#111827] dark:text-zinc-300 font-mono font-semibold flex items-center gap-1 mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-zinc-500" />
                        {device.lastSeen}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[12px] font-mono text-[#6B7280] dark:text-zinc-500">
                    FW: {device.firmware}
                  </span>

                  <button
                    onClick={() => pingDevice(device.id)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#F6F8FA] hover:bg-gray-200 text-[#111827] border border-[#E2E8F0] dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700 text-xs font-sans font-semibold transition-colors shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#0F766E] dark:text-emerald-400" />
                    <span>PING</span>
                  </button>
                </div>

                {isPinging && (
                  <div className="mt-2 text-xs font-mono text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
                    <span>ROUND-TRIP OK</span>
                    <span>{pingStatus?.pingMs} ms</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800/80 overflow-hidden shadow-card-light dark:shadow-none transition-colors duration-150">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead className="bg-[#F6F8FA] dark:bg-zinc-900 border-b border-[#E2E8F0] dark:border-zinc-800 text-[#4B5563] dark:text-zinc-400 text-[12px] font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">DEVICE ID</th>
                  <th className="py-3 px-4">ZONE</th>
                  <th className="py-3 px-4">HARDWARE TYPE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">LAST SEEN</th>
                  <th className="py-3 px-4">BATTERY</th>
                  <th className="py-3 px-4">SIGNAL</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-zinc-800/60 text-[#111827] dark:text-zinc-300">
                {devices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50/80 dark:hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-[#111827] dark:text-zinc-100 flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-[#0F766E] dark:text-emerald-400" />
                      {device.id}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#4B5563] dark:text-zinc-400">{device.zoneId}</td>
                    <td className="py-3 px-4 text-[#4B5563] dark:text-zinc-300 font-sans">{device.type}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={device.status} size="sm" showDot={true} />
                    </td>
                    <td className="py-3 px-4 font-mono text-[#6B7280] dark:text-zinc-400">{device.lastSeen}</td>
                    <td className="py-3 px-4 font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      {device.battery}% ({device.batteryVoltage}V)
                    </td>
                    <td className="py-3 px-4 font-mono text-[#4B5563] dark:text-zinc-300">{device.signalRssi} dBm</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => pingDevice(device.id)}
                        className="px-2.5 py-1 rounded bg-[#F6F8FA] hover:bg-gray-200 text-[#111827] border border-[#E2E8F0] dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700 text-xs font-sans font-semibold transition-colors shadow-sm"
                      >
                        Ping
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
