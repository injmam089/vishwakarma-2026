import React from 'react';
import { useMonitoring } from '../../context/MonitoringContext';
import { Terminal } from 'lucide-react';

export const LivePacketTicker: React.FC = () => {
  const { livePackets } = useMonitoring();

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 p-5 flex flex-col justify-between shadow-card-light transition-colors duration-150">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-[#0F766E] dark:text-emerald-400" />
          <h3 className="text-[15px] font-semibold text-[#111827] dark:text-zinc-100 font-sans tracking-tight">
            RAW SENSOR TELEMETRY FRAMES (ESP32 UART / LORA BUS)
          </h3>
        </div>
        <span className="text-[12px] font-mono text-[#6B7280] dark:text-zinc-400">
          BUFFER: {livePackets.length} FRAMES
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] dark:border-zinc-800 bg-gray-50/70 dark:bg-zinc-950/80 max-h-56 overflow-y-auto">
        <table className="w-full text-left border-collapse font-mono text-[12px]">
          <thead className="sticky top-0 bg-gray-100 dark:bg-zinc-900 border-b border-[#E2E8F0] dark:border-zinc-800 text-[#4B5563] dark:text-zinc-400 font-semibold">
            <tr>
              <th className="py-2.5 px-3">FRAME</th>
              <th className="py-2.5 px-3">TIME</th>
              <th className="py-2.5 px-3">NODE</th>
              <th className="py-2.5 px-3">RAW PAYLOAD (HEX)</th>
              <th className="py-2.5 px-3">TILT</th>
              <th className="py-2.5 px-3">MOISTURE</th>
              <th className="py-2.5 px-3">VIBE</th>
              <th className="py-2.5 px-3 text-right">CRC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] dark:divide-zinc-900">
            {livePackets.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-4 text-center text-[#6B7280] dark:text-zinc-500 font-mono text-[12px]">
                  Awaiting sensor packet ingress...
                </td>
              </tr>
            ) : (
              livePackets.map((pkt, idx) => (
                <tr
                  key={pkt.id}
                  className={`hover:bg-gray-100/80 dark:hover:bg-zinc-900/60 transition-colors ${
                    idx === 0
                      ? 'bg-teal-50/80 text-teal-900 dark:bg-emerald-950/20 dark:text-emerald-200'
                      : 'text-[#111827] dark:text-zinc-300'
                  }`}
                >
                  <td className="py-2 px-3 text-[#6B7280] dark:text-zinc-400">#{pkt.seq}</td>
                  <td className="py-2 px-3 text-[#6B7280] dark:text-zinc-400">{pkt.timestamp}</td>
                  <td className="py-2 px-3 text-[#111827] dark:text-zinc-200 font-semibold">{pkt.deviceId}</td>
                  <td className="py-2 px-3 text-[#6B7280] dark:text-zinc-500 font-mono tracking-wider">
                    {pkt.rawPayloadHex}
                  </td>
                  <td className="py-2 px-3 text-[#0F766E] dark:text-emerald-400 font-semibold">{pkt.tilt}°</td>
                  <td className="py-2 px-3 text-[#2563EB] dark:text-blue-400 font-semibold">{pkt.moisture}%</td>
                  <td className="py-2 px-3 text-[#111827] dark:text-zinc-300 font-semibold">{pkt.vibe}g</td>
                  <td className="py-2 px-3 text-right">
                    {pkt.status === 'VALID' ? (
                      <span className="text-[11px] text-[#16A34A] bg-emerald-50 border border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md font-semibold">
                        OK
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#D97706] bg-amber-50 border border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 px-2 py-0.5 rounded-md font-semibold">
                        WARN
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
