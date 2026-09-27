import React from 'react';
import { AlertTriangle, AlertCircle, Radio, CheckCircle, X } from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';
import type { AlertSeverity } from '../../types';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, setActiveTab } = useMonitoring();

  if (!toasts || toasts.length === 0) return null;

  const getSeverityStyle = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-50 dark:bg-red-950/80',
          border: 'border-red-300 dark:border-red-700/60',
          text: 'text-red-900 dark:text-red-200',
          badge: 'bg-red-600 text-white',
          icon: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />,
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/80',
          border: 'border-amber-300 dark:border-amber-700/60',
          text: 'text-amber-900 dark:text-amber-200',
          badge: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
        };
      case 'DEVICE_OFFLINE':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/80',
          border: 'border-orange-300 dark:border-orange-700/60',
          text: 'text-orange-900 dark:text-orange-200',
          badge: 'bg-orange-600 text-white',
          icon: <Radio className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0" />,
        };
      default:
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/80',
          border: 'border-emerald-300 dark:border-emerald-700/60',
          text: 'text-emerald-900 dark:text-emerald-200',
          badge: 'bg-emerald-600 text-white',
          icon: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        };
    }
  };

  return (
    <div
      className="fixed top-20 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
      role="region"
      aria-label="Alert notifications"
    >
      {toasts.map(toast => {
        const style = getSeverityStyle(toast.severity);
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-lg backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${style.bg} ${style.border}`}
          >
            {style.icon}
            <div
              className="flex-1 min-w-0 cursor-pointer"
              onClick={() => {
                setActiveTab('alerts');
                dismissToast(toast.id);
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${style.badge}`}>
                  {toast.severity}
                </span>
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                  {toast.zoneId}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto">
                  {toast.timestamp}
                </span>
              </div>
              <p className={`text-xs font-medium leading-relaxed truncate-2-lines ${style.text}`}>
                {toast.condition}
              </p>
            </div>
            <button

              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Dismiss"
              aria-label="Dismiss alert notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};