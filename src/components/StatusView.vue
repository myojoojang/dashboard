<template>
  <div>
    <v-card height="100%" class="mt-2 pa-4" min-height="250px">
      <title-card :name="`Dashboard | ${dt}`" />
      <v-divider class="my-4" />
      <div class="d-flex flex-wrap justify-space-between">
        <div style="width: 30%">
          <chart-card
            v-if="capChartLoaded"
            :name="'Market Cap'"
            :chartdata="capChartData"
            :charttype="4"
          />
        </div>
        <div style="width: 30%">
          <chart-card
            v-if="volumeChartLoaded"
            :name="'Total Volume'"
            :chartdata="volumeChartData"
            :charttype="4"
          />
        </div>

        <div style="width: 30%">
          <chart-card
            v-if="supplyChartLoaded"
            :name="'Circulating Supply'"
            :chartdata="supplyChartData"
            :charttype="4"
          />
        </div>
      </div>

      <div class="bar-chart-container pa-4 mt-4">
        <chart-card
          v-if="lineChartLoaded"
          :name="'Top 10 Cryptocurrency (last 7days)'"
          :chartdata="timestampChartData"
          :charttype="2"
        />
      </div>
    </v-card>

    <!-- <v-card class="d-flex flex-wrap">
          <v-icon>mdi-filter</v-icon>
          <v-chip color="primary">전체</v-chip>
          <v-chip close outlined color="primary" class="mx-1">필터링</v-chip>
        </v-card> -->

    <v-card height="100vh" class="mt-2 py-1">
      <div class="d-flex flex-wrap justify-space-between align-center">
        <div style="width: 300px">
          <v-tabs v-model="tab" @change="tabChange" class="pa-2 pb-0">
            <v-tab v-for="el of tabs" :key="el.id">{{ el.name }}</v-tab>
          </v-tabs>
        </div>

        <div class="ma-2 d-flex justify-end">
          <div style="width: 150px">
            <v-select
              v-model="selCurrency"
              :items="Currencies"
              rounded
              dense
              outlined
              hide-details
              placeholder="Currency"
              @change="init() + (tab = 0) + tabChange()"
            />
          </div>
          <v-btn class="mx-4" color="primary" @click="getRowDataFromGrid">
            <v-icon small class="mr-2">mdi-checkbox-marked</v-icon>Comparison
          </v-btn>
        </div>
      </div>
      <ag-grid
        ref="data1"
        v-if="isTableReady"
        style="height: 90%"
        :columndefs="headers"
        :rowdata="rowData"
        class="pb-4"
        @selected-data="selectedData"
      />
    </v-card>
    <v-dialog
      v-model="showDlg"
      fullscreen
      hide-overlay
      persistent
      transition="dialog-bottom-transition"
    >
      <ChartDlg
        v-if="showDlg"
        :compare-req="compareReq"
        :prop-data="propData"
        @close-dlg="(showDlg = false)+(init())"
      />
    </v-dialog>
  </div>
</template>

<script>
import AgGrid from "./partial/AgGrid.vue";
import ChartCard from "./partial/ChartCard";
// import TitleCard from "./partial/TitleCard.vue";
import ChartDlg from "./ChartDlg";

import { API_URL } from "../globalVars";
import axios from "axios";
import TitleCard from "./partial/TitleCard.vue";

export default {
  name: "StatusView",
  components: {
    ChartCard,
    // TitleCard,
    AgGrid,
    ChartDlg,
    TitleCard,
  },

  created() {
    this.dt = new Date().toLocaleDateString();
    this.init();
  },
  data() {
    return {
      tab: "",
      tabs: [
        { name: "all", id: 1 },
        { name: "Rise", id: 2 },
        { name: "Drop", id: 3 },
      ],
      dt: "",
      Currencies: [],
      selCurrency: "usd",

      isTableReady: false,
      rowData: [],
      headers: [],

      volumeChartLoaded: false,
      volumeChartData: null,

      supplyChartLoaded: false,
      supplyChartData: null,

      capChartLoaded: false,
      capChartData: null,

      timestampChartData: null,
      lineChartLoaded: false,

      showDlg: false,
      propData: null,
      compareReq: false,
    };
  },
  methods: {
    tabChange() {
      // console.log(this.tab);
      if (this.tab === 0) {
        this.rowData = this.allCryptos;
      } else if (this.tab === 1) {
        this.rowData = this.allCryptos.filter(
          (c) => c.price_change_percentage_24h > 0
        );
      } else if (this.tab === 2) {
        this.rowData = this.allCryptos.filter(
          (c) => c.price_change_percentage_24h < 0
        );
      }
    },
    init() {
    this.propData = null;
      this.compareReq = false;
      this.isTableReady = false;
      this.supplyChartLoaded = false;
      this.volumeChartLoaded = false;
      this.capChartLoaded = false;
      this.lineChartLoaded = false;
      // console.log(this.selCurrency);
      const priceReq = axios.get(
        `${API_URL}/coins/markets?vs_currency=${this.selCurrency}&order=market_cap_desc&per_page=1000&page=1&sparkline=true`
      );
      const currencyReq = axios.get(
        `${API_URL}/simple/supported_vs_currencies`
      );
      axios.all([currencyReq, priceReq]).then(
        axios.spread((currRes, priceRes) => {
          // output of req.
          console.log(priceRes);
          this.Currencies = currRes.data;
          this.allCryptos = priceRes.data;
          this.setTableDef(priceRes.data);
          this.setVolumeData();
          this.setCapData();
          this.setSupplyData();
          this.setTimestampChart();
        })
      );
    },
    dynamicColors() {
      const h = 215;
      const s = 90;
      const l = Math.floor(Math.random() * 50) + 30;
      const color = "hsl(" + h + ", " + s + "%, " + l + "%)";
      return color;
    },
    setTimestampChart() {
      const datasets = [];
      const top10Prices = this.allCryptos.slice(0, 10);

      for (let el of top10Prices) {
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
    showTimestampChart(dataSet) {
      this.timestampChartData = dataSet;
      this.lineChartLoaded = true;
    },

    setVolumeData() {
      const data = {
        labels: [],
        datasets: [],
        color: [],
      };

      for (let el of this.allCryptos) {
        data.labels.push(el.name);
        data.datasets.push(el.total_volume);
        data.color.push(this.dynamicColors());
      }

      this.volumeChartData = this.showChart(data);
      this.volumeChartLoaded = true;
    },
    getRowDataFromGrid() {
      this.$refs.data1.getSelectedRowData();
    },
    selectedData(items) {
      if (!items.length) {
        alert("Please Select Something 😉");
        return;
      }

      if (items.length > 20) {
        alert("Please Select less than 20 🤞");
        return;
      }

      this.propData = items;
      this.compareReq = true;
      this.showDlg = true;
    },

    setCapData() {
      const data = {
        labels: [],
        datasets: [],
        color: [],
      };

      for (let el of this.allCryptos) {
        data.labels.push(el.name);
        data.datasets.push(el.market_cap);
        data.color.push(this.dynamicColors());
      }

      this.capChartData = this.showChart(data);
      this.capChartLoaded = true;
    },

    setSupplyData() {
      const data = {
        labels: [],
        datasets: [],
        color: [],
      };

      for (let el of this.allCryptos) {
        data.labels.push(el.name);
        data.datasets.push(el.circulating_supply);
        data.color.push(this.dynamicColors());
      }

      this.supplyChartData = this.showChart(data);
      this.supplyChartLoaded = true;
    },

    showChart(data) {
      const chartData = {
        labels: data.labels,
        datasets: [
          {
            data: data.datasets,
            backgroundColor: data.color,
            borderWidth: 0.5,
            hoverBackgroundColor: data.color,
          },
        ],
      };

      return chartData;
    },
    setTableDef(data) {
      let headers = [
        {
          headerCheckboxSelection: true,
          checkboxSelection: true,
          suppressMenu: true,
          sortable: false,
          width: 50,
        },

        {
          headerName: "#",
          field: "market_cap_rank",
          width: 80,
        },
        {
          headerName: "",
          field: "image",
          cellRenderer: (params) => {
            const url = params.data.image;

            return `<img style="width:20px; height:20px;" src="${url}"/>`;
          },

          width: 80,
          suppressMenu: true,
        },

        {
          headerName: "Name",
          field: "name",
        },
        {
          headerName: "Current Price",
          field: "current_price",
          cellRenderer: (params) => {
            const usd = params.data.current_price;
            return `<span class="small-text grey--text">${
              this.selCurrency
            }</span> ${usd.toLocaleString()}`;
          },

          type: "rightAligned",
        },
        {
          headerName: "Rise and Drop Rate last 24h",
          field: "price_change_percentage_24h",
          cellRenderer: (params) => {
            const per = params.data.price_change_percentage_24h;
            if (per < 0) {
              return `<span class="error--text">${per.toFixed(
                2
              )}% <i aria-hidden="true" class="v-icon notranslate mdi v-size--x-small mdi-arrow-down-drop-circle theme--light error--text"></i></span>`;
            } else {
              return `<span class="success--text">${per.toFixed(
                2
              )}%  <i aria-hidden="true" class="v-icon notranslate mdi v-size--x-small mdi-arrow-up-drop-circle theme--light success--text"></i></span>`;
            }
          },
          type: "rightAligned",
        },
        {
          headerName: "Highest last 24h",
          field: "high_24h",
          type: "rightAligned",
          cellRenderer: (params) => {
            const usd = params.data.high_24h;
            return `<span class="small-text grey--text">${
              this.selCurrency
            }</span> ${usd.toLocaleString()}`;
          },
        },
        {
          headerName: "Lowest last 24h",
          field: "low_24h",
          type: "rightAligned",
          cellRenderer: (params) => {
            const usd = params.data.low_24h;
            return `<span class="small-text grey--text">${
              this.selCurrency
            }</span> ${usd.toLocaleString()}`;
          },
        },

        {
          headerName: "Market Cap",
          field: "market_cap",
          type: "rightAligned",
          cellRenderer: (params) => {
            const cap = params.data.market_cap;
            return cap.toLocaleString();
          },
        },
        {
          headerName: "Circulating Supply",
          field: "circulating_supply",
          type: "rightAligned",
          cellRenderer: (params) => {
            const sup = params.data.circulating_supply;
            return sup.toLocaleString();
          },
        },

        {
          headerName: "",
          field: "job",
          cellRenderer: (params) => {
            const button = this.setDetailBtn(params);
            return button;
          },
          suppressMenu: true,
          type: "rightAligned",
          width: 80,
        },
      ];
      this.headers = headers;
      this.rowData = data;
      this.isTableReady = true;
    },
    setDetailBtn(params) {
      
      const btnContainer = document.createElement("div");
      btnContainer.innerHTML =
        '<button type="button" class="v-btn v-btn--fab v-btn--round theme--light v-size--x-small primary--text btn-detail"><span class="v-btn__content"><i aria-hidden="true" class="v-icon notranslate mdi mdi-magnify theme--light"></i></span></button> ';
      const detailButton = btnContainer.querySelector(".btn-detail");

      const cur = this;
      detailButton.addEventListener("click", function () {
        cur.showDlg = true;
        params.data.currency = cur.selCurrency;
        cur.propData = params.data;
      });
      return btnContainer;
    },
  },
};
</script>
