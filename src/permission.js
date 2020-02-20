import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  if (Vue.ls.get(ACCESS_TOKEN)) {
    // console.log(Vue.ls.get(ACCESS_TOKEN))
    // Vue.ls.remove(ACCESS_TOKEN)
    /* has token */
    if (to.path === '/user/login') {
      next({ path: window.localStorage.getItem('DefaultRoutePath') }) 
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        // next()
        store
          .dispatch('GetInfo1')
          .then(res => {
            var arr = []
            res.data.forEach(v => {
              arr.push(v.flag)
              if (v.children) {
                for (const item of v.children) {
                  arr.push(item.flag)
                }
              }
              
            });
            const roles = arr
            store.dispatch('GenerateRoutes', { roles }).then(() => {
              router.addRoutes(store.getters.addRouters)
              next({ ...to, replace: true })
            }) 
          })
          .catch(() => {
            // notification.error({
            //   message: '错误',
            //   description: '请求用户信息失败，请重试'
            // })
            next({ path: '/user/login', query: { redirect: to.fullPath } })
            // store.dispatch('Logout').then(() => {
            //   next({ path: '/user/login', query: { redirect: to.fullPath } })
            // })
          })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
