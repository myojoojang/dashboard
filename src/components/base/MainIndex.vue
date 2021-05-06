
<template>
  <v-app>
    <app-bar />
    <v-main class="ma-4 mt-2">
      <v-card v-if="$route.name === '메인'" color="white">메인</v-card>
      <router-view v-else />
    </v-main>
    <main-footer />
  </v-app>
</template>

<script>
// import ActView from './base/ActView'
import AppBar from "./AppBar";
import MainFooter from "./MainFooter.vue";
export default {
  name: "MainIndex",
  components: { AppBar, MainFooter },
};
</script>