import type { ChartOptions } from 'chart.js';
import type { ChartKind, DashboardChartType } from './formatChartData';
import { formatCompactNumber } from './formatNumber';
import { formatChartDate } from './formatChartDate';

export function buildChartOptions(
  chartType: DashboardChartType,
  showLegend: boolean,
  timeAxis = false,
): ChartOptions<ChartKind> {
  const options: ChartOptions<ChartKind> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { legend: { display: showLegend } },
  };

  if (chartType === 'doughnut') {
    return options;
  }

  const categoryAxis = {
    ticks: {
      font: { size: 9 },
      maxTicksLimit: 8,
      maxRotation: 0,
    },
    grid: { display: false },
  };
  const valueAxis = {
    beginAtZero: chartType !== 'line',
    ticks: {
      font: { size: 9 },
      callback(value: number | string) {
        return formatCompactNumber(Number(value));
      },
    },
  };

  if (chartType === 'horizontal-bar') {
    options.indexAxis = 'y';
    options.scales = {
      x: valueAxis,
      y: categoryAxis,
    };
  } else {
    options.scales = {
      x: categoryAxis,
      y: valueAxis,
    };
  }

  if (chartType === 'line' && timeAxis) {
    options.scales = {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Date / time (UTC)',
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
      y: valueAxis,
    };
    options.plugins = {
      ...options.plugins,
      tooltip: {
        callbacks: {
          title(items) {
            const timestamp = items[0]?.parsed.x;

            if (timestamp == null) {
              return '';
            }

            return `${formatChartDate(timestamp)} UTC`;
          },
        },
      },
    };
  }

  return options;
}
