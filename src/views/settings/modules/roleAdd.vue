<template>
  <div>
    <a-card title="权限设置">
      <a-button slot="extra" @click="backPage">返回上一页</a-button>
      <el-form ref="formValidate" :model="list" :rules="ruleValidate">
        <el-form-item label="编号" prop="number">
          <el-input v-model="list.number" placeholder="请输入" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <a-select style="width: 200px" placeholder="请选择" v-model="list.type">
            <a-select-option value="worker">外勤</a-select-option>
            <a-select-option value="admin">内业</a-select-option>
            <a-select-option value="viewer">外部用户</a-select-option>
          </a-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="list.name" placeholder="请输入" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item>
          <a-tabs defaultActiveKey="1">
            <a-tab-pane tab="巡河" key="1">
              <a-table :columns="columns" :dataSource="data" bordered>
                <template slot="see">
                  <a-checkbox>查看</a-checkbox>
                </template>
                <template slot="del">
                  <a-checkbox>操作</a-checkbox>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane tab="监管" key="2" forceRender>
              <a-table :columns="columns" :dataSource="data" bordered>
                <template slot="see">
                  <a-checkbox>查看</a-checkbox>
                </template>
                <template slot="del">
                  <a-checkbox>操作</a-checkbox>
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane tab="设置" key="3">
              <a-table :columns="columns" :dataSource="data" bordered>
                <template slot="see">
                  <a-checkbox>查看</a-checkbox>
                </template>
                <template slot="del">
                  <a-checkbox>操作</a-checkbox>
                </template>
              </a-table>
            </a-tab-pane>
          </a-tabs>
        </el-form-item>
        <el-form-item>
          <a-button style="margin-right:15px;" type="primary" @click="backPage">返回</a-button>
          <a-button type="primary" style @click="preservation">保存</a-button>
        </el-form-item>
      </el-form>
    </a-card>
  </div>
</template>

<script>
import { roleDetails, rolePreservation } from '@/api/login'
const columns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '查看',
    scopedSlots: { customRender: 'see' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'del' }
  }
]
export default {
  data() {
    return {
      id: this.$route.query.id,
      list: {
        number: '',
        type: '',
        name: ''
      },
      ruleValidate: {
        number: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      columns,
      data: [
        {
          key: '1',
          name: '巡河计划'
        },
        {
          key: '12',
          name: '今日计划'
        }
      ]
    }
  },
  mounted() {
    if (this.$route.query.id != '') {
      this.getList()
    }
  },
  methods: {
    getList() {
      var data = {
        id: this.$route.query.id
      }
      roleDetails(data)
        .then(res => {
          var arr = res.data
          this.list.type = arr.type.code
          this.list.name = arr.name
        })
        .catch(err => {})
    },
    preservation() {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          var data = {
            // code:this.list.number,
            name: this.list.name,
            type: this.list.type
          }
          if (this.id) {
            data.id = this.id
          }
          rolePreservation(data)
            .then(res => {
              this.$message.success('成功')

              this.backPage()
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else {
          this.$message.error('请全部填写')
        }
      })
    },
    backPage() {
      this.list.name = ''
      this.list.type = ''
      this.id = ''
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
