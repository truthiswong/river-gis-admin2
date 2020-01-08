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
              <a-table :columns="columns" :dataSource="permissionList[0]" bordered>
                <template slot="see" slot-scope="item">
                  <a-switch v-model="item.read" size="small" @change="permissionRead(item)" />
                </template>
                <template slot="del" slot-scope="item">
                  <a-switch v-model="item.write" size="small" @change="permissionWrite(item)" />
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane tab="监管" key="2" forceRender>
              <a-table :columns="columns" :dataSource="permissionList[1]" bordered>
                <template slot="see" slot-scope="item">
                  <a-switch v-model="item.read" size="small" @change="permissionRead(item)" />
                </template>
                <template slot="del" slot-scope="item">
                  <a-switch v-model="item.write" size="small" @change="permissionWrite(item)" />
                </template>
              </a-table>
            </a-tab-pane>
            <a-tab-pane tab="设置" key="3">
              <a-table :columns="columns" :dataSource="permissionList[2]" bordered>
                <template slot="see" slot-scope="item">
                  <a-switch v-model="item.read" size="small" @change="permissionRead(item)" />
                </template>
                <template slot="del" slot-scope="item">
                  <a-switch v-model="item.write" size="small" @change="permissionWrite(item)" />
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
import { roleDetails, rolePreservation, getPermissionTree } from '@/api/login'
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
      permissionList: [
        [
          // {
          //   key: '1',
          //   name: '巡河',
          //   read: false,
          //   write: false
          // }
        ],
        [
          // {
          //   key: '1',
          //   name: '监管',
          //   read: false,
          //   write: false
          // }
        ],
        [
          // {
          //   key: '1',
          //   name: '巡河管理',
          //   read: false,
          //   write: false
          // }
        ]
      ]
    }
  },
  mounted() {
    if (this.$route.query.id != '') {
      this.getList()
    }
    this.getPermissionTreeList()
  },
  methods: {
    permissionRead(item) {
      if (!item.read) {
        item.write = false
      }
    },
    permissionWrite(item) {
      if (item.write) {
        item.read = true
      }
    },
    getRoleDetails() {
      roleDetails(this.$route.query.id)
        .then(res => {
          let data = res.data.permission
          for (const item of this.permissionList) {
              for (const k in res.data.permission) {
                item.filter((key)=>{
                  if (k == key.id) {
                    // console.log(key)
                    if (data[k]) {
                      key.read = true
                      key.write = true
                    } else {
                      key.read = true
                      key.write = false
                    }
                  }
                })
              }
          }
        })
        .catch(err => {})
    },
    getPermissionTreeList() {
      let data = {
        parentId: 0
      }
      getPermissionTree(data)
        .then(res => {
          let arr = []
          res.data.forEach((v, i) => {
            if (v.children.length > 0) {
              for (const item of v.children) {
                item.key = item.flag
                item.name = item.name
                item.read = false
                item.write = false
                this.permissionList[i].push(item)
              }
            } else {
              v.key = v.flag
              v.name = v.name
              v.read = false
              v.write = false
              this.permissionList[i].push(res.data[i])
            }
          })
          console.log(this.permissionList)
          if (this.$route.query.id != '') {
            this.getRoleDetails()
          }
        })
        .catch(err => {})
    },
    getList() {
      roleDetails(this.$route.query.id)
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
          let str = ''
          for (const item of this.permissionList) {
            if (item.length > 1) {
              for (const vlaue of item) {
                if (vlaue.write) {
                  str += `"permission[${vlaue.id}]": true,`
                } else {
                  if (vlaue.read) {
                    str += `"permission[${vlaue.id}]": false,`
                  }
                }
              }
            } else {
              if (item[0].write) {
                str += `"permission[${item[0].id}]": true,`
              } else {
                if (item[0].read) {
                  str += `"permission[${item[0].id}]": false,`
                }
              }
            }
          }
          str = str.substring(0, str.length - 1)
          str = `{${str}}`
          let strObj = JSON.parse(str)
          let listObj = {
            // code:this.list.number,
            name: this.list.name,
            type: this.list.type
          }
          let data = {}
          Object.assign(data, listObj, strObj)
          // console.log(data)
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
