<template>
  <section class="chart-card">
    <h4 class="pa-1 px-3 primary--text mb-2">
      {{ title }}
    </h4>
    <div
      class="chart-container"
      :class="{ 'chart-container--large': large }"
    >
      <canvas
        ref="canvas"
        role="img"
        :aria-label="title"
      >{{ title }}</canvas>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { PropType } from 'vue';
import {
  Chart,
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import type {
  ChartKind,
  ChartValue,
  DashboardChartData,
  DashboardChartType,
} from '@/utils/formatChartData';
import { buildChartOptions } from '@/utils/chartOptions';

Chart.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  DoughnutController,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
);

type ChartInstance = Chart<ChartKind, ChartValue[], string>;

export default defineComponent({
  name: 'ChartCard',
  props: {
    title: {
      type: String,
      required: true,
    },
    chartData: {
      type: Object as PropType<DashboardChartData>,
      required: true,
    },
    chartType: {
      type: String as PropType<DashboardChartType>,
      default: 'doughnut',
    },
    options: {
      type: Object as PropType<ChartOptions<ChartKind>>,
      default: () => {
        return {};
      },
    },
    timeAxis: {
      type: Boolean,
      default: false,
    },
    showLegend: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const canvas = ref<HTMLCanvasElement | null>(null);
    let chart: ChartInstance | null = null;

    function renderChart(): void {
      if (!canvas.value) {
        return;
      }

      chart?.destroy();
      const options = buildChartOptions(props.chartType, props.showLegend, props.timeAxis);

      Object.assign(options, props.options);
      const type = props.chartType === 'horizontal-bar' ? 'bar' : props.chartType;

      chart = new Chart<ChartKind, ChartValue[], string>(canvas.value, {
        type,
        data: props.chartData,
        options,
      });
    }

    onMounted(renderChart);
    watch([() => {
      return props.chartData;
    }, () => {
      return props.chartType;
    }, () => {
      return props.options;
    }, () => {
      return props.showLegend;
    }, () => {
      return props.timeAxis;
    }], renderChart);
    onBeforeUnmount(() => {
      chart?.destroy();
    });

    return { canvas };
  },
});
</script>
<style scoped>
.chart-card {
  min-width: 0;
}
.chart-container {
  position: relative;
  height: 30vh;
  min-height: 250px;
}
.chart-container--large {
  height: 80vh;
}
</style>
