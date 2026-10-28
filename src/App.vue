<template>
  <v-app>
    <SiteLayout>
      <DashboardView />
    </SiteLayout>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SiteLayout from './components/layout/SiteLayout.vue';
import DashboardView from './views/DashboardView.vue';

export default defineComponent({
  name: 'App',
  components: {
    SiteLayout,
    DashboardView,
  },
});
</script>
