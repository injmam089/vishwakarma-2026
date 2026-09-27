import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Flame,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';
import type { RiskLevel } from '../../types';

export const RiskStatus: React.FC = () => {
  const { selectedZone, currentScenario, setScenario } = useMonitoring();

  const fosValue = currentScenario === 'NORMAL' ? '1.84' : currentScenario === 'WARNING' ? '1.18' : '0.86';
  const fosColor = currentScenario === 'NORMAL'
    ? 'text-[#16A34A] dark:text-emerald-400'
    : currentScenario === 'WARNING'
    ? 'text-[#D97706] dark:text-amber-400'
    : 'text-[#DC2626] dark:text-rose-400';

  let config = {
    bg: 'bg-emerald-50/40 border-emerald-200/80 dark:bg-emerald-950/20 dark:border-emerald-500/30',
    iconBg: 'bg-white text-[#16A34A] border border-emerald-200 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/40',
    titleColor: 'text-[#16A34A] dark:text-emerald-400',
    icon: ShieldCheck,
    advisoryText: 'Slope stable · Baseline nominal',
  };

  if (currentScenario === 'WARNING') {
    config = {
      bg: 'bg-amber-50/40 border-amber-200/80 dark:bg-amber-950/25 dark:border-amber-500/40',
      iconBg: 'bg-white text-[#D97706] border border-amber-200 shadow-sm dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/50',
      titleColor: 'text-[#D97706] dark:text-amber-400',
      icon: AlertTriangle,
      advisoryText: 'Elevated moisture · Increased movement',
    };
  } else if (currentScenario === 'CRITICAL') {
    config = {
      bg: 'bg-rose-50/50 border-rose-200/90 dark:bg-rose-950/30 dark:border-rose-500/60',
      iconBg: 'bg-white text-[#DC2626] border border-rose-200 shadow-sm dark:bg-rose-500/25 dark:text-rose-400 dark:border-rose-500/60',
      titleColor: 'text-[#DC2626] dark:text-rose-400',
      icon: Flame,
      advisoryText: 'Rapid movement detected',
    };
  }

  const Icon = config.icon;

  return (
    <div className={`relative rounded-2xl border p-5 lg:p-6 transition-all duration-300 ${config.bg} shadow-card-light`}>
      <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className={`p-3.5 rounded-xl shrink-0 transition-colors ${config.iconBg}`}>
            <Icon className="w-8 h-8 lg:w-9 lg:h-9" />
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[13px] font-sans font-medium text-[#4B5563] dark:text-zinc-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#6B7280] dark:text-zinc-400" />
                <span className="font-mono font-semibold text-[#111827] dark:text-zinc-100">{selectedZone.id}</span>
                <span>·</span>
                <span>{selectedZone.name}</span>
              </span>
              <span className="text-gray-300 dark:text-zinc-600 hidden sm:inline">•</span>
              <span className="text-[12px] font-sans text-[#6B7280] dark:text-zinc-400 hidden sm:inline">
                Slope {selectedZone.slopeAngle}° · Elevation {selectedZone.elevation}m
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className={`text-2xl lg:text-3xl font-bold font-sans tracking-tight ${config.titleColor}`}>
                {currentScenario}
              </h1>
            </div>

            <p className="text-sm font-medium text-[#4B5563] dark:text-zinc-300 font-sans mt-0.5">
              {config.advisoryText}
            </p>
          </div>
        </div>

        {/* Right side: Factor of Safety, Risk Index & Scenario Preview Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-[#E2E8F0] dark:border-zinc-800/80 pt-4 lg:pt-0">
          <div className="flex items-center gap-5 bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-xl px-5 py-3 shadow-card-light">
            <div>
              <div className="text-[12px] font-sans font-medium uppercase text-[#6B7280] dark:text-zinc-400 tracking-wider">
                Factor of Safety
              </div>
              <div className={`text-2xl font-bold font-mono ${fosColor}`}>
                {fosValue} <span className="text-[12px] text-[#6B7280] dark:text-zinc-400 font-sans font-normal">FoS</span>
              </div>
            </div>

            <div className="h-9 w-px bg-[#E2E8F0] dark:bg-zinc-800" />

            <div>
              <div className="text-[12px] font-sans font-medium uppercase text-[#6B7280] dark:text-zinc-400 tracking-wider">
                Risk Index
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#111827] dark:text-zinc-100">
                  {selectedZone.riskScore}
                </span>
                <span className="text-[12px] font-sans text-[#6B7280] dark:text-zinc-400">/ 100</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <span className="text-[12px] uppercase font-sans text-[#4B5563] dark:text-zinc-400 font-semibold tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#0F766E] dark:text-cyan-400" /> Preview Hazard State:
            </span>
            <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light">
              {(['NORMAL', 'WARNING', 'CRITICAL'] as RiskLevel[]).map((level) => {
                const isActive = currentScenario === level;
                let activeStyle = 'bg-gray-100 text-[#111827] dark:bg-zinc-800 dark:text-zinc-200';
                if (isActive) {
                  if (level === 'NORMAL') activeStyle = 'bg-[#16A34A] text-white font-semibold shadow-sm';
                  if (level === 'WARNING') activeStyle = 'bg-[#D97706] text-white font-semibold shadow-sm';
                  if (level === 'CRITICAL') activeStyle = 'bg-[#DC2626] text-white font-semibold shadow-sm';
                }
                return (
                  <button
                    key={level}
                    onClick={() => setScenario(level)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-sans font-medium transition-all ${
                      isActive
                        ? activeStyle
                        : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
