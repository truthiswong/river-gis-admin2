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
            <el-tree :data="treeData" @node-click="select"></el-tree>
          </a-card>
        </div>
        <div style="width:100%;margin-left:20px">
          <div v-if="treeId==true">
            <a-button
              type="primary"
              icon="plus"
              @click="visible=true"
              v-show="jurisdiction"
              style="margin-bottom:15px"
            >添加</a-button>
            <a-table :columns="columns" :dataSource="data" bordered>
              <template slot="operation" slot-scope="row">
                <div v-show="jurisdiction">
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
                </div>
              </template>
            </a-table>
          </div>
          <div v-else>
            <a-button
              type="primary"
              icon="plus"
              @click="addProject"
              style="margin-bottom:15px"
              v-show="jurisdiction"
            >添加</a-button>
            <a-table :columns="columns1" :dataSource="data1" bordered>
              <template slot="operation" slot-scope="row">
                <div v-show="jurisdiction">
                  <a @click="add1(row)">编辑</a>
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
                </div>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </a-card>
    <a-modal
      :maskClosable="false"
      :centered="true"
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
        <span>添加一级项目</span>
      </template>
      <el-form ref="formValidate" :model="equipmentList" :rules="ruleValidate">
        <el-form-item label="项目名称" prop="projectParentName">
          <el-input
            v-model="equipmentList.projectParentName"
            placeholder="请输入"
            style="width:200px"
          />
        </el-form-item>
      </el-form>
    </a-modal>
    <a-modal
      :maskClosable="false"
      :destroyOnClose="true"
      :width="980"
      :centered="true"
      v-model="equipmentModel"
      @ok="handleOk1"
      @cancel="handleCancel1"
      class="custom_modal"
      v-dragModal
    >
      <template slot="closeIcon">
        <a-icon type="close-circle" />
      </template>
      <template slot="title">
        <span>添加二级项目</span>
      </template>
      <el-form ref="formValidate" :model="equipmentList" :rules="ruleValidate" label-width="100px">
        <a-row>
          <a-col :span="12">
            <el-form-item label="上级项目" prop="projectParentName">
              <el-input
                v-model="equipmentList.projectParentName"
                disabled
                placeholder="请输入"
                style="width:240px"
              />
            </el-form-item>
          </a-col>
          <a-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="equipmentList.projectName" placeholder="请输入" style="width:240px" />
            </el-form-item>
          </a-col>
          <a-col :span="12">
            <el-form-item label="项目中心" prop="projectParentName">
              <el-input
                v-model="equipmentList.latlng"
                disabled
                placeholder="请在地图选择"
                style="width:240px"
              >
                <el-button
                  slot="append"
                  @click="projectCoordinate"
                  style="font-size: 23px;"
                  icon="el-icon-location-outline"
                ></el-button>
              </el-input>
            </el-form-item>
          </a-col>
          <a-col :span="12">
            <el-form-item label="间隔周期">
              <a-select style="width: 240px" v-model="equipmentList.number">
                <a-select-option value="day">日</a-select-option>
                <a-select-option value="week">周</a-select-option>
                <a-select-option value="month">月</a-select-option>
              </a-select>
            </el-form-item>
          </a-col>
        </a-row>
      </el-form>
      <div id="center_map" class="map_wrap"></div>
    </a-modal>
  </div>
</template>

<script>
import {
  projectMinesTructure,
  projectTypeSave,
  projectTypeDel,
  projectNewsList,
  projectNewsSave,
  projectNewsDel
} from '@/api/login'
import { log } from 'util'
const treeData = []
const columns = [
  {
    title: '序号',
    width: 80,
    dataIndex: 'key'
  },
  {
    title: '一级分类名称',
    dataIndex: 'label'
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
      jurisdiction: this.$store.state.operationPermission[10], //权限
      id: '',
      treeId: true,
      treeData,
      columns,
      columns1,
      data: [],
      visible: false,
      equipmentModel: false,
      typeList: {
        id: '',
        typeName: ''
      },
      equipmentList: {
        id: '',
        projectParentName: '',
        projectName: '',
        number: 'day',
        projectNameId: '',
        latlng: ''
      },
      ruleValidate: {
        projectParentName: [{ required: true, message: '不能为空', trigger: 'blur' }],
        projectName: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      data1: [],
      map: {}
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
    getProjectInfo() {
      projectMinesTructure().then(res => {
        this.$store.commit('projectInfoFn', res.data)
        for (const item of res.data) {
          if (item.id == this.$store.state.defautProject[0]) {
            if (item.children.length > 0) {
              for (const value of item.children) {
                if (value.id == this.$store.state.defautProject[1]) {
                  this.$store.commit('projectCoordinateFn', value.coordinate)
                }
              }
            }
          }
        }
      })
    },
    projectCoordinate() {
      if (this.markerTool) {
        this.markerTool.clear()
        this.markerTool.close()
      }
      this.equipmentList.latlng = ''
      this.markerTool = new T.MarkTool(this.map, { follow: true })
      this.markerTool.open()
      this.markerTool.addEventListener('mouseup', this.getLngLat)
    },
    getLngLat() {
      let lnglat = this.markerTool.getMarkControlPoint()
      // console.log(lnglat.lng + ', ' + lnglat.lat)
      this.equipmentList.latlng = lnglat.lng + ', ' + lnglat.lat
    },
    getList() {
      this.treeData = [
        {
          label: '全部',
          id: '0',
          code: '1',
          children: []
        }
      ]
      var data = {
        id: '0'
      }
      projectMinesTructure(data)
        .then(res => {
          console.log(res)

          var arr = res.data
          for (let i = 0; i < arr.length; i++) {
            arr[i].key = i + 1
            arr[i].code = '2'
            arr[i].label = arr[i].name
            arr[i].children = []
          }
          for (let i = 0; i < arr.length; i++) {
            this.treeData[0].children.push(arr[i])
          }
          this.data = arr
        })
        .catch(err => {})
    },
    addProject() {
      this.equipmentModel = true
      this.$nextTick(() => {
        // 初始化地图控件
        let zoom = 14
        let twoDimensionURL =
          'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
        this.mapLayer2d = new T.TileLayer(twoDimensionURL, { minZoom: 4, maxZoom: 18, zIndex: 10 })
        let satelliteURL =
          'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
        this.mapLayerSatellite = new T.TileLayer(satelliteURL, { minZoom: 4, maxZoom: 18, zIndex: 10 })
        // 创建自定义图层对象
        let wordLabel =
          'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
        this.mapLayerWord = new T.TileLayer(wordLabel, { minZoom: 4, maxZoom: 18, zIndex: 15 })
        // 正射影像
        // this.mapImage = `${this.host}/server/data/admin/regulator/uav/data/mbtiles?year=${this.mapYear}&month=${this.mapMonth}&day=${this.mapDay}&x={x}&y={y}&z={z}&X-TENANT-ID=${this.$store.state.tenantId}&Authorization=${token}`
        // this.mapLayerImage = new T.TileLayer(this.mapImage, { minZoom: 4, maxZoom: 23, zIndex: 12 })
        this.map = new T.Map('center_map', {
          minZoom: 4,
          maxZoom: 18,
          layers: [this.mapLayerSatellite, this.mapLayerWord]
        })
        this.map.centerAndZoom(this.$store.state.projectCoordinate, zoom)
      })
    },
    add(id, name) {
      this.equipmentList.id = id
      this.equipmentList.projectParentName = name
      this.visible = true
    },
    handleOk(e) {
      var data = {
        id: this.equipmentList.id,
        name: this.equipmentList.projectParentName
      }
      projectTypeSave(data)
        .then(res => {
          this.$message.success('保存成功')
          this.visible = false
          this.equipmentList.id = ''
          this.equipmentList.projectParentName = ''
          this.getList()
          this.getProjectInfo() //刷新项目列表
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    handleCancel(e) {
      this.equipmentList.id = ''
      this.equipmentList.projectParentName = ''
      this.visible = false
    },
    add1(row) {
      console.log(row)
      this.equipmentList.id = row.id
      // this.equipmentList.projectParentName = projectParentName
      this.equipmentList.projectName = row.name
      this.equipmentList.latlng = `${row.coordinate[0]}, ${row.coordinate[1]}`
      this.equipmentList.number = row.interval.code
      this.addProject()
    },
    handleOk1(e) {
      console.log(this.equipmentList.latlng)
      if (!this.equipmentList.projectName) {
        this.$message.error('项目名不能为空')
      } else if (!this.equipmentList.latlng) {
        this.$message.error('请选择项目中心')
      } else if (!this.equipmentList.number) {
        this.$message.error('请选择间隔周期')
      } else {
        var data = {
          id: this.equipmentList.id,
          name: this.equipmentList.projectName,
          interval: this.equipmentList.number,
          typeId: this.equipmentList.projectNameId,
          coordinate: this.equipmentList.latlng
        }
        projectNewsSave(data)
          .then(res => {
            this.$message.success('保存成功')
            this.handleCancel1()
            this.newList()
            this.getProjectInfo() //刷新项目列表
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
      }
    },
    handleCancel1(e) {
      this.equipmentList.id = ''
      this.equipmentList.projectName = ''
      // this.equipmentList.number = ''
      this.equipmentModel = false
    },
    newList() {
      var data = {
        id: this.id
      }
      projectNewsList(data)
        .then(res => {
          var arr = res.data.data
          for (let i = 0; i < arr.length; i++) {
            arr[i].key = i + 1
            arr[i].code = '3'
            arr[i].label = arr[i].name
          }
          this.data1 = arr
          // var children=this.treeData[0].children
          // for (let i = 0; i < children.length; i++) {
          //   if (children[i].id==this.id) {
          //     children[i].children=new Array()
          //     for (let a = 0; a < arr.length; a++) {
          //       children[i].children.push(arr[a])
          //     }
          //   }
          // }
        })
        .catch(err => {})
    },
    select(e) {
      console.log(e)
      if (e.code == '1') {
        this.treeId = true
      } else if (e.code == '2') {
        this.treeId = false
        this.equipmentList.projectParentName = e.name
        this.equipmentList.projectNameId = e.id
        this.id = e.id
        this.newList()
      }
    },
    del(id) {
      this.id1 = id
    },
    confirm(e) {
      var data = {
        id: this.id1
      }
      if (e == '1') {
        projectTypeDel(data)
          .then(res => {
            this.$message.success('删除成功')
            this.getList()
            this.getProjectInfo() //刷新项目列表
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
      } else {
        projectNewsDel(data)
          .then(res => {
            this.$message.success('删除成功')
            this.newList()
            this.getProjectInfo() //刷新项目列表
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
      }
    },
    cancel(e) {},
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
.map_wrap {
  width: 100%;
  height: 300px;
}
</style>
