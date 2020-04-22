import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import i18n from './modules/i18n'
import permission from './modules/permission'
// import permission from './modules/async-router'
import getters from './getters'
import { log } from 'util';

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
      
    ],
    defaultRoutePath:'',//首页
    // operationPermissionList:{ //操作权限
    //   riverPatrol:true,//巡河
    //   supervision:true,//监管
    //   riverCourse:true,//河道管理
    //   street:true,//街道管理
    //   task:true,//任务管理
    //   monitoringPoint:true,//水质监测点管理
    //   supervisionList:true,//督办单管理
    //   equipment:true,//设备管理
    //   riskSources:true,//风险源类型管理
    //   draw:true,//绘制类型管理
    //   project:true,//项目管理
    //   role:true,//角色管理
    //   user:true,//用户管理
    // }
    operationPermission:[ //操作权限
      false,//巡河
      false,//监管
      false,//河道管理
      false,//街道管理
      false,//任务管理
      false,//水质监测点管理
      false,//督办单管理
      false,//设备管理
      false,//风险源类型管理
      false,//绘制类型管理
      false,//项目管理
      false,//角色管理
      false,//用户管理
    ]
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
      state.permissionLists = index
    },
    getOperationPermission:(state, index)=>{
      state.operationPermission[index.key]=index.name
    }
  },
  actions: {},
  getters
})