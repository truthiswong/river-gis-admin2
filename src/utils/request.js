import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import qs from 'qs'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const service = axios.create({
  //baseURL: process.env.VUE_APP_API_BASE_URL, // api base_url
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-TENANT-ID':'jl:jlgis@2019',
    lang:'zh_CN'
  },
  timeout: 30000 ,// 请求超时时间
  transformRequest: [function (data, headers) {
    // 可以对data做任何操作
    data = qs.stringify(data)
    return data
  }]
})

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
          }, 500)
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
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
