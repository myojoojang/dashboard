<template>
  <v-card class="market-details">
    <v-toolbar
      dense
      flat
      class="pa-0 d-flex justify-center"
    >
      <v-btn
        outlined
        fab
        x-small
        color="primary"
        aria-label="Close details"
        @click="$emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="pa-10 pt-1">
      <p>Last updated {{ formattedCoinUpdatedAt }} · {{ quoteCurrency.toUpperCase() }}</p>
      <v-sheet
        color="primary"
        dark
        rounded
        class="pa-4 mb-6"
      >
        <div class="d-flex align-center mb-4">
          <v-img
            :src="coin.image"
            :alt="coin.name"
            max-width="40"
            class="mr-4"
          />
          <h3>{{ coin.name }} · #{{ coin.market_cap_rank }}</h3>
        </div>
        <dl class="market-summary">
          <div
            v-for="stat in coinStatistics"
            :key="stat.label"
          >
            <dt>{{ stat.label }}</dt>
            <dd>{{ stat.value }}</dd>
          </div>
        </dl>
      </v-sheet>
      <ChartCard
        time-axis
        title="Price (7-day trend · approximate dates)"
        chart-type="line"
        :chart-data="sevenDayPriceChartData"
      />
      <h3 class="primary--text my-4">
        Market history (last 365 days)
      </h3>
      <v-progress-linear
        v-if="isLoadingHistory"
        indeterminate
        aria-label="Loading history"
      />
      <v-alert
        v-if="historyLoadError"
        type="error"
        outlined
        role="alert"
      >
        {{ historyLoadError }}
        <v-btn
          text
          :disabled="isLoadingHistory"
          @click="loadCoinHistory"
        >
          Try again
        </v-btn>
      </v-alert>
      <template v-if="coinHistory">
        <ChartCard
          v-for="chart in historicalMetricCharts"
          :key="chart.title"
          :title="chart.title"
          chart-type="line"
          time-axis
          :chart-data="chart.data"
          class="my-6"
        />
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { CoinHistoryResponse, CoinMarketSnapshot } from '@/types/market';
import { coinGeckoApi } from '@/services/coinGeckoApi';
import {
  buildHistoricalMetricChartData,
  buildEstimatedSevenDayPriceChartData,
} from '@/utils/buildMarketChartData';
import type { DashboardChartData } from '@/utils/buildMarketChartData';
import { formatNumber, formatPercentage } from '@/utils/formatNumber';
import ChartCard from '@/components/charts/ChartCard.vue';

interface MarketDetailsState {
  coinHistory: CoinHistoryResponse | null;
  isLoadingHistory: boolean;
  historyLoadError: string;
}

export default defineComponent({
  name: 'MarketDetails',
  components: { ChartCard },
  props: {
    coin: {
      type: Object as PropType<CoinMarketSnapshot>,
      required: true,
    },
    quoteCurrency: {
      type: String,
      required: true,
    },
  },
  data(): MarketDetailsState {
    return {
      coinHistory: null,
      isLoadingHistory: false,
      historyLoadError: '',
    };
  },
  computed: {
    formattedCoinUpdatedAt(): string {
      return new Date(this.coin.last_updated).toLocaleString();
    },
    sevenDayPriceChartData(): DashboardChartData {
      return buildEstimatedSevenDayPriceChartData([this.coin]);
    },
    coinStatistics(): { label: string; value: string }[] {
      return [
        {
          label: 'Current price',
          value: formatNumber(this.coin.current_price),
        },
        {
          label: 'Price change (24h)',
          value: formatPercentage(this.coin.price_change_percentage_24h),
        },
        {
          label: 'Low (24h)',
          value: formatNumber(this.coin.low_24h),
        },
        {
          label: 'High (24h)',
          value: formatNumber(this.coin.high_24h),
        },
        {
          label: 'Market cap',
          value: formatNumber(this.coin.market_cap),
        },
        {
          label: 'Market cap change (24h)',
          value: formatPercentage(this.coin.market_cap_change_percentage_24h),
        },
        {
          label: 'Total volume',
          value: formatNumber(this.coin.total_volume),
        },
        {
          label: 'Circulating supply',
          value: formatNumber(this.coin.circulating_supply),
        },
        {
          label: 'Total supply',
          value: formatNumber(this.coin.total_supply),
        },
        {
          label: 'Max supply',
          value: formatNumber(this.coin.max_supply),
        },
      ];
    },
    historicalMetricCharts(): { title: string; data: DashboardChartData }[] {
      if (!this.coinHistory) {
        return [];
      }

      return [
        {
          title: 'Price',
          data: buildHistoricalMetricChartData(this.coinHistory.prices, 'Price'),
        },
        {
          title: 'Market cap',
          data: buildHistoricalMetricChartData(this.coinHistory.market_caps, 'Market cap'),
        },
        {
          title: 'Total volume',
          data: buildHistoricalMetricChartData(this.coinHistory.total_volumes, 'Total volume'),
        },
      ];
    },
  },
  created() {
    this.loadCoinHistory();
  },
  methods: {
    async loadCoinHistory(): Promise<void> {
      this.isLoadingHistory = true;
      this.historyLoadError = '';

      try {
        this.coinHistory = await coinGeckoApi.fetchCoinYearHistory(
          this.coin.id,
          this.quoteCurrency,
        );
      } catch {
        this.historyLoadError = 'Couldn’t load market history. Please try again.';
      } finally {
        this.isLoadingHistory = false;
      }
    },
  },
});
</script>

<style scoped>
.market-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}
.market-summary dd {
  font-weight: 700;
}
</style>
