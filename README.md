# Coin Tracker

A cryptocurrency dashboard with market summaries, searchable and sortable market data, rise/drop filters, comparisons, and historical charts.

## Development

Use Node.js 24, matching `.nvmrc`, the package engine, CI, and Netlify. Node type definitions also target version 24.

```sh
nvm use
npm ci
npm run dev
```

`npm run serve` also starts the development server.

```sh
npm run check       # Lint, tests, TypeScript checking, and production build
npm run lint:fix    # Apply formatting fixes
npm run preview    # Serve the built app locally
```

## Structure

```text
src/
  views/DashboardView.vue       Dashboard state and user interactions
  components/layout/           Responsive site shell
  components/market/           Market table, details, and comparison
  components/charts/           Shared Chart.js component
  services/coinGeckoApi.ts         Typed CoinGecko requests
  types/market.ts               API data contracts
  utils/                       Chart transforms, filtering, and formatting
  plugins/vuetify.ts            UI component registration and theme
  styles/app.css               Shared styling
```

The application uses TypeScript, Vue 2.7, Vuetify 2, Vite 7, Chart.js 4, and AG Grid 25. The existing Vue/Vuetify/grid architecture is retained to preserve the table and UI behavior. Vue 2 and its Vite plugin are no longer actively maintained; a full UI framework migration is separate work.

Chart.js supports line, vertical bar, horizontal bar, and doughnut charts through named chart types. Doughnut remains the default; dashboard line charts select their type explicitly. `ChartCard` owns chart creation and destruction. `chartOptions.ts` holds chart-type defaults and `buildMarketChartData.ts` builds datasets; detailed history charts plot exact API timestamps on a continuous axis with date-only UTC axis labels and full date/time tooltips. Axes fit the actual data bounds. Seven-day trends estimate timestamps at one-hour intervals, working backward from each coin’s last-updated UTC hour. Chart titles mark these times as approximate because the market response supplies no sample timestamps.

The table uses DOM elements and text nodes for custom cells. Sorting, column filtering, resizing, multiple selection, and details are available. Narrow screens can scroll the table horizontally without dropping columns.

## Data flow and names

`CoinMarketSnapshot` is the type of one coin object returned by `/coins/markets`; it is not application state. `coinGeckoApi.fetchCoinMarkets(selectedCurrency)` supplies the actual objects stored in `DashboardView.coinMarkets`.

- `filteredCoinMarkets` supplies the table rows after the All/Rise/Drop filter.
- `openCoinDetails(clickedCoin)` stores the clicked row as `detailsCoin`, passed to `MarketDetails` through its `coin` prop.
- `sevenDayPriceChartData` comes from `buildEstimatedSevenDayPriceChartData([coin])`, using the coin’s existing sparkline prices and estimated hourly coordinates.
- `loadCoinHistory()` calls `fetchCoinYearHistory(coin.id, quoteCurrency)`. Its separate `CoinHistoryResponse` is stored as `coinHistory` and supplies the three `historicalMetricCharts` through `buildHistoricalMetricChartData`.
- `comparisonCoins` contains the checkbox-selected rows and supplies `comparisonPriceChartData` in the comparison dialog.

`quoteCurrency` is the currency used to express prices and monetary values. API field names such as `last_updated` and `sparkline_in_7d` remain unchanged so they match CoinGecko’s response.

## API behavior

The app calls the public [CoinGecko API](https://docs.coingecko.com/reference/introduction) directly. It loads one page of up to 250 markets, using the [documented page-size limit](https://docs.coingecko.com/reference/coins-markets). Currency changes reload the market data; rise/drop filters use the already loaded results. The top-ten chart and comparisons reuse the seven-day sparklines in that response without additional requests.

Select between 1 and 20 rows to compare. Opening details makes one request for 365-day history in the selected currency. Its seven-day trend also reuses the market sparkline. Closing the dialog does not reload the dashboard. Missing numeric values display as a dash instead of zero.

Loading, empty, and failure states are shown explicitly. Requests are not retried automatically; the user can retry a failed request. The public API can reject requests due to rate limits or access requirements; error states remain usable when this happens. No API keys are stored in the repository.

## Deployment

`npm run build` checks TypeScript and writes the app to `dist`. `netlify.toml` runs `npm run check` before publishing `dist`, so lint and tests must also pass. GitHub Actions runs the same checks from a clean `npm ci` on pushes and pull requests. Vite uses the root `index.html`; there is no Webpack, Babel configuration, or legacy OpenSSL flag.

Vite emits separate chart, grid, and UI dependency bundles so application edits can reuse cached dependencies. Vuetify components are imported directly, and unused registrations are removed. Vite 7 is retained because the Vue 2 plugin supports Vite through version 7. The retained AG Grid bundle still exceeds Vite’s size warning threshold.

## Code style

`.editorconfig` keeps indentation and line endings consistent across editors. ESLint covers Vue, TypeScript, tests, and the Vite configuration. Use explicit braces and arrow-function returns, two spaces, single quotes, and semicolons. Prefer `map`/`filter` for transformations and `for...of` for side effects. Lint rejects `forEach`, indexed loops, manual counters, and tabs.

Tests cover API request parameters and failures, rise/drop filters, chart types and axes, chart timestamps, sparkline sample preservation and UTC date formatting, and missing-value formatting.

See [the original-code comparison](docs/refactor-validation.md) for preserved behavior, corrected regressions, and intentional differences.
