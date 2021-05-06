
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


import MainIndex from './components/base/MainIndex'
// import GuideView from './components/GuideView'
import StatusView from './components/StatusView'
import CampaignView from './components/CampaignView'


export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name:'메인',
      component: MainIndex,
      children: [
       
        {
          path: 'status',
          name: 'map',
          component: StatusView,
        },
        {
          path: 'campaign',
          name: '캠페인',
          component: CampaignView,
        },

      ],
    },
  ],
})