import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import './styles/app.css';

Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (createElement) => {
    return createElement(App);
  },
}).$mount('#app');
