import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { TimeRangeSelector } from '../common/TimeRangeSelector';
import { useMonitoring } from '../../context/MonitoringContext';
import { Activity } from 'lucide-react';

export const MovementChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const { timeRange, setTimeRange, chartData, thresholds, theme } = useMonitoring();

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const isDark = theme === 'dark';
    const times = chartData.map((d) => d.timeLabel);
    const tilts = chartData.map((d) => d.tilt);
    const displacements = chartData.map((d) => d.displacement);

    const displacementColor = '#2563EB'; // Ground displacement
    const tiltColor = '#0F766E';         // Ground tilt
    const warningColor = '#D97706';      // Warning threshold
    const criticalColor = '#DC2626';     // Critical threshold

    const axisLineColor = isDark ? '#27272a' : '#E2E8F0';
    const axisLabelColor = isDark ? '#a1a1aa' : '#4B5563';
    const splitLineColor = isDark ? '#1e1e24' : '#E5E7EB';
    const tooltipBg = isDark ? '#18181b' : '#FFFFFF';
    const tooltipBorder = isDark ? '#3f3f46' : '#E2E8F0';
    const tooltipText = isDark ? '#f4f4f5' : '#111827';
    const tooltipTimeColor = isDark ? '#a1a1aa' : '#6B7280';

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      animationDuration: 500,
      grid: {
        top: 35,
        left: 55,
        right: 55,
        bottom: 30,
        containLabel: false,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        textStyle: {
          color: tooltipText,
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
        },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); border-radius: 8px; padding: 10px;',
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return '';
          const time = params[0].name;
          let content = `<div style="font-family: monospace; font-size: 12px; color: ${tooltipTimeColor}; margin-bottom: 6px;">TIME: ${time}</div>`;
          params.forEach((item: any) => {
            const unit = item.seriesName.includes('Tilt') ? '°' : ' mm';
            content += `<div style="display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 3px;">
              <span style="display: flex; align-items: center; gap: 6px; font-size: 12px;">
                <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${item.color};"></span>
                <span style="color: ${tooltipText};">${item.seriesName}:</span>
              </span>
              <span style="font-weight: 700; font-family: monospace; font-size: 12px; color: ${tooltipText};">${item.value}${unit}</span>
            </div>`;
          });
          return content;
        },
      },
      legend: {
        show: true,
        top: 0,
        right: 10,
        textStyle: {
          color: axisLabelColor,
          fontFamily: 'Inter, sans-serif',
          fontSize: 12,
        },
        itemWidth: 14,
        itemHeight: 8,
      },
      xAxis: {
        type: 'category',
        data: times,
        boundaryGap: false,
        axisLine: { lineStyle: { color: axisLineColor } },
        axisLabel: {
          color: axisLabelColor,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: 11,
        },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Displacement (mm)',
          nameTextStyle: {
            color: axisLabelColor,
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            padding: [0, 0, 0, 10],
          },
          splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } },
          axisLabel: {
            color: axisLabelColor,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
          },
        },
        {
          type: 'value',
          name: 'Tilt Angle (°)',
          nameTextStyle: {
            color: axisLabelColor,
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            padding: [0, 10, 0, 0],
          },
          splitLine: { show: false },
          axisLabel: {
            color: axisLabelColor,
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            formatter: '{value}°',
          },
        },
      ],
      series: [
        {
          name: 'Displacement',
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2.5,
            color: displacementColor,
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(37, 99, 235, 0.18)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.0)' },
            ]),
          },
          data: displacements,
        },
        {
          name: 'Ground Tilt',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 2.5,
            color: tiltColor,
            type: 'solid',
          },
          markLine: {
            silent: true,
            symbol: 'none',
            data: [
              {
                yAxis: thresholds.tilt.warning,
                lineStyle: { color: warningColor, type: 'dashed', width: 1.5 },
                label: {
                  formatter: 'Warn ({c}°)',
                  position: 'insideEndTop',
                  color: warningColor,
                  fontSize: 11,
                  fontFamily: 'monospace',
                },
              },
              {
                yAxis: thresholds.tilt.critical,
                lineStyle: { color: criticalColor, type: 'dashed', width: 1.5 },
                label: {
                  formatter: 'Crit ({c}°)',
                  position: 'insideEndTop',
                  color: criticalColor,
                  fontSize: 11,
                  fontFamily: 'monospace',
                },
              },
            ],
          },
          data: tilts,
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

    return () => {
      resizeObserver.disconnect();
    };
  }, [chartData, thresholds, theme]);

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 p-5 flex flex-col justify-between shadow-card-light transition-colors duration-150">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0F766E] dark:text-emerald-400" />
            <h2 className="text-[16px] lg:text-[17px] font-semibold text-[#111827] dark:text-zinc-100 font-sans tracking-tight">
              GROUND MOVEMENT
            </h2>
          </div>
          <p className="text-[13px] text-[#4B5563] dark:text-zinc-400 mt-0.5 font-sans">
            Displacement · Tilt
          </p>
        </div>

        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </div>

      <div ref={chartRef} className="w-full h-72 sm:h-80" />
    </div>
  );
};
