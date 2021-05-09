<template>
  <v-card class="br-none">
    <v-toolbar dense flat class="pa-0 d-flex justify-center">
      <v-btn outlined fab x-small color="primary" @click="$emit('close-dlg')">
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
        <v-sheet rounded="" color="primary" class="white--text mb-8 pa-4">
          <div class="d-flex">
            <div>
              <div class="d-flex align-center">
                <v-img
                  :src="propData.image"
                  max-width="50px"
                  max-height="50px"
                />
                <h1 class="white--text ma-2">{{ propData.name }}</h1>

                <v-chip small color="white"
                  >#{{ propData.market_cap_rank }}</v-chip
                >
              </div>
              <div>
                {{ propData.current_price }}
                {{ propData.total_volume }}

                {{ propData.high_24h }}
                {{ propData.low_24h }}
                {{ propData.price_change_24h }}
                {{ propData.price_change_percentage_24h }}
              </div>
              --

              {{ propData.market_cap }}
              {{ propData.market_cap_change_24h }}
              {{ propData.market_cap_change_percentage_24h }}

              거래량
              {{ propData.total_supply }}
              {{ propData.circulating_supply }}
              ---
              {{ propData.ath }}
              {{ propData.ath_change_percentage }}
              {{ propData.ath_date }}

              ---
              {{ propData.atl }}
              {{ propData.atl_change_percentage }}
              {{ propData.atl_date }}

              "ath": 64805, "ath_change_percentage": -9.69851, "ath_date":
              "2021-04-14T11:54:46.763Z", "atl": 67.81, "atl_change_percentage":
              86200.68373, "atl_date": "2013-07-06T00:00:00.000Z",
            </div>
            <v-spacer />
            <v-sheet outlined width="40%" min-width="400px">
              <h4 class="ma-2 primary--text">Price in 7 days</h4>
              <v-sparkline
                :value="propData.sparkline_in_7d.price"
                color="primary"
                line-width="1"
                padding="16"
              ></v-sparkline>
            </v-sheet>
          </div>
        </v-sheet>

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
      this.chartLoaded = false;
      axios
        .get(
          `${API_URL}/coins/${this.propData.id}/market_chart?vs_currency=${this.propData.currency}&days=${this.selPeriod}`
        )
        .then((res) => {
          const data = res.data;

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