<template>
  <div style="height: 100%">
    <div id="grid-wrapper" style="width: 100%; height: 100%">
      <!-- <v-divider class="my-4" /> -->
      <ag-grid-vue
        style="width: 100%; height: 100%"
        class="ag-theme-material"
        :column-defs="columndefs"
        :row-data="rowdata"
        :pagination-page-size="5"
        :row-selection="rowSelection"
        enable-cell-text-selection="true"
        :grid-options="gridOptions"
        :default-col-def="defaultColDef"
        :locale-text="gridLocalText"
        @first-data-rendered="onFirstDataRendered"
        @grid-size-changed="onGridSizeChanged"
      />
    </div>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
// import {
//   _gridLocalText,
// } from '@/GlobalVars'

export default {
  name: "AgGrid",
  components: { AgGridVue },
  props: {
    columndefs: { type: Array, default: null },
    rowdata: { type: Array, default: null },
  },
  data() {
    return {
      gridOptions: null,
      gridApi: null,
      columnApi: null,
      defaultColDef: null,
      paginationPageSize: null,

      selectedItem: null,

      tmpArr: [],
      selectedRow: [],

      gridLocalText: {
        // Set Filter
        selectAll: "모두 선택",
        selectAllSearchResults: "검색 결과 모두 선택",
        searchOoo: "검색",
        blanks: "(Blanks)",
        noMatches: "일치 결과 없음",

        // Number Filter & Text Filter
        filterOoo: "검색",
        equals: "모두 일치",
        notEqual: "모두 미일치",
        empty: "Choose One",

        // Text Filter
        contains: "포함",
        notContains: "미포함",
        startsWith: "시작",
        endsWith: "끝",

        // Date Filter
        dateFormatOoo: "yyyy-mm-dd",

        // Filter Conditions
        andCondition: "과",
        orCondition: "또는",

        // Filter Buttons
        applyFilter: "적용",
        resetFilter: "리셋",
        clearFilter: "모두 지우기",
        cancelFilter: "취소",

        to: "부터",
        of: "/",
        page: "페이지",

        loadingOoo: "로딩중",
        noRowsToShow: "데이터가 없습니다.",
        enabled: "사용",

        // // Number Filter
        // lessThan: 'Less than',
        // greaterThan: 'Greater than',
        // lessThanOrEqual: 'Less than or equal',
        // greaterThanOrEqual: 'Greater than or equal',
        // inRange: 'In range',
        // inRangeStart: '시작 값',
        // inRangeEnd: '마지막 값',
      },
    };
  },

  created() {
    this.gridOptions = {
      onRowClicked: (event) => {
        this.emmitRowData(event.data);
        this.tmpArr.push(event.data);
      },
    };
    this.defaultColDef = {
      filter: true,
      sortable: true,
      resizable: true,
      suppressHorizontalScroll: false,
      suppressSizeToFit: false,
    };
    this.paginationPageSize = this.auItemsPerPage;
    this.rowSelection = "multiple";
  },
  mounted() {
    this.gridColumnApi = this.gridOptions.columnApi;
    this.gridApi = this.gridOptions.api;
  },
  methods: {
    onFirstDataRendered(params) {
      params.api.sizeColumnsToFit();
    },

    onGridSizeChanged(params) {
      const gridWidth = document.getElementById("grid-wrapper").offsetWidth;
      const columnsToShow = [];
      const columnsToHide = [];

      let totalColsWidth = 0;
      const allColumns = params.columnApi.getAllColumns();
      for (let i = 0; i < allColumns.length; i++) {
        const column = allColumns[i];
        totalColsWidth += column.getMinWidth();
        if (totalColsWidth > gridWidth) {
          columnsToHide.push(column.colId);
        } else {
          columnsToShow.push(column.colId);
        }
      }
      params.columnApi.setColumnsVisible(columnsToShow, true);
      params.columnApi.setColumnsVisible(columnsToHide, false);
      params.api.sizeColumnsToFit();
    },

    getSelectedRowData() {
      const selectedNodes = this.gridApi.getSelectedNodes();
      const selectedData = selectedNodes.map((node) => node.data);
      this.$emit("selected-data", selectedData);
    },

    emmitRowData(data) {
      this.$emit("emmit-data", data);
    },
  },
};
</script>
<style lang="scss">
@import "../../../node_modules/ag-grid-community/dist/styles/ag-grid.css";
@import "../../../node_modules/ag-grid-community/dist/styles/ag-theme-material.css";

.ag-theme-material .ag-row-hover {
  /* putting in !important so it overrides the theme's styling as it hovers the row also */
  background-color: #edf1f7 !important;
  cursor: pointer;
}

.ag-theme-material {
  font-family: "Noto Sans KR", sans-serif;
  color: #46484b;
  background-color: transparent;
  margin-top: 0px !important;
}

.ag-theme-material .ag-row {
  background-color: transparent;
}

.ag-theme-material .ag-root-wrapper {
  background-color: transparent;
}

.ag-theme-material .ag-header {
  background-color: transparent;
  min-height: 38px !important;
  height: 38px !important;
}

.ag-row .ag-cell {
  color: #46484b;
  font-size: 0.9rem;
  padding-right: 10px;
  padding-left: 10px;
}
.ag-cell-auto-height {
  height: 38px !important;
  min-height: 38px !important;
}

.ag-header .ag-header-cell-text {
  color: #46484b;
}

.ag-theme-material .ag-checkbox-input-wrapper.ag-checked::after {
  color: #5f7daf;
}

.ag-theme-material .ag-header-cell,
.ag-theme-material .ag-header-group-cell {
  padding-right: 10px;
  padding-left: 10px;
}

.ag-theme-material .ag-paging-panel {
  height: 40px;
  width: 100%;
  font-family: "Noto Sans KR", sans-serif;
  color: #46484b;
  font-size: 0.8rem;
  // border: 1px solid #edf1f7;
  // // border-radius: 25px;
  // // padding: 10px 1px;
  // // background-color: #edf1f7;
  // // margin-right: 15px;
  // position: absolute !important;
  // bottom: 0 !important;
  // right: 0 !important;
  // transition: 0.3s;
}

.ag-theme-material .ag-row-selected {
  background-color: #edf1f7;
  // // border: 1px #5f7daf solid;
  // border-bottom:  0.5px #5f7daf solid;;
  font-weight: 500;
  color: #5f7daf !important;
}

.ag-theme-material .ag-row {
  height: 38px;
  line-height: 38px;
}

.ag-theme-material .ag-cell {
  height: 38px !important;
  line-height: 38px;
}

.ag-theme-material .ag-header-row {
  height: 38px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.ag-cell-focus {
  border: 0px solid transparent;
}

.ag-root-wrapper {
  position: relative !important;
  z-index: 1;
}

.ag-root-wrapper-body {
  margin-top: 8px;
}
</style>
