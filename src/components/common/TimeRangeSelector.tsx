import React from 'react';
import type { TimeRange } from '../../types';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  className?: string;
}

const RANGES: { label: string; value: TimeRange }[] = [
  { label: '2H', value: '2H' },
  { label: '6H', value: '6H' },
  { label: '24H', value: '24H' },
  { label: '7D', value: '7D' },
  { label: 'CUSTOM', value: 'CUSTOM' },
];

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center p-1 bg-gray-100 dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-lg ${className}`}>
      {RANGES.map((item) => {
        const isActive = value === item.value;
        return (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={`px-3 py-1 text-[12px] font-sans rounded-md transition-all ${
              isActive
                ? 'bg-white text-[#111827] shadow-sm border border-[#E2E8F0] dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 font-semibold'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-gray-200/60 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800/40 font-medium'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
