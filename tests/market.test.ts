import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { MarketItem } from '../src/types/market';
import { marketApi } from '../src/services/marketApi';
import {
  buildHistoryChart,
  buildMetricChart,
  buildPriceChart,
} from '../src/utils/formatChartData';
import { filterMarkets } from '../src/utils/filterMarkets';
import {
  formatCompactNumber,
  formatNumber,
  formatPercentage,
} from '../src/utils/formatNumber';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function market(overrides: Partial<MarketItem> = {}): MarketItem {
  return {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    image: '',
    market_cap_rank: 1,
    current_price: 100,
    price_change_percentage_24h: 2,
    high_24h: 110,
    low_24h: 90,
    market_cap: 1000,
    market_cap_change_percentage_24h: 2,
    total_volume: 100,
    circulating_supply: 10,
    total_supply: null,
    max_supply: null,
    last_updated: '2026-10-28T10:00:00Z',
    ...overrides,
  };
}

test('market requests encode currency and use one supported page', async () => {
  const requests: URL[] = [];

  globalThis.fetch = async (input) => {
    requests.push(new URL(String(input)));

    return new Response(JSON.stringify([market()]));
  };
  const result = await marketApi.getMarkets('usd');

  assert.equal(result[0].id, 'bitcoin');
  assert.equal(requests.length, 1);
  assert.equal(requests[0].pathname, '/api/v3/coins/markets');
  assert.deepEqual(Object.fromEntries(requests[0].searchParams), {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: '250',
    page: '1',
  });
});

test('history requests encode the id and preserve the selected currency', async () => {
  let request: URL | undefined;

  globalThis.fetch = async (input) => {
    request = new URL(String(input));

    return new Response(
      JSON.stringify({
        prices: [],
        market_caps: [],
        total_volumes: [],
      }),
    );
  };
  await marketApi.getHistory('coin/id', 'gbp');
  assert.equal(request?.pathname, '/api/v3/coins/coin%2Fid/market_chart');
  assert.equal(request?.searchParams.get('vs_currency'), 'gbp');
  assert.equal(request?.searchParams.get('days'), '365');
});

test('API failures reject instead of returning error payloads as data', async () => {
  globalThis.fetch = async () => {
    return new Response('Rate limited', { status: 429 });
  };
  await assert.rejects(marketApi.getCurrencies(), /429/);
});

test('rise and drop filters exclude missing and unchanged prices without mutating input', () => {
  const items = [
    market({
      id: 'rise',
      price_change_percentage_24h: 2,
    }),
    market({
      id: 'drop',
      price_change_percentage_24h: -3,
    }),
    market({
      id: 'flat',
      price_change_percentage_24h: 0,
    }),
    market({
      id: 'missing',
      price_change_percentage_24h: null,
    }),
  ];

  assert.equal(filterMarkets(items, 'all'), items);
  assert.deepEqual(filterMarkets(items, 'rise'), [items[0]]);
  assert.deepEqual(filterMarkets(items, 'drop'), [items[1]]);
  assert.equal(items.length, 4);
});

test('history charts keep exact timestamp coordinates and uneven intervals', () => {
  const chart = buildHistoryChart([[1000, 0], [9000, 5], [900000, 2]], 'Price');

  assert.equal(chart.labels, undefined);
  assert.deepEqual(chart.datasets[0].data, [
    {
      x: 1000,
      y: 0,
    },
    {
      x: 9000,
      y: 5,
    },
    {
      x: 900000,
      y: 2,
    },
  ]);
});

test('comparisons keep each coin’s timestamps instead of aligning by sample index', () => {
  const chart = buildPriceChart([
    {
      name: 'Full',
      prices: [[1000, 10], [2000, 20], [3000, 30]],
    },
    {
      name: 'Short',
      prices: [[1500, 40]],
    },
    {
      name: 'Missing',
      prices: [],
    },
  ]);

  assert.equal(chart.labels, undefined);
  assert.deepEqual(chart.datasets[1].data, [{
    x: 1500,
    y: 40,
  }]);
  assert.deepEqual(chart.datasets[2].data, []);
  assert.deepEqual(buildPriceChart([]), { datasets: [] });
});

test('seven-day charts request timestamped prices in the selected currency', async () => {
  const requests: URL[] = [];

  globalThis.fetch = async (input) => {
    requests.push(new URL(String(input)));

    return new Response(JSON.stringify({ prices: [[1000, 10], [4000, 20]] }));
  };
  const series = await marketApi.getPriceHistory([market()], 'gbp');

  assert.equal(requests.length, 1);
  assert.equal(requests[0].pathname, '/api/v3/coins/bitcoin/market_chart');
  assert.equal(requests[0].searchParams.get('days'), '7');
  assert.equal(requests[0].searchParams.get('vs_currency'), 'gbp');
  assert.deepEqual(series, [{
    name: 'Bitcoin',
    prices: [[1000, 10], [4000, 20]],
  }]);
});

test('metric charts keep zero and missing values distinct with stable colors', () => {
  const items = [market({ market_cap: 0 }), market({ market_cap: null })];
  const chart = buildMetricChart(items, 'market_cap');

  assert.deepEqual(chart.datasets[0].data, [0, null]);
  assert.deepEqual(chart, buildMetricChart(items, 'market_cap'));
});

test('number formatting handles missing values without turning them into zero', () => {
  assert.equal(formatNumber(null), '—');
  assert.equal(formatNumber(undefined), '—');
  assert.equal(formatNumber(Number.NaN), '—');
  assert.equal(formatNumber(0), '0');
  assert.equal(formatPercentage(null), '—');
  assert.equal(formatPercentage(-2.123), '-2.12%');
});

test('small prices remain visible in chart axis labels', () => {
  assert.notEqual(formatCompactNumber(0.0000000012), '0');
  assert.equal(formatCompactNumber(0.0000000012), formatNumber(0.0000000012));
});
