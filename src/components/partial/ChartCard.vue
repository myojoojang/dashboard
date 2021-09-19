<template>
  <div>
    <h4 class="pa-1 px-3 primary--text mb-2">{{ name }}</h4>
    <div class="chart-container" v-if="charttype !== 5">
      <bar-chart
        v-if="charttype === 1"
        :chartdata="chartdata"
        :options="barChartOptions"
      />
      <line-chart
        v-if="charttype === 2"
        :chartdata="chartdata"
        :options="lineChartOptions"
      />
      <horizontal-bar-chart
        v-if="charttype === 3"
        :chartdata="chartdata"
        :options="options"
      />
      <doughnut-chart
        v-if="charttype === 4"
        :chartdata="chartdata"
        :options="donutChartOptions"
      />
    </div>
    <div class="large-chart-container" v-else>
      <line-chart
        v-if="charttype === 5"
        :chartdata="chartdata"
        :options="timestampChartOptions"
      />
    </div>
  </div>
</template>

<script>
import BarChart from "./chart/BarChart.vue";
import DoughnutChart from "./chart/DoughnutChart.vue";
import HorizontalBarChart from "./chart/HorizontalBarChart.vue";
import LineChart from "./chart/LineChart.vue";

export default {
  name: "ChartCard",
  components: {
    BarChart,
    LineChart,
    HorizontalBarChart,
    DoughnutChart
  },
  props: {
    name: {
      type: String,
      default: "차트"
    },
    charttype: {
      type: Number,
      default: 4
    },
    options: {
      type: Object,
      default: null
    },
    chartdata: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      timestampChartOptions: {
        legend: {
          display: true
        },
        tooltips: {
          displayColors: false
        },
        scales: {
          yAxes: [
            {
              stacked: false,
              ticks: {
                fontSize: 9,
                beginAtZero: false,
                callback: value => {
                  if (value >= 1000) {
                    return Intl.NumberFormat().format(value / 1000) + "k";
                  } else {
                    return value;
                  }
                }
              },
              gridLines: {
                display: true
              }
            }
          ],
          xAxes: [
            {
              stacked: false,
              gridLines: {
                display: false
              },
              ticks: {
                fontSize: 9,
                autoSkip: true,
                autoSkipPadding: 20,
                maxRotation: 0
              }
            }
          ]
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        spanGaps: false
      },
      lineChartOptions: {
        legend: {
          display: false,
          labels: {
            usePointStyle: false,
            fontSize: 10,
            boxWidth: 10
          }
        },
        tooltips: {
          displayColors: true
        },
        scales: {
          yAxes: [
            {
              stacked: false,
              ticks: {
                fontSize: 9,
                beginAtZero: false,
                callback: value => {
                  if (value >= 1000) {
                    return Intl.NumberFormat().format(value / 1000) + "k";
                  } else {
                    return value;
                  }
                }
              },
              gridLines: {
                display: true
              }
            }
          ],
          xAxes: [
            {
              diaplay: false,
              stacked: false,
              gridLines: {
                display: false
              },
              ticks: {
                fontSize: 9,
                autoSkip: true,
                autoSkipPadding: 20,
                maxRotation: 0
              }
            }
          ]
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0
        }
      },
      donutChartOptions: {
        // transparencyEffects: true,
        // dataSetBorderWidth: 2,
        // legend:{ display: true, fullWidth:true, position: 'right', labels:{boxWidth:40, fontSize:12, fontStyle':'normal', 'fontColor':'#666', 'usePointStyle':false}},
        legend: {
          display: false,
          position: "right",
          labels: {
            fontColor: "#46484b",
            usePointStyle: true,
            fontSize: 9
          }
        },
        tooltips: {
          displayColors: true,
          callbacks: {
            label: (tooltipItem, data) => {
              const dataLabel = data.labels[tooltipItem.index];
              const value = data.datasets[tooltipItem.datasetIndex].data[
                tooltipItem.index
              ].toLocaleString();
              const tooltip = dataLabel + " : " + value;
              return tooltip;
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0
        }
      }
    };
  }
};
</script>


<style lang="scss" scoped>
.chart-container {
  flex-grow: 1;
  min-height: 250px;
  > div {
    position: relative;
    height: 30vh;
    padding-left: 0;
  }
}

.large-chart-container {
  flex-grow: 1;
  min-height: 250px;
  > div {
    position: relative;
    height: 80vh;
    padding-left: 0;
  }
}
</style>

