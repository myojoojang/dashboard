import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);


const theme = {
  primary: '#5f7daf',
  secondary: '#00d2e5',
  accent: '#0080CB',
  info: '#00d2e5',
  error: '#f95f5f',
  success: '#1ec58a',
  warning: '#ffb914',
  backColor: '#FAECE5',
  grey: '#d1d1d1',
  gray: '#d1d1d1',
}

export default new Vuetify({
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
})