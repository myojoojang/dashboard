import type { ChartData } from 'chart.js';
import type { HistoryPoint, MarketItem, MarketMetric, PriceSeries } from '../types/market';

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

export function buildPriceChart(series: PriceSeries[]): DashboardChartData {
  return {
    datasets: series.map((item, index) => {
      return {
        label: item.name,
        data: item.prices.map(([x, y]) => {
          return {
            x,
            y,
          };
        }),
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
