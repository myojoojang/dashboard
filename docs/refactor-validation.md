# Refactor validation against the original dashboard

Baseline: `e804293` (the last original commit). Refactor: `2dbd391`, plus the corrections from this audit. The comparison covers the original source, unit tests, and browser checks with mocked success/failure responses. It is a behavior audit, not a claim that the layouts or public component props are identical.

## Feature comparison

| Original behavior | Refactored behavior | Result |
| --- | --- | --- |
| Load currencies and market prices together | Same two endpoints, selected currency, rank order, and sparklines | Preserved; page-size correction below |
| Market cap, total volume, and circulating supply doughnuts | Same fields and loaded markets | Preserved |
| First ten markets in the seven-day line chart | Same selection and sparkline values | Preserved; labels corrected below |
| All/Rise/Drop tabs | Same positive/negative comparison; zero excluded from Rise/Drop | Preserved; missing values also excluded |
| Currency change reloads markets and resets to All | Same behavior | Preserved |
| AG Grid sorting, filtering, resizing, and multiple selection | Same grid features | Preserved |
| Clicking a row selects it | Row-click selection enabled | Restored in audit |
| Header checkbox selects all rows, even with a column filter | Same select-all scope | Restored in audit |
| Switching tabs keeps the grid instance and column sort/width state | Grid keyed only by currency | Restored in audit |
| Column filters reset when row data changes | AG Grid 25 client-side row-model default retained | Preserved and browser-checked |
| Compare 1–20 rows, reject zero or more than 20 | Same bounds, inline messages instead of browser alerts | Preserved; 0, 1, 20, and 21 checked |
| Fullscreen persistent detail/comparison dialogs | Same explicit-close behavior | Restored in audit |
| Detail summary: rank, current price, price change, high/low, cap, cap change, volume, supply values | All original fields retained | Preserved |
| Seven-day detail sparkline | Same samples rendered by the shared chart component | Preserved |
| Three history charts for 365 days in the selected currency | Price, market cap, and total volume using the same endpoint | Preserved; timestamps corrected below |
| Root dashboard route | Single-page dashboard renders directly | Preserved; unused router and commented sidebar removed |
| Table image and name columns | Image and name combined in one cell; remaining data fields retained | Presentation change |

## Chart-handler mapping

The original component had handlers that were not called by the dashboard itself. They are supported again; they were incorrectly omitted in the first refactor.

| Original numeric type | Named configuration |
| --- | --- |
| `1`: bar | `chart-type="bar"` |
| `2`: line | `chart-type="line"` |
| `3`: horizontal bar | `chart-type="horizontal-bar"` (Chart.js 4 bar with `indexAxis: 'y'`) |
| `4`: doughnut, including default | `chart-type="doughnut"`, still the default |
| `5`: large line with legend | `chart-type="line"`, `large`, and `show-legend` |

`ChartCard.vue` registers and creates the chart. `chartOptions.ts` contains the type-specific axes and defaults. An optional `options` prop overrides top-level Chart.js options. Custom options use the Chart.js 4 schema, not the old Chart.js 2 schema. Browser checks covered every type, default doughnut, options overrides, data updates, and chart destruction.

## Intentional differences retained

- The market request uses `per_page=250` instead of `1000`, respecting CoinGecko's documented maximum. It still requests only page 1; it does not enumerate 1,000 coins.
- Historical labels use API timestamps. The original generated daily dates from array indexes, regardless of actual sampling intervals.
- Seven-day comparisons label sample order instead of fabricated timestamps. Shorter series are aligned at the newest edge and padded with missing values.
- Missing numeric fields display a dash instead of being converted to zero or throwing. Small prices remain visible rather than rounding to zero.
- Errors and loading states are visible, with manual retry. There are no automatic retries or background polling.
- Closing a dialog preserves the dashboard data and selection. The original reloaded both endpoints and reset state on close.
- The layout is responsive. The table scrolls horizontally rather than hiding columns at narrower widths. Chart sizes, typography, deterministic colors, numeric formatting, and some labels differ; this is not a pixel-identical redesign.
- Table renderers use DOM text instead of interpolating API strings into HTML. Detail props are not mutated to attach currency.
- Vue CLI/Babel, unused filters/navigation, and duplicated chart wrappers are replaced with TypeScript, Vite, and Chart.js 4. Vue 2.7, Vuetify 2, and AG Grid 25 remain.

## Validation

- ESLint, strict TypeScript checking, unit tests, and production build.
- Browser checks for initial failure/retry, overview charts, rise/drop filtering, zero-selection feedback, comparisons, history failure/retry, repeated dialog opening, currency change, and narrow-screen layout.
- Original-behavior checks for row clicks, filtered select-all, retained grid identity/sort/width, original filter resets, persistent dialogs, and comparison limits.
- Dedicated chart checks for every original handler, default type, options overrides, update behavior, and teardown.

The production build still reports a large-bundle warning from the retained UI/grid stack. Live data availability remains dependent on CoinGecko; deterministic browser tests mock the API rather than depending on its rate limits.
