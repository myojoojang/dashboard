<template>
  <div>
    <v-card class="pa-4 mb-4">
      <h2 class="primary--text mb-4">
        Market overview
      </h2>
      <v-progress-linear
        v-if="isLoadingMarkets"
        indeterminate
        aria-label="Loading markets"
      />
      <v-alert
        v-if="marketLoadError"
        type="error"
        outlined
        role="alert"
      >
        {{ marketLoadError }}
        <v-btn
          text
          :disabled="isLoadingMarkets"
          @click="loadMarketOverview"
        >
          Try again
        </v-btn>
      </v-alert>
      <template v-if="coinMarkets.length">
        <p>
          Updated {{ marketDataLoadedAt }} · {{ selectedCurrency.toUpperCase() }}
          · {{ coinMarkets.length }} markets
        </p>
        <v-row>
          <v-col
            v-for="chart in marketOverviewCharts"
            :key="chart.title"
            cols="12"
            md="4"
          >
            <ChartCard
              :title="chart.title"
              chart-type="doughnut"
              :chart-data="chart.data"
            />
          </v-col>
        </v-row>
        <ChartCard
          time-axis
          title="Top 10 cryptocurrencies (7-day trend · approximate dates)"
          chart-type="line"
          :chart-data="topTenSevenDayPriceChartData"
          show-legend
          large
          class="pa-4 mt-4"
        />
      </template>
      <p v-else-if="!isLoadingMarkets && !marketLoadError">
        No markets found.
      </p>
    </v-card>
    <v-card class="mt-2 py-0">
      <div class="market-controls">
        <div class="market-tabs">
          <v-tabs
            v-model="priceChangeFilter"
            show-arrows="never"
            class="pa-2 pb-0"
            @change="clearComparisonSelection"
          >
            <v-tab href="#all">
              All
            </v-tab>
            <v-tab href="#rise">
              Rise
            </v-tab>
            <v-tab href="#drop">
              Drop
            </v-tab>
          </v-tabs>
        </div>
        <div class="market-actions ma-2">
          <v-select
            v-model="selectedCurrency"
            :items="supportedCurrencies"
            :disabled="isLoadingMarkets"
            placeholder="Currency"
            aria-label="Currency"
            rounded
            outlined
            dense
            hide-details
            class="currency-select"
            @change="loadMarketOverview"
          />
          <v-btn
            class="mx-4"
            color="primary"
            :disabled="isLoadingMarkets || !coinMarkets.length"
            @click="openCoinComparison"
          >
            <v-icon
              small
              class="mr-2"
            >
              mdi-checkbox-marked
            </v-icon>
            Compare selected
          </v-btn>
        </div>
      </div>
      <v-alert
        v-if="comparisonSelectionMessage"
        type="info"
        outlined
        role="status"
      >
        {{ comparisonSelectionMessage }}
      </v-alert>
      <MarketTable
        v-if="coinMarkets.length"
        :key="selectedCurrency"
        :coin-markets="filteredCoinMarkets"
        :quote-currency="selectedCurrency"
        @selection-change="updateComparisonSelection"
        @open-details="openCoinDetails"
      />
    </v-card>
    <v-dialog
      v-model="isDetailsDialogOpen"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <MarketDetails
        v-if="isDetailsDialogOpen && detailsCoin"
        :coin="detailsCoin"
        :quote-currency="selectedCurrency"
        @close="isDetailsDialogOpen = false"
      />
    </v-dialog>
    <v-dialog
      v-model="isComparisonDialogOpen"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <MarketComparison
        v-if="isComparisonDialogOpen"
        :comparison-coins="comparisonCoins"
        :quote-currency="selectedCurrency"
        @close="isComparisonDialogOpen = false"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PriceChangeFilter, CoinMarketSnapshot } from '@/types/market';
import type { DashboardChartData } from '@/utils/buildMarketChartData';
import {
  buildMarketMetricChartData,
  buildEstimatedSevenDayPriceChartData,
} from '@/utils/buildMarketChartData';
import { filterCoinsByPriceChange } from '@/utils/filterCoinsByPriceChange';
import { coinGeckoApi } from '@/services/coinGeckoApi';
import ChartCard from '@/components/charts/ChartCard.vue';
import MarketTable from '@/components/market/MarketTable.vue';
import MarketDetails from '@/components/market/MarketDetails.vue';
import MarketComparison from '@/components/market/MarketComparison.vue';

interface DashboardState {
  coinMarkets: CoinMarketSnapshot[];
  supportedCurrencies: string[];
  selectedCurrency: string;
  priceChangeFilter: PriceChangeFilter;
  marketDataLoadedAt: string;
  isLoadingMarkets: boolean;
  marketLoadError: string;
  comparisonCoins: CoinMarketSnapshot[];
  detailsCoin: CoinMarketSnapshot | null;
  comparisonSelectionMessage: string;
  isDetailsDialogOpen: boolean;
  isComparisonDialogOpen: boolean;
}

export default defineComponent({
  name: 'DashboardView',
  components: {
    ChartCard,
    MarketTable,
    MarketDetails,
    MarketComparison,
  },
  data(): DashboardState {
    return {
      coinMarkets: [],
      supportedCurrencies: ['usd'],
      selectedCurrency: 'usd',
      priceChangeFilter: 'all',
      marketDataLoadedAt: '',
      isLoadingMarkets: false,
      marketLoadError: '',
      comparisonCoins: [],
      detailsCoin: null,
      comparisonSelectionMessage: '',
      isDetailsDialogOpen: false,
      isComparisonDialogOpen: false,
    };
  },
  computed: {
    filteredCoinMarkets(): CoinMarketSnapshot[] {
      return filterCoinsByPriceChange(this.coinMarkets, this.priceChangeFilter);
    },
    marketOverviewCharts(): { title: string; data: DashboardChartData }[] {
      return [
        {
          title: 'Market cap',
          data: buildMarketMetricChartData(this.coinMarkets, 'market_cap'),
        },
        {
          title: 'Total volume',
          data: buildMarketMetricChartData(this.coinMarkets, 'total_volume'),
        },
        {
          title: 'Circulating supply',
          data: buildMarketMetricChartData(this.coinMarkets, 'circulating_supply'),
        },
      ];
    },
    topTenSevenDayPriceChartData(): DashboardChartData {
      return buildEstimatedSevenDayPriceChartData(this.coinMarkets.slice(0, 10));
    },
  },
  created() {
    this.loadMarketOverview();
  },
  methods: {
    async loadMarketOverview(): Promise<void> {
      this.isLoadingMarkets = true;
      this.marketLoadError = '';
      this.coinMarkets = [];
      this.priceChangeFilter = 'all';
      this.clearComparisonSelection();

      try {
        const [supportedCurrencies, coinMarkets] = await Promise.all([
          coinGeckoApi.fetchSupportedCurrencies(),
          coinGeckoApi.fetchCoinMarkets(this.selectedCurrency),
        ]);

        this.supportedCurrencies = supportedCurrencies;
        this.coinMarkets = coinMarkets;
        this.marketDataLoadedAt = new Date().toLocaleString();
      } catch {
        this.marketLoadError = 'Couldn’t load market data. Please try again.';
      } finally {
        this.isLoadingMarkets = false;
      }
    },
    clearComparisonSelection(): void {
      this.comparisonCoins = [];
      this.comparisonSelectionMessage = '';
    },
    updateComparisonSelection(selectedCoins: CoinMarketSnapshot[]): void {
      this.comparisonCoins = selectedCoins;
      this.comparisonSelectionMessage = '';
    },
    openCoinDetails(clickedCoin: CoinMarketSnapshot): void {
      this.detailsCoin = clickedCoin;
      this.isDetailsDialogOpen = true;
    },
    openCoinComparison(): void {
      if (!this.comparisonCoins.length) {
        this.comparisonSelectionMessage = 'Select at least one market to compare.';

        return;
      }

      if (this.comparisonCoins.length > 20) {
        this.comparisonSelectionMessage = 'Select up to 20 markets to compare.';

        return;
      }

      this.isComparisonDialogOpen = true;
    },
  },
});
</script>

<style scoped>
.market-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.market-tabs {
  width: 300px;
  max-width: 100%;
}
.market-tabs ::v-deep .v-tab {
  flex: 1 1 0;
  min-width: 0;
}
.market-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px 0;
}
.currency-select {
  flex: 0 0 150px;
  width: 150px;
}
</style>
