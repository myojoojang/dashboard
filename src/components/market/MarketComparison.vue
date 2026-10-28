<template>
  <v-card>
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
        aria-label="Close comparison"
        @click="$emit('close')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text class="pa-10 pt-1">
      <h2 class="primary--text mb-4">
        Market comparison · {{ currency.toUpperCase() }}
      </h2>
      <v-progress-linear
        v-if="isLoading"
        indeterminate
        aria-label="Loading comparison"
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
      <ChartCard
        v-if="priceHistory.length"
        title="Prices (last 7 days)"
        chart-type="line"
        :chart-data="chartData"
        time-axis
        show-legend
        large
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { MarketItem, PriceSeries } from '@/types/market';
import type { DashboardChartData } from '@/utils/formatChartData';
import { buildPriceChart } from '@/utils/formatChartData';
import { marketApi } from '@/services/marketApi';
import ChartCard from '@/components/charts/ChartCard.vue';

export default defineComponent({
  name: 'MarketComparison',
  components: { ChartCard },
  props: {
    items: {
      type: Array as PropType<MarketItem[]>,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  data(): { priceHistory: PriceSeries[]; isLoading: boolean; errorMessage: string } {
    return {
      priceHistory: [],
      isLoading: false,
      errorMessage: '',
    };
  },
  computed: {
    chartData(): DashboardChartData {
      return buildPriceChart(this.priceHistory);
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
        this.priceHistory = await marketApi.getPriceHistory(this.items, this.currency);
      } catch {
        this.errorMessage = 'Couldn’t load comparison history. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>
