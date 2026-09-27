import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useMonitoring } from '../../context/MonitoringContext';
import { Droplets } from 'lucide-react';

export const EnvironmentalChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  const { chartData, thresholds, theme } = useMonitoring();

  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const isDark = theme === 'dark';
    const times = chartData.map((d) => d.timeLabel);
    const moistures = chartData.map((d) => d.soilMoisture);
    const rainfalls = chartData.map((d) => d.rainfall);

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
        left: 50,
        right: 50,
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
      },
      legend: {
        top: 0,
        right: 0,
        textStyle: { color: axisLabelColor, fontFamily: 'Inter, sans-serif', fontSize: 11 },
        itemWidth: 12,
        itemHeight: 7,
      },
      xAxis: {
        type: 'category',
        data: times,
        boundaryGap: true,
        axisLine: { lineStyle: { color: axisLineColor } },
        axisLabel: { color: axisLabelColor, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
        axisTick: { show: false },
      },
      yAxis: [
        {
          type: 'value',
          name: 'Moisture (%)',
          min: 0,
          max: 100,
          nameTextStyle: { color: axisLabelColor, fontFamily: 'Inter, sans-serif', fontSize: 11 },
          splitLine: { lineStyle: { color: splitLineColor, type: 'dashed' } },
          axisLabel: { color: axisLabelColor, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
        },
        {
          type: 'value',
          name: 'Rain (mm)',
          nameTextStyle: { color: axisLabelColor, fontFamily: 'Inter, sans-serif', fontSize: 11 },
          splitLine: { show: false },
          axisLabel: { color: axisLabelColor, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' },
        },
      ],
      series: [
        {
          name: 'Soil Moisture',
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2.5, color: '#2563EB' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(37, 99, 235, 0.2)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.0)' },
            ]),
          },
          markLine: {
            silent: true,
            symbol: 'none',
            data: [
              {
                yAxis: thresholds.soilMoisture.warning,
                lineStyle: { color: '#D97706', type: 'dotted', width: 1.5 },
                label: { formatter: 'Sat Warn ({c}%)', position: 'insideEndTop', color: '#D97706', fontSize: 10, fontFamily: 'monospace' },
              },
            ],
          },
          data: moistures,
        },
        {
          name: 'Rainfall',
          type: 'bar',
          yAxisIndex: 1,
          barMaxWidth: 12,
          itemStyle: {
            color: '#0F766E',
            borderRadius: [2, 2, 0, 0],
          },
          data: rainfalls,
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
  }, [chartData, thresholds, theme]);

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121217] border border-[#E2E8F0] dark:border-zinc-800 p-5 flex flex-col justify-between shadow-card-light transition-colors duration-150">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-[15px] font-semibold text-[#111827] dark:text-zinc-100 font-sans tracking-tight">
              SOIL SATURATION & RAINFALL
            </h3>
          </div>
          <p className="text-[12px] text-[#4B5563] dark:text-zinc-400 mt-0.5 font-sans">
            Volumetric Moisture · Precipitation
          </p>
        </div>
      </div>
      <div ref={chartRef} className="w-full h-52" />
    </div>
  );
};
