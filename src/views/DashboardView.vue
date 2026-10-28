<template>
  <div>
    <v-card class="pa-4 mb-4">
      <h2 class="primary--text mb-4">
        Market overview
      </h2>
      <v-progress-linear
        v-if="isLoading"
        indeterminate
        aria-label="Loading markets"
      />
      <v-alert
        v-if="errorMessage"
        type="error"
        outlined
        role="alert"
      >
        {{ errorMessage }}
        <v-btn
          text
          :disabled="isLoading"
          @click="loadMarkets"
        >
          Try again
        </v-btn>
      </v-alert>
      <template v-if="markets.length">
        <p>Updated {{ updatedAt }} · {{ currency.toUpperCase() }} · {{ markets.length }} markets</p>
        <v-row>
          <v-col
            v-for="chart in overviewCharts"
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
          title="Top 10 cryptocurrencies (7-day trend · approximate times)"
          chart-type="line"
          :chart-data="topMarketsChart"
          show-legend
          large
          class="pa-4 mt-4"
        />
      </template>
      <p v-else-if="!isLoading && !errorMessage">
        No markets found.
      </p>
    </v-card>
    <v-card class="mt-2 py-0">
      <div class="market-controls">
        <div class="market-tabs">
          <v-tabs
            v-model="filter"
            show-arrows="never"
            class="pa-2 pb-0"
            @change="clearSelection"
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
            v-model="currency"
            :items="currencies"
            :disabled="isLoading"
            placeholder="Currency"
            aria-label="Currency"
            rounded
            outlined
            dense
            hide-details
            class="currency-select"
            @change="loadMarkets"
          />
          <v-btn
            class="mx-4"
            color="primary"
            :disabled="isLoading || !markets.length"
            @click="openComparison"
          >
            <v-icon
              small
              class="mr-2"
            >
              mdi-checkbox-marked
            </v-icon>
            Comparison
          </v-btn>
        </div>
      </div>
      <v-alert
        v-if="selectionMessage"
        type="info"
        outlined
        role="status"
      >
        {{ selectionMessage }}
      </v-alert>
      <MarketTable
        v-if="markets.length"
        :key="currency"
        :items="visibleMarkets"
        :currency="currency"
        @selection-change="selectMarkets"
        @open-details="openDetails"
      />
    </v-card>
    <v-dialog
      v-model="isDetailsOpen"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <MarketDetails
        v-if="isDetailsOpen && selectedMarket"
        :item="selectedMarket"
        :currency="currency"
        @close="isDetailsOpen = false"
      />
    </v-dialog>
    <v-dialog
      v-model="isComparisonOpen"
      fullscreen
      persistent
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <MarketComparison
        v-if="isComparisonOpen"
        :items="selectedMarkets"
        :currency="currency"
        @close="isComparisonOpen = false"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { MarketFilter, MarketItem } from '@/types/market';
import type { DashboardChartData } from '@/utils/formatChartData';
import { buildMetricChart, buildSparklineChart } from '@/utils/formatChartData';
import { filterMarkets } from '@/utils/filterMarkets';
import { marketApi } from '@/services/marketApi';
import ChartCard from '@/components/charts/ChartCard.vue';
import MarketTable from '@/components/market/MarketTable.vue';
import MarketDetails from '@/components/market/MarketDetails.vue';
import MarketComparison from '@/components/market/MarketComparison.vue';

interface DashboardState {
  markets: MarketItem[];
  currencies: string[];
  currency: string;
  filter: MarketFilter;
  updatedAt: string;
  isLoading: boolean;
  errorMessage: string;
  selectedMarkets: MarketItem[];
  selectedMarket: MarketItem | null;
  selectionMessage: string;
  isDetailsOpen: boolean;
  isComparisonOpen: boolean;
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
      markets: [],
      currencies: ['usd'],
      currency: 'usd',
      filter: 'all',
      updatedAt: '',
      isLoading: false,
      errorMessage: '',
      selectedMarkets: [],
      selectedMarket: null,
      selectionMessage: '',
      isDetailsOpen: false,
      isComparisonOpen: false,
    };
  },
  computed: {
    visibleMarkets(): MarketItem[] {
      return filterMarkets(this.markets, this.filter);
    },
    overviewCharts(): { title: string; data: DashboardChartData }[] {
      return [
        {
          title: 'Market cap',
          data: buildMetricChart(this.markets, 'market_cap'),
        },
        {
          title: 'Total volume',
          data: buildMetricChart(this.markets, 'total_volume'),
        },
        {
          title: 'Circulating supply',
          data: buildMetricChart(this.markets, 'circulating_supply'),
        },
      ];
    },
    topMarketsChart(): DashboardChartData {
      return buildSparklineChart(this.markets.slice(0, 10));
    },
  },
  created() {
    this.loadMarkets();
  },
  methods: {
    async loadMarkets(): Promise<void> {
      this.isLoading = true;
      this.errorMessage = '';
      this.markets = [];
      this.filter = 'all';
      this.clearSelection();

      try {
        const [currencies, markets] = await Promise.all([
          marketApi.getCurrencies(), marketApi.getMarkets(this.currency),
        ]);

        this.currencies = currencies;
        this.markets = markets;
        this.updatedAt = new Date().toLocaleString();
      } catch {
        this.errorMessage = 'Couldn’t load market data. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
    clearSelection(): void {
      this.selectedMarkets = [];
      this.selectionMessage = '';
    },
    selectMarkets(items: MarketItem[]): void {
      this.selectedMarkets = items;
      this.selectionMessage = '';
    },
    openDetails(item: MarketItem): void {
      this.selectedMarket = item;
      this.isDetailsOpen = true;
    },
    openComparison(): void {
      if (!this.selectedMarkets.length) {
        this.selectionMessage = 'Select at least one market to compare.';

        return;
      }

      if (this.selectedMarkets.length > 20) {
        this.selectionMessage = 'Select up to 20 markets to compare.';

        return;
      }

      this.isComparisonOpen = true;
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
