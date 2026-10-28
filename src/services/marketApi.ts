import type { MarketHistory, MarketItem, PriceSeries } from '../types/market';

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
    });
  },
  async getHistory(id: string, currency: string, days: 7 | 365 = 365): Promise<MarketHistory> {
    return get<MarketHistory>(`/coins/${encodeURIComponent(id)}/market_chart`, {
      vs_currency: currency,
      days: String(days),
    });
  },
  async getPriceHistory(items: readonly MarketItem[], currency: string): Promise<PriceSeries[]> {
    return Promise.all(items.map(async (item) => {
      const history = await marketApi.getHistory(item.id, currency, 7);

      return {
        name: item.name,
        prices: history.prices,
      };
    }));
  },
};
