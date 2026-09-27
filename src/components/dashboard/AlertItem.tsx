import React from 'react';
import type { AlertRecord } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Clock, MapPin } from 'lucide-react';

interface AlertItemProps {
  alert: AlertRecord;
  onAcknowledge?: (id: string) => void;
  compact?: boolean;
}

export const AlertItem: React.FC<AlertItemProps> = ({
  alert,
  onAcknowledge,
}) => {
  return (
    <div
      className={`group relative flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all ${
        alert.severity === 'CRITICAL'
          ? 'bg-rose-50/40 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800/40 hover:border-rose-300'
          : alert.severity === 'WARNING'
          ? 'bg-amber-50/40 border-amber-200 dark:bg-amber-950/15 dark:border-amber-800/40 hover:border-amber-300'
          : 'bg-white border-[#E2E8F0] dark:bg-zinc-900/60 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 shadow-card-light'
      }`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className="pt-0.5 shrink-0">
          <StatusBadge status={alert.severity} size="sm" showDot={true} />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[14px] font-medium text-[#111827] dark:text-zinc-100 font-sans line-clamp-1">
              {alert.condition}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[12px] font-mono text-[#6B7280] dark:text-zinc-400 mt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#6B7280] dark:text-zinc-400" />
              {alert.timestamp}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#6B7280] dark:text-zinc-400" />
              {alert.zoneId}
            </span>
            <span>Node: {alert.deviceId}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-1.5 self-center">
        {alert.status === 'ACTIVE' && onAcknowledge && (
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="text-[12px] font-sans font-semibold px-2.5 py-1 rounded-md bg-white hover:bg-gray-50 text-[#111827] border border-[#E2E8F0] dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-zinc-200 dark:border-zinc-700 transition-colors shadow-card-light"
          >
            ACK
          </button>
        )}
        {alert.status === 'ACKNOWLEDGED' && (
          <span className="text-[12px] font-sans font-medium text-[#D97706] bg-amber-50 border border-amber-200 dark:text-amber-400/80 px-2 py-0.5 rounded-md dark:bg-amber-950/40 dark:border-amber-900/50">
            ACKED
          </span>
        )}
        {alert.status === 'RESOLVED' && (
          <span className="text-[12px] font-sans font-medium text-[#16A34A] bg-emerald-50 border border-emerald-200 dark:text-emerald-400/80 px-2 py-0.5 rounded-md dark:bg-emerald-950/30 dark:border-emerald-900/40">
            CLEARED
          </span>
        )}
      </div>
    </div>
  );
};
