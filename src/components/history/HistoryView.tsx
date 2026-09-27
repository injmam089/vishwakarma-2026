import React, { useMemo, useState } from 'react';
import { useMonitoring } from '../../context/MonitoringContext';
import { TimeRangeSelector } from '../common/TimeRangeSelector';
import { generateHistoricalData, exportToCSV } from '../../services/mockData';
import {
  Calendar,
  CheckCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { MovementChart } from '../dashboard/MovementChart';
import { EnvironmentalChart } from '../dashboard/EnvironmentalChart';
import { VibrationChart } from '../dashboard/VibrationChart';

export const HistoryView: React.FC = () => {
  const { timeRange, setTimeRange, currentScenario, selectedZone } = useMonitoring();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const data = useMemo(() => {
    return generateHistoricalData(timeRange, currentScenario);
  }, [timeRange, currentScenario]);

  const stats = useMemo(() => {
    const tilts = data.map((d) => d.tilt);
    const displacements = data.map((d) => d.displacement);
    const moistures = data.map((d) => d.soilMoisture);
    const rains = data.map((d) => d.rainfall);
    const vibes = data.map((d) => d.vibration);

    return {
      peakTilt: Math.max(...tilts),
      minTilt: Math.min(...tilts),
      maxDisplacement: Math.max(...displacements),
      avgMoisture: (moistures.reduce((a, b) => a + b, 0) / moistures.length).toFixed(1),
      totalRain: Math.max(...rains),
      peakVibe: Math.max(...vibes),
      breachesCount: currentScenario === 'CRITICAL' ? 14 : currentScenario === 'WARNING' ? 4 : 0,
    };
  }, [data, currentScenario]);

  const handleExport = () => {
    exportToCSV(data, selectedZone.id);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-5 lg:space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header & Controls Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light transition-colors duration-150">
        <div>
          <h2 className="text-[20px] font-bold text-[#111827] dark:text-zinc-100 font-sans tracking-tight flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#0F766E] dark:text-emerald-400" />
            Historical Analytics & Audit
          </h2>
          <p className="text-[13px] text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">
            Multi-sensor geotechnical time-series logs for {selectedZone.id} ({selectedZone.name})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white font-sans text-[13px] font-semibold transition-all shadow-card-light group"
          >
            {downloadSuccess ? (
              <>
                <CheckCircle className="w-4 h-4 text-white" />
                <span>EXPORTED!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-4 h-4" />
                <span>EXPORT CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary KPI Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light">
          <span className="text-[12px] font-sans font-semibold text-[#4B5563] dark:text-zinc-400 uppercase tracking-wider block">Peak Tilt</span>
          <span className="text-2xl font-bold font-mono text-[#111827] dark:text-zinc-100 flex items-baseline gap-1 mt-0.5">
            {stats.peakTilt}°
          </span>
          <span className="text-[12px] font-sans text-[#6B7280] dark:text-zinc-400">Min: {stats.minTilt}°</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light">
          <span className="text-[12px] font-sans font-semibold text-[#4B5563] dark:text-zinc-400 uppercase tracking-wider block">Max Disp</span>
          <span className="text-2xl font-bold font-mono text-[#111827] dark:text-zinc-100 flex items-baseline gap-1 mt-0.5">
            {stats.maxDisplacement} <span className="text-[13px] font-sans text-[#6B7280] dark:text-zinc-400 font-normal">mm</span>
          </span>
          <span className="text-[12px] font-sans text-[#0F766E] dark:text-emerald-400 font-medium">Subsurface</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light">
          <span className="text-[12px] font-sans font-semibold text-[#4B5563] dark:text-zinc-400 uppercase tracking-wider block">Mean Moisture</span>
          <span className="text-2xl font-bold font-mono text-[#2563EB] dark:text-blue-400 flex items-baseline gap-1 mt-0.5">
            {stats.avgMoisture}%
          </span>
          <span className="text-[12px] font-sans text-[#6B7280] dark:text-zinc-400">Pore Saturation</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light">
          <span className="text-[12px] font-sans font-semibold text-[#4B5563] dark:text-zinc-400 uppercase tracking-wider block">Total Rain</span>
          <span className="text-2xl font-bold font-mono text-[#0F766E] dark:text-teal-400 flex items-baseline gap-1 mt-0.5">
            {stats.totalRain} <span className="text-[13px] font-sans text-[#6B7280] dark:text-zinc-400 font-normal">mm</span>
          </span>
          <span className="text-[12px] font-sans text-[#6B7280] dark:text-zinc-400">Accumulated</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light">
          <span className="text-[12px] font-sans font-semibold text-[#4B5563] dark:text-zinc-400 uppercase tracking-wider block">Peak Accel</span>
          <span className="text-2xl font-bold font-mono text-[#111827] dark:text-zinc-100 flex items-baseline gap-1 mt-0.5">
            {stats.peakVibe} <span className="text-[13px] font-sans text-[#6B7280] dark:text-zinc-400 font-normal">g</span>
          </span>
          <span className="text-[12px] font-sans text-[#6B7280] dark:text-zinc-400">PGA Microseismic</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light">
          <span className="text-[12px] font-sans font-semibold text-[#4B5563] dark:text-zinc-400 uppercase tracking-wider block">Threshold Breaches</span>
          <span className={`text-2xl font-bold font-mono flex items-baseline gap-1 mt-0.5 ${
            stats.breachesCount > 0 ? 'text-[#DC2626] dark:text-rose-400' : 'text-[#16A34A] dark:text-emerald-400'
          }`}>
            {stats.breachesCount}
          </span>
          <span className="text-[12px] font-sans text-[#6B7280] dark:text-zinc-400">In Selected Period</span>
        </div>
      </div>

      {/* Historical Movement Chart */}
      <MovementChart />

      {/* Environmental & Vibration Historical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EnvironmentalChart />
        <VibrationChart />
      </div>

      {/* Data Point Log Table */}
      <div className="rounded-2xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 p-5 shadow-card-light transition-colors duration-150">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[15px] font-semibold text-[#111827] dark:text-zinc-100 font-sans tracking-tight">
            RAW AUDIT TRAIL SAMPLES ({data.length} RECORDINGS)
          </h3>
          <span className="text-[12px] font-mono text-[#6B7280] dark:text-zinc-400">FORMAT: ISO-8601 UTC</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] dark:border-zinc-800 bg-gray-50/60 dark:bg-zinc-950/60 max-h-64 overflow-y-auto">
          <table className="w-full text-left font-mono text-[12px] border-collapse">
            <thead className="sticky top-0 bg-gray-100 dark:bg-zinc-900 border-b border-[#E2E8F0] dark:border-zinc-800 text-[#4B5563] dark:text-zinc-400 text-[12px] font-semibold">
              <tr>
                <th className="py-2.5 px-3">TIMESTAMP</th>
                <th className="py-2.5 px-3">TILT (°)</th>
                <th className="py-2.5 px-3">DISPLACEMENT (MM)</th>
                <th className="py-2.5 px-3">SOIL MOISTURE (%)</th>
                <th className="py-2.5 px-3">RAINFALL (MM)</th>
                <th className="py-2.5 px-3">VIBRATION (G)</th>
                <th className="py-2.5 px-3 text-right">RISK SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-zinc-900 text-[#111827] dark:text-zinc-300">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-100/70 dark:hover:bg-zinc-900/60 transition-colors">
                  <td className="py-2 px-3 text-[#6B7280] dark:text-zinc-400">{row.timeLabel}</td>
                  <td className="py-2 px-3 font-semibold text-[#0F766E] dark:text-emerald-400">{row.tilt}°</td>
                  <td className="py-2 px-3 font-semibold">{row.displacement} mm</td>
                  <td className="py-2 px-3 text-[#2563EB] dark:text-blue-400 font-semibold">{row.soilMoisture}%</td>
                  <td className="py-2 px-3 text-[#0F766E] dark:text-cyan-400 font-semibold">{row.rainfall} mm</td>
                  <td className="py-2 px-3 font-semibold">{row.vibration} g</td>
                  <td className="py-2 px-3 text-right font-bold">
                    <span className={`px-2 py-0.5 rounded text-[12px] font-sans font-medium ${
                      row.riskScore >= 70
                        ? 'bg-rose-50 text-[#DC2626] border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300'
                        : row.riskScore >= 40
                        ? 'bg-amber-50 text-[#D97706] border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-emerald-50 text-[#16A34A] border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}>
                      {row.riskScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
