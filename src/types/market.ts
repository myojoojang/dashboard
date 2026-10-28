export interface MarketItem {
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

export type HistoryPoint = [timestamp: number, value: number];

export interface MarketHistory {
  prices: HistoryPoint[];
  market_caps: HistoryPoint[];
  total_volumes: HistoryPoint[];
}

export type MarketFilter = 'all' | 'rise' | 'drop';
export type MarketMetric = 'market_cap' | 'total_volume' | 'circulating_supply';
