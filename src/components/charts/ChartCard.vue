<template>
  <section class="chart-card">
    <h3 class="primary--text mb-3">
      {{ title }}
    </h3>
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
import { Chart, ArcElement, CategoryScale, DoughnutController, Legend, LinearScale,
  LineController, LineElement, PointElement, Tooltip } from 'chart.js';
import type { ChartOptions } from 'chart.js';
import type { DashboardChartData, DashboardChartType } from '@/utils/chartData';
import { formatCompactNumber } from '@/utils/formatNumber';

Chart.register(ArcElement, CategoryScale, DoughnutController, Legend, LinearScale,
  LineController, LineElement, PointElement, Tooltip);

type ChartInstance = Chart<DashboardChartType, (number | null)[], string>;

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
      default: 'line',
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
      const options: ChartOptions<DashboardChartType> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: props.showLegend } },
      };

      if (props.chartType === 'line') {
        options.scales = {
          x: {
            ticks: {
              maxTicksLimit: 8,
              maxRotation: 0,
            },
            grid: { display: false },
          },
          y: {
            ticks: {
              callback(value) {
                return formatCompactNumber(Number(value));
              },
            },
          },
        };
      }

      chart = new Chart<DashboardChartType, (number | null)[], string>(canvas.value, {
        type: props.chartType,
        data: props.chartData,
        options,
      });
    }

    onMounted(renderChart);
    watch([() => {
      return props.chartData;
    }, () => {
      return props.chartType;
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
  height: 280px;
}
.chart-container--large {
  height: 420px;
}
</style>
