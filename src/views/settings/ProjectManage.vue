<template>
  <div>
    <a-card>
      <a-breadcrumb style="font-size: 16px;">
        <a-breadcrumb-item>设置</a-breadcrumb-item>
        <a-breadcrumb-item>项目管理</a-breadcrumb-item>
      </a-breadcrumb>
      <a-divider style="margin: 10px 0" />
      <div style="display:flex;width:100%;box-sizing:border-box;">
        <div style="width:220px">
          <a-card style="min-height: 200px">
            <el-tree :data="treeData"  @node-click="select"></el-tree>
          </a-card>
        </div>
        <div style="width:100%;margin-left:20px">
          <div v-if="treeId==true">
            <a-button type="primary" icon="plus" @click="visible=true" style="margin-bottom:15px">添加</a-button>
            <a-table :columns="columns" :dataSource="data" bordered>
              <template slot="operation" slot-scope="row">
                <a @click="add(row.id,row.name)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm
                  title="是否确认删除?"
                  @confirm="confirm('1')"
                  @cancel="cancel"
                  okText="确认"
                  cancelText="取消"
                >
                  <a @click="del(row.id)">删除</a>
                </a-popconfirm>
              </template>
            </a-table>
          </div>
          <div v-else>
            <a-button
              type="primary"
              icon="plus"
              @click="equipmentModel=true"
              style="margin-bottom:15px"
            >添加</a-button>
            <a-table :columns="columns1" :dataSource="data1" bordered>
              <template slot="operation" slot-scope="row">
                <a @click="add1(row.id,row.name,row.interval.code)">编辑</a>
                <a-divider type="vertical" />
                <a-popconfirm
                  title="是否确认删除?"
                  @confirm="confirm('2')"
                  @cancel="cancel"
                  okText="确认"
                  cancelText="取消"
                >
                  <a @click="del(row.id)">删除</a>
                </a-popconfirm>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </a-card>
    <a-modal title="添加一级项目" v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <el-form ref="formValidate" :model="equipmentList" :rules="ruleValidate" >
        <el-form-item label="项目名称" prop="name">
          <el-input v-model="equipmentList.name" placeholder="请输入" style="width:200px" />
        </el-form-item>
      </el-form>
    </a-modal>
    <a-modal title="添加二级项目" v-model="equipmentModel"
      @ok="handleOk1"
      @cancel="handleCancel1"
    >
      <el-form ref="formValidate" :model="equipmentList" :rules="ruleValidate" label-width="100px" >
        <el-form-item label="上级项目" prop="name">
          <el-input v-model="equipmentList.name" disabled placeholder="请输入" style="width:200px" />
        </el-form-item>
        <el-form-item label="项目名称" prop="type">
          <el-input v-model="equipmentList.type" placeholder="请输入" style="width:200px" />
        </el-form-item>
        <el-form-item label="间隔周期">
          <a-select style="width: 200px" placeholder="请选择"  v-model="equipmentList.number">
            <a-select-option value="day">日</a-select-option>
            <a-select-option value="week">周</a-select-option>
            <a-select-option value="month">月</a-select-option>
          </a-select>
        </el-form-item>
      </el-form>
    </a-modal>
  </div>
</template>

<script>
import {  projectTypeList,projectTypeSave,projectTypeDel,projectNewsList,projectNewsSave,projectNewsDel } from '@/api/login'
const treeData = []
const columns = [
  {
    title: '序号',
    width: 80,
    dataIndex: 'key'
  },
  {
    title: '一级分类名称',
    dataIndex: 'name'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    width: 120
  }
]
const columns1 = [
  {
    title: '序号',
    width: 80,
    dataIndex: 'key'
  },
  {
    title: '项目名称',
    dataIndex: 'name'
  },
  {
    title: '项目ID',
    dataIndex: 'id'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    width: 120
  }
]
export default {
  data() {
    return {
      id:'',
      treeId: true,
      treeData,
      columns,
      columns1,
      data:[],
      visible: false,
      equipmentModel: false,
      typeList: {
        id: '',
        typeName: ''
      },
      equipmentList: {
        id:'',
        name: '',
        type: '',
        number: '',
        typeId:'',
      },
      ruleValidate: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      data1: [
        
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
      this.treeData=[{
        label: '全部',
        id: '0',
        code:'1',
        children: [
        
        ]
      }]
      var data={
        id:'0'
      }
      projectTypeList(data).then(res => {
         var arr = res.data
        for (let i = 0; i < arr.length; i++) {
           arr[i].key=i+1
           arr[i].code='2'
           arr[i].label=arr[i].name
        }
        for (let i = 0; i < arr.length; i++) {
          this.treeData[0].children.push(arr[i])
        }
         this.data=arr
        }).catch(err => {

      })
    },
    add(id,name){
      this.equipmentList.id=id
      this.equipmentList.name=name
      this.visible = true;
    },
    handleOk(e) {
      var data ={
        id:this.equipmentList.id,
        name:this.equipmentList.name
      }
      projectTypeSave(data).then(res => {
          this.$message.success('保存成功');
          this.visible = false;
          this.equipmentList.id=''
          this.equipmentList.name=''
          this.getList()
        }).catch(err => {
          this.$message.error(err.response.data.message);
      })
    },
    handleCancel(e) {
      this.equipmentList.id=''
      this.equipmentList.name=''
      this.visible = false;
    },
    add1(id,name,code){
      this.equipmentList.id=id
      this.equipmentList.type=name
      this.equipmentList.number=code
      this.equipmentModel = true;
    },
    handleOk1(e) {
      var data ={
        id:this.equipmentList.id,
        name:this.equipmentList.type,
        interval:this.equipmentList.number,
        typeId:this.equipmentList.typeId
      }
      projectNewsSave(data).then(res => {
          this.$message.success('保存成功');
          this.handleCancel1()
          this.newList()
        }).catch(err => {
          this.$message.error(err.response.data.message);
      })
    },
    handleCancel1(e) {
      this.equipmentList.id=''
      this.equipmentList.type=''
      this.equipmentList.number=''
      this.equipmentModel = false;
    },
    newList(){
      var data={
        id:this.id
      }
      projectNewsList(data).then(res => {
        var arr = res.data.data     
        for (let i = 0; i < arr.length; i++) {
           arr[i].key=i+1
           arr[i].code='3'
           arr[i].label=arr[i].name
        }
        this.data1=arr
        // var children=this.treeData[0].children
        // for (let i = 0; i < children.length; i++) {
        //   if (children[i].id==this.id) {
        //     children[i].children=new Array()
        //     for (let a = 0; a < arr.length; a++) {
        //       children[i].children.push(arr[a])
        //     }
        //   }
        // }
        }).catch(err => {

      })
    },
    select(e) {
      // console.log(this.treeData);
      // console.log(e);
      if (e.code=='1') {
        this.treeId=true
      }else if(e.code=='2') {
        this.treeId=false
        this.equipmentList.name=e.name
        this.equipmentList.typeId=e.id
        this.id=e.id
        this.newList()
      }
    },
    del(id){
      this.id1=id
    },
    confirm(e) {
      var data ={
        id:this.id1
      }
      if (e=='1') {
         projectTypeDel(data).then(res => {
          this.$message.success('删除成功');
          this.getList()
        }).catch(err => {
          this.$message.error(err.response.data.message);
        })
      }else{
        projectNewsDel(data).then(res => {
          this.$message.success('删除成功');
          this.newList()
        }).catch(err => {
          this.$message.error(err.response.data.message);
        })
      }
     
    },
    cancel(e) {

    },
    handleEdit(row) {
      this.visible = true
      this.typeList.id = row.id
      this.typeList.typeName = row.typeName
    },
    handleSub() {}
  }
}
</script>

<style lang="less" scoped>
.boder-tree {
  border: 1px solid #b8b8b8;
}
</style>
