<template>
  <a-modal
    title="风险源"
    :width="980"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="saveClick"
    @cancel="handleCancel"
    :forceRender="true"
  >
    <a-spin :spinning="confirmLoading">
      <a-form class="from" :form="form">
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
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道序号">
              <a-input placeholder v-model="list.code" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道管理等级">
              <a-input placeholder v-model="list.supervisoryLevel" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道等级">
              <a-input placeholder v-model="list.priority" disabled/>
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
              <a-input placeholder v-model="list.controller" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="二级河长">
              <a-input placeholder  v-model="list.tworiver" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="地标位置">
              <a-input placeholder v-model="list.landmarkLocation"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="地址">
              <a-input placeholder v-model="list.address" disabled/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="准确位置">
              <a-input placeholder  v-model="list.accurateLocation"/>
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
        <h3 style="margin-top: 10px;">属性</h3>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="类别">
              <a-select  :allowClear="true" placeholder="选择风险源类别"  @change="typeChange" v-model="list.typeId">
                <a-select-option :value="item.id" v-for="item in typeList" :key="item.id">{{item.name}}</a-select-option>
                <!-- <a-select-option value="surface_ratio">水面率</a-select-option>
                <a-select-option value="bank_risk">河岸风险</a-select-option>
                <a-select-option value="surface_flotage">水面漂浮物</a-select-option>
                <a-select-option value="bottom_sediment">底泥</a-select-option> -->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="面积">
              <a-input placeholder v-model="list.currentArea" disabled/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="说明">
              <a-input placeholder v-model="list.statement"/>
            </a-form-item>
          </a-col>
        </a-row>
        <h3 style="margin-top: 10px;">状态</h3>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="首次发现">
              <a-date-picker style="width:100%"  :format="dateFormat" @change="onChange"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="风险等级" >
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
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="管理建议" >
              <a-input placeholder v-model="list.advice"/>
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
                :limit='1'>
                <a-button type="primary" icon="plus" >上传</a-button>
              </el-upload>
              <viewer >
                <img  :src="attachmentJpg" alt="" style="height:70px;">
              </viewer >
            </a-form-item>
          </a-col>
        </a-row>
        <h3 style="margin-top: 10px;">
          督办单
          <a-button size="small" style="margin-left:10px;">添加</a-button>
        </h3>
        <a-table bordered size='small' :dataSource="dataSource" :columns="columns">
          <template slot="name" slot-scope="text, record">
            <editable-cell :text="text" @change="onCellChange(record.key, 'name', $event)" />
          </template>
          <template slot="operation" slot-scope="text, record">
            <a-popconfirm
              v-if="dataSource.length"
              title="确定删除吗?"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
      </a-form>
      <a-divider orientation="left"></a-divider>
      <!-- <a-row style="width:100%; margin-top:10px;" type="flex" justify="space-around">
        <a-button-group>
            <a-button>取消</a-button>
            <a-button>保存</a-button>
            <a-button>修改河道区域</a-button>
            <a-button>关闭河道</a-button>
        </a-button-group>
        <a-col :span="3">
          <a-button block @click="">取消</a-button>
        </a-col>
        <a-col :span="3">
          <a-button block @click="">保存</a-button>
        </a-col>
      </a-row> -->
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters']
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { mapdrawDetail,getRiverList,getStreetList,informationStreet,informationRiver,riskInner,mapdrawRiskSave,paramList} from '@/api/login'
export default {
  data() {
    return {
      fileList:[],
      file:false,
      attachmentJpg:'',
      startDate:'',
      dateFormat: 'YYYY-MM-DD',
      upload:{
        title:'1',
        drawId:'',
        id:'',
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
        typeId:'',
        landmarkLocation:'',
        accurateLocation:'',
        level:'',
        innerCode:'',
        innerName:'',
        currentArea:'',
        discoveryTime:'',
        advice:'',
        statement:'',
        drawId:'',
      },
      typeList:[],
      headers: {
        Authorization: '',
        'X-TENANT-ID': 'jl:jlgis@2019' 
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
      riverList:[],//河道列表
      streetList:[],//街道列表
      form: this.$form.createForm(this),

      dataSource: [{
        key: '0',
        insideNum: '黄浦江',
        officialNum: "HPJ1213",
        date: '2019-12-13',
      }, {
        key: '1',
        insideNum: '长江',
        officialNum: "CJ1212",
        date: '2019-12-12',
      }],
      count: 2,
      columns: [{
        title: '序号',
        dataIndex: 'key',
        width: '10%',
        scopedSlots: { customRender: 'key' },
      }, {
        title: '内部编号',
        dataIndex: 'insideNum',
      }, {
        title: '官方编号',
        dataIndex: 'officialNum',
      }, {
        title: '调查日期',
        dataIndex: 'date',
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
      getRiverList(this.$store.state.id).then(res=>{
        this.riverList = res.data.data
      })
      getStreetList(this.$store.state.id).then(res=>{
        this.streetList = res.data.data
      })
      let data = {
        type:'risk_source_type'
      }
      paramList(data).then(res=>{
        console.log(res.data.data);
        
        this.typeList = res.data
      })
    },
    typeChange(value,option){
      if (this.list.riverId!='') {
        let data={
          riverId:this.list.riverId,
          typeId:value
        }
        riskInner(data).then(res=>{
          this.list.innerCode = res.data.innerCode
          this.list.innerName = res.data.innerName
        })
      }else{
        this.$message.warning('请先选择河道');
      }
    },
    riverChange(value,option){
      informationRiver(value).then(res=>{
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
    saveClick(){
      let data ={
        drawId:this.list.drawId,
        standardCode:this.list.standardCode,
        standardName:this.list.standardName,
        landmarkLocation:this.list.landmarkLocation,
        accurateLocation:this.list.accurateLocation,
        riverId:this.list.riverId,
        streetId:this.list.streetId,
        typeId:this.list.typeId,
        level:this.list.level,
        statement:this.list.statement,
        discoveryTime:this.list.discoveryTime,
        advice:this.list.advice,
        innerCode:this.list.innerCode,
        innerName:this.list.innerName,
      }
      mapdrawRiskSave(data).then(res=>{
        this.$message.success('保存成功')
        this.$parent.getMapdrawPage('1')
        this.handleCancel()
      }).catch(err => {
          this.$message.error(err.response.data.message);
      })
    },
    onCellChange (key, dataIndex, value) {
        const dataSource = [...this.dataSource]
        const target = dataSource.find(item => item.key === key)
        if (target) {
          target[dataIndex] = value
          this.dataSource = dataSource
        }
    },
    add(id,currentArea,result) {
      this.headers.Authorization=Vue.ls.get(ACCESS_TOKEN)
      this.list.drawId =id
      this.upload.drawId =id
      this.list.address = result.formatted_address
      this.list.lat =  result.resultObj.location.lat
      this.list.lng =  result.resultObj.location.lon
      this.list.currentArea = currentArea
      this.getList()
      // mapdrawDetail(id).then(res=>{
      //   console.log(res);
        
      // })
      this.visible = true
    },
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
      this.list.level=''
      this.list.innerCode=''
      this.list.innerName=''
      this.list.currentArea=''
      this.list.discoveryTime=''
      this.list.advice=''
      this.list.statement=''
      this.list.drawId=''
      this.upload.id = ''
      this.attachmentJpg=''
      this.visible = false
    },
    onChange(date, dateString) {
      this.list.discoveryTime = dateString
    },
    handleSuccess(response, file, fileList){
     this.attachmentJpg = response.data.media
     this.$message.success('上传成功');
     this.upload.id= response.data.id
     this.fileList=[]
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

