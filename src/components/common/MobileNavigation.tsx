import React from 'react';
import {
  LayoutDashboard,
  Activity,
  History,
  BellRing,
  Cpu,
  Sliders,
} from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';
import type { NavigationTab } from '../../types';

export const MobileNavigation: React.FC = () => {
  const { activeTab, setActiveTab, alerts } = useMonitoring();
  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const NAV_ITEMS: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live', label: 'Live', icon: Activity },
    { id: 'history', label: 'History', icon: History },
    { id: 'alerts', label: 'Alerts', icon: BellRing, badge: activeAlertsCount },
    { id: 'devices', label: 'Devices', icon: Cpu },
    { id: 'settings', label: 'Config', icon: Sliders },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#09090b] border-t border-[#E2E8F0] dark:border-zinc-800 px-2 py-1.5 flex items-center justify-around shadow-lg safe-area-bottom transition-colors duration-150">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl font-sans text-[11px] transition-all relative ${
              isActive
                ? 'text-[#0F766E] dark:text-emerald-400 font-bold'
                : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#DC2626] text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
