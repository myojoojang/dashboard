<template>
  <div>
    <h4 class="pa-1 px-3 primary--text">{{ name }}</h4>
    <div class="chart-container d-flex align-center justify-center">
      <bar-chart
        v-if="charttype === 1"
        :chartdata="chartdata"
        :options="options"
      />
      <line-chart
        v-if="charttype === 2"
        :chartdata="chartdata"
        :options="options"
      />
      <horizontal-bar-chart
        v-if="charttype === 3"
        :chartdata="chartdata"
        :options="options"
      />
      <doughnut-chart
        v-if="charttype === 4"
        :chartdata="chartdata"
        :options="options"
      />
    </div>
  </div>
</template>

<script>
import BarChart from './chart/BarChart.vue'
import DoughnutChart from './chart/DoughnutChart.vue'
import HorizontalBarChart from './chart/HorizontalBarChart.vue'
import LineChart from './chart/LineChart.vue'

export default {
  name: 'ChartCard',
  components: {
    BarChart,
    LineChart,
    HorizontalBarChart,
    DoughnutChart,
  },
  props: {
    name: {
      type: String,
      default: '차트',
    },
    charttype: {
      type: Number,
      default: 4,
    },
    options: {
      type: Object,
      default: null,
    },
    chartdata: {
      type: Object,
      default: null,
    },
  },
}
</script>


<style lang="scss" scoped>
.chart-container {
  flex-grow: 1;
  min-height: 100px;
  > div {
    position: relative;
    height: 18vh;
    padding-left: 0;
  }
}

</style>

