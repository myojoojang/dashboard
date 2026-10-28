import type { MarketFilter, MarketItem } from '../types/market';

export function filterMarkets(items: MarketItem[], filter: MarketFilter): MarketItem[] {
  if (filter === 'all') {
    return items;
  }

  return items.filter((item) => {
    const change = item.price_change_percentage_24h;

    if (change == null) {
      return false;
    }

    if (filter === 'rise') {
      return change > 0;
    }

    return change < 0;
  });
}
