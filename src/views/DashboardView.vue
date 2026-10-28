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
          title="Top 10 cryptocurrencies (last 7 days)"
          :chart-data="topMarketsChart"
          show-legend
          large
          class="mt-6"
        />
      </template>
      <p v-else-if="!isLoading && !errorMessage">
        No markets found.
      </p>
    </v-card>
    <v-card class="pa-4">
      <div class="market-controls">
        <v-tabs
          v-model="filter"
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
        <v-select
          v-model="currency"
          :items="currencies"
          :disabled="isLoading"
          label="Currency"
          outlined
          dense
          hide-details
          class="currency-select"
          @change="loadMarkets"
        />
        <v-btn
          color="primary"
          :disabled="isLoading || !markets.length"
          @click="openComparison"
        >
          Compare selected
        </v-btn>
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
        :key="`${currency}-${filter}`"
        :items="visibleMarkets"
        :currency="currency"
        @selection-change="selectMarkets"
        @open-details="openDetails"
      />
    </v-card>
    <v-dialog
      v-model="isDetailsOpen"
      fullscreen
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
      transition="dialog-bottom-transition"
    >
      <v-card v-if="isComparisonOpen">
        <v-toolbar flat>
          <h2>Market comparison · {{ currency.toUpperCase() }}</h2>
          <v-spacer />
          <v-btn
            icon
            aria-label="Close comparison"
            @click="isComparisonOpen = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <ChartCard
            title="Prices (last 7 days)"
            :chart-data="comparisonChart"
            show-legend
            large
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { MarketFilter, MarketItem } from '@/types/market';
import type { DashboardChartData } from '@/utils/chartData';
import { buildMetricChart, buildSparklineChart } from '@/utils/chartData';
import { filterMarkets } from '@/utils/filterMarkets';
import { marketApi } from '@/services/marketApi';
import ChartCard from '@/components/charts/ChartCard.vue';
import MarketTable from '@/components/market/MarketTable.vue';
import MarketDetails from '@/components/market/MarketDetails.vue';

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
    comparisonChart(): DashboardChartData {
      return buildSparklineChart(this.selectedMarkets);
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
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}
.market-controls > .v-tabs {
  flex: 1 1 280px;
  width: auto;
}
.currency-select {
  flex: 0 1 180px;
}
</style>
