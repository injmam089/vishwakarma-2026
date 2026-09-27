import React, { useState, useMemo } from 'react';
import { useMonitoring } from '../../context/MonitoringContext';
import type { AlertSeverity } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import {
  BellRing,
  CheckCircle2,
  Clock,
  MapPin,
  Cpu,
  Search,
  Filter,
  Check,
} from 'lucide-react';

export const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, zones } = useMonitoring();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | AlertSeverity>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'>('ALL');
  const [zoneFilter, setZoneFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Statistics
  const activeCritical = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'ACTIVE').length;
  const activeWarning = alerts.filter((a) => a.severity === 'WARNING' && a.status === 'ACTIVE').length;
  const totalResolved = alerts.filter((a) => a.status === 'RESOLVED').length;

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
      if (zoneFilter !== 'ALL' && a.zoneId !== zoneFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesCondition = a.condition.toLowerCase().includes(query);
        const matchesDevice = a.deviceId.toLowerCase().includes(query);
        const matchesZone = a.zoneId.toLowerCase().includes(query);
        if (!matchesCondition && !matchesDevice && !matchesZone) return false;
      }
      return true;
    });
  }, [alerts, severityFilter, statusFilter, zoneFilter, searchQuery]);


  return (
    <div className="space-y-5 lg:space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header and Summary stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light transition-colors duration-150">
        <div>
          <h2 className="text-[20px] font-bold text-[#111827] dark:text-zinc-100 font-sans tracking-tight flex items-center gap-2">
            <BellRing className="w-5 h-5 text-[#DC2626] dark:text-rose-400" />
            Hazard Alerts & Dispatch Audit
          </h2>
          <p className="text-[13px] text-[#4B5563] dark:text-zinc-400 font-sans mt-0.5">
            Automated threshold violation log & emergency response protocol
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-rose-50 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/50 text-[13px] font-sans font-semibold">
            <span className="text-[#DC2626] dark:text-rose-400 font-bold">{activeCritical}</span>
            <span className="text-[#4B5563] dark:text-zinc-400 ml-1.5">Critical Active</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/50 text-[13px] font-sans font-semibold">
            <span className="text-[#D97706] dark:text-amber-400 font-bold">{activeWarning}</span>
            <span className="text-[#4B5563] dark:text-zinc-400 ml-1.5">Warning Active</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/40 text-[13px] font-sans font-semibold hidden md:block">
            <span className="text-[#16A34A] dark:text-emerald-400 font-bold">{totalResolved}</span>
            <span className="text-[#4B5563] dark:text-zinc-400 ml-1.5">Resolved</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light flex flex-wrap items-center justify-between gap-3">
        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[12px] font-sans font-semibold text-[#6B7280] dark:text-zinc-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {(['ALL', 'CRITICAL', 'WARNING', 'DEVICE_OFFLINE', 'DEVICE_RECOVERED'] as ('ALL' | AlertSeverity)[]).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 text-[12px] font-sans rounded-lg transition-all ${
                severityFilter === sev
                  ? 'bg-gray-100 text-[#111827] font-semibold border border-[#E2E8F0] dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 shadow-card-light'
                  : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-900 font-medium'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>


        {/* Status Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[12px] font-sans font-semibold text-[#6B7280] dark:text-zinc-500 mr-1">Status:</span>
          {(['ALL', 'ACTIVE', 'ACKNOWLEDGED', 'RESOLVED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-[12px] font-sans rounded-lg transition-all ${
                statusFilter === st
                  ? 'bg-gray-100 text-[#111827] font-semibold border border-[#E2E8F0] dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 shadow-card-light'
                  : 'text-[#4B5563] dark:text-zinc-400 hover:text-[#111827] dark:hover:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-900 font-medium'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Zone Filter selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-sans font-semibold text-[#6B7280] dark:text-zinc-500 mr-1">Sector:</span>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-gray-50 dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-lg px-3 py-1.5 text-[12px] font-sans font-medium text-[#111827] dark:text-zinc-200 focus:outline-none focus:border-[#0F766E]"
          >
            <option value="ALL">All Sectors</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.id}</option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="w-4 h-4 text-[#6B7280] dark:text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search conditions, nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-zinc-900 border border-[#E2E8F0] dark:border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-[12px] font-sans text-[#111827] dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#0F766E]"
          />
        </div>
      </div>

      {/* Alert Cards Timeline List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 shadow-card-light">
            <CheckCircle2 className="w-10 h-10 text-[#0F766E] dark:text-emerald-400 mx-auto mb-2 opacity-80" />
            <h3 className="text-[15px] font-semibold text-[#111827] dark:text-zinc-200 font-sans">No Alerts Match Criteria</h3>
            <p className="text-[13px] text-[#4B5563] dark:text-zinc-500 font-sans mt-1">
              All sensors in the selected query are operating within safe geological limits.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isWarning = alert.severity === 'WARNING';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl bg-white dark:bg-[#121217] border transition-all duration-150 shadow-card-light ${
                  isCritical
                    ? 'border-[#E2E8F0] border-l-4 border-l-[#DC2626] dark:border-zinc-800 dark:border-l-[#DC2626]'
                    : isWarning
                    ? 'border-[#E2E8F0] border-l-4 border-l-[#D97706] dark:border-zinc-800 dark:border-l-[#D97706]'
                    : 'border-[#E2E8F0] dark:border-zinc-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="pt-0.5 shrink-0">
                      <StatusBadge status={alert.severity} size="md" showDot={true} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono font-bold text-[14px] text-[#111827] dark:text-zinc-100">
                          {alert.id}
                        </span>
                        <span className="text-[14px] font-sans font-medium text-[#111827] dark:text-zinc-200">
                          • {alert.condition}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[13px] font-sans mt-1 text-[#4B5563] dark:text-zinc-400">
                        <span>
                          Reading: <strong className="font-mono text-[#111827] dark:text-zinc-200">{alert.value}</strong>
                        </span>
                        <span>
                          Threshold: <strong className="font-mono text-[#111827] dark:text-zinc-300">{alert.threshold}</strong>
                        </span>
                      </div>

                      <p className="text-[12px] text-[#6B7280] dark:text-zinc-400 font-sans mt-1 italic">
                        Protocol: {alert.protocol}
                      </p>

                      <div className="flex items-center gap-3 text-[12px] font-mono text-[#6B7280] dark:text-zinc-400 mt-2 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#6B7280] dark:text-zinc-400" />
                          {alert.timestamp}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#6B7280] dark:text-zinc-400" />
                          {alert.zoneId}
                        </span>
                        <span className="flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5 text-[#6B7280] dark:text-zinc-400" />
                          Node: {alert.deviceId}
                        </span>
                      </div>

                      {alert.acknowledgedBy && alert.status === 'ACKNOWLEDGED' && (
                        <div className="text-[11px] text-[#0F766E] dark:text-emerald-400 font-sans mt-1.5 flex items-center gap-1">
                          <span>Acknowledged by <strong className="font-semibold">{alert.acknowledgedBy}</strong></span>
                          {alert.acknowledgedAt && <span>at {new Date(alert.acknowledgedAt).toLocaleTimeString()}</span>}
                        </div>
                      )}

                      {alert.resolvedBy && alert.status === 'RESOLVED' && (
                        <div className="text-[11px] text-[#16A34A] dark:text-emerald-400 font-sans mt-1.5 flex items-center gap-1">
                          <span>Resolved by <strong className="font-semibold">{alert.resolvedBy}</strong></span>
                          {alert.resolvedAt && <span>at {new Date(alert.resolvedAt).toLocaleTimeString()}</span>}
                        </div>
                      )}
                    </div>
                  </div>


                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    {alert.status === 'ACTIVE' && (
                      <>
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-[#111827] border border-[#E2E8F0] dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 dark:border-zinc-700 text-[12px] font-sans font-semibold transition-colors shadow-card-light"
                        >
                          Acknowledge
                        </button>
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-[12px] font-sans font-semibold transition-colors flex items-center gap-1 shadow-card-light"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Resolve
                        </button>
                      </>
                    )}

                    {alert.status === 'ACKNOWLEDGED' && (
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-md bg-amber-50 border border-amber-200 text-[#D97706] text-[12px] font-sans font-semibold">
                          ACKNOWLEDGED
                        </span>
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#115E59] text-white text-[12px] font-sans font-semibold transition-colors flex items-center gap-1 shadow-card-light"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Resolve
                        </button>
                      </div>
                    )}

                    {alert.status === 'RESOLVED' && (
                      <span className="px-3.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#16A34A] text-[12px] font-sans font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        CLEARED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
