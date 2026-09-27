import React from 'react';
import {
  LayoutDashboard,
  Activity,
  History,
  BellRing,
  Cpu,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';
import type { NavigationTab } from '../../types';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { activeTab, setActiveTab, alerts, selectedZone } = useMonitoring();

  const activeAlertsCount = alerts.filter(a => a.status === 'ACTIVE').length;

  const NAV_ITEMS: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live', label: 'Live', icon: Activity },
    { id: 'history', label: 'History', icon: History },
    { id: 'alerts', label: 'Alerts', icon: BellRing, badge: activeAlertsCount },
    { id: 'devices', label: 'Devices', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between border-r border-[#E2E8F0] dark:border-zinc-800/80 bg-white dark:bg-[#0c0c10] transition-all duration-300 select-none z-30 shrink-0 ${
        collapsed ? 'w-16' : 'w-56 lg:w-60'
      }`}
    >
      <div className="flex flex-col p-3 gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-[14px] transition-all group relative font-sans ${
                isActive
                  ? 'bg-teal-50 dark:bg-zinc-800 text-[#0F766E] dark:text-zinc-100 font-semibold border border-teal-200/80 dark:border-zinc-700 shadow-card-light'
                  : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-900/60 border border-transparent'
              }`}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                  isActive
                    ? 'text-[#0F766E] dark:text-emerald-400'
                    : 'text-[#6B7280] dark:text-zinc-500 group-hover:text-[#111827] dark:group-hover:text-zinc-200'
                }`}
              />

              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`ml-auto font-mono text-[11px] px-1.5 py-0.5 rounded-full font-bold transition-all ${
                    collapsed
                      ? 'absolute top-1.5 right-1.5 w-2 h-2 p-0 bg-[#DC2626] rounded-full'
                      : 'bg-rose-50 text-[#DC2626] border border-rose-200 dark:bg-rose-950/80 dark:text-rose-400 dark:border-rose-800/50'
                  }`}
                >
                  {!collapsed && item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-[#E2E8F0] dark:border-zinc-800/80 flex flex-col gap-2">
        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 text-[12px]">
            <div className="flex items-center justify-between text-[#6B7280] dark:text-zinc-400 mb-1 font-medium font-sans">
              <span>ACTIVE SECTOR</span>
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            </div>
            <div className="font-mono font-semibold text-[#111827] dark:text-zinc-200 truncate">{selectedZone.id}</div>
            <div className="text-[12px] text-[#4B5563] dark:text-zinc-400 truncate mt-0.5 font-sans">{selectedZone.name}</div>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="flex items-center justify-center p-2 rounded-lg bg-gray-50 dark:bg-zinc-900/50 border border-[#E2E8F0] dark:border-zinc-800/60 hover:bg-gray-100 dark:hover:bg-zinc-850 hover:text-[#111827] dark:hover:text-zinc-200 text-[#4B5563] dark:text-zinc-400 transition-all w-full font-sans"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (
            <div className="flex items-center justify-between w-full px-1 text-[13px] font-medium">
              <span>Collapse</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
