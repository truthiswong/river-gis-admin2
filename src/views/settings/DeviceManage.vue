<template>
  <div>
    <a-card>
      <a-breadcrumb style="font-size: 16px;">
        <a-breadcrumb-item>设置</a-breadcrumb-item>
        <a-breadcrumb-item>设备管理</a-breadcrumb-item>
      </a-breadcrumb>
      <a-divider style="margin: 10px 0" />
      <div style="display:flex;width:100%;box-sizing:border-box;">
        <div style="width:250px">
          <a-card style="min-height: 200px">
            <el-tree :data="treeData" @node-click="select"></el-tree>
          </a-card>
        </div>
        <div style="width:100%;margin-left:20px">
          <div v-if="treeId=='1'">
            <a-button
              type="primary"
              icon="plus"
              @click="visible=true"
              style="margin-bottom:15px"
              v-show="jurisdiction"
            >添加</a-button>
            <a-table :columns="columns" :dataSource="data" bordered>
              <template slot="operation" slot-scope="item">
                <div v-show="jurisdiction">
                  <a @click="handleEdit(item.id,item.name)">编辑</a>
                  <a-divider type="vertical" />
                  <a-popconfirm
                    title="是否确认删除?"
                    @confirm="handleSub(item.id)"
                    @cancel="cancel"
                    okText="确认"
                    cancelText="取消"
                  >
                    <a>删除</a>
                  </a-popconfirm>
                </div>
              </template>
            </a-table>
          </div>
          <div v-if="treeId=='2'">
            <a-button
              type="primary"
              icon="plus"
              @click="visible=true"
              style="margin-bottom:15px"
              v-show="jurisdiction"
            >添加</a-button>
            <a-table :columns="columns2" :dataSource="data" bordered>
              <template slot="operation" slot-scope="item">
                <div v-show="jurisdiction">
                  <a @click="handleEdit(item.id,item.name)">编辑</a>
                  <a-divider type="vertical" />
                  <a-popconfirm
                    title="是否确认删除?"
                    @confirm="handleSub(item.id)"
                    @cancel="cancel"
                    okText="确认"
                    cancelText="取消"
                  >
                    <a>删除</a>
                  </a-popconfirm>
                </div>
              </template>
            </a-table>
          </div>
          <div v-if="treeId=='3'">
            <p style="color: #333; font-weight: 900;font-size: 16px;">筛选查询</p>
            <div>
              <a-input
                placeholder="请输入设备名称"
                style="width:200px;margin:0  10px 10px 0"
                v-model="name"
              />
              <a-button type="primary" @click="getList1">查询</a-button>
            </div>
            <a-button
              type="primary"
              icon="plus"
              @click="addequipment"
              style="margin:15px 0"
              v-show="jurisdiction"
            >添加</a-button>
            <a-table :columns="columns1" :dataSource="data1" bordered>
              <template slot="state" slot-scope="row">
                <a v-if="row.status== 'available'">可用</a>
                <a v-else>不可用</a>
              </template>
              <template slot="operation" slot-scope="row">
                <div v-show="jurisdiction">
                  <a @click="addequipment1(row)">编辑</a>
                  <a-divider type="vertical" />
                  <a-popconfirm
                    title="是否确认删除?"
                    @confirm="handleSub1(row.id)"
                    @cancel="cancel"
                    okText="确认"
                    cancelText="取消"
                  >
                    <a>删除</a>
                  </a-popconfirm>
                  <a-divider type="vertical" />
                  <a v-if="row.status!= 'available'" @click="deviceStatus(row.id,'available')">启用</a>
                  <a v-else @click="deviceStatus(row.id,'forbidden')">禁用</a>
                </div>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </a-card>
    <a-modal
      v-model="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      class="custom_modal"
      v-dragModal
    >
      <template slot="closeIcon">
        <a-icon type="close-circle" />
      </template>
      <template slot="title">
        <span>添加以及设备类型</span>
      </template>
      <a-form :form="form">
        <a-form-item label="设备名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input v-model="typeList.name" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      v-model="equipmentModel"
      :width="850"
      @ok="handleOk1"
      @cancel="handleCancel1"
      class="custom_modal"
      v-dragModal
    >
      <template slot="closeIcon">
        <a-icon type="close-circle" />
      </template>
      <template slot="title">
        <span>添加设备</span>
      </template>
      <el-form ref="formValidate" :model="equipmentList" :rules="ruleValidate" label-width="150px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="equipmentList.name" placeholder="请输入" style="width:250px" />
        </el-form-item>
        <el-form-item label="设备型号" prop="type">
          <el-input v-model="equipmentList.type" placeholder="请输入" style="width:250px" />
        </el-form-item>
        <el-form-item label="设备数量">
          <el-input placeholder="请输入" v-model="equipmentList.amount" style="width:250px" />
        </el-form-item>
        <el-form-item label="设备聚隆编号" prop="number">
          <el-input v-model="equipmentList.number" placeholder="请输入" style="width:250px" />
        </el-form-item>
        <h3 style="margin-bottom:25px">关联设备</h3>
        <!-- <el-form-item label="无人机类型"></el-form-item> -->
        <div v-for="option in classificationList" :key="option.id" style="padding-left:10px">
          <p>{{option.name}}</p>
          <div v-for="item in option.children" :key="item.id" style="padding-left:20px">
            <p>{{item.name}}</p>
            <el-checkbox-group style="display:flex;flex-wrap:wrap;" v-model="checkedList">
              <div
                style="width:340px;margin:0 5px 10px 0"
                v-for="index in item.children"
                :key="index.id"
              >
                <a-row>
                  <a-col :span="12" offset="4" style="height:30px;">
                    <el-checkbox :label="index.id">{{index.name}}</el-checkbox>
                  </a-col>
                  <a-col :span="8" style="height:30px;text-align:right;">
                    <el-input-number size="mini" v-model="index.num" :min="1" :max="999999"></el-input-number>
                  </a-col>
                </a-row>
              </div>
            </el-checkbox-group>
          </div>
          <a-divider />
        </div>
      </el-form>
    </a-modal>
  </div>
</template>
<script>
import {
  structureEquipment,
  equipmentTypeList,
  equipmentTypeSave,
  equipmentTypeDel,
  equipmentNewsList,
  equipmentNewsSave,
  equipmentNewsDel,
  relatedList,
  structDeviceList,
  equipmentTypetatus
} from '@/api/login'
const treeData = [
  {
    label: '全部',
    code: '1',
    children: []
  }
]
const columns = [
  {
    title: '序号',
    width: 80,
    dataIndex: 'key'
  },
  {
    title: '一级类型名称',
    dataIndex: 'name'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    width: 120
  }
]
const columns2 = [
  {
    title: '序号',
    width: 80,
    dataIndex: 'key'
  },
  {
    title: '二级类型名称',
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
    title: '设备名称',
    dataIndex: 'name'
  },
  {
    title: '数量',
    dataIndex: 'amount'
  },
  {
    title: '状态',
    scopedSlots: { customRender: 'state' },
    width: 100
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    width: 170
  }
]
export default {
  data() {
    return {
      jurisdiction: this.$store.state.operationPermission[7], //权限
      parentId: '0',
      treeId: '1',
      name: '',
      id: '',
      treeData,
      columns,
      columns1,
      columns2,
      data: [],
      visible: false,
      equipmentModel: false,
      typeList: {
        id: '',
        name: ''
      },
      equipmentList: {
        id: '',
        name: '',
        type: '',
        number: '',
        amount: ''
      },
      classificationList: [],
      uavList: [],
      checkedList: [],
      ruleValidate: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '不能为空', trigger: 'blur' }],
        number: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      data1: [],
      form: this.$form.createForm(this)
    }
  },
  watch: {
    $route() {
      this.getList()
      this.getstructure()
      this.getstructDeviceList()
    }
  },
  mounted() {
    this.getList()
    this.getstructure()
    this.getstructDeviceList()
  },
  methods: {
    getstructDeviceList() {
      structDeviceList().then(res => {
        var arr = res.data
        this.classificationList = arr
      })
    },
    getstructure() {
      //树
      structureEquipment()
        .then(res => {
          var arr = res.data
          for (let i = 0; i < arr.length; i++) {
            arr[i].code = '2'
            for (let a = 0; a < arr[i].children.length; a++) {
              arr[i].children[a].code = '3'
              for (let c = 0; c < arr[i].children[a].length; c++) {
                arr[i].children[a].children[c].code = '4'
              }
            }
          }
          this.treeData[0].children = arr
        })
        .catch(err => {})
    },
    getList() {
      //类型列表
      var data = {
        id: this.parentId
      }
      equipmentTypeList(data)
        .then(res => {
          var sz = res.data
          for (let i = 0; i < sz.length; i++) {
            sz[i].key = i + 1
          }
          this.data = sz
        })
        .catch(err => {})
    },
    handleOk(e) {
      //类型保存
      var data = {
        parentId: this.parentId,
        name: this.typeList.name,
        id: this.typeList.id
      }
      equipmentTypeSave(data)
        .then(res => {
          this.$message.success('保存成功')
          this.visible = false
          this.typeList.id = ''
          this.typeList.name = ''
          this.getstructure()
          this.getList()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    handleSub(id) {
      var data = {
        id: id
      }
      equipmentTypeDel(data)
        .then(res => {
          var arr = res.data
          this.$message.success('删除成功')
          this.getList()
          this.getstructure()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    handleOk1() {
      //设备型号保存
      var data = {
        id: this.equipmentList.id,
        typeId: this.parentId,
        name: this.equipmentList.name,
        model: this.equipmentList.type,
        code: this.equipmentList.number,
        amount: this.equipmentList.amount,
        relatedDeviceId: this.checkedList.join(','),
        relatedDeviceNum: ''
      }
      for (const item of this.checkedList) {
        for (const aa of this.classificationList) {
          for (const vv of aa.children) {
            for (const bb of vv.children) {
              if (item == bb.id) {
                if (data.relatedDeviceNum != '') {
                  data.relatedDeviceNum = data.relatedDeviceNum + bb.num + ','
                } else {
                  data.relatedDeviceNum = bb.num + ','
                }
              }
            }
          }
        }
      }
      equipmentNewsSave(data)
        .then(res => {
          var arr = res.data
          this.$message.success('保存成功')
          this.handleCancel1()
          this.equipmentModel = false
          this.getList1()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    handleCancel1() {
      this.equipmentList.id = ''
      this.equipmentList.name = ''
      this.equipmentList.type = ''
      this.equipmentList.amount = ''
      this.equipmentList.number = ''
      this.checkedList = []
      this.getstructDeviceList()
    },
    getList1() {
      //设备列表
      var data = {
        typeId: this.parentId,
        name: this.name
      }
      equipmentNewsList(data)
        .then(res => {
          var sz = res.data.data
          console.log(sz)

          for (let i = 0; i < sz.length; i++) {
            sz[i].key = i + 1
            if (sz[i].status) {
              sz[i].status = sz[i].status.code
            }
          }
          this.data1 = sz
          this.uavList = sz
        })
        .catch(err => {})
    },
    handleSub1(id) {
      var data = {
        id: id
      }
      equipmentNewsDel(data)
        .then(res => {
          var arr = res.data
          console.log(arr)
          this.$message.success('删除成功')
          this.name = ''
          this.getList1()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    addequipment() {
      this.equipmentModel = true
    },
    deviceStatus(id, status) {
      let data = {
        id: id,
        status: status
      }
      equipmentTypetatus(data)
        .then(res => {
          this.$message.success('成功')
          this.name = ''
          this.getList1()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    addequipment1(row) {
      this.equipmentModel = true
      this.equipmentList.id = row.id
      this.equipmentList.name = row.name
      this.equipmentList.amount = row.amount
      this.equipmentList.type = row.model
      this.equipmentList.number = row.code
      var data = {
        id: row.id
      }
      relatedList(data)
        .then(res => {
          var arr = res.data.data
          var sz = []
          for (const item of arr) {
            for (const aa of this.classificationList) {
              for (const vv of aa.children) {
                for (const bb of vv.children) {
                  if (item.device.id == bb.id) {
                    sz.push(item.device.id)
                    bb.num = item.num
                    break
                  }
                }
              }
            }
          }
          this.checkedList = sz
        })
        .catch(err => {})
    },
    cancel() {},
    handleEdit(id, name) {
      //类型编辑
      this.typeList.id = id
      this.visible = true
      this.typeList.name = name
    },
    handleCancel(e) {
      //类型弹窗关闭
      this.typeList.id = ''
      this.typeList.name = ''
      this.visible = false
    },
    twoGetList() {},
    select(e) {
      this.name = ''
      if (e.code == '1') {
        this.treeId = '1'
        this.parentId = '0'
        this.getList()
      } else if (e.code == '2') {
        this.treeId = '2'
        this.parentId = e.id
        this.getList()
      } else if (e.code == '3') {
        this.treeId = '3'
        this.parentId = e.id
        this.getList1()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.boder-tree {
  box-shadow: 1px 1px 3px 1px #c0c0c0;
  padding: 10px;
  min-height: 200px;
}
</style>
