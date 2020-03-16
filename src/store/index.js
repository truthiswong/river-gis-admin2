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
    defautProject: [], //默认项目选择
    serverUrl: 'http://demo-jleco-river.jl-shgroup.com',
    tenantId: "test:jlgis@2019", // 默认测试
    projectCoordinate: { //项目坐标
      lng: 121.43489, // 经度
      lat: 31.15053 // 纬度
    },
    weatherId:'',
    projectInfo: {}, //项目信息
    permissionLists: [
      [
        {
          id: '5e142f3273e44f2d59d43766',
          name: '巡河',
          flag: 'xh',
          read: false,
          write: false
        }
      ],
      [
        {
          id: '5e142f8373e44f2d59d43767',
          name: '监管',
          flag: 'jg',
          read: false,
          write: false
        }
      ],
      [
        {
          id: '5e144bdfa96a47239fbf9d72',
          parentId: '5e142f8e73e44f2d59d43768',
          name: '河道',
          flag: 'river',
          read: false,
          write: false
        },
        {
          id: '5e15857aa96a47239fbf9dc5',
          parentId: '5e142f8e73e44f2d59d43768',
          name: '街道',
          flag: 'street',
          read: false,
          write: false
        },
        {
          id: '5e15858ba96a47239fbf9dc6',
          parentId: '5e142f8e73e44f2d59d43768',
          name: '任务',
          flag: 'task',
          read: false,
          write: false
        },
        {
          id: '5e1585b3a96a47239fbf9dc7',
          parentId: '5e142f8e73e44f2d59d43768',
          name: '巡河方案',
          flag: 'plan',
          read: false,
          write: false
        },
        {
          id: '5e1585d5a96a47239fbf9dc8',
          parentId: '5e142f8e73e44f2d59d43768',
          name: '水质监测点',
          flag: 'station',
          read: false,
          write: false
        },
        {
          id: '5e1587f4a96a47239fbf9dc9',
          parentId: '5e142f8e73e44f2d59d43768',
          name: '督办单',
          flag: 'supervision',
          read: false,
          write: false
        },
        {
          id: '5e158f06a96a47239fbf9dcf',
          parentId: '5e142f8e73e44f2d59d43768',
          name: '设备',
          flag: 'device',
          read: false,
          write: false
        },
        {
          id: '5e158f26a96a47239fbf9dd0',
          parentId: '5e142f8e73e44f2d59d43768',
          name: '风险源类型',
          flag: 'riskSourceType',
          read: false,
          write: false
        },
        {
          id: '5e158f37a96a47239fbf9dd1',
          parentId: '5e142f8e73e44f2d59d43768',
          name: '绘制类型',
          flag: 'drawType',
          read: false,
          write: false
        },
        {
          id: '5e158f4ba96a47239fbf9dd2',
          parentId: '5e142f8e73e44f2d59d43768',
          name: '项目',
          flag: 'project',
          read: false,
          write: false
        },
        {
          id: '5e158f58a96a47239fbf9dd3',
          parentId: '5e142f8e73e44f2d59d43768',
          name: '角色',
          flag: 'role',
          read: false,
          write: false
        },
        {
          id: '5e158f67a96a47239fbf9dd4',
          parentId: '5e142f8e73e44f2d59d43768',
          name: '用户',
          flag: 'user',
          read: false,
          write: false
        }
      ]
    ],
    defaultRoutePath:''//首页

  },
  mutations: {
    show(state, objid) {
      state.id = objid
    },
    SET_DEFAUT_PROJECT: (state, index) => {
      state.defautProject = index
    },
    weather: (state, index) => {
      state.weatherId = index
    },
    getDefaultRoutePath: (state, index) => {
      state.defaultRoutePath = index
    },
    setServerUrl: (state, index) => {
      state.serverUrl = index
    },
    // 商户签名
    tenantIdFn: (state, index) => {
      state.tenantId = index
    },
    // 项目坐标
    projectCoordinateFn: (state, index) => {
      state.projectCoordinate.lng = index[0]
      state.projectCoordinate.lat = index[1]
    },
    // 项目信息
    projectInfoFn: (state, index) => {
      state.projectInfo = index
    },
    permissionListsFn: (state, index) => {
      console.log(index)
      state.permissionLists = index
    },
  },
  actions: {},
  getters
})