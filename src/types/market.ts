// One coin object returned by CoinGecko /coins/markets.
export interface CoinMarketSnapshot {
  id: string;
  name: string;
  symbol: string;
  image: string;
  market_cap_rank: number | null;
  current_price: number | null;
  price_change_percentage_24h: number | null;
  high_24h: number | null;
  low_24h: number | null;
  market_cap: number | null;
  market_cap_change_percentage_24h: number | null;
  total_volume: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  last_updated: string;
  sparkline_in_7d?: { price: number[] };
}

export type TimestampedMarketValue = [timestampMs: number, metricValue: number];

// Timestamp/value pairs returned by CoinGecko /coins/{id}/market_chart.
export interface CoinHistoryResponse {
  prices: TimestampedMarketValue[];
  market_caps: TimestampedMarketValue[];
  total_volumes: TimestampedMarketValue[];
}

export type PriceChangeFilter = 'all' | 'rise' | 'drop';
export type MarketMetricField = 'market_cap' | 'total_volume' | 'circulating_supply';
