import type { ChartOptions } from 'chart.js';
import type { ChartKind, DashboardChartType } from './chartData';
import { formatCompactNumber } from './formatNumber';

export function buildChartOptions(
  chartType: DashboardChartType,
  showLegend: boolean,
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
      maxTicksLimit: 8,
      maxRotation: 0,
    },
    grid: { display: false },
  };
  const valueAxis = {
    beginAtZero: chartType !== 'line',
    ticks: {
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

  return options;
}
