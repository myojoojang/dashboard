import type { ChartData } from 'chart.js';
import type { TimestampedMarketValue, CoinMarketSnapshot, MarketMetricField } from '../types/market';

export type ChartKind = 'line' | 'bar' | 'doughnut';
export type DashboardChartType = ChartKind | 'horizontal-bar';
export type ChartDataPoint = number | null | { x: number; y: number };
export type DashboardChartData = ChartData<ChartKind, ChartDataPoint[], string>;

function getChartSeriesColor(seriesIndex: number): string {
  return `hsl(215, 90%, ${30 + (seriesIndex * 17) % 50}%)`;
}

export function buildMarketMetricChartData(
  coinMarkets: CoinMarketSnapshot[],
  metricField: MarketMetricField,
): DashboardChartData {
  const seriesColors = coinMarkets.map((_coin, seriesIndex) => {
    return getChartSeriesColor(seriesIndex);
  });

  const coinNames = coinMarkets.map((coin) => {
    return coin.name;
  });
  const metricValues = coinMarkets.map((coin) => {
    return coin[metricField];
  });

  return {
    labels: coinNames,
    datasets: [{
      data: metricValues,
      backgroundColor: seriesColors,
      hoverBackgroundColor: seriesColors,
      borderWidth: 0.5,
    }],
  };
}

function estimateHourlyPriceCoordinates(coin: CoinMarketSnapshot): { x: number; y: number }[] {
  const hourlyPriceSamples = coin.sparkline_in_7d?.price ?? [];
  const coinUpdatedAtMs = Date.parse(coin.last_updated);

  if (!Number.isFinite(coinUpdatedAtMs)) {
    return [];
  }

  const hourInMilliseconds = 60 * 60 * 1000;
  const updatedAtHour = Math.floor(coinUpdatedAtMs / hourInMilliseconds);
  const estimatedLastSampleHourMs = updatedAtHour * hourInMilliseconds;

  // The API supplies prices only; hourly coordinates are estimates based on last_updated.
  return hourlyPriceSamples.map((samplePrice, sampleIndex) => {
    const hoursBeforeLastSample = hourlyPriceSamples.length - 1 - sampleIndex;

    return {
      x: estimatedLastSampleHourMs - hoursBeforeLastSample * hourInMilliseconds,
      y: samplePrice,
    };
  });
}

export function buildEstimatedSevenDayPriceChartData(
  coinMarkets: CoinMarketSnapshot[],
): DashboardChartData {
  return {
    datasets: coinMarkets.map((coin, seriesIndex) => {
      return {
        label: coin.name,
        data: estimateHourlyPriceCoordinates(coin),
        borderColor: getChartSeriesColor(seriesIndex),
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 1,
        pointHoverRadius: 1,
        pointHitRadius: 8,
      };
    }),
  };
}

export function buildHistoricalMetricChartData(
  timestampedValues: TimestampedMarketValue[],
  datasetLabel: string,
): DashboardChartData {
  const metricCoordinates = timestampedValues.map(([timestampMs, metricValue]) => {
    return {
      x: timestampMs,
      y: metricValue,
    };
  });

  return {
    datasets: [{
      label: datasetLabel,
      data: metricCoordinates,
      borderColor: '#0f2d61',
      borderWidth: 1,
      pointRadius: 1,
      pointHoverRadius: 2,
      pointHitRadius: 8,
    }],
  };
}
