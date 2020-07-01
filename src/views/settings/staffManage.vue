<template>
  <div>
    <a-card>
      <a-breadcrumb style="font-size: 16px;">
        <a-breadcrumb-item>设置</a-breadcrumb-item>
        <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      </a-breadcrumb>
      <a-divider style="margin: 10px 0" />
      <div>
        <a-form layout="inline">
          <a-form-item label="用户">
            <a-input placeholder="请输入" v-model="list.name"/>
          </a-form-item>
          <a-form-item label="联系方式">
            <a-input placeholder="请输入" v-model="list.mobile"/>
          </a-form-item>
          <a-form-item label="类型">
            <a-select style="width: 200px" placeholder="请选择" v-model="list.type">
              <a-select-option value="worker">外勤</a-select-option>
              <a-select-option value="admin">内业</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="getList">查询</a-button>
            <a-button type="dashed" style="margin-left:20px" @click="delList"> 清空 </a-button>
          </a-form-item>
        </a-form>
      </div>
      <a-button type="primary" icon="plus" style="margin:15px 0" @click="add(id='')">添加</a-button>
      <a-table :columns="columns" :dataSource="data" bordered>
        <template slot="state" slot-scope="row">
          <a v-if="row.actived==true">启用</a>
          <a v-else>禁用</a>
        </template>
        <template slot="operation" slot-scope="row">
          <a @click="add(row)">编辑</a>
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
import { userList, userEnable, userProhibit, userDel } from '@/api/login'
const columns = [
  {
    title: '编号',
    width: 70,
    dataIndex: 'key'
  },
  {
    title: '姓名',
    width: 80,
    dataIndex: 'name'
  },
  {
    title: '联系方式',
    width: 120,
    dataIndex: 'mobile'
  },
  {
    title: '角色',
    dataIndex: 'roleStr'
  },
  {
    title: '类型',
    width: 70,
    dataIndex: 'type'
  },
  {
    title: '状态',
    width: 70,
    scopedSlots: { customRender: 'state' }
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
      list: {
        type:'',
        name: '',
        mobile: ''
      },
      columns,
      data: []
    }
  },
  watch: {
    $route() {
      this.getList()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      userList(this.list)
        .then(res => {
          var arr = res.data.data
          for (let i = 0; i < arr.length; i++) {
            arr[i].type = arr[i].type.name
            arr[i].key = i + 1
            arr[i].roleStr = ''
            if (arr[i].role) {
              for (const value of arr[i].role) {
                arr[i].roleStr = arr[i].roleStr + value.name + ', '
              }
              arr[i].roleStr = arr[i].roleStr.substring(0, arr[i].roleStr.length - 2)
            }
          }
          this.data = arr
        })
        .catch(err => {})
    },
    delList() {
      this.list.type=''
      this.list.name= ''
      this.list.mobile= ''
      this.getList()
    },
    enable(id) {
      var data = {
        id: id
      }
      userEnable(data)
        .then(res => {
          this.$message.success('启用成功')
          this.getList()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    prohibit(id) {
      var data = {
        id: id
      }
      userProhibit(data)
        .then(res => {
          this.$message.success('禁用成功')
          this.getList()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    del(id) {
      this.id = id
    },
    confirm(e) {
      var data = {
        id: this.id
      }
      userDel(data)
        .then(res => {
          this.$message.success('删除成功')
          this.getList()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    cancel(e) {},
    add(data) {
      let type = 'worker'
      if (data.type == '外勤') {
        type = 'worker'
      } else if (data.type == '内业') {
        type = 'admin'
      } else if (data.type == '查访') {
        type = 'viewer'
      }
      if (data == '') {
        this.$router.push({
          path: '/settings/staff',
          query: {
            type: type,
            actived: true
          }
        })
      } else {
        this.$router.push({
          path: '/settings/staff',
          query: {
            id: data.id,
            type: type,
            actived: data.actived,
            roleList: data.role
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
