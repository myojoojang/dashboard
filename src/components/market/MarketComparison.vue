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
      <ChartCard
        time-axis
        title="Prices (7-day trend · approximate times)"
        chart-type="line"
        :chart-data="chartData"
        show-legend
        large
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import type { MarketItem } from '@/types/market';
import type { DashboardChartData } from '@/utils/formatChartData';
import { buildSparklineChart } from '@/utils/formatChartData';
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
  computed: {
    chartData(): DashboardChartData {
      return buildSparklineChart(this.items);
    },
  },
});
</script>
