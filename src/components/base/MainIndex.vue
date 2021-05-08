
<template>
  <v-app>
    <app-bar />
    <v-main class="ma-4 mt-2">
      <router-view />
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