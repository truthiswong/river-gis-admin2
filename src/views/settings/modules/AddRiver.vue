<template>
  <a-modal
    :width="980"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask="false"
    :centered="true"
    class="custom_modal"
    v-if="visible"
    v-dragModal
  >
    <template slot="closeIcon">
      <a-icon type="close-circle" />
    </template>
    <template slot="title">
      <span>添加河道</span>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form class="from">
        <p>基础信息</p>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道名称">
              <a-input placeholder="请输入河道名称" v-model="list.name" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道长度(m)">
              <a-input  v-model="list.length1" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道编号">
              <a-input  v-model="list.code" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="水域面积(m²)">
              <a-input  v-model="list.dimension" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="管理级别" has-feedback>
              <a-select v-model="list.supervisoryLevel" >
                <a-select-option value="city">市</a-select-option>
                <a-select-option value="district">区</a-select-option>
                <a-select-option value="village">村</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否重点" has-feedback>
              <a-select v-model="list.priority">
                <a-select-option value="true">重点</a-select-option>
                <a-select-option value="false">非重点</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="左岸" has-feedback>
              <el-upload
                class="upload-demo"
                ref="upload"
                :data="spotList"
                name="leftBankKmz"
                :headers="headers"
                action="/server/data/admin/river/save"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :show-file-list="true"
                :file-list="fileList"
                accept=".kmz, .kml"
                :limit="1"
                :auto-upload="false"
              >
                <a-button block style="margin-top: 10px;">{{leftKmz}}</a-button>
              </el-upload>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="右岸" has-feedback>
              <el-upload
                class="upload-demo"
                ref="upload1"
                :data="spotList"
                name="rightBankKmz"
                :headers="headers"
                action="/server/data/admin/river/save"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :show-file-list="true"
                :file-list="fileList1"
                accept=".kmz, .kml"
                :limit="1"
                :auto-upload="false"
              >
                <a-button block style="margin-top: 10px;">{{rightKmz}}</a-button>
              </el-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <p style="margin-top: 10px;">起点</p>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="起点位置" has-feedback>
              <a-select style="width:100px" v-model="list.areaId" @change="getCity">
                <a-select-option
                  v-for="item in options"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
              <a-select
                style="width:100px;margin-left:2px"
                v-model="list.areaId1"
                @change="getArea"
              >
                <a-select-option
                  v-for="item in cityList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
              <a-select style="width:100px;margin-left:2px" v-model="list.areaId2">
                <a-select-option
                  v-for="item in areaList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="详细地址" has-feedback>
              <a-input placeholder="请输入详细起点位置" v-model="list.startAddress" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="经度" has-feedback>
              <a-input  v-model="list.lng" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="纬度" has-feedback>
              <a-input  v-model="list.lat" />
            </a-form-item>
          </a-col>
        </a-row>
        <p style="margin-top: 10px;">讫点</p>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="讫点位置" has-feedback>
              <a-select style="width:100px" v-model="list.areaId3" @change="getCity1">
                <a-select-option
                  v-for="item in options"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
              <a-select
                style="width:100px;margin-left:2px"
                v-model="list.areaId4"
                @change="getArea1"
              >
                <a-select-option
                  v-for="item in cityList1"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
              <a-select style="width:100px;margin-left:2px" v-model="list.areaId5">
                <a-select-option
                  v-for="item in areaList1"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="详细地址" has-feedback>
              <a-input placeholder="请输入详细起点位置" v-model="list.destAddress" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="经度" has-feedback>
              <a-input  v-model="list.lng1" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="纬度" has-feedback>
              <a-input  v-model="list.lat1" />
            </a-form-item>
          </a-col>
        </a-row>
        <p style="margin-top: 10px;">其他信息</p>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="一级河长">
              <a-input  v-model="list.controller" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="常水位(m)">
              <a-input  v-model="list.normalWaterLevel" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河口面积(m²)">
              <a-input  v-model="list.mouthDimension" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="最高控制水位(m)">
              <a-input  v-model="list.highWaterLevel" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="平均水深(m)">
              <a-input  v-model="list.averageDepth" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="最大水深(m)">
              <a-input  v-model="list.maxDepth" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河口最小面宽(m)">
              <a-input  v-model="list.minMouthWidth" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河口最大面宽(m)">
              <a-input  v-model="list.maxMouthWidth" />
            </a-form-item>
          </a-col>
        </a-row>
        <p style="margin-top: 10px;">预设计划</p>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="每月巡查次数(次)">
              <a-input  v-model="list.inspectTimes" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-row style="width:100%;" type="flex" justify="space-around" v-show="jurisdiction">
        <a-col :span="6">
          <a-button block @click="handleCancel">取消</a-button>
        </a-col>
        <a-col :span="6">
          <a-button block @click="saveRiver" >保存</a-button>
        </a-col>
      </a-row>
    </template>
  </a-modal>
</template>

<script>
const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters']
import { informationRiver, regionList, getSaveRiver } from '@/api/login'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  props: {
    inputName: String,
    required: true
  },
  data() {
    return {
      jurisdiction:this.$store.state.operationPermission[2],//权限
      leftKmz:'上传kmz',
      rightKmz:'上传kmz',
      fileList:[],
      fileList1:[],
      headers: {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
        'X-TENANT-ID': this.$store.state.tenantId
      },
      spotList:{
        id: '',
        projectId: this.$store.state.id,
      },
      list: {
        id: '',
        projectId: this.$store.state.id,
        name: '',
        length1: '',
        supervisoryLevel:'',
        dimension: '',
        code: '',
        priority: '',
        destAddress: '',
        lat: '',
        lng: '',
        startAddress: '',
        lat1: '',
        lng1: '',
        areaId: '',
        areaId1: '',
        areaId2: '',
        areaId3: '',
        areaId4: '',
        areaId5: '',
        controller:'',
        averageDepth: '',
        highWaterLevel: '',
        maxDepth: '',
        maxMouthWidth: '',
        minMouthWidth: '',
        mouthDimension: '',
        normalWaterLevel: '',
        inspectTimes: ''
      },
      coordinate: [],
      labelCol: {
        xs: { span: 18 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      selectedItems: [], //风险源类型
      save: '1',
      options: [],
      cityList: [],
      areaList: [],
      cityList1: [],
      areaList1: [],
      form: this.$form.createForm(this)
    }
  },
  computed: {
    filteredOptions() {
      return OPTIONS.filter(o => !this.selectedItems.includes(o))
    }
  },
  mounted() {},
  methods: {
    add(currentLnglats) {
      this.save = '1'
      this.visible = true
      if (currentLnglats != undefined) {
        this.coordinate = currentLnglats
      }
      regionList('100000')
        .then(res => {
          this.options = res.data
        })
        .catch(err => {})
    },
    add1() {
      this.save = '2'
      this.visible = true
      regionList('100000')
        .then(res => {
          this.options = res.data
        })
        .catch(err => {})
    },
    //保存河道
    saveRiver() {
      var data = {
        id: this.list.id,
        projectId: this.list.projectId,
        code: this.list.code,
        name: this.list.name,
        length: this.list.length1,
        dimension: this.list.dimension,
        priority: this.list.priority,
        controller: this.list.controller,
        inspectTimes: this.list.inspectTimes,
        startAddress: this.list.startAddress,
        destAddress: this.list.destAddress,
        normalWaterLevel: this.list.normalWaterLevel,
        highWaterLevel: this.list.highWaterLevel,
        minMouthWidth: this.list.minMouthWidth,
        maxMouthWidth: this.list.maxMouthWidth,
        mouthDimension: this.list.mouthDimension,
        averageDepth: this.list.averageDepth,
        maxDepth: this.list.maxDepth,
        supervisoryLevel: this.list.supervisoryLevel,
        startCoordinate: this.list.lng + ',' + this.list.lat,
        destCoordinate: this.list.lng1 + ',' + this.list.lat1,
        startZoneId: this.list.areaId2,
        destZoneId: this.list.areaId5
      }
      for (let i = 0; i < this.coordinate.length; i++) {
        if (i == 0) {
          data.region = this.coordinate[i].lng + ',' + this.coordinate[i].lat + '|'
        } else if (i == this.coordinate.length - 1) {
          data.region = data.region + this.coordinate[i].lng + ',' + this.coordinate[i].lat
        } else {
          data.region = data.region + this.coordinate[i].lng + ',' + this.coordinate[i].lat + '|'
        }
      }
      if (this.save == '1') {
        getSaveRiver(data)
          .then(res => {
            console.log(res);
            this.spotList.id = res.data.info.id
            this.submitUpload1()
            this.$message.success('保存成功')
            this.$parent.getList()
            this.handleCancel()
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
      } else {
        this.$parent.uploadSave(data)
        
      }
    },
    //省市选择
    getCity(value) {
      regionList(value)
        .then(res => {
          this.cityList = res.data
        })
        .catch(err => {})
    },
    getCity1(value) {
      regionList(value)
        .then(res => {
          this.cityList1 = res.data
        })
        .catch(err => {})
    },
    getArea(value) {
      regionList(value)
        .then(res => {
          this.areaList = res.data
        })
        .catch(err => {})
    },
    getArea1(value) {
      regionList(value)
        .then(res => {
          this.areaList1 = res.data
        })
        .catch(err => {})
    },
    // 添加河流
    addRiver(value) {
      console.log(value)
    },
    // 风险源类型
    handleChange(selectedItems) {
      this.selectedItems = selectedItems
      console.log(selectedItems)
    },
    //河道信息
    getRiver(id) {
      informationRiver(id)
        .then(res => {
          let arr = res.data
          if (arr.extra.startZone != null) {
            var area = arr.extra.startZone.idPath.split(',')
            regionList(area[0])
              .then(res => {
                this.cityList = res.data
              })
              .catch(err => {})
            regionList(area[1])
              .then(res => {
                this.areaList = res.data
              })
              .catch(err => {})
            this.list.areaId = area[0]
            this.list.areaId1 = area[1]
            this.list.areaId2 = area[2]
          }
          if (arr.extra.destZone != null) {
            var area = arr.extra.destZone.idPath.split(',')
            regionList(area[0])
              .then(res => {
                this.cityList1 = res.data
              })
              .catch(err => {})
            regionList(area[1])
              .then(res => {
                this.areaList1 = res.data
              })
              .catch(err => {})
            this.list.areaId3 = area[0]
            this.list.areaId4 = area[1]
            this.list.areaId5 = area[2]
          }
          //基础信息
          if (arr.info.leftBankRegion.length>0) {
            this.leftKmz='已上传'
          }
          if (arr.info.rightBankRegion.length>0) {
            this.rightKmz='已上传'
          }
          this.list.id = arr.info.id
          this.list.name = arr.info.name
          this.list.length1 = arr.info.length
          this.list.dimension = arr.info.dimension
          this.list.code = arr.info.code
          this.list.priority = arr.info.priority +''
          this.list.inspectTimes = arr.info.inspectTimes
          this.coordinate = arr.info.region
          if (arr.info.supervisoryLevel) {
            this.list.supervisoryLevel = arr.info.supervisoryLevel.code
          }
          
          //起点
          this.list.destAddress = arr.extra.destAddress
          this.list.startAddress = arr.extra.startAddress
          if (arr.extra.startCoordinate.lat) {
             this.list.lat = arr.extra.startCoordinate.lat
          }
          if (arr.extra.startCoordinate.lng) {
              this.list.lng = arr.extra.startCoordinate.lng
          }
          if (arr.extra.destCoordinate.lat) {
             this.list.lat1 = arr.extra.destCoordinate.lat
          }
          if (arr.extra.destCoordinate.lng) {
             this.list.lng1 = arr.extra.destCoordinate.lng
          }
         
         
          
          //其他信息
          this.list.controller = arr.info.controller
          this.list.averageDepth = arr.extra.averageDepth
          this.list.highWaterLevel = arr.extra.highWaterLevel
          this.list.maxDepth = arr.extra.maxDepth
          this.list.maxMouthWidth = arr.extra.maxMouthWidth
          this.list.minMouthWidth = arr.extra.minMouthWidth
          this.list.mouthDimension = arr.extra.mouthDimension
          this.list.normalWaterLevel = arr.extra.normalWaterLevel
        })
        .catch(err => {})
    },
    // 文件上传
    fileUpload(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    // 标签
    handleChangeTag(value) {
      console.log(`selected ${value}`)
    },
    handleSubmit() {
      console.log(11111)
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          setTimeout(() => {
            this.visible = false
            this.confirmLoading = false
            this.$emit('confirm')
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.list.id = ''
      this.list.controller = ''
      this.list.inspectTimes = ''
      this.list.name = ''
      this.list.length1 = ''
      this.list.dimension = ''
      this.list.code = ''
      this.list.priority = ''
      this.list.destAddress = ''
      this.list.lat = ''
      this.list.lng = ''
      this.list.startAddress = ''
      this.list.lat1 = ''
      this.list.lng1 = ''
      this.list.areaId = ''
      this.list.areaId1 = ''
      this.list.areaId2 = ''
      this.list.areaId3 = ''
      this.list.areaId4 = ''
      this.list.areaId5 = ''
      this.list.averageDepth = ''
      this.list.highWaterLevel = ''
      this.list.maxDepth = ''
      this.list.maxMouthWidth = ''
      this.list.minMouthWidth = ''
      this.list.mouthDimension = ''
      this.list.normalWaterLevel = ''
      this.list.controller=''
      this.list.cityList = []
      this.list.areaList = []
      this.list.cityList1 = []
      this.list.areaList1 = []
      this.coordinate = []
      this.visible = false
      this.$parent.del1()
      this.$emit('cancel')
    },
    // 选择地址
    onChange(value, selectedOptions) {
      console.log(value, selectedOptions)
    },
    loadData(selectedOptions) {
      console.log(selectedOptions)
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      setTimeout(() => {
        targetOption.loading = false
        regionList(targetOption.value)
          .then(res => {
            let arr = res.data
            arr.forEach(v => {
              v.isLeaf = false
            })
            console.log(arr)
            targetOption.children = arr
          })
          .catch(err => {})
        this.options = [...this.options]
      }, 1000)
    },
    filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    },
    submitUpload1(){
      this.$refs.upload.submit()
      this.$refs.upload1.submit()
    },
    submitUpload(id){
      this.spotList.id = id
      this.$refs.upload.submit()
      this.$refs.upload1.submit()
      this.list.id = ''
      this.list.inspectTimes = ''
      this.list.controller = ''
      this.list.name = ''
      this.list.length1 = ''
      this.list.dimension = ''
      this.list.code = ''
      this.list.priority = ''
      this.list.destAddress = ''
      this.list.lat = ''
      this.list.lng = ''
      this.list.startAddress = ''
      this.list.lat1 = ''
      this.list.lng1 = ''
      this.list.areaId = ''
      this.list.areaId1 = ''
      this.list.areaId2 = ''
      this.list.areaId3 = ''
      this.list.areaId4 = ''
      this.list.areaId5 = ''
      this.list.averageDepth = ''
      this.list.highWaterLevel = ''
      this.list.maxDepth = ''
      this.list.maxMouthWidth = ''
      this.list.minMouthWidth = ''
      this.list.mouthDimension = ''
      this.list.normalWaterLevel = ''
      this.list.cityList = []
      this.list.areaList = []
      this.list.cityList1 = []
      this.list.areaList1 = []
      this.coordinate = []
      this.visible = false
      
    },
    handleSuccess(response, file, fileList) {
      this.fileList = []
      this.fileList1 = []
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    }
  }
}
</script>
<style scoped  lang="less">
.ant-spin-container {
  .ant-list-item:hover {
    background-color: #eee;
  }
  .active_item {
    background-color: #eee;
  }
}
.ant-form-item {
  margin-bottom: 0;
}
.from {
  max-height: 450px;
  overflow-y: scroll;
}
</style>
