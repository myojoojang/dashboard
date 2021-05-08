
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


import MainIndex from './components/base/MainIndex'
// import GuideView from './components/GuideView'
import StatusView from './components/StatusView'
import personalView from './components/personalView'


export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: MainIndex,
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: StatusView,
        },

        {
          path: 'personal',
          name: 'Personal',
          component: personalView,
        },

      ],
    },
  ],
})