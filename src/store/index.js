import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import i18n from './modules/i18n'
import permission from './modules/permission'
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    app,
    user,
    i18n,
    permission
  },
  state: {
    id: '', //默认当前项目id
    defautProject: [], // 默认项目选择
  },
  mutations: {
    show(state,objid) {
      state.id = objid
    },
    SET_DEFAUT_PROJECT: (state, index) => {
      state.defautProject = index
    },
  },
  actions: {

  },
  getters
})
