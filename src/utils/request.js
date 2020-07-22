import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import qs from 'qs'
import { ACCESS_TOKEN } from '@/store/mutation-types'
let baseUrl, tenantId
switch (process.env.VUE_APP_TITLE) {
  case 'localtion':
    baseUrl = "http://192.168.100.190" //本地环境url
    tenantId = "jl:jlgis@2019" //这里是本地环境中的正式商户id
    console.log("0000")
    store.commit('setServerUrl', baseUrl)
    store.commit('tenantIdFn', tenantId)
    break
  case 'test':
    baseUrl = "http://demo-jleco-river.jl-shgroup.com" //这里是测试环境中的url
    tenantId = "test:jlgis@2019" //这里是测试环境中的商户id
    console.log("1111")
    store.commit('setServerUrl', baseUrl)
    store.commit('tenantIdFn', tenantId)
    break
  case 'prod':
    baseUrl = "http://jleco-river.jl-shgroup.com" //生产环境url
    tenantId = "jl:jlgis@2019" //这里是正式环境中的商户id
    console.log("2222")
    store.commit('setServerUrl', baseUrl)
    store.commit('tenantIdFn', tenantId)
    break
  default:
    baseUrl = "/" //这里是本地的请求url
    tenantId = "test:jlgis@2019" //这里是测试环境中的url
    console.log("3333")
    store.commit('setServerUrl', baseUrl)
    store.commit('tenantIdFn', tenantId)
}
console.log(store.state.serverUrl)
console.log(store.state.tenantId)
// 创建 axios 实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  // baseURL: store.state.serverUrl, // api base_url
  baseURL: store.state.baseUrl, // api base_url
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-TENANT-ID': store.state.tenantId,
    lang: 'zh_CN'
  },
  timeout: 30000, // 请求超时时间
  transformRequest: [function (data, headers) {
    // 可以对data做任何操作
    data = qs.stringify(data)
    return data
  }]
  
})
// if (service.method === 'get') {
//   // 如果是get请求，且params是数组类型如arr=[1,2]，则转换成arr=1&arr=2
//   service.paramsSerializer = function(params) {
//     return qs.stringify(params, { arrayFormat: 'repeat' })
//   }
// }
const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        // 禁止的
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        // 未授权
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 0)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor 请求拦截
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor 响应拦截
service.interceptors.response.use((response) => {
  return response.data
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}