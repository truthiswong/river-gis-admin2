<template>
  <div class="logo" title="城市河道水质风险评估系统">
    <router-link :to="{name:'dashboard'}">
      <img src="../../assets/logo.png" alt="logo">
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
// import LogoSvg from '@/assets/logo.svg?inline'
// import LogoSvg from '@/assets/logo.png'

export default {
  name: 'Logo',
  components: {
    // LogoSvg
  },
  props: {
    title: {
      type: String,
      default: '城市河道水质风险评估系统',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
