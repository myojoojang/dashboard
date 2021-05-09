<template>
  <div class="d-flex align-center ma-2">
    <h2 class="primary--text">{{ name }}</h2>

    <div v-if="addr">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <!-- <router-link
                  :to="{ path: '../monitor/audit' }"
                  :to="addr"
                  target="_blank"
                > -->
          <v-icon small color="grey" class="ml-2" v-bind="attrs" v-on="on">
            mdi-open-in-new
          </v-icon>
          <!-- </router-link> -->
        </template>
        전체보기
      </v-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "TitleCard",
  props: {
    name: {
      type: String,
    },
    addr: {
      type: String,
      default: null,
    },
  },
};
</script>
