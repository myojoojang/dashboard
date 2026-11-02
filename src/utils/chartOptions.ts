import type { ChartOptions } from 'chart.js';
import type { ChartKind, DashboardChartType } from './buildMarketChartData';
import { formatCompactNumber } from './formatNumber';
import { formatChartDate, formatChartTimestamp } from './formatChartDate';

export function buildChartOptions(
  chartType: DashboardChartType,
  showLegend: boolean,
  timeAxis = false,
): ChartOptions<ChartKind> {
  const chartOptions: ChartOptions<ChartKind> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { legend: { display: showLegend } },
  };

  if (chartType === 'doughnut') {
    return chartOptions;
  }

  const categoryAxisOptions = {
    ticks: {
      font: { size: 9 },
      maxTicksLimit: 8,
      maxRotation: 0,
    },
    grid: { display: false },
  };
  const valueAxisOptions = {
    beginAtZero: chartType !== 'line',
    ticks: {
      font: { size: 9 },
      callback(value: number | string) {
        return formatCompactNumber(Number(value));
      },
    },
  };

  if (chartType === 'horizontal-bar') {
    chartOptions.indexAxis = 'y';
    chartOptions.scales = {
      x: valueAxisOptions,
      y: categoryAxisOptions,
    };

    return chartOptions;
  }

  if (chartType === 'line' && timeAxis) {
    chartOptions.scales = {
      x: {
        type: 'linear',
        bounds: 'data',
        offset: false,
        title: {
          display: true,
          text: 'Date (UTC)',
        },
        ticks: {
          font: { size: 9 },
          maxTicksLimit: 8,
          maxRotation: 0,
          callback(value) {
            return formatChartDate(Number(value));
          },
        },
        grid: { display: false },
      },
      y: valueAxisOptions,
    };
    chartOptions.plugins = {
      ...chartOptions.plugins,
      tooltip: {
        callbacks: {
          title(tooltipItems) {
            const timestampMs = tooltipItems[0]?.parsed.x;

            if (timestampMs == null) {
              return '';
            }

            return `${formatChartTimestamp(timestampMs)} UTC`;
          },
        },
      },
    };

    return chartOptions;
  }

  chartOptions.scales = {
    x: categoryAxisOptions,
    y: valueAxisOptions,
  };

  return chartOptions;
}
