<template>
  <AgGridVue
    class="ag-theme-material market-table"
    :column-defs="marketColumns"
    :row-data="coinMarkets"
    :default-col-def="defaultColumnOptions"
    :row-height="44"
    row-selection="multiple"
    :enable-cell-text-selection="true"
    @selection-changed="emitSelectedCoins"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { AgGridVue } from 'ag-grid-vue';
import type { ColDef, SelectionChangedEvent } from 'ag-grid-community';
import type { CoinMarketSnapshot } from '@/types/market';
import { formatNumber, formatPercentage } from '@/utils/formatNumber';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

interface CoinMarketCellParams {
  data: CoinMarketSnapshot;
}

export default defineComponent({
  name: 'MarketTable',
  components: { AgGridVue },
  props: {
    coinMarkets: {
      type: Array as PropType<CoinMarketSnapshot[]>,
      required: true,
    },
    quoteCurrency: {
      type: String,
      required: true,
    },
  },
  computed: {
    defaultColumnOptions(): ColDef {
      return {
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: 130,
      };
    },
    marketColumns(): ColDef[] {
      return [
        {
          headerName: '',
          headerCheckboxSelection: true,
          checkboxSelection: true,
          sortable: false,
          filter: false,
          minWidth: 50,
          width: 50,
          pinned: 'left',
        },
        {
          headerName: '#',
          field: 'market_cap_rank',
          minWidth: 70,
          width: 70,
        },
        {
          headerName: 'Name',
          field: 'name',
          width: 180,
          cellRenderer: this.renderCoinNameCell,
        },
        {
          headerName: `Price (${this.quoteCurrency.toUpperCase()})`,
          field: 'current_price',
          type: 'rightAligned',
          valueFormatter: (cellParams: CoinMarketCellParams) => {
            return formatNumber(cellParams.data.current_price);
          },
        },
        {
          headerName: 'Change (24h)',
          field: 'price_change_percentage_24h',
          type: 'rightAligned',
          valueFormatter: (cellParams: CoinMarketCellParams) => {
            return formatPercentage(
              cellParams.data.price_change_percentage_24h,
            );
          },
          cellClassRules: {
            'market-change--positive': (cellParams: CoinMarketCellParams) => {
              return (cellParams.data.price_change_percentage_24h || 0) > 0;
            },
            'market-change--negative': (cellParams: CoinMarketCellParams) => {
              return (cellParams.data.price_change_percentage_24h || 0) < 0;
            },
          },
        },
        {
          headerName: `High (24h, ${this.quoteCurrency.toUpperCase()})`,
          field: 'high_24h',
          type: 'rightAligned',
          valueFormatter: (cellParams: CoinMarketCellParams) => {
            return formatNumber(cellParams.data.high_24h);
          },
        },
        {
          headerName: `Low (24h, ${this.quoteCurrency.toUpperCase()})`,
          field: 'low_24h',
          type: 'rightAligned',
          valueFormatter: (cellParams: CoinMarketCellParams) => {
            return formatNumber(cellParams.data.low_24h);
          },
        },
        {
          headerName: 'Market cap',
          field: 'market_cap',
          type: 'rightAligned',
          valueFormatter: (cellParams: CoinMarketCellParams) => {
            return formatNumber(cellParams.data.market_cap);
          },
        },
        {
          headerName: 'Circulating supply',
          field: 'circulating_supply',
          type: 'rightAligned',
          valueFormatter: (cellParams: CoinMarketCellParams) => {
            return formatNumber(cellParams.data.circulating_supply);
          },
        },
        {
          headerName: 'Actions',
          sortable: false,
          filter: false,
          pinned: 'right',
          minWidth: 180,
          width: 180,
          cellRenderer: this.renderDetailsButton,
        },
      ];
    },
  },
  methods: {
    renderCoinNameCell(cellParams: CoinMarketCellParams): HTMLElement {
      const coinNameCell = document.createElement('span');
      const coinImage = document.createElement('img');

      coinImage.src = cellParams.data.image;
      coinImage.alt = '';
      coinImage.width = 20;
      coinImage.height = 20;
      coinNameCell.className = 'market-name';
      coinNameCell.append(
        coinImage,
        document.createTextNode(cellParams.data.name),
      );

      return coinNameCell;
    },
    renderDetailsButton(cellParams: CoinMarketCellParams): HTMLButtonElement {
      const detailsButton = document.createElement('button');

      detailsButton.type = 'button';
      detailsButton.className = [
        'market-details-button v-btn',
        'theme--light v-size--small primary white--text',
      ].join(' ');
      const buttonContent = document.createElement('span');
      const detailsIcon = document.createElement('i');

      buttonContent.className = 'v-btn__content';
      detailsIcon.className =
        'v-icon notranslate mdi mdi-magnify theme--light white--text';
      detailsIcon.setAttribute('aria-hidden', 'true');
      buttonContent.append(detailsIcon, document.createTextNode('Details'));
      detailsButton.append(buttonContent);
      detailsButton.title = `View ${cellParams.data.name} details`;
      detailsButton.setAttribute(
        'aria-label',
        `View ${cellParams.data.name} details`,
      );
      detailsButton.addEventListener('click', () => {
        this.$emit('open-details', cellParams.data);
      });

      return detailsButton;
    },
    emitSelectedCoins(selectionEvent: SelectionChangedEvent): void {
      this.$emit('selection-change', selectionEvent.api.getSelectedRows());
    },
  },
});
</script>

<style>
.market-table {
  width: 100%;
  height: 70vh;
  min-height: 400px;
}
.market-name {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.market-details-button {
  vertical-align: middle;
  transition: background-color 150ms ease;
}
.market-details-button .v-btn__content {
  gap: 6px;
}
.v-application .market-details-button.primary:hover,
.v-application .market-details-button.primary:focus-visible {
  background-color: #25549a !important;
}
.market-details-button:focus-visible {
  outline: 2px solid #0f2d61;
  outline-offset: 3px;
}
.market-change--positive {
  color: #137c56;
}
.market-change--negative {
  color: #c93030;
}
.ag-theme-material {
  font-family: 'Noto Sans KR', sans-serif;
}
</style>
