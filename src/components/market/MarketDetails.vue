<template>
  <v-card class="market-details">
    <v-toolbar flat>
      <h2>{{ item.name }}</h2>
      <v-spacer />
      <v-btn
        icon
        aria-label="Close details"
        @click="$emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <p>Last updated {{ lastUpdated }} · {{ currency.toUpperCase() }}</p>
      <v-sheet
        color="primary"
        dark
        rounded
        class="pa-4 mb-6"
      >
        <div class="d-flex align-center mb-4">
          <v-img
            :src="item.image"
            :alt="item.name"
            max-width="40"
            class="mr-4"
          />
          <h3>{{ item.name }} · #{{ item.market_cap_rank }}</h3>
        </div>
        <dl class="market-summary">
          <div
            v-for="stat in statistics"
            :key="stat.label"
          >
            <dt>{{ stat.label }}</dt>
            <dd>{{ stat.value }}</dd>
          </div>
        </dl>
      </v-sheet>
      <ChartCard
        title="Price (last 7 days)"
        :chart-data="sparkline"
      />
      <h3 class="primary--text my-4">
        Market history (last 365 days)
      </h3>
      <v-progress-linear
        v-if="isLoading"
        indeterminate
        aria-label="Loading history"
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
          @click="loadHistory"
        >
          Try again
        </v-btn>
      </v-alert>
      <template v-if="history">
        <ChartCard
          v-for="chart in historyCharts"
          :key="chart.title"
          :title="chart.title"
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
import type { MarketHistory, MarketItem } from '@/types/market';
import { marketApi } from '@/services/marketApi';
import { buildHistoryChart, buildSparklineChart } from '@/utils/chartData';
import type { DashboardChartData } from '@/utils/chartData';
import { formatNumber, formatPercentage } from '@/utils/formatNumber';
import ChartCard from '@/components/charts/ChartCard.vue';

export default defineComponent({
  name: 'MarketDetails',
  components: { ChartCard },
  props: {
    item: {
      type: Object as PropType<MarketItem>,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data(): { history: MarketHistory | null; isLoading: boolean; errorMessage: string } {
    return {
      history: null,
      isLoading: false,
      errorMessage: '',
    };
  },
  computed: {
    lastUpdated(): string {
      return new Date(this.item.last_updated).toLocaleString();
    },
    sparkline(): DashboardChartData {
      return buildSparklineChart([this.item]);
    },
    statistics(): { label: string; value: string }[] {
      return [
        {
          label: 'Current price',
          value: formatNumber(this.item.current_price),
        },
        {
          label: 'Price change (24h)',
          value: formatPercentage(this.item.price_change_percentage_24h),
        },
        {
          label: 'Low (24h)',
          value: formatNumber(this.item.low_24h),
        },
        {
          label: 'High (24h)',
          value: formatNumber(this.item.high_24h),
        },
        {
          label: 'Market cap',
          value: formatNumber(this.item.market_cap),
        },
        {
          label: 'Market cap change (24h)',
          value: formatPercentage(this.item.market_cap_change_percentage_24h),
        },
        {
          label: 'Total volume',
          value: formatNumber(this.item.total_volume),
        },
        {
          label: 'Circulating supply',
          value: formatNumber(this.item.circulating_supply),
        },
        {
          label: 'Total supply',
          value: formatNumber(this.item.total_supply),
        },
        {
          label: 'Max supply',
          value: formatNumber(this.item.max_supply),
        },
      ];
    },
    historyCharts(): { title: string; data: DashboardChartData }[] {
      if (!this.history) {
        return [];
      }

      return [
        {
          title: 'Price',
          data: buildHistoryChart(this.history.prices, 'Price'),
        },
        {
          title: 'Market cap',
          data: buildHistoryChart(this.history.market_caps, 'Market cap'),
        },
        {
          title: 'Total volume',
          data: buildHistoryChart(this.history.total_volumes, 'Total volume'),
        },
      ];
    },
  },
  created() {
    this.loadHistory();
  },
  methods: {
    async loadHistory(): Promise<void> {
      this.isLoading = true;
      this.errorMessage = '';

      try {
        this.history = await marketApi.getHistory(this.item.id, this.currency);
      } catch {
        this.errorMessage = 'Couldn’t load market history. Please try again.';
      } finally {
        this.isLoading = false;
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
