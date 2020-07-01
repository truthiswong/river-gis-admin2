<template>
  <div>
    <a-card>
      <a-breadcrumb style="font-size: 16px;">
        <a-breadcrumb-item>设置</a-breadcrumb-item>
        <a-breadcrumb-item>角色管理</a-breadcrumb-item>
      </a-breadcrumb>
      <a-divider style="margin: 10px 0" />
      <div>
        <a-form layout="inline">
          <a-form-item label="类型">
            <a-select style="width: 200px" placeholder="请选择" v-model="type">
              <a-select-option value="worker">外勤</a-select-option>
              <a-select-option value="admin">内业</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="getList">查询</a-button>
            <a-button type="dashed" style="margin-left:20px" @click="type='',getList()"> 清空 </a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-button type="primary" icon="plus" style="margin:15px 0" @click="add('')">添加</a-button>
      <a-table :columns="columns" :dataSource="data" bordered>
        <template slot="state" slot-scope="row">
          <a v-if="row.actived==true">启用</a>
          <a v-else>禁用</a>
        </template>
        <template slot="operation" slot-scope="row">
          <a @click="add(row.id)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="是否确认删除?"
            @confirm="confirm"
            @cancel="cancel"
            okText="确认"
            cancelText="取消"
          >
            <a @click="del(row.id)">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="enable(row.id)" v-if="row.actived==false">启用</a>
          <a @click="prohibit(row.id)" v-else>禁用</a>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script>
import { roleList, roleEnable,roleProhibit,roleDel } from '@/api/login'
const columns = [
  {
    title: '编号',
    width: 80,
    dataIndex: 'key'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '类型',
    dataIndex: 'type'
  },
  {
    title: '状态',
    scopedSlots: { customRender: 'state' },
    width: 90
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    width: 160
  }
]
export default {
  data() {
    return {
      columns,
      type:'',
      data: []
    }
  },
  watch: {},
  mounted(){
    this.getList()
  },
  methods: {
    getList(){
      roleList(this.type).then(res => {
         var arr = res.data.data
         for (let i = 0; i < arr.length; i++) {
          arr[i].type=arr[i].type.name
          arr[i].key=i+1
         }
         this.data = arr
         console.log(arr);
        }).catch(err => {

      })
    },
    enable(id){
      var data ={
        id:id
      }
      roleEnable(data).then(res => {
          this.$message.success('启用成功');
          this.getList()
        }).catch(err => {
          this.$message.error(err.response.data.message);
      })
    },
    prohibit(id){
      var data ={
        id:id
      }
      roleProhibit(data).then(res => {
          this.$message.success('禁用成功');
         this.getList()
        }).catch(err => {
          this.$message.error(err.response.data.message);
      })
    },
    del(id){
      this.id=id
    },
    confirm(e) {
      var data ={
        id:this.id
      }
      roleDel(data).then(res => {
          this.$message.success('删除成功');
          this.getList()
        }).catch(err => {
          this.$message.error(err.response.data.message);
      })
    },
    cancel(e) {

    },
    add(id) {
      this.$router.push({
        path: '/settings/role',
        query: {
          id: id
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
