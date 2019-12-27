<template>
  <div class="addSurvey" v-show="isvisible">
    <div class="searchInput">
      <a-input-search
        placeholder="请输入查询内容"
        style="width: 100%;border-radius:10px;"
        @search="searchInfo"
      />
    </div>
    <div class="selectInfo">
      <ul>
        <li>全部</li>
        <li>河道</li>
        <li>风险源</li>
        <li>海口</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'addSurvey',
  data() {
    return {
      isvisible: false
    }
  },
  methods: {
    show() {
      this.isvisible = true
    },
    close() {
      this.isvisible = false
    },
    searchInfo(val) {
      this.isvisible = false
      console.log(val)
    }
  }
}
</script>
<style>
.addSurvey {
  width: 400px;
  height: 80px;
  margin: 0;
  padding: 0;
  background-color: #ffffff;
  border: 1px solid #e8e8e8;
  /* box-shadow: 0 0 10px #e8e8e8; */
}
.searchInput {
  margin: 10px;
  text-align: left;
}
.selectInfo ul {
  list-style: none;
  padding-left: 12px;
  text-align: left;
}
.selectInfo li {
  display: inline-block;
  font-weight: 500;
  margin-right: 25px;
}
.selectInfo li:hover {
  color: #1890ff;
  font-size: 15px;
}
</style>


