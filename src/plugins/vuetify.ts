import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import VAlert from 'vuetify/lib/components/VAlert/VAlert';
import VApp from 'vuetify/lib/components/VApp/VApp';
import VBtn from 'vuetify/lib/components/VBtn/VBtn';
import { VCard, VCardText } from 'vuetify/lib/components/VCard';
import VCol from 'vuetify/lib/components/VGrid/VCol';
import VDialog from 'vuetify/lib/components/VDialog/VDialog';
import VIcon from 'vuetify/lib/components/VIcon/VIcon';
import VImg from 'vuetify/lib/components/VImg/VImg';
import VMain from 'vuetify/lib/components/VMain/VMain';
import VProgressLinear from 'vuetify/lib/components/VProgressLinear/VProgressLinear';
import VRow from 'vuetify/lib/components/VGrid/VRow';
import VSelect from 'vuetify/lib/components/VSelect/VSelect';
import VSheet from 'vuetify/lib/components/VSheet/VSheet';
import VTab from 'vuetify/lib/components/VTabs/VTab';
import VTabs from 'vuetify/lib/components/VTabs/VTabs';
import VToolbar from 'vuetify/lib/components/VToolbar/VToolbar';
import { Ripple } from 'vuetify/lib/directives';

Vue.use(Vuetify, {
  components: {
    VAlert,
    VApp,
    VBtn,
    VCard,
    VCardText,
    VCol,
    VDialog,
    VIcon,
    VImg,
    VMain,
    VProgressLinear,
    VRow,
    VSelect,
    VSheet,
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
