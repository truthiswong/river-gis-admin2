<template>
  <div>
    <a-card title="新增/编辑用户">
      <a-button slot="extra" @click="backPage">返回上一页</a-button>
      <el-form ref="formValidate" :model="list" :rules="ruleValidate" label-width="100px">
        <h3>用户信息</h3>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="list.phone" placeholder="请输入" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="list.password" placeholder="请输入" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="number">
          <el-input v-model="list.number" placeholder="请输入" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="list.name" placeholder="请输入" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <a-select style="width: 200px" placeholder="请选择" v-model="list.sex">
            <a-select-option value="jack">男</a-select-option>
            <a-select-option value="lucy">女</a-select-option>
          </a-select>
        </el-form-item>
        <el-form-item label="类型">
          <a-select
            style="width: 200px"
            placeholder="请选择"
            @change="handleChange"
            v-model="list.type"
          >
            <a-select-option value="worker">外勤</a-select-option>
            <a-select-option value="admin">内业</a-select-option>
            <a-select-option value="viewer">外部用户</a-select-option>
          </a-select>
        </el-form-item>
        <h3>权限信息</h3>
        <el-form-item label="角色">
          <div v-if="jurisdiction=='worker'">
            <p>外勤</p>
            <a-checkbox-group v-model="list.roleId">
              <a-checkbox
                v-for="(option, index) in externalList"
                :value="option.id"
                :key="index"
              >{{option.name}}</a-checkbox>
            </a-checkbox-group>
          </div>
          <div v-if="jurisdiction=='admin'">
            <p>内业</p>
            <a-checkbox-group v-model="list.roleId">
              <a-checkbox
                v-for="(option, index) in externalList"
                :value="option.id"
                :key="index"
              >{{option.name}}</a-checkbox>
            </a-checkbox-group>
          </div>
          <div v-if="jurisdiction=='viewer'">
            <p>外部用户</p>
            <a-checkbox-group v-model="list.roleId">
              <a-checkbox
                v-for="(option, index) in externalList"
                :value="option.id"
                :key="index"
              >{{option.name}}</a-checkbox>
            </a-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="管理范围">
          <a-card style="min-height: 200px;width:300px">
            <a-directory-tree :treeData="treeData"></a-directory-tree>
          </a-card>
          <!-- <Tree :data="treeData" :expand='true'></Tree> -->
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
import { userDetails, userPreservation, roleList } from '@/api/login'
export default {
  data() {
    return {
      id: this.$route.query.id,
      jurisdiction: 'worker',
      list: {
        number: '',
        phone: '',
        name: '',
        password: '',
        sex: '',
        type: 'worker',
        roleId: []
      },
      ruleValidate: {
        phone: [{ required: true, message: '不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      externalList: [
        {
          name: '主飞手'
        },
        {
          name: '副飞手'
        },
        {
          name: '河道管理员'
        }
      ],
      treeData: [
        //     {
        //     title: '全部',
        //     key: '1',
        //     id:'1',
        //     children: [{
        //         title: '无人机类型',
        //         key: '2-2',
        //         id:'2',
        //         children: [
        //         { title: '无人机', key: '3-1',id:'3' },
        //         { title: '无人机螺旋桨', key: '3-2',id:'3' },
        //         { title: '无人机电池', key: '3-3' ,id:'3'},
        //         ],
        //     }, {
        //         title: '采水样类型',
        //         key: '2-3',
        //         id:'2',
        //         children: [
        //         ],
        //     }],
        // }
      ]
    }
  },
  mounted() {
    if (this.$route.query.id != '') {
      this.getList()
    } else {
      this.getRoleList()
    }
  },
  methods: {
    getList() {
      var data = {
        id: this.id
      }
      userDetails(data)
        .then(res => {
          var arr = res.data
          this.list.type = arr.type.code
          this.list.name = arr.name
          this.list.phone = arr.mobile
          this.list.number = arr.code
          this.getRoleList()
        })
        .catch(err => {})
    },
    getRoleList() {
      roleList(this.list.type).then(res => {
        this.list.roleId = []
        this.externalList = res.data.data
      })
    },
    preservation() {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          var data = {
            code: this.list.number,
            name: this.list.name,
            mobile: this.list.phone,
            type: this.list.type,
            roleId: this.list.roleId.join(',')
          }
          if (this.id) {
            data.id = this.id
          }
          userPreservation(data)
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
    handleChange(value) {
      this.jurisdiction = value
      this.getRoleList()
    },
    backPage() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
