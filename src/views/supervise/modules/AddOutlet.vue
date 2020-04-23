<template>
  <a-modal
    title="排口"
    :width="980"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="saveClick"
    @cancel="handleCancel"
    :centered="true"
    :footer="null"
    :maskClosable="false"
    :destroyOnClose="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form class="from">
        <h3>基本信息</h3>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="内部编码">
              <a-input placeholder disabled v-model="list.innerCode" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="标准编码">
              <a-input placeholder v-model="list.standardCode" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="内部名称">
              <a-input placeholder disabled v-model="list.innerName" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="标准名称">
              <a-input placeholder v-model="list.standardName" />
            </a-form-item>
          </a-col>
        </a-row>
        <!-- <h3 style="margin-top: 10px;">位置</h3> -->
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="所属河道">
              <a-select
                :allowClear="true"
                placeholder="请输入河流"
                optionFilterProp="children"
                style="width: 100%"
                v-model="list.riverId"
                @change="riverChange"
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in riverList"
                  :key="index"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="排入水体功能区名称">
              <a-input placeholder v-model="list.functionName" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道序号">
              <a-input placeholder v-model="list.code" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道管理等级">
              <a-input placeholder v-model="list.supervisoryLevel" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道等级">
              <a-input placeholder v-model="list.priority" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="所属街道">
              <a-select
                :allowClear="true"
                placeholder="请输入街道"
                optionFilterProp="children"
                style="width: 100%"
                v-model="list.streetId"
                @change="streetChange"
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in streetList"
                  :key="index"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="一级河长">
              <a-input placeholder v-model="list.controller" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="二级河长">
              <a-input placeholder v-model="list.tworiver" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="地标位置">
              <a-input placeholder v-model="list.landmarkLocation" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="地址">
              <a-input placeholder v-model="list.address" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="经度">
              <a-input placeholder v-model="list.lng" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="纬度">
              <a-input placeholder v-model="list.lat" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="准确位置">
              <a-input placeholder v-model="list.accurateLocation" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="首次发现时间">
              <a-date-picker
                   
                    style="width: 100%"
                  />
                   <!-- :value="moment(list.activateTime, 'YYYY-MM-DD')"
                    @change="onChange" -->
            </a-form-item>
          </a-col>
        </a-row>
        <h3 style="margin-top: 10px;">属性</h3>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="类别">
              <a-select
                :allowClear="true"
                placeholder="请选择类别"
                @change="typeChange"
                v-model="list.type"
              >
                <a-select-option value="rainwater">雨水</a-select-option>
                <a-select-option value="life">生活</a-select-option>
                <a-select-option value="mix">混合</a-select-option>
                <a-select-option value="industrial">工业</a-select-option>
                <a-select-option value="powerplant">电厂温排水</a-select-option>
                <a-select-option value="other">其他</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="排放方式">
              <a-select :allowClear="true" placeholder="请选择" v-model="list.letway">
                <a-select-option value="sequence">连续</a-select-option>
                <a-select-option value="interrupt">间接</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="入河方式">
              <a-input placeholder v-model="list.enterRiverWay" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="大小">
              <a-input placeholder v-model="list.enterRiverSize" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="实际年排放总量(万吨)">
              <a-input placeholder v-model="list.yearLetSize" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="主要污染物">
              <a-input placeholder v-model="list.pollutant" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="设置单位">
              <a-input placeholder v-model="list.settingUnit" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="单位地址">
              <a-input placeholder v-model="list.unitAddress" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="联系人">
              <a-input placeholder v-model="list.linkman" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="联系地址">
              <a-input placeholder v-model="list.linktel" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="封堵状态">
              <a-input placeholder v-model="list.blockoffStatus" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="情况说明">
              <a-input placeholder v-model="list.statement" />
            </a-form-item>
          </a-col>
        </a-row>
        <h3 style="margin-top: 10px;">等级情况</h3>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="建成时间">
              <a-date-picker
                :value="moment(list.activateTime, 'YYYY-MM-DD')"
                @change="onChange"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="登记情况">
              <a-input placeholder v-model="list.registrationState" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="批准情况">
              <a-input placeholder v-model="list.approveState" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="批准单位">
              <a-input placeholder v-model="list.approveUnit" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="排污许可">
              <a-input placeholder v-model="list.dischargeLicense" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="许可证号">
              <a-input placeholder v-model="list.licenseNo" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="影像">
              <el-upload
                class="upload-demo"
                :data="upload"
                name="media"
                :headers="headers"
                action="/server/data/admin/mapdraw/media/save"
                :on-preview="handlePreview"
                :on-success="handleSuccess"
                :on-errore="handleRemove"
                :file-list="fileList"
                :limit="1"
              >
                <a-button type="primary" icon="plus" v-show="jurisdiction">上传</a-button>
              </el-upload>
              <div style="display:flex;flex-wrap:wrap">
                 <span >
                  <viewer :images="attachmentJpg" >
                    <img v-for="item in attachmentJpg" :key="item.id" :src="item.media" alt style="width:70px;height:70px;margin:0 4px 4px 0;"  />
                  </viewer >
                  <div style="width:70px;margin:0 4px 4px 0;display: inline-block"  v-for="item in attachmentJpg" :key="item.id" v-show="jurisdiction"> 
                     <a-popconfirm
                        title="确定删除吗？"
                        @confirm="mediaDelete(item.id)"
                      >
                        <a-icon slot="icon" type="question-circle-o" style="color: red" />
                        <a-button type="primary" >删除</a-button>
                      </a-popconfirm>
                  </div>
                 
                </span>
              </div>
             
            </a-form-item>
          </a-col>
        </a-row>
        <h3 style="margin-top: 10px;">
          督办单
          <a-button size="small" style="margin-left:10px;" @click="addSheet()" v-show="jurisdiction">添加</a-button>
        </h3>
        <div v-show="sheet" style="margin-bottom:20px;">
          <a-select
            showSearch
            mode="multiple"
            :allowClear="true"
            placeholder="请选择督办单"
            optionFilterProp="children"
            style="width: 300px"
            @change="handleChange"
            :filterOption="filterOption"
            v-model="sheetId"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, index) in sheetList"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
          <div style="margin-top:10px;">
            <a-button style="margin-right:20px;">取消</a-button>
            <a-button type="primary" @click="addSelectSheet">确定</a-button>
          </div>
        </div>
        <a-table bordered size="small" :dataSource="dataSource" :columns="columns">
          <template slot="operation" slot-scope="text, record">
            <a-popconfirm
              @confirm="confirm(record.id)"
              title="确定删除吗?"
              @cancel="cancelDelete"
              okText="确定"
              cancelText="取消"
            >
              <a v-show="jurisdiction">删除</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a :href="record.attachment" :download="record.documentName"   target="_blank" >下载</a>
          </template>
        </a-table>
      </a-form>
      <a-divider orientation="left"></a-divider>
      <a-row style="width:100%; margin-top:10px;" type="flex" justify="space-around" v-show="jurisdiction">
        <a-col :span="3">
          <a-button block @click="handleCancel">取消</a-button>
        </a-col>
        <a-col :span="3">
          <a-button block @click="handleDelete">删除</a-button>
        </a-col>
        <a-col :span="3">
          <a-button block @click="saveClick">保存</a-button>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import {
  getRiverList,
  getStreetList,
  informationStreet,
  informationRiver,
  dischargeInner,
  mapdrawDischargeSave,
  mapdrawDelete,
  mediaList,
  dischargeDetails,
  mapdrawDetail,
  SupervisePage,
  mediaRemove
} from '@/api/login'
export default {
  data() {
    return {
       jurisdiction:this.$store.state.operationPermission[1],//权限
       currentAreaDisabled:false,
      sheet: false,
      sheetList: [],
      sheetId: [],
      fileList: [],
      file: false,
      headers: {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
        'X-TENANT-ID': this.$store.state.tenantId
      },
      list: {
        riverId: '',
        streetId: '',
        tworiver: '',
        supervisoryLevel: '',
        controller: '',
        priority: '',
        lat: '',
        lng: '',
        type: '',
        waterName: '苏州',
        landmarkLocation: '',
        accurateLocation: '',
        innerCode: '',
        innerName: '',
        drawId: '',
        letway: '',
        enterRiverWay: '',
        enterRiverSize: '',
        yearLetSize: '',
        pollutant: '',
        settingUnit: '',
        unitAddress: '',
        linkman: '',
        linktel: '',
        blockoffStatus: '',
        statement: '',
        activateTime: moment(new Date()).format('YYYY-MM-DD'),
        registrationState: '',
        approveState: '',
        approveUnit: '',
        dischargeLicense: '',
        licenseNo: '',
        innerCode: '',
        innerName: '',
        functionName: '',
        standardCode: '',
        standardName: ''
      },
      attachmentJpg: [],
      riverList: [],
      streetList: [],
      upload: {
        title: '1',
        drawId: '',
        id: ''
      },
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
      dataSource: [],
      dataSourceId: [],
      columns: [
        {
          title: '名称',
          dataIndex: 'name'
          // width: '10%',
          // scopedSlots: { customRender: 'key' },
        },
        {
          title: '内部编号',
          dataIndex: 'innerCode'
        },
        {
          title: '官方编号',
          dataIndex: 'officialCode'
        },
        {
          title: '调查日期',
          dataIndex: 'surveyDate'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  computed: {},
  mounted() {},
  methods: {
    moment,
    onChange(date, dateString) {
      this.list.activateTime = dateString
    },
    getList() {
      SupervisePage(this.$store.state.id).then(res => {
        res.data.data.forEach(v => {
          v.key = v.id
          v.surveyDate = moment(v.surveyDate).format('YYYY-MM-DD')
        })
        this.sheetList = res.data.data
      })
      getRiverList(this.$store.state.id).then(res => {
        this.riverList = res.data.data
      })
      getStreetList(this.$store.state.id).then(res => {
        this.streetList = res.data.data
      })
    },
    detailList(row) {
      this.getList()
      this.visible = true
      this.list.drawId = row
      this.upload.drawId = row
      console.log(this.list.drawId)
      dischargeDetails(row).then(res => {
        var arr = res.data
        arr.bill.forEach(v => {
          v.key = v.id
          v.surveyDate = moment(v.surveyDate).format('YYYY-MM-DD')
          this.dataSourceId.push(v.id)
        })
        this.dataSource = arr.bill
        if (arr.river) {
          this.list.riverId = arr.river.id
          if (arr.river.supervisoryLevel) {
            this.list.supervisoryLevel = arr.river.supervisoryLevel.name
          }
          
        }
        if (arr.street) {
          this.list.streetId = arr.street.id
        }
        this.list.tworiver = arr.tworiver
        if (arr.river) {
          this.list.code = arr.river.code
        }
        this.list.controller = arr.river.controller
        
        if (arr.river.priority == true) {
          this.list.priority = '重点'
        } else if (arr.river.priority == false) {
          this.list.priority = '非重点'
        }
        if (arr.coordinate) {
          this.list.lat=arr.coordinate[0]
          this.list.lng=arr.coordinate[1]
        }
        this.list.tworiver = arr.street.controller
        this.list.address = arr.address
        this.list.standardCode = arr.standardCode
        this.list.standardName = arr.standardName
        if (arr.type) {
          this.list.type = arr.type.code
        }
        
        this.list.landmarkLocation = arr.landmarkLocation
        this.list.accurateLocation = arr.accurateLocation
        this.list.innerCode = arr.innerCode
        this.list.innerName = arr.innerName
        if (arr.letway) {
          this.list.letway = arr.letway.code
        }
        
        this.list.enterRiverWay = arr.enterRiverWay
        this.list.enterRiverSize = arr.enterRiverSize
        this.list.yearLetSize = arr.yearLetSize
        this.list.pollutant = arr.pollutant
        this.list.settingUnit = arr.settingUnit
        this.list.unitAddress = arr.unitAddress
        this.list.linkman = arr.linkman
        this.list.linktel = arr.linktel
        this.list.blockoffStatus = arr.blockoffStatus
        this.list.statement = arr.statement
        this.list.activateTime = moment(arr.activateTime).format('YYYY-MM-DD')
        this.list.registrationState = arr.registrationState
        this.list.approveState = arr.approveState
        this.list.approveUnit = arr.approveUnit
        this.list.dischargeLicense = arr.dischargeLicense
        this.list.licenseNo = arr.licenseNo
        this.list.innerCode = arr.innerCode
        this.list.innerName = arr.innerName
        this.list.functionName = arr.functionName
        mediaList(this.list.drawId).then(res => {
          this.attachmentJpg = res.data.slice(0,3)
        })
      })
    },
    typeChange(value, option) {
      if (this.list.riverId != '') {
        let data = {
          riverId: this.list.riverId,
          type: value
        }
        dischargeInner(data).then(res => {
          this.list.innerCode = res.data.innerCode
          this.list.innerName = res.data.innerName
        })
      } else {
        this.$message.warning('请先选择河道')
      }
    },
    riverChange(value, option) {
      informationRiver(value).then(res => {
        console.log(res.data)
        this.list.code = res.data.info.code
        this.list.controller = res.data.info.controller
        this.list.supervisoryLevel = res.data.info.supervisoryLevel.name
        if (res.data.info.priority == true) {
          this.list.priority = '重点'
        } else if (res.data.info.priority == false) {
          this.list.priority = '非重点'
        }
      })
    },
    streetChange(value, option) {
      informationStreet(value).then(res => {
        this.list.tworiver = res.data.controller
      })
    },
    add(id, result) {
      this.visible = true
      this.list.drawId = id
      this.upload.drawId = id
      this.list.address = result.formatted_address
      this.list.lat = result.resultObj.location.lat
      this.list.lng = result.resultObj.location.lon
      this.getList()
    },
    // 添加河流
    handleSubmit() {
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
            this.$emit('ok', values)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.list.riverId = ''
      this.list.streetId = ''
      this.list.tworiver = ''
      this.list.supervisoryLevel = ''
      this.list.controller = ''
      this.list.priority = ''
      this.list.lat = ''
      this.list.lng = ''
      this.list.type = ''
      this.list.landmarkLocation = ''
      this.list.accurateLocation = ''
      this.list.innerCode = ''
      this.list.innerName = ''
      this.list.drawId = ''
      this.list.letway = ''
      this.list.enterRiverWay = ''
      this.list.enterRiverSize = ''
      this.list.yearLetSize = ''
      this.list.pollutant = ''
      this.list.settingUnit = ''
      this.list.unitAddress = ''
      this.list.linkman = ''
      this.list.linktel = ''
      this.list.blockoffStatus = ''
      this.list.statement = ''
      this.list.activateTime = moment(new Date()).format('YYYY-MM-DD')
      this.list.registrationState = ''
      this.list.approveState = ''
      this.list.approveUnit = ''
      this.list.dischargeLicense = ''
      this.list.licenseNo = ''
      this.list.innerCode = ''
      this.list.innerName = ''
      this.list.functionName = ''
      this.upload.id = ''
      this.dataSourceId = []
      this.dataSource = []
      this.attachmentJpg = []
    },
    handleDelete() {
      mapdrawDelete(this.list.drawId)
        .then(res => {
          this.$message.success('删除成功')
          this.$parent.drawSaveRefresh('discharge')
          this.handleCancel()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    saveClick() {
      let data = this.list
      data.coordinate=this.list.lat+','+this.list.lng
      data.billId = this.dataSourceId.join(',')
      mapdrawDischargeSave(data)
        .then(res => {
          this.$message.success('保存成功,请打开排口按钮查看')
          this.$parent.drawSaveRefresh('discharge')
          this.handleCancel()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    handleSuccess(response, file, fileList) {
      this.$message.success('上传成功')
      console.log(this.list.drawId)
      this.fileList = []
      mediaList(this.list.drawId).then(res => {
        console.log(res.data)
        this.attachmentJpg = res.data.slice(0,3)
      })
    },
    handleRemove(err) {
      console.log(err)
    },
    // 影像删除
    mediaDelete(id) {
      mediaRemove(id)
        .then(res => {
          this.$message.success('删除成功')
          mediaList(this.list.drawId).then(res => {
            this.attachmentJpg = res.data.slice(0,3)
          })
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {},
    beforeRemove(file, fileList) {},
    handleChange(index) {
      this.sheetList.forEach(value => {
        if (value.name === index) {
          value.clicked = true
        } else {
          value.clicked = false
        }
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    addSheet() {
      this.sheet = true
    },
    addSelectSheet() {
      this.sheetId.forEach(v => {
        this.sheetList.forEach(a => {
          if (v == a.id) {
            if (this.dataSourceId.indexOf(a.id) == -1) {
              this.dataSource.push(a)
              this.dataSourceId.push(a.id)
            } else {
              this.$message.warning(a.name + '已存在')
            }
          }
        })
      })
      this.sheetId = []
      this.sheet = false
    },
    confirm(id) {
      for (let i = 0; i < this.dataSourceId.length; i++) {
        if (this.dataSourceId[i] == id) {
          this.dataSourceId.splice(i, 1)
        }
      }
      for (let i = 0; i < this.dataSource.length; i++) {
        if (this.dataSource[i].id == id) {
          this.dataSource.splice(i, 1)
        }
      }
    },
    cancelDelete() {}
  }
}
</script>
<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 0;
}
.from {
  max-height: 450px;
  overflow-y: scroll;
  h3 {
    font-weight: 600;
    font-size: 15px;
  }
}
</style>
