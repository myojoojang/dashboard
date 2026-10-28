# Coin Tracker

A cryptocurrency dashboard with market summaries, searchable and sortable market data, rise/drop filters, comparisons, and historical charts.

## Development

Use Node.js 24, matching `.nvmrc` and Netlify.

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
  services/marketApi.ts         Typed CoinGecko requests
  types/market.ts               API data contracts
  utils/                       Chart transforms, filtering, and formatting
  plugins/vuetify.ts            UI component registration and theme
  styles/app.css               Shared styling
```

The application uses TypeScript, Vue 2.7, Vuetify 2, Vite 7, Chart.js 4, and AG Grid 25. The existing Vue/Vuetify/grid architecture is retained to preserve the table and UI behavior. Vue 2 and its Vite plugin are no longer actively maintained; a full UI framework migration is separate work.

Chart.js supports line, vertical bar, horizontal bar, and doughnut charts through named chart types. Doughnut remains the default; dashboard line charts select their type explicitly. `ChartCard` owns chart creation and destruction. `chartOptions.ts` holds chart-type defaults and `formatChartData.ts` builds datasets; all time-series charts plot exact API timestamps on a continuous axis. Labels and tooltips use UTC. Each coin keeps its own timestamps; uneven intervals retain their actual spacing.

The table uses DOM elements and text nodes for custom cells. Sorting, column filtering, resizing, multiple selection, and details are available. Narrow screens can scroll the table horizontally without dropping columns.

## API behavior

The app calls the public [CoinGecko API](https://docs.coingecko.com/reference/introduction) directly. It loads one page of up to 250 markets, using the [documented page-size limit](https://docs.coingecko.com/reference/coins-markets). Currency changes reload the market data; rise/drop filters use the already loaded results. The top-ten chart requests seven days of timestamped history for each displayed coin.

Select between 1 and 20 rows to compare. Comparisons request seven days of timestamped history per selected coin. Opening details requests both seven-day and 365-day history for that coin in the selected currency. These additional requests avoid guessing dates from the timestamp-free market sparklines. Closing the dialog does not reload the dashboard. Missing numeric values display as a dash instead of zero.

Loading, empty, and failure states are shown explicitly. Requests are not retried automatically; the user can retry a failed request. The public API can reject requests due to rate limits or access requirements; error states remain usable when this happens. No API keys are stored in the repository.

## Deployment

`npm run build` checks TypeScript and writes the app to `dist`. `netlify.toml` configures that command and publish directory. Vite uses the root `index.html`; there is no Webpack, Babel configuration, or legacy OpenSSL flag.

## Code style

ESLint covers Vue, TypeScript, tests, and the Vite configuration. Use explicit braces and arrow-function returns, two spaces, single quotes, and semicolons. Prefer `map`/`filter` for transformations and `for...of` for side effects. Lint rejects `forEach`, indexed loops, manual counters, and tabs.

Tests cover API request parameters and failures, rise/drop filters, chart types and axes, chart timestamps, independent comparison timestamps and UTC date formatting, and missing-value formatting.

See [the original-code comparison](docs/refactor-validation.md) for preserved behavior, corrected regressions, and intentional differences.
