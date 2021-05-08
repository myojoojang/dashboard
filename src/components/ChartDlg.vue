<template>
  <v-card class="br-none">
    <v-toolbar dense flat class="pa-0 d-flex justify-center">
      <v-btn
        fab
        outlined
        small
        color="primary"
        icon
        @click="$emit('close-dlg')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text class="pa-10" style="height: 100%">
      <template v-if="compareReq">
        <chart-card
          v-if="lineChartLoaded"
          :name="`Prices (last 7days)`"
          :chartdata="timestampChartData"
          :charttype="5"
      /></template>

      <template v-else>
        <title-card
          :name="`${propData.name} - Market data of Last ${selPeriod} days `"
        />

        <v-divider class="my-4" />

        <chart-card
          v-if="chartLoaded"
          :name="`Price`"
          :chartdata="pricesChart"
          :charttype="2"
        />

        <v-divider class="my-4" />
        <chart-card
          v-if="chartLoaded"
          :name="`Market Caps`"
          :chartdata="markCapsChart"
          :charttype="2"
        />
        <v-divider class="my-4" />

        <chart-card
          v-if="chartLoaded"
          :name="`Total Volume (24h)`"
          :chartdata="totalChart"
          :charttype="2"
        />
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import { API_URL, PRIMARY_COLOR } from "../globalVars";
import ChartCard from "./partial/ChartCard";
import axios from "axios";
import TitleCard from "./partial/TitleCard.vue";
export default {
  name: "ChartDlg",
  components: {
    ChartCard,
    TitleCard,
  },

  props: {
    compareReq: { type: Boolean, default: false },
    propData: null,
  },

  data() {
    return {
      selPeriod: 365,
      chartLoaded: false,
      pricesChart: {},
      markCapsChart: {},
      totalChart: {},
      lineChartLoaded: false,
      timestampChartData: {},
    };
  },

  created() {
    if (!this.compareReq) {
      this.init();
    } else {
      this.getComparison();
    }
  },

  methods: {
    init() {
      console.log(this.selPeriod);

      this.chartLoaded = false;
      axios
        .get(
          `${API_URL}/coins/${this.propData.id}/market_chart?vs_currency=${this.propData.currency}&days=${this.selPeriod}`
        )
        .then((res) => {
          const data = res.data;
          console.log(res);
          this.setChartData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getComparison() {
      const datasets = [];
      for (let el of this.propData) {
        datasets.push({
          label: el.name,
          data: el.sparkline_in_7d.price,
          borderColor: this.dynamicColors(),
          backgroundColor: "transparent",
          borderWidth: 1,
          pointRadius: 1,
          pointHoverRadius: 1,
        });
      }
      const calcDate = new Date(new Date().setDate(new Date().getDate() - 7));
      const end = new Date();

      for (
        var arr = [], dt = new Date(calcDate);
        dt <= end;
        dt.setHours(dt.getHours() + 1)
      ) {
        arr.push(new Date(dt).toLocaleString());
      }

      const timestampChartData = {
        labels: arr,
        datasets: datasets,
      };

      // console.log(timestampChartData);

      this.showTimestampChart(timestampChartData);
    },
    dynamicColors() {
      const h = 215;
      const s = 90;
      const l = Math.floor(Math.random() * 50) + 30;
      const color = "hsl(" + h + ", " + s + "%, " + l + "%)";
      return color;
    },
    showTimestampChart(dataSet) {
      this.timestampChartData = dataSet;
      this.lineChartLoaded = true;
    },
    setChartData(data) {
      const prices = data.prices;
      const pricesSets = this.setDatasets(prices);
      this.pricesChart = this.showChart(pricesSets);

      const markCaps = data.market_caps;
      const markCapsSets = this.setDatasets(markCaps);
      this.markCapsChart = this.showChart(markCapsSets);

      const total = data.total_volumes;
      const totalSets = this.setDatasets(total);
      this.totalChart = this.showChart(totalSets);
      this.chartLoaded = true;
    },
    setDatasets(data) {
      const tmpArr = {
        labels: [],
        datasets: [],
      };
      for (const [index, value] of data.entries()) {
        const per = index - this.selPeriod;
        const calcDate = new Date(
          new Date().setDate(new Date().getDate() + per)
        ).toLocaleDateString();

        tmpArr.labels.push(calcDate);
        tmpArr.datasets.push(value[1]);
      }
      return tmpArr;
    },

    showChart(data) {
      const chartData = {
        labels: data.labels,
        datasets: [
          {
            data: data.datasets,
            borderColor: PRIMARY_COLOR,
            borderWidth: 1,
            pointBackgroundColor: PRIMARY_COLOR,
            pointRadius: 1,
            pointHoverRadius: 2,
          },
        ],
      };

      return chartData;
    },
  },
};
</script>

<style>
#app > div.v-dialog__content.v-dialog__content--active > div > .br-none {
  border-radius: 0;
}
</style>