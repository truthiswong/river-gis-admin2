<template>
  <div style="width:100%;height:calc(100vh - 52px);" class="home">
    <div class="home_content">
      <div>
        <img @click="gotoRouter(1)" src="./img/monitor.png" alt />
        <img @click="gotoRouter(2)" src="./img/supervise.png" alt />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
// token
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'Home',
  components: {},
  data() {
    return {}
  },
  watch: {},
  mounted() {},
  methods: {
    gotoRouter(index) {
      if (index == 1) {
        this.$router.push({
          path: '/dashboard/analysis'
        })
      } else if (index == 2) {
        this.$router.push({
          path: '/supervise/Supervise'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  position: relative;
  background: url('./img/homeBg.jpg') no-repeat 0 0;
  background-size: 100% 100%;
  .home_content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    div {
      position: relative;
      top: 50%; /*偏移*/
      transform: translateY(-50%);
    }
    img {
      width: 100%;
    }
  }
}
</style>