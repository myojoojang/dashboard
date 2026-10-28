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
        Market comparison · {{ quoteCurrency.toUpperCase() }}
      </h2>
      <ChartCard
        time-axis
        title="Prices (7-day trend · approximate dates)"
        chart-type="line"
        :chart-data="comparisonPriceChartData"
        show-legend
        large
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { CoinMarketSnapshot } from '@/types/market';
import type { DashboardChartData } from '@/utils/buildMarketChartData';
import { buildEstimatedSevenDayPriceChartData } from '@/utils/buildMarketChartData';
import ChartCard from '@/components/charts/ChartCard.vue';

export default defineComponent({
  name: 'MarketComparison',
  components: { ChartCard },
  props: {
    comparisonCoins: {
      type: Array as PropType<CoinMarketSnapshot[]>,
      required: true,
    },
    quoteCurrency: {
      type: String,
      required: true,
    },
  },
  computed: {
    comparisonPriceChartData(): DashboardChartData {
      return buildEstimatedSevenDayPriceChartData(this.comparisonCoins);
    },
  },
});
</script>
