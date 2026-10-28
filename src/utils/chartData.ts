import type { ChartData } from 'chart.js';
import type { HistoryPoint, MarketItem, MarketMetric } from '../types/market';

export type ChartKind = 'line' | 'bar' | 'doughnut';
export type DashboardChartType = ChartKind | 'horizontal-bar';
export type DashboardChartData = ChartData<ChartKind, (number | null)[], string>;

function seriesColor(index: number): string {
  return `hsl(${(215 + index * 47) % 360}, 65%, 48%)`;
}

export function buildMetricChart(items: MarketItem[], metric: MarketMetric): DashboardChartData {
  return {
    labels: items.map((item) => {
      return item.name;
    }),
    datasets: [{
      data: items.map((item) => {
        return item[metric];
      }),
      backgroundColor: items.map((_item, index) => {
        return seriesColor(index);
      }),
      borderWidth: 0,
    }],
  };
}

export function buildSparklineChart(items: MarketItem[]): DashboardChartData {
  const length = Math.max(0, ...items.map((item) => {
    return item.sparkline_in_7d?.price.length || 0;
  }));

  return {
    labels: Array.from({ length }, (_value, index) => {
      return String(index + 1);
    }),
    datasets: items.map((item, index) => {
      const prices = item.sparkline_in_7d?.price || [];

      return {
        label: item.name,
        data: [...Array<number | null>(length - prices.length).fill(null), ...prices],
        borderColor: seriesColor(index),
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 0,
        pointHitRadius: 8,
      };
    }),
  };
}

export function buildHistoryChart(points: HistoryPoint[], label: string): DashboardChartData {
  return {
    labels: points.map(([timestamp]) => {
      return new Date(timestamp).toLocaleString();
    }),
    datasets: [{
      label,
      data: points.map(([, value]) => {
        return value;
      }),
      borderColor: '#0f2d61',
      borderWidth: 1,
      pointRadius: 0,
      pointHitRadius: 8,
    }],
  };
}
