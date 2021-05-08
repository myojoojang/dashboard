<template>
  <div>
    <v-card class="d-flex flex-wrap align-center pa-4">
      <div style="width: 400px">
        <v-select
          v-model="selFilter"
          :items="Crryptos"
          item-text="name"
          return-object
          rounded
          dense
          outlined
          hide-details
        />
      </div>
      <v-divider vertical class="mx-4" />
      {{ selFilter }}
      <v-spacer />
      <v-btn color="primary" large>add New</v-btn>
    </v-card>
    <v-card class="mt-4 pa-4">
      <div class="d-flex flex-wrap justify-space-between">
        <div style="width: 49%">
          <title-card :name="'Prosess'" />
          <v-progress-linear
            color="primary lighten-1"
            rounded
            height="25"
            value="20"
            class="primary--text"
            >20%</v-progress-linear
          >
        </div>
        <div style="width: 49%">
          <title-card :name="'wip'" />

          <v-progress-linear
            color="primary lighten-1"
            rounded
            height="25"
            value="20"
            class="primary--text"
            >20%</v-progress-linear
          >
        </div>
      </div>
      <div class="mt-4">
        <chart-card :charttype="4" :name="'Finsh'" />
      </div>
    </v-card>
    <v-row>
      <v-col cols="12" md="3">
        <v-card height="100vh" class="mt-4 pa-4">
          <title-card :name="'select '" />
          <div style="height: 90vh" class="mt-4 overflow-y-auto">
            <v-treeview
              selectable
              dense
              open-on-click
              :items="companies"
              rounded
            ></v-treeview>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card height="100vh" class="mt-4 pa-4">
          <div class="d-flex flex-wrap align-center">
            <v-tabs style="width: 70%">
              <v-tab v-for="el of tabs" :key="el.id">{{ el.name }}</v-tab>
            </v-tabs>
            <div style="width: 150px">
              <v-select
                v-model="selFilter"
                :items="Crryptos"
                item-text="name"
                return-object
                rounded
                dense
                outlined
                hide-details
                placeholder=""
              />
            </div>
          </div>
          <ag-grid
            v-if="isTableReady"
            style="height: 100%"
            :columndefs="[]"
            :multiselection="[]"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import TitleCard from "./partial/TitleCard.vue";
import ChartCard from "./partial/ChartCard";

import AgGrid from "./partial/AgGrid.vue";

export default {
  components: { TitleCard, ChartCard, AgGrid },
  name: "CampaignView",
  data() {
    return {
      Crryptos: [],
      selFilter: null,

      isTableReady: false,

      companies: [
        {
          id: 1,
          name: "Applications :",
          children: [
            { id: 2, name: "Calendar : app" },
            { id: 3, name: "Chrome : app" },
            { id: 4, name: "Webstorm : app" },
          ],
        },
        {
          id: 1,
          name: "Applications :",
          children: [
            { id: 2, name: "Calendar : app" },
            { id: 3, name: "Chrome : app" },
            { id: 4, name: "Webstorm : app" },
          ],
        },
        {
          id: 5,
          name: "Documents :",
          children: [
            {
              id: 6,
              name: "vuetify :",
              children: [
                {
                  id: 7,
                  name: "src :",
                  children: [
                    { id: 8, name: "index : ts" },
                    { id: 9, name: "bootstrap : ts" },
                  ],
                },
              ],
            },
            {
              id: 10,
              name: "material2 :",
              children: [
                {
                  id: 11,
                  name: "src :",
                  children: [
                    { id: 12, name: "v-btn : ts" },
                    { id: 13, name: "v-card : ts" },
                    { id: 14, name: "v-window : ts" },
                  ],
                },
              ],
            },
          ],
        },
      ],
      tabs: [
        { name: "all", id: 1 },
        { name: "1", id: 2 },
        { name: "2", id: 3 },
        { name: "3", id: 4 },
      ],
    };
  },
};
</script>

<style>
</style>