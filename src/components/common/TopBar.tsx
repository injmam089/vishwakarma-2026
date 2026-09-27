import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldAlert,
  ChevronDown,
  LogOut,
  Play,
  Pause,
  MapPin,
  Clock,
  Sparkles,
  Sun,
  Moon,
  Database,
  RefreshCw,
  Bell,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';
import { useMonitoring } from '../../context/MonitoringContext';
import type { RiskLevel } from '../../types';


export const TopBar: React.FC = () => {
  const {
    selectedZone,
    selectZoneById,
    zones,
    currentScenario,
    setScenario,
    isSimulating,
    toggleSimulation,
    lastUpdatedSecondsAgo,
    user,
    logout,
    theme,
    toggleTheme,
    appMode,
    toggleAppMode,
    apiStatus,
    wsStatus,
    notifications,
    unreadCount,
    markAllNotificationsAsRead,
    setActiveTab,
  } = useMonitoring();

  const [zoneDropdownOpen, setZoneDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const zoneRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (zoneRef.current && !zoneRef.current.contains(e.target as Node)) {
        setZoneDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#09090b] border-b border-[#E2E8F0] dark:border-zinc-800/80 px-4 lg:px-6 py-2.5 transition-colors duration-150">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Brand & Zone Selector */}
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 dark:bg-emerald-500/10 border border-teal-200 dark:border-emerald-500/30 text-[#0F766E] dark:text-emerald-400 shadow-sm">
              <ShieldAlert className="w-4 h-4 text-[#0F766E] dark:text-emerald-400" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#0F766E] dark:bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-[18px] text-[#111827] dark:text-zinc-100 font-sans">
                LANDSAFE
              </span>
              <span className="text-[12px] font-medium font-sans px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-[#4B5563] dark:text-zinc-400 border border-[#E2E8F0] dark:border-zinc-700 hidden sm:inline-block">
                IoT Monitor
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-[#E2E8F0] dark:bg-zinc-800 hidden sm:block" />

          {/* Current Zone Dropdown */}
          <div className="relative" ref={zoneRef}>
            <button
              onClick={() => setZoneDropdownOpen(!zoneDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 text-[13px] font-sans text-[#111827] dark:text-zinc-200 hover:bg-gray-100/80 dark:hover:bg-zinc-850 transition-all shadow-card-light group"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0F766E] dark:text-emerald-400 shrink-0" />
              <div className="text-left hidden xs:block">
                <span className="font-mono font-semibold text-[#111827] dark:text-zinc-100">{selectedZone.id}</span>
                <span className="text-[#4B5563] dark:text-zinc-400 text-[13px] ml-1.5 hidden md:inline">
                  — {selectedZone.name}
                </span>
              </div>
              <span className="xs:hidden font-mono font-semibold">{selectedZone.id}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] dark:text-zinc-400 group-hover:text-[#111827] dark:group-hover:text-zinc-200 transition-transform" />
            </button>

            {zoneDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 shadow-lg p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2.5 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#6B7280] dark:text-zinc-500 border-b border-[#E2E8F0] dark:border-zinc-800 mb-1">
                  Select Monitoring Sector
                </div>
                {zones.map((z) => (
                  <button
                    key={z.id}
                    onClick={() => {
                      selectZoneById(z.id);
                      setZoneDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-[13px] transition-all ${
                      z.id === selectedZone.id
                        ? 'bg-teal-50 dark:bg-zinc-800 text-[#0F766E] dark:text-zinc-100 font-semibold border border-teal-200 dark:border-zinc-700'
                        : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div>
                      <div className="font-mono font-semibold text-[#111827] dark:text-zinc-100">{z.id}</div>
                      <div className="text-[12px] text-[#4B5563] dark:text-zinc-400 font-sans">{z.name}</div>
                    </div>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        z.risk === 'CRITICAL'
                          ? 'bg-[#DC2626]'
                          : z.risk === 'WARNING'
                          ? 'bg-[#D97706]'
                          : 'bg-[#16A34A]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center/Right: Scenario Switcher, Connection, Theme Toggle, Profile */}
        <div className="flex items-center gap-2.5 lg:gap-3.5">
          {/* Quick Scenario Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-gray-50 dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 p-1 rounded-lg">
            <span className="text-[12px] font-medium text-[#6B7280] dark:text-zinc-400 px-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#0F766E] dark:text-cyan-400" />
              State:
            </span>
            {(['NORMAL', 'WARNING', 'CRITICAL'] as RiskLevel[]).map((level) => {
              const active = currentScenario === level;
              let activeClass = 'bg-white text-[#111827] shadow-sm border border-[#E2E8F0] dark:bg-zinc-800 dark:text-zinc-200';
              if (active) {
                if (level === 'NORMAL') activeClass = 'bg-[#16A34A] text-white font-semibold shadow-sm';
                else if (level === 'WARNING') activeClass = 'bg-[#D97706] text-white font-semibold shadow-sm';
                else if (level === 'CRITICAL') activeClass = 'bg-[#DC2626] text-white font-semibold shadow-sm';
              }
              return (
                <button
                  key={level}
                  onClick={() => setScenario(level)}
                  className={`text-[12px] font-sans font-medium px-2.5 py-1 rounded transition-all ${
                    active ? activeClass : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>

          {/* Real-time Stream & Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 text-[13px]">
            {appMode === 'API' ? (
              <div className="flex items-center gap-1.5">
                {wsStatus === 'LIVE' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                    <span className="text-[#4B5563] dark:text-zinc-400 text-[13px] font-medium">Stream:</span>
                    <span className="text-[#16A34A] dark:text-emerald-400 font-semibold font-mono text-[12px]">LIVE</span>
                    <span className="text-[11px] font-mono text-[#6B7280] dark:text-zinc-400 hidden xl:inline">STOMP/WS</span>
                  </>
                )}
                {wsStatus === 'CONNECTING' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-[#4B5563] dark:text-zinc-400 text-[13px] font-medium">Stream:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold font-mono text-[12px]">CONNECTING</span>
                  </>
                )}
                {wsStatus === 'RECONNECTING' && (
                  <>
                    <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
                    <span className="text-[#4B5563] dark:text-zinc-400 text-[13px] font-medium">Stream:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold font-mono text-[12px]">RECONNECTING</span>
                  </>
                )}
                {wsStatus === 'OFFLINE' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                    <span className="text-[#4B5563] dark:text-zinc-400 text-[13px] font-medium">Stream:</span>
                    <span className="text-[#DC2626] dark:text-rose-400 font-semibold font-mono text-[12px]">OFFLINE</span>
                  </>
                )}
              </div>
            ) : (
              <>
                <span className={`w-2 h-2 rounded-full ${isSimulating ? 'bg-[#16A34A] animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-[#4B5563] dark:text-zinc-400 text-[13px] font-medium">Gateway:</span>
                <span className="text-[#111827] dark:text-zinc-200 font-semibold">{isSimulating ? 'LIVE' : 'PAUSED'}</span>
                <span className="text-[12px] font-mono text-[#6B7280] dark:text-zinc-400 hidden xl:inline">SIM</span>
                <button
                  onClick={toggleSimulation}
                  title={isSimulating ? 'Pause simulated telemetry' : 'Resume simulated telemetry'}
                  className="text-[#6B7280] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-100 p-0.5 rounded transition-colors ml-0.5"
                >
                  {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#0F766E] dark:text-emerald-400" />}
                </button>
              </>
            )}
          </div>

          {/* App Mode (API vs MOCK) Toggle */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 text-[13px] font-sans">
            <Database className="w-3.5 h-3.5 text-[#0F766E] dark:text-emerald-400 shrink-0" />
            <button
              onClick={toggleAppMode}
              title={`Click to switch mode (Current: ${appMode === 'API' ? 'Spring Boot REST API' : 'Client Mock Simulation'})`}
              className={`px-2 py-0.5 rounded font-mono font-medium text-[11px] transition-all flex items-center gap-1.5 ${
                appMode === 'API'
                  ? (apiStatus === 'CONNECTED'
                      ? 'bg-teal-50 dark:bg-emerald-950/40 text-[#0F766E] dark:text-emerald-400 border border-teal-200 dark:border-emerald-700/50 hover:bg-teal-100/60'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50 hover:bg-amber-100/60')
                  : 'bg-gray-100 dark:bg-zinc-800 text-[#4B5563] dark:text-zinc-300 border border-[#E2E8F0] dark:border-zinc-700 hover:bg-gray-200/60'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  appMode === 'API'
                    ? (apiStatus === 'CONNECTED' ? 'bg-[#16A34A] animate-pulse' : 'bg-amber-500')
                    : 'bg-indigo-500'
                }`}
              />
              {appMode === 'API' ? (apiStatus === 'CONNECTED' ? 'API: ONLINE' : 'API: FALLBACK') : 'MOCK MODE'}
            </button>
          </div>

          {/* Last Updated */}
          <div className="hidden md:flex items-center gap-1.5 text-[13px] text-[#4B5563] dark:text-zinc-400 px-1 py-1">
            <Clock className="w-3.5 h-3.5 text-[#6B7280] dark:text-zinc-400" />
            <span>
              {lastUpdatedSecondsAgo === 0
                ? 'Syncing...'
                : `${lastUpdatedSecondsAgo}s ago`}
            </span>
          </div>

          {/* Theme Toggle (Light / Dark) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 text-[#4B5563] dark:text-zinc-300 transition-colors shadow-card-light"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#111827]" />
            )}
          </button>

          {/* Notification Indicator & Popover */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              title="Alert Notifications"
              className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 text-[#4B5563] dark:text-zinc-300 transition-colors shadow-card-light"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <Bell className="w-4 h-4 text-[#111827] dark:text-zinc-200" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold font-mono text-white bg-red-600 rounded-full border-2 border-white dark:border-[#09090b] animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-80 sm:w-96 rounded-xl bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
                <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#E2E8F0] dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-850/50">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-[#111827] dark:text-zinc-100 uppercase tracking-wider font-sans">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="flex items-center gap-1 text-[11px] text-[#0F766E] dark:text-emerald-400 hover:underline font-medium"
                    >
                      <CheckCheck className="w-3 h-3" />
                      Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#E2E8F0] dark:divide-zinc-800/80">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#6B7280] dark:text-zinc-400">
                      No notifications logged
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((n, idx) => (
                      <div
                        key={`${n.alertId || n.condition}-${idx}`}
                        onClick={() => {
                          setActiveTab('alerts');
                          setNotifDropdownOpen(false);
                        }}
                        className={`p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-teal-50/20 dark:bg-emerald-950/10' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                                n.severity === 'CRITICAL'
                                  ? 'bg-red-600 text-white'
                                  : n.severity === 'WARNING'
                                  ? 'bg-amber-600 text-white'
                                  : n.severity === 'DEVICE_OFFLINE'
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {n.severity}
                            </span>
                            <span className="text-[11px] font-mono text-[#6B7280] dark:text-zinc-400">
                              {n.zoneId}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#6B7280] dark:text-zinc-500">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#111827] dark:text-zinc-200 line-clamp-2 leading-relaxed">
                          {n.condition || n.reason}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-[#E2E8F0] dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-850/50 text-center">
                  <button
                    onClick={() => {
                      setActiveTab('alerts');
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 w-full py-1 text-xs text-[#0F766E] dark:text-emerald-400 hover:text-teal-800 dark:hover:text-emerald-300 font-medium"
                  >
                    View Alert Center
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 border border-transparent hover:border-[#E2E8F0] dark:hover:border-zinc-800 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-zinc-800 border border-teal-200 dark:border-zinc-700 flex items-center justify-center text-[12px] font-sans font-bold text-[#0F766E] dark:text-emerald-400">
                {user?.avatarInitials || 'OP'}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] dark:text-zinc-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 shadow-lg p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-2.5 py-2 border-b border-[#E2E8F0] dark:border-zinc-800">
                  <div className="font-semibold text-sm text-[#111827] dark:text-zinc-200">{user?.name}</div>
                  <div className="text-[12px] text-[#4B5563] dark:text-zinc-400 truncate">{user?.email}</div>
                  <div className="mt-1 text-[11px] font-sans text-[#0F766E] dark:text-emerald-400 uppercase tracking-wider font-semibold">
                    {user?.role.replace('_', ' ')}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    logout();
                  }}
                  className="w-full mt-1 flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors font-medium font-sans"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
