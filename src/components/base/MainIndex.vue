
<template>
  <v-app>
    <!-- <app-bar /> -->
    <div style="max-width: 1340px; min-width: 1340px; margin: auto">
      <div class="d-flex justify-center white--text my-8">
        <v-icon class="mx-2" color="white">mdi-circle-multiple-outline</v-icon>
        <h1>Coin Tracker</h1>
      </div>
      <v-main class="ma-4 mt-2">
        <status-view />
      </v-main>
    </div>
    <!-- <main-footer /> -->
  </v-app>
</template>

<script>
// import ActView from './base/ActView'
// import AppBar from "./AppBar";
import StatusView from "../StatusView.vue";
// import MainFooter from "./MainFooter.vue";
export default {
  name: "MainIndex",
  components: { StatusView }
};
</script>