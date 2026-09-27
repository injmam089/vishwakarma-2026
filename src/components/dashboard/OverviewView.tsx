import React from 'react';
import { useMonitoring } from '../../context/MonitoringContext';
import { RiskStatus } from './RiskStatus';
import { SensorCard } from './SensorCard';
import { MovementChart } from './MovementChart';
import { EnvironmentalChart } from './EnvironmentalChart';
import { VibrationChart } from './VibrationChart';
import { AlertItem } from './AlertItem';
import { DeviceStatus } from './DeviceStatus';
import { BellRing, ArrowRight } from 'lucide-react';

export const OverviewView: React.FC = () => {
  const {
    telemetry,
    alerts,
    acknowledgeAlert,
    setActiveTab,
  } = useMonitoring();

  const recentAlerts = alerts.slice(0, 4);

  const getTiltStatus = () => {
    if (telemetry.tilt >= 12) return 'CRITICAL SHEAR';
    if (telemetry.tilt >= 5) return 'ACCELERATING';
    return 'Within Baseline';
  };

  const getMoistureStatus = () => {
    if (telemetry.soilMoisture >= 92) return 'CRITICAL SATURATION';
    if (telemetry.soilMoisture >= 80) return 'Elevated Saturation';
    return 'Stable Drain';
  };

  const getRainStatus = () => {
    if (telemetry.rainfall >= 75) return 'TORRENTIAL STORM';
    if (telemetry.rainfall >= 35) return 'Heavy Rainfall';
    return 'Light Precip';
  };

  const getVibrationStatus = () => {
    if (telemetry.vibration >= 1.2) return 'COLLAPSE TREMORS';
    if (telemetry.vibration >= 0.5) return 'Acoustic Shift';
    return 'Ambient Baseline';
  };

  const getBatteryStatus = () => {
    if (telemetry.battery <= 20) return 'CRITICAL BATTERY';
    if (telemetry.battery <= 40) return 'Low Battery';
    return 'Nominal Solar';
  };

  return (
    <div className="space-y-5 lg:space-y-6 max-w-7xl mx-auto pb-10">
      <RiskStatus />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 lg:gap-4">
        <SensorCard
          title="Ground Tilt"
          value={telemetry.tilt}
          unit="°"
          iconType="tilt"
          trendText={`+${telemetry.tiltTrend}°/h`}
          trendDirection={telemetry.tiltTrend > 0.1 ? 'up' : 'neutral'}
          status={getTiltStatus()}
          riskSeverity={telemetry.tilt >= 12 ? 'CRITICAL' : telemetry.tilt >= 5 ? 'WARNING' : 'NORMAL'}
          sparklinePoints={[2.2, 2.3, 2.3, 2.4, 2.4, telemetry.tilt - 0.1, telemetry.tilt]}
          subDetail={`Disp: ${telemetry.displacement}mm`}
        />

        <SensorCard
          title="Soil Moisture"
          value={telemetry.soilMoisture}
          unit="%"
          iconType="moisture"
          trendText={`+${telemetry.soilMoistureTrend}%`}
          trendDirection={telemetry.soilMoistureTrend > 1 ? 'up' : 'neutral'}
          status={getMoistureStatus()}
          riskSeverity={telemetry.soilMoisture >= 92 ? 'CRITICAL' : telemetry.soilMoisture >= 80 ? 'WARNING' : 'NORMAL'}
          sparklinePoints={[58, 61, 63, 65, 66, telemetry.soilMoisture - 1, telemetry.soilMoisture]}
          subDetail="Depth: -1.8m"
        />

        <SensorCard
          title="Rainfall (24h)"
          value={telemetry.rainfall}
          unit="mm"
          iconType="rain"
          trendText={`${telemetry.rainfallRate} mm/h`}
          trendDirection={telemetry.rainfallRate > 10 ? 'up' : 'neutral'}
          status={getRainStatus()}
          riskSeverity={telemetry.rainfall >= 75 ? 'CRITICAL' : telemetry.rainfall >= 35 ? 'WARNING' : 'NORMAL'}
          sparklinePoints={[4, 8, 11, 14, 16, telemetry.rainfall - 2, telemetry.rainfall]}
          subDetail="Accumulated"
        />

        <SensorCard
          title="Vibration"
          value={telemetry.vibration}
          unit="g"
          iconType="vibration"
          trendText={`${telemetry.vibrationTrend >= 0 ? '+' : ''}${telemetry.vibrationTrend}`}
          trendDirection={telemetry.vibrationTrend > 0.05 ? 'up' : 'neutral'}
          status={getVibrationStatus()}
          riskSeverity={telemetry.vibration >= 1.2 ? 'CRITICAL' : telemetry.vibration >= 0.5 ? 'WARNING' : 'NORMAL'}
          sparklinePoints={[0.18, 0.20, 0.19, 0.21, 0.22, telemetry.vibration - 0.02, telemetry.vibration]}
          subDetail="PGA Peak"
        />

        <SensorCard
          title="Battery"
          value={telemetry.battery}
          unit="%"
          iconType="battery"
          trendText={`${telemetry.batteryVoltage}V`}
          trendDirection={telemetry.solarCharging ? 'up' : 'down'}
          status={getBatteryStatus()}
          riskSeverity={telemetry.battery <= 20 ? 'CRITICAL' : telemetry.battery <= 40 ? 'WARNING' : 'NORMAL'}
          sparklinePoints={[94, 93, 92, 91, 91, 91, telemetry.battery]}
          subDetail={telemetry.solarCharging ? `Solar +${telemetry.solarPower}W` : 'Battery Drain'}
        />
      </div>

      <MovementChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EnvironmentalChart />
        <VibrationChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 p-5 flex flex-col justify-between shadow-card-light transition-colors duration-150">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-[#D97706] dark:text-amber-400" />
                <h3 className="text-[16px] font-semibold text-[#111827] dark:text-zinc-100 font-sans tracking-tight">
                  RECENT HAZARD ALERTS
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('alerts')}
                className="text-[13px] font-sans font-medium text-[#4B5563] hover:text-[#111827] dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recentAlerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onAcknowledge={acknowledgeAlert}
                  compact={true}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0] dark:border-zinc-800/80 flex items-center justify-between text-[13px] font-sans text-[#4B5563] dark:text-zinc-400">
            <span>Automated SMS/Email Emergency Broadcast Active</span>
            <span className="text-[#0F766E] dark:text-emerald-400 font-semibold font-sans">GATEWAY ARMED</span>
          </div>
        </div>

        <div className="lg:col-span-1">
          <DeviceStatus />
        </div>
      </div>
    </div>
  );
};
