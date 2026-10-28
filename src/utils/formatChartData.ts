import type { ChartData } from 'chart.js';
import type { HistoryPoint, MarketItem, MarketMetric } from '../types/market';

export type ChartKind = 'line' | 'bar' | 'doughnut';
export type DashboardChartType = ChartKind | 'horizontal-bar';
export type ChartValue = number | null | { x: number; y: number };
export type DashboardChartData = ChartData<ChartKind, ChartValue[], string>;

function seriesColor(index: number): string {
  return `hsl(215, 90%, ${30 + (index * 17) % 50}%)`;
}

export function buildMetricChart(items: MarketItem[], metric: MarketMetric): DashboardChartData {
  const colors = items.map((_item, index) => {
    return seriesColor(index);
  });

  return {
    labels: items.map((item) => {
      return item.name;
    }),
    datasets: [{
      data: items.map((item) => {
        return item[metric];
      }),
      backgroundColor: colors,
      hoverBackgroundColor: colors,
      borderWidth: 0.5,
    }],
  };
}

export function buildSparklineChart(items: MarketItem[]): DashboardChartData {
  const hourInMilliseconds = 60 * 60 * 1000;

  return {
    datasets: items.map((item, index) => {
      const prices = item.sparkline_in_7d?.price ?? [];
      const updatedAt = Date.parse(item.last_updated);
      const lastSampleHour = Math.floor(updatedAt / hourInMilliseconds) * hourInMilliseconds;
      // Sparkline timestamps are estimated: the API only supplies hourly price samples.
      const data = Number.isFinite(updatedAt) ? prices.map((price, sampleIndex) => {
        const hoursBeforeLastSample = prices.length - 1 - sampleIndex;

        return {
          x: lastSampleHour - hoursBeforeLastSample * hourInMilliseconds,
          y: price,
        };
      }) : [];

      return {
        label: item.name,
        data,
        borderColor: seriesColor(index),
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 1,
        pointHoverRadius: 1,
        pointHitRadius: 8,
      };
    }),
  };
}

export function buildHistoryChart(points: HistoryPoint[], label: string): DashboardChartData {
  return {
    datasets: [{
      label,
      data: points.map(([x, y]) => {
        return {
          x,
          y,
        };
      }),
      borderColor: '#0f2d61',
      borderWidth: 1,
      pointRadius: 1,
      pointHoverRadius: 2,
      pointHitRadius: 8,
    }],
  };
}
