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
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }
    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
  mounted() {
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
