import React from 'react';
import {
  Compass,
  Droplets,
  CloudRain,
  Activity,
  BatteryCharging,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import type { RiskLevel } from '../../types';

export interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  iconType: 'tilt' | 'moisture' | 'rain' | 'vibration' | 'battery';
  trendText: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  status: string;
  riskSeverity?: RiskLevel;
  sparklinePoints?: number[];
  subDetail?: string;
}

export const SensorCard: React.FC<SensorCardProps> = ({
  title,
  value,
  unit,
  iconType,
  trendText,
  trendDirection = 'neutral',
  status,
  riskSeverity = 'NORMAL',
  sparklinePoints = [20, 22, 21, 24, 23, 26, 25, 27],
  subDetail,
}) => {
  const getIcon = () => {
    switch (iconType) {
      case 'tilt':
        return Compass;
      case 'moisture':
        return Droplets;
      case 'rain':
        return CloudRain;
      case 'vibration':
        return Activity;
      case 'battery':
        return BatteryCharging;
    }
  };

  const Icon = getIcon();

  // White cards with left accent border for warning/critical
  let cardBorder = 'border border-[#E2E8F0] dark:border-zinc-800 bg-white dark:bg-[#121217]';
  let iconBg = 'bg-gray-50 text-[#0F766E] border border-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
  let badgeStyle = 'bg-emerald-50 text-[#16A34A] border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50';

  if (riskSeverity === 'WARNING') {
    cardBorder = 'border border-[#E2E8F0] border-l-4 border-l-[#D97706] dark:border-zinc-800 dark:border-l-[#D97706] bg-white dark:bg-[#121217]';
    iconBg = 'bg-amber-50 text-[#D97706] border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30';
    badgeStyle = 'bg-amber-50 text-[#D97706] border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50';
  } else if (riskSeverity === 'CRITICAL') {
    cardBorder = 'border border-[#E2E8F0] border-l-4 border-l-[#DC2626] dark:border-zinc-800 dark:border-l-[#DC2626] bg-white dark:bg-[#121217]';
    iconBg = 'bg-rose-50 text-[#DC2626] border border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/40';
    badgeStyle = 'bg-rose-50 text-[#DC2626] border border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/60 shadow-sm';
  }

  const minVal = Math.min(...sparklinePoints);
  const maxVal = Math.max(...sparklinePoints);
  const range = maxVal - minVal || 1;
  const width = 64;
  const height = 20;

  const pointsString = sparklinePoints
    .map((pt, idx) => {
      const x = (idx / (sparklinePoints.length - 1)) * width;
      const y = height - ((pt - minVal) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  const strokeColor =
    riskSeverity === 'CRITICAL'
      ? '#DC2626'
      : riskSeverity === 'WARNING'
      ? '#D97706'
      : '#0F766E';

  return (
    <div
      className={`relative flex flex-col justify-between p-5 rounded-2xl transition-all duration-150 group shadow-card-light hover:shadow-md ${cardBorder}`}
    >
      {/* 1. LABEL & Icon */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] lg:text-[13px] font-sans uppercase tracking-wider text-[#4B5563] dark:text-zinc-400 font-semibold">
          {title}
        </span>
        <div className={`p-2 rounded-xl transition-colors ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* 2. Large Primary Value */}
      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-3xl lg:text-[34px] font-bold font-mono tracking-tight text-[#111827] dark:text-zinc-100">
          {value}
        </span>
        <span className="text-[14px] font-sans font-medium text-[#4B5563] dark:text-zinc-400">
          {unit}
        </span>
      </div>

      {/* 3. Trend & Mini Sparkline */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-zinc-800/60">
        <div className="flex items-center gap-1.5 text-[13px] font-sans font-medium text-[#4B5563] dark:text-zinc-400">
          {trendDirection === 'up' && <TrendingUp className="w-4 h-4 text-[#D97706]" />}
          {trendDirection === 'down' && <TrendingDown className="w-4 h-4 text-[#16A34A]" />}
          {trendDirection === 'neutral' && <Minus className="w-4 h-4 text-[#6B7280]" />}
          <span>{trendText}</span>
        </div>

        {/* Mini sparkline */}
        <div className="w-16 h-5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pointsString}
            />
          </svg>
        </div>
      </div>

      {/* 4. Status Badge + Secondary Metric */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <span
          className={`text-[12px] font-sans px-2.5 py-1 rounded-md uppercase font-semibold transition-colors ${badgeStyle}`}
        >
          {status}
        </span>

        {subDetail && (
          <span className="text-[12px] font-sans text-[#6B7280] dark:text-zinc-400 font-medium truncate">
            {subDetail}
          </span>
        )}
      </div>
    </div>
  );
};
