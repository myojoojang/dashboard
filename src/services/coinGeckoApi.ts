import type { CoinHistoryResponse, CoinMarketSnapshot } from '../types/market';

const COINGECKO_API_BASE_URL = 'https://api.coingecko.com/api/v3';

async function fetchCoinGeckoJson<ResponseData>(
  endpointPath: string,
  queryParameters: Record<string, string> = {},
): Promise<ResponseData> {
  const requestUrl = new URL(`${COINGECKO_API_BASE_URL}${endpointPath}`);

  requestUrl.search = new URLSearchParams(queryParameters).toString();
  const apiResponse = await fetch(requestUrl);

  if (!apiResponse.ok) {
    throw new Error(`Market request failed (${apiResponse.status}).`);
  }

  return apiResponse.json();
}

export const coinGeckoApi = {
  async fetchSupportedCurrencies(): Promise<string[]> {
    return fetchCoinGeckoJson<string[]>('/simple/supported_vs_currencies');
  },
  async fetchCoinMarkets(quoteCurrency: string): Promise<CoinMarketSnapshot[]> {
    return fetchCoinGeckoJson<CoinMarketSnapshot[]>('/coins/markets', {
      vs_currency: quoteCurrency,
      order: 'market_cap_desc',
      per_page: '250',
      page: '1',
      sparkline: 'true',
    });
  },
  async fetchCoinYearHistory(coinId: string, quoteCurrency: string): Promise<CoinHistoryResponse> {
    return fetchCoinGeckoJson<CoinHistoryResponse>(`/coins/${encodeURIComponent(coinId)}/market_chart`, {
      vs_currency: quoteCurrency,
      days: '365',
    });
  },
};
