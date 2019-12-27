<template>
  <a-modal
    title="排口"
    :width="980"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="saveClick"
    @cancel="handleCancel"
    :mask="true"
    :centered="true"
    :footer="null"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form class="from">
        <h3>名称</h3>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="内部编码">
              <a-input placeholder disabled v-model="list.innerCode"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="标准编码">
              <a-input placeholder  v-model="list.standardCode" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="内部名称">
              <a-input placeholder disabled v-model="list.innerName"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="标准名称">
              <a-input placeholder v-model="list.standardName"/>
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
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="排入水体功能区名称">
              <a-input placeholder v-model="list.functionName"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道序号">
              <a-input placeholder v-model="list.code" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道管理等级">
              <a-input placeholder v-model="list.supervisoryLevel" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道等级">
              <a-input placeholder v-model="list.priority" disabled/>
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
              <a-input placeholder v-model="list.controller" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="二级河长">
              <a-input placeholder  v-model="list.tworiver" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="地标位置">
              <a-input placeholder v-model="list.landmarkLocation"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="地址">
               <a-input placeholder v-model="list.address" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="经度">
              <a-input placeholder v-model="list.lng" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="纬度">
              <a-input placeholder v-model="list.lat" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="准确位置">
              <a-input placeholder  v-model="list.accurateLocation"/>
            </a-form-item>
          </a-col>
        </a-row>
        <h3 style="margin-top: 10px;">属性</h3>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="类别">
              <a-select  :allowClear="true" placeholder="请选择类别"  @change="typeChange" v-model="list.type">
                <a-select-option value="rainwater">雨水</a-select-option>
                <a-select-option value="life">生活</a-select-option>
                <a-select-option value="mix">混合</a-select-option>
                <a-select-option value="industrial">工业</a-select-option>
                <a-select-option value="powerplant">电厂温排水</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="排放方式">
              <a-select  :allowClear="true" placeholder="请选择" v-model="list.letway">
                <a-select-option value="sequence">连续</a-select-option>
                <a-select-option value="interrupt">间接</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="入河方式">
              <a-input placeholder v-model="list.enterRiverWay"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="大小">
              <a-input placeholder v-model="list.enterRiverSize"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="实际年排放总量(万吨)">
              <a-input placeholder v-model="list.yearLetSize"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="主要污染物">
              <a-input placeholder v-model="list.pollutant"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="设置单位">
              <a-input placeholder v-model="list.settingUnit"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="单位地址">
              <a-input placeholder v-model="list.unitAddress"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="联系人">
              <a-input placeholder v-model="list.linkman"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="联系地址">
              <a-input placeholder v-model="list.linktel"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="封堵状态">
              <a-input placeholder v-model="list.blockoffStatus"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="情况说明">
              <a-input placeholder v-model="list.statement"/>
            </a-form-item>
          </a-col>
        </a-row>
        <h3 style="margin-top: 10px;">等级情况</h3>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="建成时间">
              <a-input placeholder v-model="list.activateTime"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="登记情况">
              <a-input placeholder v-model="list.registrationState"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="批准情况">
              <a-input placeholder v-model="list.approveState"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="批准单位">
              <a-input placeholder v-model="list.approveUnit"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="排污许可">
              <a-input placeholder v-model="list.dischargeLicense"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"   label="许可证号">
              <a-input placeholder v-model="list.licenseNo"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol"  label="影像">
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
                :limit='1'>
                <a-button type="primary" icon="plus" >上传</a-button>
              </el-upload>
              <viewer >
                <img v-for="item in attachmentJpg" :key="item.id" :src="item.media" alt="" style="height:70px;">
              </viewer >
            </a-form-item>
          </a-col>
        </a-row>
        <h3 style="margin-top: 10px;">
          督办单
          <a-button size="small" style="margin-left:10px;" @click="addSheet()">添加</a-button>
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
        <a-table bordered size='small' :dataSource="dataSource" :columns="columns">
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
import { getRiverList,getStreetList,informationStreet,informationRiver,dischargeInner,mapdrawDischargeSave,mediaList,dischargeDetails,mapdrawDetail,SupervisePage} from '@/api/login'
export default {
  data() {
    return {
      sheet:false,
      sheetList:[],
      sheetId:[],
      fileList:[],
      file:false,
      headers: {
        Authorization: '',
        'X-TENANT-ID': 'jl:jlgis@2019' 
      },
      list:{
        riverId:'',
        streetId:'',
        tworiver:'',
        supervisoryLevel:'',
        controller:'',
        priority:'',
        lat:'',
        lng:'',
        type:'',
        waterName:'苏州',
        landmarkLocation:'',
        accurateLocation:'',
        innerCode:'',
        innerName:'',
        drawId:'',
        letway:'',
        enterRiverWay:'',
        enterRiverSize:'',
        yearLetSize:'',
        pollutant:'',
        settingUnit:'',
        unitAddress:'',
        linkman:'',
        linktel:'',
        blockoffStatus:'',
        statement:'',
        activateTime:'',
        registrationState:'',
        approveState:'',
        approveUnit:'',
        dischargeLicense:'',
        licenseNo:'',
        innerCode:'',
        innerName:'',
        functionName:'',
        standardCode:'',
        standardName:'',
      },
      attachmentJpg:[],
      riverList:[],
      streetList:[],
      upload:{
        title:'1',
        drawId:'',
        id:'',
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
      dataSource: [

      ],
      dataSourceId:[],
      columns: [{
        title: '名称',
        dataIndex: 'name',
        // width: '10%',
        // scopedSlots: { customRender: 'key' },
      }, {
        title: '内部编号',
        dataIndex: 'insideNum',
      }, {
        title: '官方编号',
        dataIndex: 'officialNum',
      }, {
        title: '调查日期',
        dataIndex: 'surveyDate',
      }, {
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
      }],

    }
  },
  computed: {
  },
  mounted(){
    this.headers.Authorization=Vue.ls.get(ACCESS_TOKEN)
  },
  methods: {
    moment,
    getList(){
      SupervisePage(this.$store.state.id).then(res=>{
        function formatDate(now) { 
          var year=now.getFullYear() //取得4位数的年份
          var month=now.getMonth()+1  //取得日期中的月份，其中0表示1月，11表示12月
          var date=now.getDate()      //返回日期月份中的天数（1到31）
          var hour=now.getHours()     //返回日期中的小时数（0到23）
          var minute=now.getMinutes() //返回日期中的分钟数（0到59）
          var second=now.getSeconds() //返回日期中的秒数（0到59）
          return year+"-"+month+"-"+date
        }
        res.data.data.forEach(v => {
          v.key = v.id
          v.surveyDate = formatDate(new Date(v.surveyDate))
        });
        this.sheetList = res.data.data
      })
      getRiverList(this.$store.state.id).then(res=>{
        this.riverList = res.data.data
      })
      getStreetList(this.$store.state.id).then(res=>{
        this.streetList = res.data.data
      })
    },
    detailList(row){
      this.getList()
      // mapdrawDetail(row.target.options.id).then(res=>{
      //   this.list.lng=res.data.point[0]
      //   this.list.lat=res.data.point[1]
      // })
      this.list.drawId=row.target.options.id
      dischargeDetails(row.target.options.id).then(res=>{
        var arr = res.data
        this.list.riverId=arr.river.id
        this.list.streetId=arr.street.id
        this.list.code = arr.river.code
        this.list.controller = arr.river.controller
        this.list.supervisoryLevel = arr.river.supervisoryLevel.name
        if (arr.river.priority == true) {
          this.list.priority='重点'
        }else if(arr.river.priority == false){
          this.list.priority='非重点'
        }
        this.list.tworiver=arr.street.controller
        this.list.address=arr.address
        // this.list.supervisoryLevel=arr.
        // this.list.controller=arr.
        // this.list.priority=arr.
        this.list.standardCode=arr.standardCode
        this.list.standardName=arr.standardName
        this.list.type=arr.type.code
        this.list.landmarkLocation=arr.landmarkLocation
        this.list.accurateLocation=arr.accurateLocation
        this.list.innerCode=arr.innerCode
        this.list.innerName=arr.innerName
        this.list.letway=arr.letway.code
        this.list.enterRiverWay=arr.enterRiverWay
        this.list.enterRiverSize=arr.enterRiverSize
        this.list.yearLetSize=arr.yearLetSize
        this.list.pollutant=arr.pollutant
        this.list.settingUnit=arr.settingUnit
        this.list.unitAddress=arr.unitAddress
        this.list.linkman=arr.linkman
        this.list.linktel=arr.linktel
        this.list.blockoffStatus=arr.blockoffStatus
        this.list.statement=arr.statement
        this.list.activateTime=arr.activateTime
        this.list.registrationState=arr.registrationState
        this.list.approveState=arr.approveState
        this.list.approveUnit=arr.approveUnit
        this.list.dischargeLicense=arr.dischargeLicense
        this.list.licenseNo=arr.licenseNo
        this.list.innerCode=arr.innerCode
        this.list.innerName=arr.innerName
        this.list.functionName=arr.functionName
      })
      this.visible = true
    },
    detailList1(row){
      this.getList()
      this.visible = true
      // mapdrawDetail(row).then(res=>{
      //   this.list.lng=res.data.point[0]
      //   this.list.lat=res.data.point[1]
      // })
      this.list.drawId=row
      function formatDate(now) { 
        var year=now.getFullYear() //取得4位数的年份
        var month=now.getMonth()+1  //取得日期中的月份，其中0表示1月，11表示12月
        var date=now.getDate()      //返回日期月份中的天数（1到31）
        var hour=now.getHours()     //返回日期中的小时数（0到23）
        var minute=now.getMinutes() //返回日期中的分钟数（0到59）
        var second=now.getSeconds() //返回日期中的秒数（0到59）
        return year+"-"+month+"-"+date
      }
      dischargeDetails(row).then(res=>{
        var arr = res.data
        arr.bill.forEach(v => {
          v.key = v.id
          v.surveyDate = formatDate(new Date(v.surveyDate))
          this.dataSourceId.push(v.id)
        });
        this.dataSource= arr.bill 
        this.list.riverId=arr.river.id
        this.list.streetId=arr.street.id
        this.list.tworiver=arr.tworiver
        this.list.code = arr.river.code
        this.list.controller = arr.river.controller
        this.list.supervisoryLevel = arr.river.supervisoryLevel.name
        if (arr.river.priority == true) {
          this.list.priority='重点'
        }else if(arr.river.priority == false){
          this.list.priority='非重点'
        }
        this.list.tworiver=arr.street.controller
        this.list.address=arr.address
        this.list.standardCode=arr.standardCode
        this.list.standardName=arr.standardName
        this.list.type=arr.type.code
        this.list.landmarkLocation=arr.landmarkLocation
        this.list.accurateLocation=arr.accurateLocation
        this.list.innerCode=arr.innerCode
        this.list.innerName=arr.innerName
        this.list.letway=arr.letway.code
        this.list.enterRiverWay=arr.enterRiverWay
        this.list.enterRiverSize=arr.enterRiverSize
        this.list.yearLetSize=arr.yearLetSize
        this.list.pollutant=arr.pollutant
        this.list.settingUnit=arr.settingUnit
        this.list.unitAddress=arr.unitAddress
        this.list.linkman=arr.linkman
        this.list.linktel=arr.linktel
        this.list.blockoffStatus=arr.blockoffStatus
        this.list.statement=arr.statement
        this.list.activateTime=arr.activateTime
        this.list.registrationState=arr.registrationState
        this.list.approveState=arr.approveState
        this.list.approveUnit=arr.approveUnit
        this.list.dischargeLicense=arr.dischargeLicense
        this.list.licenseNo=arr.licenseNo
        this.list.innerCode=arr.innerCode
        this.list.innerName=arr.innerName
        this.list.functionName=arr.functionName
      })
      
    },
    typeChange(value,option){
      if (this.list.riverId!='') {
        let data={
          riverId:this.list.riverId,
          type:value
        }
        dischargeInner(data).then(res=>{
          this.list.innerCode = res.data.innerCode
          this.list.innerName = res.data.innerName
        })
      }else{
        this.$message.warning('请先选择河道');
      }
    },
    riverChange(value,option){
      informationRiver(value).then(res=>{
        console.log(res.data);
         this.list.code = res.data.info.code
         this.list.controller = res.data.info.controller
         this.list.supervisoryLevel = res.data.info.supervisoryLevel.name
         if (res.data.info.priority == true) {
           this.list.priority='重点'
         }else if(res.data.info.priority == false){
           this.list.priority='非重点'
         }
      })
    },
    streetChange(value,option){
      informationStreet(value).then(res=>{
        this.list.tworiver = res.data.controller
      })
    },
    add(id,result) {
      this.headers.Authorization=Vue.ls.get(ACCESS_TOKEN)
      this.visible = true
      this.list.drawId =id
      this.upload.drawId =id
      this.list.address = result.formatted_address
      this.list.lat =  result.resultObj.location.lat
      this.list.lng =  result.resultObj.location.lon
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
      this.list.riverId=''
      this.list.streetId=''
      this.list.tworiver=''
      this.list.supervisoryLevel=''
      this.list.controller=''
      this.list.priority=''
      this.list.lat=''
      this.list.lng=''
      this.list.type=''
      this.list.landmarkLocation=''
      this.list.accurateLocation=''
      this.list.innerCode=''
      this.list.innerName=''
      this.list.drawId=''
      this.list.letway=''
      this.list.enterRiverWay=''
      this.list.enterRiverSize=''
      this.list.yearLetSize=''
      this.list.pollutant=''
      this.list.settingUnit=''
      this.list.unitAddress=''
      this.list.linkman=''
      this.list.linktel=''
      this.list.blockoffStatus=''
      this.list.statement=''
      this.list.activateTime=''
      this.list.registrationState=''
      this.list.approveState=''
      this.list.approveUnit=''
      this.list.dischargeLicense=''
      this.list.licenseNo=''
      this.list.innerCode=''
      this.list.innerName=''
      this.list.functionName=''
      this.upload.id = ''
      this.dataSourceId=[]
      this.dataSource= []
    },
    saveClick(){
      let data =this.list
      data.billId=this.dataSourceId.join(',')
      mapdrawDischargeSave(data).then(res=>{
        this.$message.success('保存成功')
        this.$parent.drawSaveRefresh()
        this.handleCancel()
      }).catch(err => {
          this.$message.error(err.response.data.message);
      })
    },
    handleSuccess(response, file, fileList){
     this.$message.success('上传成功');
     this.fileList=[]
     mediaList(this.list.drawId).then(res=>{
       console.log(res.data);
       this.attachmentJpg = res.data
     })
    },
    handleRemove(err) {
      console.log(err);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      
    },
    beforeRemove(file, fileList) {
      
    },
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
    addSheet(){
      this.sheet = true
    },
    addSelectSheet(){
      this.sheetId.forEach(v => {
        this.sheetList.forEach(a => {
          if (v == a.id) {
            if (this.dataSourceId.indexOf(a.id) == -1) {
              this.dataSource.push(a)
              this.dataSourceId.push(a.id)
            }else{
              this.$message.warning(a.name +'已存在');
            }
          }
        })
      })
      this.sheetId = []
      this.sheet = false
    },
    confirm(id){
      for (let i = 0; i < this.dataSourceId.length; i++) {
        if (this.dataSourceId[i] == id) {
          this.dataSourceId.splice(i,1)
        }
        
      }
      for (let i = 0; i < this.dataSource.length; i++) {
        if (this.dataSource[i].id == id) {
          this.dataSource.splice(i,1)
        }
        
      }
    },
    cancelDelete(){},
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
