import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import type { CoinMarketSnapshot } from '../src/types/market';
import { coinGeckoApi } from '../src/services/coinGeckoApi';
import {
  buildHistoricalMetricChartData,
  buildMarketMetricChartData,
  buildEstimatedSevenDayPriceChartData,
} from '../src/utils/buildMarketChartData';
import { filterCoinsByPriceChange } from '../src/utils/filterCoinsByPriceChange';
import {
  formatCompactNumber,
  formatNumber,
  formatPercentage,
} from '../src/utils/formatNumber';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function createCoinMarketFixture(overrides: Partial<CoinMarketSnapshot> = {}): CoinMarketSnapshot {
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

    return new Response(JSON.stringify([createCoinMarketFixture()]));
  };
  const result = await coinGeckoApi.fetchCoinMarkets('usd');

  assert.equal(result[0].id, 'bitcoin');
  assert.equal(requests.length, 1);
  assert.equal(requests[0].pathname, '/api/v3/coins/markets');
  assert.deepEqual(Object.fromEntries(requests[0].searchParams), {
    vs_currency: 'usd',
    order: 'market_cap_desc',
    per_page: '250',
    page: '1',
    sparkline: 'true',
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
  await coinGeckoApi.fetchCoinYearHistory('coin/id', 'gbp');
  assert.equal(request?.pathname, '/api/v3/coins/coin%2Fid/market_chart');
  assert.equal(request?.searchParams.get('vs_currency'), 'gbp');
  assert.equal(request?.searchParams.get('days'), '365');
});

test('API failures reject instead of returning error payloads as data', async () => {
  globalThis.fetch = async () => {
    return new Response('Rate limited', { status: 429 });
  };
  await assert.rejects(coinGeckoApi.fetchSupportedCurrencies(), /429/);
});

test('rise and drop filters exclude missing and unchanged prices without mutating input', () => {
  const coinMarkets = [
    createCoinMarketFixture({
      id: 'rise',
      price_change_percentage_24h: 2,
    }),
    createCoinMarketFixture({
      id: 'drop',
      price_change_percentage_24h: -3,
    }),
    createCoinMarketFixture({
      id: 'flat',
      price_change_percentage_24h: 0,
    }),
    createCoinMarketFixture({
      id: 'missing',
      price_change_percentage_24h: null,
    }),
  ];

  assert.equal(filterCoinsByPriceChange(coinMarkets, 'all'), coinMarkets);
  assert.deepEqual(filterCoinsByPriceChange(coinMarkets, 'rise'), [coinMarkets[0]]);
  assert.deepEqual(filterCoinsByPriceChange(coinMarkets, 'drop'), [coinMarkets[1]]);
  assert.equal(coinMarkets.length, 4);
});

test('history charts keep exact timestamp coordinates and uneven intervals', () => {
  const chart = buildHistoricalMetricChartData([[1000, 0], [9000, 5], [900000, 2]], 'Price');

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

test('sparkline samples step backward in hours from the last-updated hour', () => {
  const chart = buildEstimatedSevenDayPriceChartData([
    createCoinMarketFixture({ sparkline_in_7d: { price: [10, 20, 30] } }),
    createCoinMarketFixture({ sparkline_in_7d: { price: [40] } }),
    createCoinMarketFixture(),
  ]);

  assert.equal(chart.labels, undefined);
  assert.deepEqual(chart.datasets[0].data, [
    {
      x: Date.parse('2026-10-28T08:00:00Z'),
      y: 10,
    },
    {
      x: Date.parse('2026-10-28T09:00:00Z'),
      y: 20,
    },
    {
      x: Date.parse('2026-10-28T10:00:00Z'),
      y: 30,
    },
  ]);
  assert.deepEqual(chart.datasets[1].data, [{
    x: Date.parse('2026-10-28T10:00:00Z'),
    y: 40,
  }]);
  assert.deepEqual(chart.datasets[2].data, []);
  assert.deepEqual(buildEstimatedSevenDayPriceChartData([]), { datasets: [] });
});

test('hourly sparkline estimates handle year rollover and invalid update dates', () => {
  const chart = buildEstimatedSevenDayPriceChartData([
    createCoinMarketFixture({
      last_updated: '2027-01-01T00:45:00Z',
      sparkline_in_7d: { price: [1, 2] },
    }),
    createCoinMarketFixture({
      last_updated: 'invalid',
      sparkline_in_7d: { price: [1] },
    }),
  ]);

  assert.deepEqual(chart.datasets[0].data, [
    {
      x: Date.parse('2026-12-31T23:00:00Z'),
      y: 1,
    },
    {
      x: Date.parse('2027-01-01T00:00:00Z'),
      y: 2,
    },
  ]);
  assert.deepEqual(chart.datasets[1].data, []);
});

test('metric charts keep zero and missing values distinct with stable colors', () => {
  const coinMarkets = [
    createCoinMarketFixture({ market_cap: 0 }),
    createCoinMarketFixture({ market_cap: null }),
  ];
  const chart = buildMarketMetricChartData(coinMarkets, 'market_cap');

  assert.deepEqual(chart.datasets[0].data, [0, null]);
  assert.deepEqual(chart, buildMarketMetricChartData(coinMarkets, 'market_cap'));
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
