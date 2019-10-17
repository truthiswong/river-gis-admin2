// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import splitPane from 'vue-splitpane'
import draggable from 'vuedraggable'
import VueVideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'



// mock
//import './mock' // 模拟数据

import bootstrap from './core/bootstrap'
import './core/use'
import './permission' // 权限控制
import './utils/filter' // 全局过滤器
import i18n from './locales'

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)
Vue.use(iView);
Vue.use(VueVideoPlayer);
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
Vue.component('split-pane',splitPane);
Vue.component('draggable',draggable);

new Vue({
  router,
  store,
  i18n,
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
