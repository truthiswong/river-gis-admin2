<template>
  <div>
    <a-card title="新增/编辑用户">
      <a-button slot="extra" @click="backPage">返回上一页</a-button>
      <el-form ref="formValidate" :model="list" :rules="ruleValidate" label-width="100px">
        <h3>用户信息</h3>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="list.phone" placeholder="请输入" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input v-model="list.password" placeholder="请输入" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="number">
          <el-input v-model="list.number" placeholder="请输入" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="list.name" placeholder="请输入" style="width:200px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="性别" prop="sex">
          <a-select style="width: 200px" placeholder="请选择" v-model="list.sex">
            <a-select-option value="jack">男</a-select-option>
            <a-select-option value="lucy">女</a-select-option>
          </a-select>
        </el-form-item> -->
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
        <el-form-item label="角色" prop="roleId">
          <div v-show="jurisdiction=='worker'">
            <p>外勤</p>
            <a-checkbox-group v-model="list.roleId">
              <a-checkbox
                v-for="(option, index) in externalList"
                :value="option.id"
                :key="index"
              >{{option.name}}</a-checkbox>
            </a-checkbox-group>
          </div>
          <div v-show="jurisdiction=='admin'">
            <p>内业</p>
            <a-checkbox-group v-model="list.roleId">
              <a-checkbox
                v-for="(option, index) in externalList"
                :value="option.id"
                :key="index"
              >{{option.name}}</a-checkbox>
            </a-checkbox-group>
          </div>
          <div v-show="jurisdiction=='viewer'">
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
        <el-form-item label="管理范围" prop="projectId">
          <el-select v-model="list.projectId" multiple placeholder="请选择" style="width:350px">
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
import { userDetails, userPreservation, roleList, roleListDetail,projectMinesTructure} from '@/api/login'
export default {
  data() {
    return {
      id: this.$route.query.id,
      jurisdiction: this.$route.query.type,
      list: {
        number: '',
        phone: '',
        name: '',
        password: '',
        sex: '',
        type: 'worker',
        roleId: [],
        projectId:[],

      },
      ruleValidate: {
        phone: [{ required: true, message: '不能为空', trigger: 'blur' }],
        // password: [{ required: true, message: '不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        roleId: [
            { type: 'array', required: true, message: '请至少选择一个角色', trigger: 'change' }
        ],
        projectId: [
            { type: 'array', required: true, message: '请至少选择一个项目', trigger: 'change' }
        ],
      },
      externalList: [

      ],
      projectList:[],
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getList()
    } else {
      this.getRoleList()
      this.getProject()
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
          // this.list.password = arr.password
          this.list.phone = arr.mobile
          this.list.number = arr.code
          if (arr.role) {
            this.list.roleId=arr.role.map(function (item) {
          　　　return item.id; 
            })
          }
          if (arr.accessProjects) {
            this.list.projectId=arr.accessProjects.map(function (item) {
          　　　return item.id; 
            });
          }
           
          this.getRoleList()
          this.getProject()
        })
        .catch(err => {})
    },
    getRoleList() {
      let data = {
        type: this.jurisdiction,
        actived: this.$route.query.actived,
      }
      roleListDetail(data).then(res => {
        
        this.externalList = res.data
      })
    },
    getProject(){
      projectMinesTructure().then(res => {
        
        let arr = res.data
        let  project =[]
        arr.forEach(v => {
          if (v.children) {
            for (const item of v.children) {
              project.push(item)
              
            }
          }
        });
        this.projectList = project
      })
    },
    preservation() {
      this.$refs['formValidate'].validate(valid => {
        if (valid) {
          var data = {
            code: this.list.number,
            name: this.list.name,
            password:this.list.password,
            mobile: this.list.phone,
            type: this.list.type,
            roleId: this.list.roleId.join(','),
            projectId: this.list.projectId.join(',')
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
      this.list.roleId =[]
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