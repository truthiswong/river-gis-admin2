<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="256px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null"
  >
    <logo />
    <!-- 河流项目选择 -->
    <river-select></river-select>
    <s-menu
      :collapsed="collapsed"
      :menu="menus"
      :theme="theme"
      :mode="mode"
      @select="onSelect"
      style="padding: 16px 0px;"
    ></s-menu>
  </a-layout-sider>
</template>

<script>
import Logo from '@/components/tools/Logo'
import RiverSelect from '@/components/tools/RiverSelect'
import SMenu from './index'
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'SideMenu',
  components: { Logo, SMenu, RiverSelect },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      // default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  methods: {
    onSelect(obj) {
      this.$emit('menuSelect', obj)
      console.log(obj)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-menu-dark,
.ant-menu-dark .ant-menu-sub {
  color: #FFFFFF;
  background: rgba(0, 0, 0, 0);
}
</style>