import type { MarketHistory, MarketItem } from '../types/market';

const API_URL = 'https://api.coingecko.com/api/v3';

async function get<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${API_URL}${path}`);

  url.search = new URLSearchParams(params).toString();
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Market request failed (${response.status}).`);
  }

  return response.json();
}

export const marketApi = {
  async getCurrencies(): Promise<string[]> {
    return get<string[]>('/simple/supported_vs_currencies');
  },
  async getMarkets(currency: string): Promise<MarketItem[]> {
    return get<MarketItem[]>('/coins/markets', {
      vs_currency: currency,
      order: 'market_cap_desc',
      per_page: '250',
      page: '1',
      sparkline: 'true',
    });
  },
  async getHistory(id: string, currency: string): Promise<MarketHistory> {
    return get<MarketHistory>(`/coins/${encodeURIComponent(id)}/market_chart`, {
      vs_currency: currency,
      days: '365',
    });
  },
};
