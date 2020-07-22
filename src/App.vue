<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
export default {
  mixins: [AppDeviceEnquire],
  data() {
    return {
      locale: zhCN
    }
  },
  created() {
    // 此举是防止浏览器刷新造成vuex数据丢失
    //在页面加载时读取sessionStorage里的状态信息
    if (localStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(localStorage.getItem('store'))))
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      localStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
  mounted() {
    let baseUrl, tenantId
    console.log(process.env.VUE_APP_TITLE)
    switch (process.env.VUE_APP_TITLE) {
      case 'localtion':
        baseUrl = "http://192.168.100.190" //本地环境url
        tenantId = "jl:jlgis@2019" //这里是本地环境中的正式商户id
        // tenantId = "test:jlgis@2019" //这里是测试环境中的商户id
        console.log("0000")
        console.log(baseUrl)
        this.$store.commit('setServerUrl', baseUrl)
        this.$store.commit('tenantIdFn', tenantId)
        break
      case 'test':
        baseUrl = "http://demo-jleco-river.jl-shgroup.com" //这里是测试环境中的url
        tenantId = "test:jlgis@2019" //这里是测试环境中的商户id
        console.log("1111")
        this.$store.commit('setServerUrl', baseUrl)
        this.$store.commit('tenantIdFn', tenantId)
        break
      case 'prod':
        baseUrl = "http://jleco-river.jl-shgroup.com" //生产环境url
        tenantId = "jl:jlgis@2019" //这里是正式环境中的商户id
        console.log("2222")
        this.$store.commit('setServerUrl', baseUrl)
        this.$store.commit('tenantIdFn', tenantId)
        break
      default:
        baseUrl = "http://demo-jleco-river.jl-shgroup.com" //这里是测试环境中的url
        tenantId = "test:jlgis@2019" //这里是测试环境中的url
        console.log("3333")
        this.$store.commit('setServerUrl', baseUrl)
        this.$store.commit('tenantIdFn', tenantId)
    }
    window.document.oncontextmenu = function() {
      return false
    }
  }
}
</script>
<style>
#app {
  height: 100%;
}
</style>
