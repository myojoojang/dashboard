<template>
  <v-card class="br-none">
    <v-toolbar dense flat class="pa-0 d-flex justify-center">
      <v-btn
        outlined
        fab
        x-small
        color="primary"
        @click="(propData = null) + (data = null) + $emit('close-dlg')"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card-text class="pa-10 pt-1" style="height: 100%">
      <template v-if="compareReq">
        <chart-card
          v-if="lineChartLoaded"
          :name="`Prices (last 7days)`"
          :chartdata="timestampChartData"
          :charttype="5"
      /></template>

      <template v-else>
        <div class="text-right mb-1">
          Last update {{ data.last_updated }}
          <v-chip small outlined>{{ data.currency }}</v-chip>
        </div>
        <v-sheet rounded color="primary" class="white--text mb-8 pa-4">
          <div class="d-flex">
            <div style="width: 100%" class="mx-4">
              <div class="d-flex flex-wrap align-center justify-space-between">
                <v-img :src="data.image" max-width="50px" max-height="50px" />
                <h1 class="white--text ma-2">{{ data.name }}</h1>

                <v-chip small color="white"
                  >#{{ propData.market_cap_rank }}</v-chip
                >
                <v-spacer />
                <div class="">
                  Current Price
                  <span class="display-1">{{
                    data.current_price | toThousandFilter
                  }}</span>
                  <v-chip
                    class="mb-4 ma-1"
                    small
                    :color="
                      data.price_change_percentage_24h > 0 ? 'success' : 'error'
                    "
                    >{{ data.price_change_percentage_24h }}%
                  </v-chip>
                  <v-divider dark />
                  <div class="text-right pa-2">
                    <v-chip dark x-small outlined>24h</v-chip>
                    Low
                    <b class="mr-2">{{ data.low_24h | toThousandFilter }}</b>
                    High
                    <b>{{ data.high_24h | toThousandFilter }}</b>
                  </div>
                </div>
              </div>
              <v-divider dark class="my-4" />
              <div class="ma-4 d-flex flex-wrap justify-space-between">
                <div class="my-1">
                  Market Cap
                  <div>
                    <b>{{ data.market_cap | toThousandFilter }}</b>
                    <!-- {{ data.market_cap_change_24h |toThousandFilter }} -->

                    <v-chip
                      class="mb-3 ma-1"
                      small
                      :color="
                        data.price_change_percentage_24h > 0
                          ? 'success'
                          : 'error'
                      "
                      >{{ data.market_cap_change_percentage_24h }} %</v-chip
                    >
                  </div>
                </div>
                <div class="my-1">
                  Total Volume
                  <div>
                    <b>{{ data.total_volume | toThousandFilter }}</b>
                  </div>
                </div>

                <div class="my-1">
                  <div>
                    Circulating Supply
                    <b>{{ data.circulating_supply | toThousandFilter }}</b>
                  </div>
                  <div>
                    Total Supply
                    <b>{{ data.total_supply | toThousandFilter }}</b>
                  </div>
                  <div>
                    Max Supply <b>{{ data.max_supply | toThousandFilter }}</b>
                  </div>
                </div>
              </div>
            </div>

            <v-sheet outlined min-width="300px" class="mx-4">
              <h4 class="ma-2 primary--text">Price in 7 days</h4>
              <v-sparkline
                :value="data.sparkline_in_7d.price"
                color="primary"
                line-width="1"
                padding="16"
              ></v-sparkline>
            </v-sheet>
          </div>
        </v-sheet>

        <title-card
          :name="`${data.name} - Market data of Last ${selPeriod} days `"
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
          :name="`Market Cap`"
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
const API_URL = "https://api.coingecko.com/api/v3";

import ChartCard from "./partial/ChartCard";
import axios from "axios";
import TitleCard from "./partial/TitleCard.vue";
export default {
  name: "ChartDlg",
  components: {
    ChartCard,
    TitleCard
  },

  props: {
    compareReq: { type: Boolean, default: false },
    propData: null
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
      data: null
    };
  },

  created() {
    this.data = this.propData;
    if (!this.compareReq) {
      this.init();
    } else {
      this.getComparison();
    }
  },

  methods: {
    init() {
      this.chartLoaded = false;
      axios
        .get(
          `${API_URL}/coins/${this.propData.id}/market_chart?vs_currency=${this.propData.currency}&days=${this.selPeriod}`
        )
        .then(res => {
          const data = res.data;
          this.setChartData(data);
        })
        .catch(err => {
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
          pointHoverRadius: 1
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
        datasets: datasets
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
        datasets: []
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
            borderColor: "#0f2d61",
            borderWidth: 1,
            pointBackgroundColor: "#0f2d61",
            pointRadius: 1,
            pointHoverRadius: 2
          }
        ]
      };

      return chartData;
    }
  }
};
</script>

<style>
#app > div.v-dialog__content.v-dialog__content--active > div > .br-none {
  border-radius: 0;
}
</style>
