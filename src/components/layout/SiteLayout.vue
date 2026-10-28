<template>
  <div class="site-layout">
    <header class="d-flex justify-center white--text my-8">
      <v-icon
        class="mx-2"
        color="white"
      >
        mdi-circle-multiple-outline
      </v-icon>
      <h1>Coin Tracker</h1>
    </header>
    <v-main>
      <slot />
    </v-main>
    <footer class="text-right small-text white--text my-4">
      Market data from <a
        href="https://www.coingecko.com/"
        class="white--text"
      >CoinGecko</a>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'SiteLayout' });
</script>

<style scoped>
.site-layout {
  width: 100%;
  max-width: 1340px;
  margin: auto;
  padding: 0 16px;
}
</style>
