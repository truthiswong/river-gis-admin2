<template>
  <a-modal
    :title="'水体名称:'+name"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :forceRender="true"
    :width="1000"
    :centered="true"
    :maskClosable="false"
  >
    <el-form :inline="true"  class="demo-form-inline">
      <el-form-item label="断面编号:">
        <div>{{list.number}}</div>
      </el-form-item>
      <el-form-item label="断面名称:">
        <div>{{list.waterName}}</div>
      </el-form-item>
      <el-form-item label="经度:">
        <div>{{list.lat}}</div>
      </el-form-item>
      <el-form-item label="纬度:">
        <div>{{list.lng}}</div>
      </el-form-item>
      <el-form-item label="查看时间">
        <a-range-picker
          :defaultValue="[moment(startDate, dateFormat), moment(endDate, dateFormat)]"
          :format="dateFormat"
          @change="onChange"
        />
      </el-form-item>
      <el-form-item label="">
        <el-upload
          class="upload-demo"
          action="/server/data/admin/regulator/water/save"
          multiple
          name='file'
          :headers="headers"
          :on-success="onSuccess"
          :on-error="onError"
          :data="uploadData"
          :limit="1"
          :file-list="fileList">
           <a-button v-show="jurisdiction">导入最新水质数据</a-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div style="display:flex;height:400px">
      <div class="leftList">
        <a-checkbox-group style="display:flex; flex-direction: column;" v-model="checkbox" @change="changeCheckbox">
          <a-checkbox value="6" style="margin:0 0 7px 0" v-show="checkbox1">PH值</a-checkbox>
          <a-checkbox value="2" style="margin:0 0 7px 0" v-show="checkbox2">溶解氧</a-checkbox>
          <a-checkbox value="3" style="margin:0 0 7px 0" v-show="checkbox3">高锰酸盐指数</a-checkbox>
          <a-checkbox value="4" style="margin:0 0 7px 0" v-show="checkbox4">氨氮</a-checkbox>
          <a-checkbox value="5" style="margin:0 0 7px 0" v-show="checkbox5">总磷</a-checkbox>
          <!-- <a-checkbox value="6" style="margin:0 0 7px 0">透明度</a-checkbox>
          <a-checkbox value="7" style="margin:0 0 7px 0">氧化还原电位</a-checkbox>
          <a-checkbox value="8" style="margin:0 0 7px 0">化学需氧量</a-checkbox>
          <a-checkbox value="9" style="margin:0 0 7px 0">硝酸盐氮</a-checkbox>
          <a-checkbox value="10" style="margin:0 0 7px 0">亚硝酸盐氮</a-checkbox>
          <a-checkbox value="11" style="margin:0 0 7px 0">浊度</a-checkbox>
          <a-checkbox value="12" style="margin:0 0 7px 0">盐度</a-checkbox>
          <a-checkbox value="13" style="margin:0 0 7px 0">水温</a-checkbox>
          <a-checkbox value="14" style="margin:0 0 7px 0">流速</a-checkbox> -->
        </a-checkbox-group>
      </div>
      <div class="rightList">
        <div id="main6" v-show="main6" style="width:600px;height:350px"></div>
        <div id="main2" v-show="main2" style="width:600px;height:350px"></div>
        <div id="main3" v-show="main3" style="width:600px;height:350px"></div>
        <div id="main4" v-show="main4" style="width:600px;height:350px"></div>
        <div id="main5" v-show="main5" style="width:600px;height:350px"></div>
        <!-- <div id="main6" v-show="main6" style="width:600px;height:350px"></div>
        <div id="main7" v-show="main7" style="width:600px;height:350px"></div>
        <div id="main8" v-show="main8" style="width:600px;height:350px"></div>
        <div id="main9" v-show="main9" style="width:600px;height:350px"></div>
        <div id="main10" v-show="main10" style="width:600px;height:350px"></div>
        <div id="main11" v-show="main11" style="width:600px;height:350px"></div>
        <div id="main12" v-show="main12" style="width:600px;height:350px"></div>
        <div id="main13" v-show="main13" style="width:600px;height:350px"></div>
        <div id="main14" v-show="main14" style="width:600px;height:350px"></div> -->
      </div>
    </div>
  </a-modal>
</template>

<script>
import Vue from 'vue'
// token
import { ACCESS_TOKEN } from '@/store/mutation-types'
import moment from 'moment';
import {getWaterQualityList} from '@/api/login'
// 基于准备好的dom，初始化echarts实例
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/line');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/dataZoom');
require('echarts/lib/component/title');
require('echarts/lib/component/markLine');
export default {
  name:'waterQualityData',
  components: {
  },
  data() {
    return {
      jurisdiction:this.$store.state.operationPermission[1],//权限
      uploadData:{
        projectId:this.$store.state.id
      },
      headers: {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
        'X-TENANT-ID': 'jl:jlgis@2019'
      },
      fileList:[],
      startDate:'',
      dateFormat: 'YYYY-MM-DD',
      list:{
        number:'',
        lat:'21',
        lng:'11.11',
        waterName:'',
        date:[],
      },
      checkbox1:true,
      checkbox2:true,
      checkbox3:true,
      checkbox4:true,
      checkbox5:true,
      listMain:[],
      main1:false,
      main2:false,
      main3:false,
      main4:false,
      main5:false,
      main6:false,
      main7:false,
      main8:false,
      main9:false,
      main10:false,
      main11:false,
      main12:false,
      main13:false,
      main14:false,
      checkbox:[],
      time:[],
      name:'黄浦江',
      visible: false,
      confirmLoading: false,
      startDate:'',
      endDate:'',
    }
  },
  computed: {},
  mounted() {

  },
  methods: {
    moment,
    add(item) {
     //开始时间
      let d = new Date()
      d.setMonth(d.getMonth() - 3)
      let a = (d.toLocaleDateString()).split('/')
      this.startDate = a[0]+'-'+a[1]+'-'+a[2]
       //结束时间
      let c = new Date()
      let b = (c.toLocaleDateString()).split('/')
      this.endDate = b[0]+'-'+b[1]+'-'+b[2]
      this.name = item.target.options.item.waterName
      this.list.waterName = item.target.options.item.name
      this.list.number = item.target.options.item.code
      this.list.lat = item.target.options.item.coordinate.lat
      this.list.lng = item.target.options.item.coordinate.lng
      this.getList()
      this.visible = true
    },
    handleSubmit() {
      this.visible = false
    },
    handleCancel() {
      this.visible = false
    },
    onChange(date, dateString) {
      this.startDate = dateString[0]
      this.endDate = dateString[1]
      this.time = this.getAll(dateString[0],dateString[1]) 
      this.getList()
    },
    getList(){
      let data = {
        projectId:this.$store.state.id,
        // coordinate:this.list.lng+','+this.list.lat,
        sectionCode:this.list.number,
        startDate:this.startDate,
        endDate:this.endDate
      }
      getWaterQualityList(data).then(res=>{
        let arr = res.data.data
        this.checkbox=[]
        if (arr.length==0) {
          this.checkbox1 =false
          this.checkbox2 =false
          this.checkbox3 =false
          this.checkbox4 =false
          this.checkbox5 =false
          this.main2=false
          this.main3=false
          this.main4=false
          this.main5=false
          this.main6=false
        }else{
          this.checkbox1 =false
          this.checkbox2 =false
          this.checkbox3 =false
          this.checkbox4 =false
          this.checkbox5 =false
         for(const v of arr ){
             if (v.ph!=0){
               this.checkbox1 =true
               this.checkbox.push('6')
               break
             }
          }
         for(const v of arr ){
             if (v.do!=0){
               this.checkbox2 =true
               this.checkbox.push('2')
               break
             }
          }
         for(const v of arr ){
             if (v.cod!=0){
               this.checkbox3 =true
               this.checkbox.push('3')
               break
             }
          }
         for(const v of arr ){
            if (v.nh3N!=0){
              this.checkbox4 =true
              this.checkbox.push('4')
              break
            }
          }
         for(const v of arr ){
             if (v.tp!=0){
               this.checkbox5 =true
               this.checkbox.push('5')
               break
             }
          }
        }
        this.listMain = arr
        this.changeCheckbox()
      })
    },
    changeCheckbox(){
      if (this.startDate != '') {
        this.drawLine()
      }else{
        this.$message.warning('请先选择时间');
      }
     
    },
    drawLine(){
      this.main6=false
      this.main2=false
      this.main3=false
      this.main4=false
      this.main5=false
      // this.main6=false
      // this.main7=false
      // this.main8=false
      // this.main9=false
      // this.main10=false
      // this.main11=false
      // this.main12=false
      // this.main13=false
      // this.main14=false
      for(const item of this.checkbox){
        var myChart = echarts.init(document.getElementById('main'+item));
        var text = ''
        var mark = undefined
        var mark1 = undefined
        var date= []
        var xis=[]
        var yis={}
         if(item == '2'){
          text = '溶解氧'
          this.listMain.forEach(v => {
            date.push(v.date)
            xis.push(v.do)
          });
          this.main2=true
          mark = {
            symbol: ['none', 'none'],//去掉箭头
            itemStyle: {
                normal: { 
                  lineStyle: { color:'#FE7575'}
                }
            },
            data: [
              {
                name: 'max',
                yAxis: 7.5,
                // valueDim: 'close'
              },
              {
                  name: '最小值',
                  yAxis: 2,
                  // valueDim: 'close'
              },
            ]
          }
          mark1 = {
            symbol: ['none', 'none'],//去掉箭头
            itemStyle: {
                normal: { 
                  lineStyle: { color:'#707070'}
                }
            },
            data: [
              // {
              //   name: 'max',
              //   yAxis: 2,
              //   // valueDim: 'close'
              // },
              {
                  name: '最小值',
                  yAxis: 0.2,
                  // valueDim: 'close'
              },
            ]
          }
        }else if (item == '6') {
          text = 'PH值'
          this.listMain.forEach(v => {
            date.push(v.date)
            xis.push(v.ph)
          });
          this.main6=true
          mark = {
            symbol: ['none', 'none'],//去掉箭头
            itemStyle: {
                normal: { 
                  lineStyle: { color:'#FE7575'}
                }
            },
            data: [
              {
                name: 'max',
                yAxis: 9,
                // valueDim: 'close'
              },
              {
                  name: 'min',
                  yAxis: 6,
                  // valueDim: 'close'
              },
            ]
          }
        } else if(item == '3'){
          text = '高锰酸盐指数'
          this.listMain.forEach(v => {
            date.push(v.date)
            xis.push(v.cod)
          });
          this.main3=true
           mark = {
            symbol: ['none', 'none'],//去掉箭头
            itemStyle: {
                normal: { 
                  lineStyle: { color:'#FE7575'}
                }
            },
            data: [
              {
                name: 'max',
                yAxis: 15,
                // valueDim: 'close'
              },
              {
                  name: 'min',
                  yAxis: 2,
                  // valueDim: 'close'
              },
            ]
          }
        }else if(item == '4'){
          text = '氨氮'
          this.listMain.forEach(v => {
            date.push(v.date)
            xis.push(v.nh3N)
          });
          this.main4=true
           mark = {
            symbol: ['none', 'none'],//去掉箭头
            itemStyle: {
                normal: { 
                  lineStyle: { color:'#FE7575'}
                }
            },
            data: [
              {
                name: 'max',
                yAxis: 2,
                // valueDim: 'close'
              },
              {
                  name: 'min',
                  yAxis: 0.15,
                  // valueDim: 'close'
              },
            ]
          }
          mark1 = {
            symbol: ['none', 'none'],//去掉箭头
            itemStyle: {
                normal: { 
                  lineStyle: { color:'#707070'}
                }
            },
            data: [
              {
                name: 'max',
                yAxis: 15,
                // valueDim: 'close'
              },
              {
                  name: 'min',
                  yAxis: 8,
                  // valueDim: 'close'
              },
            ]
          }
        }else if(item == '5'){
          text = '总磷'
          this.listMain.forEach(v => {
            date.push(v.date)
            xis.push(v.tp)
          });
          this.main5=true
          mark = {
            symbol: ['none', 'none'],//去掉箭头
            itemStyle: {
                normal: { 
                  lineStyle: { color:'#FE7575'}
                }
            },
            data: [
              {
                name: 'max',
                yAxis: 0.4,
                // valueDim: 'close'
              },
              {
                  name: 'min',
                  yAxis: 0.02,
                  // valueDim: 'close'
              },
            ]
          }
        }
        // else if(item == '6'){
        //   text = '透明度'
        //   this.main6=true
        // }else if(item == '7'){
        //   text = '氧化还原电位'
        //   this.main7=true
        // }else if(item == '8'){
        //   text = '化学需氧量'
        //   this.main8=true
        // }else if(item == '9'){
        //   text = '硝酸盐氮'
        //   this.main9=true
        // }else if(item == '10'){
        //   text = '亚硝酸盐氮'
        //   this.main10=true
        // }else if(item == '11'){
        //   text = '浊度'
        //   this.main11=true
        // }else if(item == '12'){
        //   text = '盐度'
        //   this.main12=true
        // }else if(item == '13'){
        //   text = '水温'
        //   this.main13=true
        // }else if(item == '14'){
        //   text = '流速'
        //   this.main14=true
        // }
        // 绘制图表
        if (item=='6') {
        } else {
          yis= {
            nameLocation :'center',
            nameTextStyle:{
              lineHeight: 56,
              fontSize:15
            },
            type: 'value',
            name : 'mg/L',
          }
        }
        myChart.setOption({
          title: {
            text: text
          },
          tooltip: {},
          xAxis: {
             data: date
          },
          yAxis:yis,
          series: [{
            name: text,
            type: 'line',
            data:xis,
            itemStyle:{ 
              normal:{ 
                color:'blue', //折点颜色
                lineStyle:{ 
                    color:'blue' //折线颜色
                } 
              } 
            },
          },
          {
            name: '水质评价',
            type: 'line',
            markLine: mark
          },
          {
            name: '黑臭评价',
            type: 'line',
            markLine: mark1
          },
          ],
          dataZoom: [
            {
                type: 'slider',
                yAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                type: 'inside',
                yAxisIndex: 0,
                filterMode: 'empty'
            }
        ],
        });
      }
     
    },
    getAll(begin, end) {
      let arr1= begin.split("-");
      let arr2= end.split("-");
      let arr1_= new Date();
      let arrTime = [];
      arr1_.setUTCFullYear(arr1[0], arr1[1] - 1, arr1[2]);
      let arr2_= new Date();
      arr2_.setUTCFullYear(arr2[0], arr2[1] - 1, arr2[2]);
      let unixDb = arr1_.getTime();
      let unixDe = arr2_.getTime();
      for (let k = unixDb; k <= unixDe;) {
        arrTime.push(this.datetimeparse(k, 'MM-DD'));
        k = k + 24 * 60 * 60 * 1000;
      }
      return arrTime;
    },
    onSuccess(response, file, fileList){
      this.$message.success('导入成功,'+response.data);
      this.getList()
      this.fileList =[]
    },
    onError(err, file, fileList){
      this.$message.error('导入失败,数据相同');
    },
    // 时间格式处理
    datetimeparse (timestamp, format, prefix) {
      if (typeof timestamp =='string'){
        timestamp=Number(timestamp)
      };
      //转换时区
      let currentZoneTime = new Date (timestamp);
      let currentTimestamp = currentZoneTime.getTime ();
      let offsetZone = currentZoneTime.getTimezoneOffset () / 60;//如果offsetZone>0是西区，西区晚
      let offset = null;
      //客户端时间与服务器时间保持一致，固定北京时间东八区。
      offset = offsetZone + 8;
      currentTimestamp = currentTimestamp + offset * 3600 * 1000
 
      let newtimestamp = null;
      if (currentTimestamp) {
          if (currentTimestamp.toString ().length === 13) {
              newtimestamp = currentTimestamp.toString ()
          } else if (currentTimestamp.toString ().length === 10) {
              newtimestamp = currentTimestamp + '000'
          } else {
              newtimestamp = null
          }
      } else {
          newtimestamp = null
      }
      ;
      let dateobj = newtimestamp ? new Date (parseInt (newtimestamp)) : new Date ()
      let YYYY = dateobj.getFullYear ()
      let MM = dateobj.getMonth () > 8 ? dateobj.getMonth () + 1 : '0' + (dateobj.getMonth () + 1)
      let DD = dateobj.getDate () > 9 ? dateobj.getDate () : '0' + dateobj.getDate ()
      let HH = dateobj.getHours () > 9 ? dateobj.getHours () : '0' + dateobj.getHours ()
      let mm = dateobj.getMinutes () > 9 ? dateobj.getMinutes () : '0' + dateobj.getMinutes ()
      let ss = dateobj.getSeconds () > 9 ? dateobj.getSeconds () : '0' + dateobj.getSeconds ()
      let output = '';
      let separator = '/'
      if (format) {
          separator = format.match (/-/) ? '-' : '/'
          output += format.match (/yy/i) ? YYYY : ''
          output += format.match (/MM/) ? (output.length ? separator : '') + MM : ''
          output += format.match (/dd/i) ? (output.length ? separator : '') + DD : ''
          output += format.match (/hh/i) ? (output.length ? ' ' : '') + HH : ''
          output += format.match (/mm/) ? (output.length ? ':' : '') + mm : ''
          output += format.match (/ss/i) ? (output.length ? ':' : '') + ss : ''
      } else {
          output += YYYY + separator + MM + separator + DD
      }
      output = prefix ? (prefix + output) : output
 
      return newtimestamp ? output : ''
    },
  }
}
</script>
<style lang="less" scoped>
.leftList{
  width:150px;
  height: 100%;
  border-right: 1px solid #c0bebea4;
  padding: 5px 10px 
}
.rightList{
  width:800px;
  padding:5px 15px;
  height: 100%;
  overflow-y: scroll;

}
</style>
