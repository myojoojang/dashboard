<template>
  <AgGridVue
    class="ag-theme-material market-table"
    :column-defs="columns"
    :row-data="items"
    :default-col-def="defaultColumn"
    :row-height="44"
    row-selection="multiple"
    :suppress-row-click-selection="true"
    :enable-cell-text-selection="true"
    @selection-changed="onSelectionChanged"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
import { AgGridVue } from 'ag-grid-vue';
import type { ColDef, SelectionChangedEvent } from 'ag-grid-community';
import type { MarketItem } from '@/types/market';
import { formatNumber, formatPercentage } from '@/utils/formatNumber';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

interface MarketCell {
  data: MarketItem;
}

export default defineComponent({
  name: 'MarketTable',
  components: { AgGridVue },
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
    defaultColumn(): ColDef {
      return {
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: 130,
      };
    },
    columns(): ColDef[] {
      return [
        {
          headerName: '',
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
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
          cellRenderer: (params: MarketCell) => {
            const container = document.createElement('span');
            const image = document.createElement('img');

            image.src = params.data.image;
            image.alt = '';
            image.width = 20;
            image.height = 20;
            container.className = 'market-name';
            container.append(image, document.createTextNode(params.data.name));

            return container;
          },
        },
        {
          headerName: `Price (${this.currency.toUpperCase()})`,
          field: 'current_price',
          valueFormatter: (params: MarketCell) => {
            return formatNumber(params.data.current_price);
          },
        },
        {
          headerName: 'Change (24h)',
          field: 'price_change_percentage_24h',
          valueFormatter: (params: MarketCell) => {
            return formatPercentage(params.data.price_change_percentage_24h);
          },
          cellClassRules: {
            'market-change--positive': (params: MarketCell) => {
              return (params.data.price_change_percentage_24h || 0) > 0;
            },
            'market-change--negative': (params: MarketCell) => {
              return (params.data.price_change_percentage_24h || 0) < 0;
            },
          },
        },
        ...(['high_24h', 'low_24h', 'market_cap', 'circulating_supply'] as const).map((field) => {
          const labels = {
            high_24h: 'High (24h)',
            low_24h: 'Low (24h)',
            market_cap: 'Market cap',
            circulating_supply: 'Circulating supply',
          };

          return {
            headerName: labels[field],
            field,
            valueFormatter: (params: MarketCell) => {
              return formatNumber(params.data[field]);
            },
          };
        }),
        {
          headerName: 'Details',
          sortable: false,
          filter: false,
          pinned: 'right',
          minWidth: 90,
          width: 90,
          cellRenderer: (params: MarketCell) => {
            const button = document.createElement('button');

            button.type = 'button';
            button.className = 'market-details-button';
            button.textContent = 'Details';
            button.setAttribute('aria-label', `View ${params.data.name} details`);
            button.addEventListener('click', () => {
              this.$emit('open-details', params.data);
            });

            return button;
          },
        },
      ];
    },
  },
  methods: {
    onSelectionChanged(event: SelectionChangedEvent): void {
      this.$emit('selection-change', event.api.getSelectedRows());
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
  color: #0f2d61;
  text-decoration: underline;
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
