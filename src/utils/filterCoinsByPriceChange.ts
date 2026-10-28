import type { PriceChangeFilter, CoinMarketSnapshot } from '../types/market';

export function filterCoinsByPriceChange(
  coinMarkets: CoinMarketSnapshot[],
  priceChangeFilter: PriceChangeFilter,
): CoinMarketSnapshot[] {
  if (priceChangeFilter === 'all') {
    return coinMarkets;
  }

  return coinMarkets.filter((coin) => {
    const priceChangePercentage = coin.price_change_percentage_24h;

    if (priceChangePercentage == null) {
      return false;
    }

    if (priceChangeFilter === 'rise') {
      return priceChangePercentage > 0;
    }

    return priceChangePercentage < 0;
  });
}
