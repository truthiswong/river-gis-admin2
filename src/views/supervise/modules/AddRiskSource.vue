<template>
  <a-modal
    title="风险源"
    :width="980"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="saveClick"
    @cancel="handleCancel"
    :centered="true"
    :maskClosable="false"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <a-form class="from" :form="form">
        <h3>名称</h3>
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
        <h3 style="margin-top: 10px;">位置</h3>
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
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道序号">
              <a-input placeholder v-model="list.code" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道管理等级">
              <a-input placeholder v-model="list.supervisoryLevel" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道等级">
              <a-input placeholder v-model="list.priority" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
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
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="一级河长">
              <a-input placeholder v-model="list.controller" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="二级河长">
              <a-input placeholder v-model="list.tworiver" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="地标位置">
              <a-input placeholder v-model="list.landmarkLocation" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="地址">
              <a-input placeholder v-model="list.address" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="准确位置">
              <a-input placeholder v-model="list.accurateLocation" />
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
        <h3 style="margin-top: 10px;">属性</h3>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="类别">
              <a-select
                :allowClear="true"
                placeholder="选择风险源类别"
                @change="typeChange"
                v-model="list.typeId"
              >
                <a-select-option
                  :value="item.id"
                  v-for="item in typeList"
                  :key="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="面积(m²)">
              <a-input placeholder v-model="list.currentArea" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="说明">
              <a-input placeholder v-model="list.statement" />
            </a-form-item>
          </a-col>
        </a-row>
        <h3 style="margin-top: 10px;">状态</h3>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="首次发现">
              <el-date-picker
                v-model="list.discoveryTime"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
                format="yyyy-MM-dd"
                @change="onChange"
              ></el-date-picker>
              <!-- <a-date-picker style="width:100%"  :format="dateFormat" @change="onChange" /> -->
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="风险等级">
              <a-select v-model="list.level">
                <a-select-option value="one">Ⅰ-红色</a-select-option>
                <a-select-option value="two">Ⅱ-橙色</a-select-option>
                <a-select-option value="three">Ⅲ-黄色</a-select-option>
                <a-select-option value="four">Ⅳ-蓝色</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="管理建议">
              <a-input placeholder v-model="list.advice" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="影像数据">
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
                <a-button type="primary" icon="plus">上传</a-button>
              </el-upload>
              <div style="display:flex;flex-wrap:wrap">
                <span v-for="item in attachmentJpg"
                  :key="item.id">
                <viewer>
                    <img :src="item.media" alt style="width:70px;height:70px;margin:0 4px 4px 0;" />
                </viewer>
                <a-popconfirm
                  title="确定删除吗？"
                  @confirm="mediaDelete(item.id)"
                >
                  <a-icon slot="icon" type="question-circle-o" style="color: red" />
                  <a-button type="primary" >删除</a-button>
                </a-popconfirm>
                </span>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
        <h3 style="margin-top: 10px;">
          督办单
          <a-button size="small" style="margin-left:10px;" @click="addSheet()">添加</a-button>
          <a-button size="small" style="margin-left:10px;" @click="exportExcel ()">导出</a-button>
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
        <a-table bordered size="small" :dataSource="dataSource" :columns="columns" id="exportTab">
          <template slot="operation" slot-scope="text, record">
            <a-popconfirm
              @confirm="confirm(record.id)"
              title="确定删除吗?"
              @cancel="cancelDelete"
              okText="确定"
              cancelText="取消"
            >
              <a>删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </a-form>
      <a-divider orientation="left"></a-divider>
      <a-row style="width:100%; margin-top:10px;" type="flex" justify="space-around">
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
import XLSX from 'xlsx'
import FileSaver from 'file-saver'
import moment from 'moment'
const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters']
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'


import {
  mapdrawDetail,
  getRiverList,
  getStreetList,
  informationStreet,
  informationRiver,
  riskInner,
  mediaList,
  mapdrawRiskSave,
  paramList,
  SupervisePage,
  riskDetails,
  mapdrawDelete,
  mediaRemove
} from '@/api/login'
export default {
  data() {
    return {
      sheet: false,
      sheetList: [],
      sheetId: [],
      fileList: [],
      file: false,
      attachmentJpg: '',
      startDate: '',
      dateFormat: 'YYYY-MM-DD',
      upload: {
        title: '1',
        drawId: '',
        id: ''
      },
      list: {
        standardCode: '',
        standardName: '',
        riverId: '',
        streetId: '',
        tworiver: '',
        supervisoryLevel: '',
        controller: '',
        priority: '',
        lat: '',
        lng: '',
        typeId: '',
        landmarkLocation: '',
        accurateLocation: '',
        level: '',
        innerCode: '',
        innerName: '',
        currentArea: '',
        discoveryTime: '',
        advice: '',
        statement: '',
        drawId: ''
      },
      typeList: [],
      headers: {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
        'X-TENANT-ID': this.$store.state.tenantId
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
      riverList: [], //河道列表
      streetList: [], //街道列表
      form: this.$form.createForm(this),

      dataSource: [],
      dataSourceId: [],
      count: 2,
      columns: [
        {
          title: '名称',
          dataIndex: 'name'
          // width: '10%',
          // scopedSlots: { customRender: 'key' },
        },
        {
          title: '内部编号',
          dataIndex: 'insideNum'
        },
        {
          title: '官方编号',
          dataIndex: 'officialNum'
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
    getList() {
      SupervisePage(this.$store.state.id).then(res => {
        function formatDate(now) {
          var year = now.getFullYear() //取得4位数的年份
          var month = now.getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
          var date = now.getDate() //返回日期月份中的天数（1到31）
          var hour = now.getHours() //返回日期中的小时数（0到23）
          var minute = now.getMinutes() //返回日期中的分钟数（0到59）
          var second = now.getSeconds() //返回日期中的秒数（0到59）
          return year + '-' + month + '-' + date
        }
        res.data.data.forEach(v => {
          v.key = v.id
          v.surveyDate = formatDate(new Date(v.surveyDate))
        })
        this.sheetList = res.data.data
      })
      getRiverList(this.$store.state.id).then(res => {
        this.riverList = res.data.data
      })
      getStreetList(this.$store.state.id).then(res => {
        this.streetList = res.data.data
      })
      let data = {
        type: 'risk_source_type'
      }
      paramList(data).then(res => {
        this.typeList = res.data
      })
    },
    typeChange(value, option) {
      if (this.list.riverId != '') {
        let data = {
          riverId: this.list.riverId,
          typeId: value
        }
        riskInner(data).then(res => {
          this.list.innerCode = res.data.innerCode
          this.list.innerName = res.data.innerName
        })
      } else {
        this.$message.warning('请先选择河道')
      }
    },
    riverChange(value, option) {
      informationRiver(value).then(res => {
        this.list.code = res.data.info.code
        this.list.controller = res.data.info.controller
        console.log(res.data.info.supervisoryLevel)
        if (res.data.info.supervisoryLevel) {
          this.list.supervisoryLevel = res.data.info.supervisoryLevel.name
        }
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
    saveClick() {
      let data = {
        drawId: this.list.drawId,
        standardCode: this.list.standardCode,
        standardName: this.list.standardName,
        landmarkLocation: this.list.landmarkLocation,
        accurateLocation: this.list.accurateLocation,
        riverId: this.list.riverId,
        streetId: this.list.streetId,
        typeId: this.list.typeId,
        level: this.list.level,
        address: this.list.address,
        polygonSize: this.list.currentArea,
        statement: this.list.statement,
        discoveryTime: this.list.discoveryTime,
        advice: this.list.advice,
        innerCode: this.list.innerCode,
        innerName: this.list.innerName,
        billId: this.dataSourceId.join(','),
        coordindate:this.list.lat+','+this.list.lng
      }
      mapdrawRiskSave(data)
        .then(res => {
          this.$message.success('保存成功')
          this.$parent.drawSaveRefresh('riskSource')
          this.handleCancel()
          this.$emit('confirm')
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    addSource(id) {
      this.list.drawId = id
      this.upload.drawId = id
      mediaList(this.list.drawId).then(res => {
        console.log(res.data)
        this.attachmentJpg = res.data
      })
      this.getList()
      this.visible = true
      function formatDate(now) {
        var year = now.getFullYear() //取得4位数的年份
        var month = now.getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
        var date = now.getDate() //返回日期月份中的天数（1到31）
        var hour = now.getHours() //返回日期中的小时数（0到23）
        var minute = now.getMinutes() //返回日期中的分钟数（0到59）
        var second = now.getSeconds() //返回日期中的秒数（0到59）
        return year + '-' + month + '-' + date
      }
      riskDetails(id).then(res => {
        let arr = res.data
        arr.bill.forEach(v => {
          v.key = v.id
          v.surveyDate = formatDate(new Date(v.surveyDate))
          this.dataSourceId.push(v.id)
        })
        if (arr.river) {
          this.list.code = arr.river.code
          this.list.controller = arr.river.controller
          this.list.riverId = arr.river.id
        }
        if (arr.river.supervisoryLevel) {
          this.list.supervisoryLevel = arr.river.supervisoryLevel.name
        }
        if (arr.river.priority == true) {
          this.list.priority = '重点'
        } else if (arr.river.priority == false) {
          this.list.priority = '非重点'
        }
        
        this.list.address = arr.address
        this.dataSource = arr.bill
        if (arr.street) {
          this.list.tworiver = arr.street.controller
          this.list.streetId = arr.street.id
        }
        if ( arr.type) {
          this.list.typeId = arr.type.id  
        }
        
        if (arr.level) {
          this.list.level = arr.level.code
        }
        // this.list.supervisoryLevel=arr.
        // this.list.controller=arr.
        // this.list.priority=arr.
        // this.list.lat=arr.
        // this.list.lng=arr.

        this.list.currentArea = arr.polygonSize
        this.list.landmarkLocation = arr.landmarkLocation
        this.list.accurateLocation = arr.accurateLocation
        this.list.innerCode = arr.innerCode
        this.list.innerName = arr.innerName
        this.list.discoveryTime = formatDate(new Date(arr.discoveryTime))
        this.list.advice = arr.advice
        this.list.statement = arr.statement
        this.list.standardCode = arr.standardCode
        this.list.standardName = arr.standardName
      })
    },
    handleCancel() {
      this.list.riverId = ''
      this.list.streetId = ''
      this.list.tworiver = ''
      this.list.supervisoryLevel = ''
      this.list.controller = ''
      this.list.priority = ''
      this.list.lat = ''
      this.list.lng = ''
      this.list.typeId = ''
      this.list.landmarkLocation = ''
      this.list.accurateLocation = ''
      this.list.level = ''
      this.list.innerCode = ''
      this.list.innerName = ''
      this.list.currentArea = ''
      this.list.discoveryTime = ''
      this.list.advice = ''
      this.list.statement = ''
      this.list.drawId = ''
      this.dataSourceId = []
      this.dataSource = []
      this.upload.id = ''
      this.attachmentJpg = ''
      this.visible = false
      this.$emit('cancel')
    },
    handleDelete() {
      mapdrawDelete(this.list.drawId)
        .then(res => {
          this.$message.success('删除成功')
          this.$parent.drawSaveRefresh('riskSource')
          this.handleCancel()
          // this.$emit('confirm')
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    onChange(date) {
      function formatDate(now) {
        var year = now.getFullYear() //取得4位数的年份
        var month = now.getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
        var date = now.getDate() //返回日期月份中的天数（1到31）
        var hour = now.getHours() //返回日期中的小时数（0到23）
        var minute = now.getMinutes() //返回日期中的分钟数（0到59）
        var second = now.getSeconds() //返回日期中的秒数（0到59）
        return year + '-' + month + '-' + date
      }
      this.list.discoveryTime = formatDate(date)
    },
    handleSuccess(response, file, fileList) {
      this.$message.success('上传成功')
      this.fileList = []
      mediaList(this.list.drawId).then(res => {
        this.attachmentJpg = res.data
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
            this.attachmentJpg = res.data
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
    add(id, currentArea, result) {
      this.list.drawId = id
      this.upload.drawId = id
      this.list.address = result.formatted_address
      this.list.lat = result.resultObj.location.lat
      this.list.lng = result.resultObj.location.lon
      this.list.currentArea = currentArea
      this.getList()
      this.visible = true
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
    cancelDelete() {},
    exportExcel () {
      /* generate workbook object from table */
      var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
      var wb = XLSX.utils.table_to_book(document.querySelector('#exportTab'), xlsxParam)

      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '督办单.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      return wbout
    }
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
<style lang="less" >
.ant-form input[type='file'] {
  display: none;
}
</style>

