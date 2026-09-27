import React from 'react';
import type { AlertSeverity } from '../../types';

interface StatusBadgeProps {
  status: AlertSeverity | 'ONLINE' | 'OFFLINE' | 'STANDBY' | 'DEGRADED' | 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  let colorStyles = 'bg-gray-100 text-[#4B5563] border-[#E2E8F0] dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';
  let dotColor = 'bg-gray-400 dark:bg-zinc-400';
  let pulse = false;

  switch (status) {
    case 'NORMAL':
    case 'ONLINE':
    case 'RESOLVED':
    case 'DEVICE_RECOVERED':
      colorStyles = 'bg-emerald-50 text-[#16A34A] border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50';
      dotColor = 'bg-[#16A34A] dark:bg-emerald-400';
      pulse = status === 'ONLINE';
      break;

    case 'WARNING':
    case 'STANDBY':
    case 'ACKNOWLEDGED':
    case 'DEGRADED':
    case 'DEVICE_OFFLINE':
      colorStyles = status === 'DEVICE_OFFLINE'
        ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800/50'
        : 'bg-amber-50 text-[#D97706] border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50';
      dotColor = status === 'DEVICE_OFFLINE' ? 'bg-orange-500' : 'bg-[#D97706] dark:bg-amber-400';
      pulse = status === 'WARNING' || status === 'DEVICE_OFFLINE';
      break;

    case 'CRITICAL':
    case 'OFFLINE':
    case 'ACTIVE':
      colorStyles = 'bg-rose-50 text-[#DC2626] border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/60 shadow-sm';
      dotColor = 'bg-[#DC2626] dark:bg-rose-500';
      pulse = true;
      break;
  }


  const sizeStyles = {
    sm: 'text-[12px] px-2.5 py-0.5 tracking-wide',
    md: 'text-[12px] px-3 py-1 tracking-wider',
    lg: 'text-[14px] px-3.5 py-1.5 tracking-wider font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-sans uppercase border font-semibold transition-all ${colorStyles} ${sizeStyles} ${className}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`} />
        </span>
      )}
      {status}
    </span>
  );
};
