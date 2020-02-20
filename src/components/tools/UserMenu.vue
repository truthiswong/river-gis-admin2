<template>
  <div class="user-wrapper">
    <div class="content-box">
      <!-- nav问号图标 -->
      <!-- <a href="https://pro.loacg.com/docs/getting-started" target="_blank">
        <span class="action">
          <a-icon type="question-circle-o"></a-icon>
        </span>
      </a>-->
      <!-- nav通知 -->
      <!-- <notice-icon class="action"/> -->
      <!-- 河流选择 -->
      <river-select></river-select>
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar" />
          <span>{{ nickname }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <!-- <a-menu-item key="0">
            <router-link :to="{ name: 'center' }">
              <a-icon type="user" />
              <span>个人中心</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="1">
            <router-link :to="{ name: 'settings' }">
              <a-icon type="setting" />
              <span>账户设置</span>
            </router-link>
          </a-menu-item>
          <a-menu-item key="2" disabled>
            <a-icon type="setting" />
            <span>测试</span>
          </a-menu-item>
          <a-menu-divider />-->
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
      <!-- 语言选择 -->
      <!-- <lang-select /> -->
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import LangSelect from '@/components/tools/LangSelect'
import RiverSelect from '@/components/tools/RiverSelect'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  name: 'UserMenu',
  components: {
    LangSelect,
    NoticeIcon,
    RiverSelect
  },
  computed: {
    ...mapGetters(['nickname', 'avatar'])
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout() {
      this.$confirm('真的要注销登录吗 ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          localStorage.removeItem('store')
          Vue.ls.remove(ACCESS_TOKEN)
          this.$store.commit('SET_TOKEN', '')
          this.$store.commit('SET_ROLES', [])
          this.$router.push({
            path: '/user/login'
          })
          window.location.reload()
        })
        .catch(() => {})
      // this.$confirm({
      //   title: '提示',
      //   content: '真的要注销登录吗 ?',
      //   onOk: () => {
      //     console.log('11');

      //   },
      //   onCancel() {}
      // })
    }
  }
}
</script>
<style lang="less" scoped>
.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, 0.45);
    display: inline-block;
    font-size: 14px;
    line-height: 22px;
    margin-bottom: 4px;
  }
  p {
    color: rgba(0, 0, 0, 0.85);
    font-size: 24px;
    line-height: 32px;
    margin: 0;
  }
  em {
    background-color: #e8e8e8;
    position: absolute;
    height: 56px;
    width: 1px;
    top: 0;
    right: 0;
  }
}
</style>
