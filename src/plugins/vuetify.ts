import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import {
  VAlert,
  VApp,
  VBtn,
  VCard,
  VCardText,
  VChip,
  VCol,
  VDialog,
  VDivider,
  VIcon,
  VImg,
  VMain,
  VProgressLinear,
  VRow,
  VSelect,
  VSheet,
  VSpacer,
  VTab,
  VTabs,
  VToolbar,
} from 'vuetify/lib';
import { Ripple } from 'vuetify/lib/directives';

Vue.use(Vuetify, {
  components: {
    VAlert,
    VApp,
    VBtn,
    VCard,
    VCardText,
    VChip,
    VCol,
    VDialog,
    VDivider,
    VIcon,
    VImg,
    VMain,
    VProgressLinear,
    VRow,
    VSelect,
    VSheet,
    VSpacer,
    VTab,
    VTabs,
    VToolbar,
  },
  directives: { Ripple },
});

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#0f2d61',
        secondary: '#00d2e5',
        accent: '#0080cb',
        error: '#f95f5f',
        success: '#1ec58a',
      },
    },
  },
});
