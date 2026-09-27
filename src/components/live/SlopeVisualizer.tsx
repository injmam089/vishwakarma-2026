import React from 'react';
import { useMonitoring } from '../../context/MonitoringContext';
import { Compass, ArrowUpRight } from 'lucide-react';

export const SlopeVisualizer: React.FC = () => {
  const { telemetry, currentScenario, theme } = useMonitoring();

  const isDark = theme === 'dark';
  const tiltAngle = telemetry.tilt;
  const isCritical = currentScenario === 'CRITICAL';
  const isWarning = currentScenario === 'WARNING';

  const waterTableHeightPct = Math.min(95, Math.max(20, (telemetry.soilMoisture - 30) * 1.3));

  const slipColor = isCritical
    ? (isDark ? '#ef4444' : '#dc2626')
    : isWarning
    ? (isDark ? '#f59e0b' : '#d97706')
    : (isDark ? '#10b981' : '#0F766E');

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 p-5 flex flex-col justify-between shadow-card-light transition-colors duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-50 dark:bg-emerald-500/10 border border-teal-200 dark:border-emerald-500/30 text-[#0F766E] dark:text-emerald-400">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#111827] dark:text-zinc-100 font-sans tracking-tight">
              SLOPE CROSS-SECTION & BOREHOLE VISUALIZER
            </h3>
            <span className="text-[12px] text-[#4B5563] dark:text-zinc-400 font-sans">
              2D Geotechnical Stratum Cross-Section (Sensor Borehole #01)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[13px] font-sans">
          <span className="text-[#4B5563] dark:text-zinc-400 font-medium">Deformation Velocity:</span>
          <span className={`font-mono font-bold ${
            isCritical
              ? 'text-[#DC2626] dark:text-rose-400 animate-pulse'
              : isWarning
              ? 'text-[#D97706] dark:text-amber-400'
              : 'text-[#0F766E] dark:text-emerald-400'
          }`}>
            {telemetry.displacementRate} mm/hr
          </span>
        </div>
      </div>

      {/* SVG Slope Cross-section Diagram */}
      <div className="relative w-full h-72 sm:h-80 bg-gray-50/80 dark:bg-zinc-950/80 rounded-xl border border-gray-200 dark:border-zinc-800/90 overflow-hidden flex items-center justify-center p-2">
        <div
          className="absolute inset-0 opacity-10 dark:opacity-10"
          style={{
            backgroundImage: isDark
              ? 'radial-gradient(#ffffff 1px, transparent 1px)'
              : 'radial-gradient(#000000 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <svg viewBox="0 0 600 320" className="w-full h-full select-none">
          <defs>
            <linearGradient id="colluviumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#27272a' : '#f1f5f9'} />
              <stop offset="100%" stopColor={isDark ? '#18181b' : '#e2e8f0'} />
            </linearGradient>

            <linearGradient id="bedrockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? '#18181b' : '#cbd5e1'} />
              <stop offset="100%" stopColor={isDark ? '#09090b' : '#94a3b8'} />
            </linearGradient>

            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(14, 165, 233, 0.35)'} />
              <stop offset="100%" stopColor={isDark ? 'rgba(37, 99, 235, 0.1)' : 'rgba(2, 132, 199, 0.1)'} />
            </linearGradient>

            <filter id="glowSlip" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Intact Deep Bedrock stratum */}
          <polygon
            points="0,180 340,250 600,280 600,320 0,320"
            fill="url(#bedrockGrad)"
            stroke={isDark ? '#3f3f46' : '#94a3b8'}
            strokeWidth="1"
          />

          {/* Colluvial/Soil slope stratum */}
          <polygon
            points="0,60 480,260 600,280 600,320 0,320"
            fill="url(#colluviumGrad)"
            stroke={isDark ? '#52525b' : '#cbd5e1'}
            strokeWidth="1.5"
          />

          {/* Water Table Saturation zone */}
          <path
            d={`M 0,${180 - waterTableHeightPct * 0.8} Q 250,${230 - waterTableHeightPct * 0.5} 480,260 L 600,280 L 600,320 L 0,320 Z`}
            fill="url(#waterGrad)"
          />
          <path
            d={`M 0,${180 - waterTableHeightPct * 0.8} Q 250,${230 - waterTableHeightPct * 0.5} 480,260`}
            fill="none"
            stroke={isDark ? '#38bdf8' : '#0284c7'}
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Potential Shear Failure Plane */}
          <path
            d="M 50,75 Q 260,200 440,255"
            fill="none"
            stroke={slipColor}
            strokeWidth={isCritical ? '3' : '2'}
            strokeDasharray={isCritical ? 'none' : '6 3'}
            filter="url(#glowSlip)"
          />

          {/* Sensor Borehole Drill Line */}
          <line
            x1="220"
            y1="152"
            x2="220"
            y2="280"
            stroke={isDark ? '#a1a1aa' : '#475569'}
            strokeWidth="2.5"
          />

          {/* Surface Inclinometer Node */}
          <circle cx="220" cy="152" r="5" fill={isDark ? '#10b981' : '#0F766E'} stroke="#ffffff" strokeWidth="1.5" />
          <text x="232" y="156" fill={isDark ? '#10b981' : '#0F766E'} fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
            MEMS INCLINOMETER ({tiltAngle}°)
          </text>

          {/* Deep Piezometer Sensor at -8m */}
          <circle cx="220" cy="225" r="4.5" fill={isDark ? '#38bdf8' : '#0284c7'} stroke="#ffffff" strokeWidth="1" />
          <text x="232" y="228" fill={isDark ? '#38bdf8' : '#0284c7'} fontSize="9" fontFamily="JetBrains Mono, monospace">
            PIEZOMETER (-8m pore pressure)
          </text>

          {/* Deep Anchor */}
          <circle cx="220" cy="275" r="3.5" fill={isDark ? '#71717a' : '#64748b'} />
          <text x="232" y="278" fill={isDark ? '#71717a' : '#64748b'} fontSize="8" fontFamily="JetBrains Mono, monospace">
            BEDROCK DATUM (-14m)
          </text>

          {/* Live Shear Displacement Vector Arrow */}
          <g transform="translate(180, 130)">
            <line
              x1="0"
              y1="0"
              x2="40"
              y2="18"
              stroke={slipColor}
              strokeWidth="3"
            />
            <polygon
              points="40,18 30,12 34,22"
              fill={slipColor}
            />
            <text x="45" y="24" fill={slipColor} fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="bold">
              {telemetry.displacement}mm vector
            </text>
          </g>

          {/* Stratigraphy Labels */}
          <text x="15" y="45" fill={isDark ? '#71717a' : '#475569'} fontSize="10" fontFamily="Inter, sans-serif" fontWeight="bold">
            HILLSIDE CREST (EL. 842m)
          </text>
          <text x="15" y="115" fill={isDark ? '#a1a1aa' : '#64748b'} fontSize="9" fontFamily="Inter, sans-serif">
            Colluvial Soil Stratum (Loose)
          </text>
          <text x="15" y="260" fill={isDark ? '#71717a' : '#475569'} fontSize="9" fontFamily="Inter, sans-serif">
            Intact Sandstone Bedrock
          </text>
          <text x="400" y="305" fill={isDark ? '#38bdf8' : '#0369a1'} fontSize="9" fontFamily="Inter, sans-serif">
            Phreatic Line ({telemetry.soilMoisture}% Sat.)
          </text>
        </svg>

        <div className="absolute bottom-3 left-3 bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 px-3.5 py-1.5 rounded-lg flex items-center gap-2.5 text-[12px] font-sans shadow-card-light">
          <span className="w-2 h-2 rounded-full bg-[#0F766E] dark:bg-emerald-400 animate-ping" />
          <span className="text-[#4B5563] dark:text-zinc-400 font-medium">TILT:</span>
          <span className={`font-mono font-bold ${
            isCritical
              ? 'text-[#DC2626] dark:text-rose-400'
              : isWarning
              ? 'text-[#D97706] dark:text-amber-400'
              : 'text-[#0F766E] dark:text-emerald-400'
          }`}>
            {telemetry.tilt}°
          </span>
          <span className="text-gray-300 dark:text-zinc-600">|</span>
          <span className="text-[#4B5563] dark:text-zinc-400 font-medium">SATURATION:</span>
          <span className="text-[#2563EB] dark:text-blue-400 font-mono font-bold">{telemetry.soilMoisture}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#E2E8F0] dark:border-zinc-800/80 text-[12px] font-sans font-medium">
        <div className="flex items-center gap-2 text-[#4B5563] dark:text-zinc-300">
          <span className="w-3.5 h-1 bg-[#0F766E] dark:bg-emerald-400 rounded-sm inline-block" />
          <span>Nominal Shear Plane</span>
        </div>
        <div className="flex items-center gap-2 text-[#2563EB] dark:text-blue-400">
          <span className="w-3.5 h-1 bg-[#2563EB] rounded-sm inline-block" />
          <span>Phreatic Water Line</span>
        </div>
        <div className="flex items-center gap-2 text-[#4B5563] dark:text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-[#0F766E] dark:bg-emerald-400 inline-block" />
          <span>Borehole Inclinometer</span>
        </div>
        <div className="flex items-center gap-2 text-[#D97706] dark:text-amber-400">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>Displacement Vector</span>
        </div>
      </div>
    </div>
  );
};
