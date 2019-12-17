<template>
  <div>
    <a-card>
      <a-breadcrumb style="font-size: 16px;">
        <a-breadcrumb-item>设置</a-breadcrumb-item>
        <a-breadcrumb-item>绘制类型管理</a-breadcrumb-item>
      </a-breadcrumb>
      <a-divider style="margin: 10px 0" />
      <a-button type="primary" icon="plus" style="margin-bottom:15px" @click="visible=true">添加</a-button>
      <a-table :columns="columns" :dataSource="data" bordered>
        <template slot="operation" slot-scope="row">
          <div v-if="row.name !='风险源'&&row.name !='排口'&&row.name !='水面漂浮物' ">
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
          </div>
        </template>
      </a-table>
    </a-card>
    <a-modal title="添加/编辑风险源" v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <el-form ref="formValidate" :model="list" :rules="ruleValidate" label-width="100px">
        <el-form-item label="绘制类型" prop="name">
          <el-input v-model="list.name" placeholder="请输入" style="width:200px"/>
        </el-form-item>
      </el-form>
    </a-modal>
  </div>
</template>

<script>
import { paramList, paramSave,paramDel } from '@/api/login'
const columns = [
  {
    title: '序号',
    width: 80,
    dataIndex: 'key'
  },
  {
    title: '绘制类型',
    dataIndex: 'name'
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
      id:'',
      list: {
        id:'',
        name: ''
      },
      ruleValidate: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      visible: false,
      columns,
      data: [
       
      ]
    }
  },
  watch: {
    $route(){
      this.getList()
    },
  },
  mounted(){
    this.getList()
  },
  methods: {
    getList(){
      var data ={
        type:'draw_type'
      }
      paramList(data).then(res => {
         var arr = res.data
         for (let i = 0; i < arr.length; i++) {
          arr[i].key=i+1
         }
         this.data = arr
        }).catch(err => {

      })
    },
    del(id){
      this.id=id
    },
    add(id){
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].id==id) {
          this.list.name =this.data[i].name
          break
        }  
      }
      this.list.id=id
      this.visible=true
    },
    confirm(e) {
      var data ={
        id:this.id
      }
      paramDel(data).then(res => {
          this.$message.success('删除成功');
          
          this.getList()
        }).catch(err => {
          this.$message.error(err.response.data.message);
      })
    },
    cancel(e) {

    },
    handleOk(e) {
      this.$refs['formValidate'].validate((valid) => {
          if (valid) {
            var data ={
              id:this.list.id,
              type:'draw_type',
              name:this.list.name
            }
            paramSave(data).then(res => {
                this.$message.success('保存成功');
                this.visible = false;
                this.list.id=''
                this.list.name=''
                this.getList()
              }).catch(err => {
                this.$message.error(err.response.data.message);
            })
          } else {
            this.$message.error('请填写绘制类型')
          }
        });
      
    },
    handleCancel(e) {
      this.list.id=''
      this.list.name=''
      this.visible = false;
    },
  }
}
</script>

<style lang="less" scoped>
</style>
