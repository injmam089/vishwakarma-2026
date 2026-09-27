import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useMonitoring } from '../../context/MonitoringContext';
import { Activity } from 'lucide-react';

export const VibrationChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const { chartData, currentScenario, thresholds, theme } = useMonitoring();

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const isDark = theme === 'dark';
    const times = chartData.map((d) => d.timeLabel);
    const vibes = chartData.map((d) => d.vibration);

    const isCritical = currentScenario === 'CRITICAL';
    const isWarning = currentScenario === 'WARNING';
    const lineColor = isCritical
      ? '#DC2626'
      : isWarning
      ? '#D97706'
      : '#2563EB';

    const axisLineColor = isDark ? '#27272a' : '#E2E8F0';
    const axisLabelColor = isDark ? '#a1a1aa' : '#4B5563';
    const splitLineColor = isDark ? '#1e1e24' : '#E5E7EB';
    const tooltipBg = isDark ? '#18181b' : '#FFFFFF';
    const tooltipBorder = isDark ? '#3f3f46' : '#E2E8F0';
    const tooltipText = isDark ? '#f4f4f5' : '#111827';

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      animationDuration: 500,
      grid: {
        top: 35,
        left: 45,
        right: 25,
        bottom: 25,
        containLabel: false,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        textStyle: { color: tooltipText, fontFamily: 'Inter, sans-serif', fontSize: 12 },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius: 8px; padding: 10px;',
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return '';
          return `<div style="font-family: monospace; font-size: 12px;">
            <div style="color: ${axisLabelColor};">TIME: ${params[0].name}</div>
            <div style="color: ${lineColor}; font-weight: bold; margin-top: 3px;">
              VIBRATION: ${params[0].value} g
            </div>
          </div>`;
        },
      },
      xAxis: {
        type: 'category',
        data: times,
        boundaryGap: false,
        axisLine: { lineStyle: { color: axisLineColor } },
        axisLabel: { color: axisLabelColor, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
        axisTick: { show: false },
      },
      yAxis: {
        type: 'value',
        name: 'Accel (g)',
        nameTextStyle: { color: axisLabelColor, fontFamily: 'Inter, sans-serif', fontSize: 11 },
        splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } },
        axisLabel: { color: axisLabelColor, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
      },
      series: [
        {
          name: 'Vibration',
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2.5, color: lineColor },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: isCritical ? 'rgba(220,38,38,0.2)' : isWarning ? 'rgba(217,119,6,0.2)' : 'rgba(37,99,235,0.18)' },
              { offset: 1, color: 'rgba(0, 0, 0, 0)' },
            ]),
          },
          markLine: {
            silent: true,
            symbol: 'none',
            data: [
              {
                yAxis: thresholds.vibration.warning,
                lineStyle: { color: '#D97706', type: 'dashed', width: 1.5 },
                label: { formatter: 'Warn ({c}g)', position: 'insideEndTop', color: '#D97706', fontSize: 10, fontFamily: 'monospace' },
              },
            ],
          },
          data: vibes,
        },
      ],
    };

    chartInstance.current.setOption(option, true);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [chartData, currentScenario, thresholds, theme]);

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 p-5 flex flex-col justify-between shadow-card-light transition-colors duration-150">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-[15px] font-semibold text-[#111827] dark:text-zinc-100 font-sans tracking-tight">
              MICROSEISMIC VIBRATION
            </h3>
          </div>
          <p className="text-[12px] text-[#4B5563] dark:text-zinc-400 mt-0.5 font-sans">
            Peak Accel · Acoustic Frequency
          </p>
        </div>
      </div>
      <div ref={chartRef} className="w-full h-52" />
    </div>
  );
};
