<template>
  <a-modal
    title="任务完成情况"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleOk"
    :maskClosable="false"
  >
    <div class="sitution_info">
      <div class v-if="sitution == 'uav'">
        <a-row type="flex" align="middle">
          <a-col :span="8">任务名称:</a-col>
          <a-col :span="8">{{uavDetail.name}}</a-col>
        </a-row>
        <a-row type="flex" align="middle">
          <a-col :span="8">任务类型:</a-col>
          <a-col :span="8">{{uavDetail.template.name}}</a-col>
        </a-row>
        <a-row type="flex" align="middle">
          <a-col :span="8">任务状态:</a-col>
          <a-col :span="8">{{uavDetail.status.name}}</a-col>
        </a-row>
        <a-row type="flex" align="middle">
          <a-col :span="8">发布时间:</a-col>
          <a-col :span="8">{{uavDetail.timeCreated}}</a-col>
        </a-row>
        <a-row type="flex" align="middle">
          <a-col :span="8">无人机编号:</a-col>
          <a-col :span="8">{{uavDetail.uavDetail.uavCode}}</a-col>
        </a-row>
        <a-row type="flex" align="middle" v-for="(item,index) in uavDetail.uavDetail.batteryCode" :key="index">
          <a-col :span="6">无人机电池编号:</a-col>
          <a-col :span="2">{{item}}</a-col>
          <a-col :span="6" >电池剩余电量:</a-col>
          <a-col :span="2">{{uavDetail.uavDetail.batteryPower[index]}}</a-col>
        </a-row>
        <a-row type="flex" align="middle">
          <a-col :span="8">内存卡编号:</a-col>
          <a-col :span="8">{{uavDetail.uavDetail.storageCardCode}}</a-col>
        </a-row>
        <a-row type="flex" align="middle">
          <a-col :span="8">ipad编号:</a-col>
          <a-col :span="8">{{uavDetail.uavDetail.ipadCode}}</a-col>
        </a-row>
        <a-row type="flex" align="middle">
          <a-col :span="8">任务执行时间:</a-col>
          <a-col :span="8">{{uavDetail.uavDetail.beginTime}}</a-col>
        </a-row>
        <a-row type="flex" align="middle" v-if="uavDetail.uavDetail.endTime!=false">
          <a-col :span="8">任务结束时间:</a-col>
          <a-col :span="8">{{uavDetail.uavDetail.endTime}}</a-col>
        </a-row>
        <a-row type="flex" align="middle">
          <a-col :span="8">备注:</a-col>
          <a-col :span="8">{{uavDetail.uavDetail.remark}}</a-col>
        </a-row>
      </div>
      <div class v-if="sitution == 'manual'">
        <div class style="margin-bottom:15px;">
          <a-row type="flex" align="middle">
            <a-col :span="8">任务名称:</a-col>
            <a-col :span="8">{{manualDetail.name}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">任务类型:</a-col>
            <a-col :span="8">{{manualDetail.template.name}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">任务状态:</a-col>
            <a-col :span="8">{{manualDetail.status.name}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">发布时间:</a-col>
            <a-col :span="8">{{manualDetail.timeCreated}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">详细位置:</a-col>
            <a-col :span="8">{{manualDetail.latlng}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">坐标:</a-col>
            <a-col :span="8">{{manualDetail.manualDetail.coordinate[0]}} , {{manualDetail.manualDetail.coordinate[1]}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">任务执行时间:</a-col>
            <a-col :span="8">{{manualDetail.manualDetail.beginTime}}</a-col>
          </a-row>
          <a-row type="flex" align="middle" v-if="manualDetail.manualDetail.endTime!=false">
            <a-col :span="8">任务结束时间:</a-col>
            <a-col :span="8">{{manualDetail.manualDetail.endTime}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">河道水体水色:</a-col>
            <a-col :span="8">{{manualDetail.manualDetail.color.name}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">河道水体流动性:</a-col>
            <a-col :span="8">{{manualDetail.manualDetail.flow.name}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">河道气味:</a-col>
            <a-col :span="8">{{manualDetail.manualDetail.smell.name}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">河道水位:</a-col>
            <a-col :span="8">{{manualDetail.manualDetail.level.name}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">水面漂浮物情况:</a-col>
            <a-col :span="8">{{manualDetail.floater}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">河道内动植物:</a-col>
            <a-col :span="8">{{manualDetail.biont}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">人工治理措施:</a-col>
            <a-col :span="8">{{manualDetail.govern}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">风险源:</a-col>
            <a-col :span="8">{{manualDetail.riskSource}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">突发情况:</a-col>
            <a-col :span="8">{{manualDetail.emergency}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">备注:</a-col>
            <a-col :span="8">{{manualDetail.manualDetail.remark}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">照片:</a-col>
            <a-col :span="8">
              <viewer   :images="imgList" style="display:flex">
                <img  v-for="item of imgList"  :key="item" :src="item.media" style="margin:0 5px 5px 0;width:80px;height:80px"/>
              </viewer>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class v-if="sitution == 'water'">
        <div class style="margin-bottom:15px;">
          <a-row type="flex" align="middle">
            <a-col :span="8">任务名称:</a-col>
            <a-col :span="8">{{waterDetail.name}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">任务类型:</a-col>
            <a-col :span="8">{{waterDetail.template.name}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">任务状态:</a-col>
            <a-col :span="8">{{waterDetail.status.name}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">发布时间:</a-col>
            <a-col :span="8">{{waterDetail.timeCreated}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">任务执行时间:</a-col>
            <a-col :span="8">{{waterDetail.waterDetail.beginTime}}</a-col>
          </a-row>
          <a-row type="flex" align="middle" v-if="waterDetail.waterDetail.endTime!=false">
            <a-col :span="8">任务结束时间:</a-col>
            <a-col :span="8">{{waterDetail.waterDetail.endTime}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">水温℃:</a-col>
            <a-col :span="8">{{waterDetail.waterDetail.temperature}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">ph:</a-col>
            <a-col :span="8">{{waterDetail.waterDetail.ph}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">氧化还原电位 mV:</a-col>
            <a-col :span="8">{{waterDetail.waterDetail.redox}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">溶解氧 mg/L:</a-col>
            <a-col :span="8">{{waterDetail.waterDetail.cond}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">浊度 NTU:</a-col>
            <a-col :span="8">{{waterDetail.waterDetail.ntu}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">备注:</a-col>
            <a-col :span="8">{{waterDetail.waterDetail.remark}}</a-col>
          </a-row>
          <a-row type="flex" align="middle">
            <a-col :span="8">照片:</a-col>
            <a-col :span="8">
              <viewer   :images="imgList">
                <img  v-for="item of imgList"  :key="item" :src="item.media" style="margin:0 5px 5px 0;width:80px;height:80px"/>
              </viewer>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { inspectTaskDetail,resultMediaList } from '@/api/login'
import { number } from 'echarts/lib/export';
export default {
  name: 'situtionInfo',
  data() {
    return {
      visible: false,
      sitution: '',
      uavDetail: {},
      manualDetail: {},
      waterDetail: {},
      imgList:[],
    }
  },
  methods: { 
    show(id) {
        inspectTaskDetail(id).then(res => {
        var arr = res.data
        this.sitution = arr.template.code
        function formatDate(now) {
          var year = now.getFullYear() //取得4位数的年份
          var month = now.getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
          var date = now.getDate() //返回日期月份中的天数（1到31）
          var hour = now.getHours() //返回日期中的小时数（0到23）
          var minute = now.getMinutes() //返回日期中的分钟数（0到59）
          var second = now.getSeconds() //返回日期中的秒数（0到59）
          if (Number(hour) <10) {
            hour = '0'+hour
          }
           if (Number(minute) <10) {
            minute = '0'+minute
          }
           if (Number(second) <10) {
            second = '0'+second
          }
          return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
        }
        resultMediaList(arr.id).then(res=>{
            this.imgList = res.data
            
        })
        if (arr.template.code == 'uav') {
          arr.timeCreated = formatDate(new Date(arr.timeCreated))
          arr.uavDetail.beginTime = formatDate(new Date(arr.uavDetail.beginTime))
          if (arr.uavDetail.endTime!=null) {
            arr.uavDetail.endTime = formatDate(new Date(arr.uavDetail.endTime))
          }else{
            arr.uavDetail.endTime=false
          }
          
          this.uavDetail = arr
        }
        if (arr.template.code == 'manual') {
          arr.timeCreated = formatDate(new Date(arr.timeCreated))
          arr.manualDetail.beginTime = formatDate(new Date(arr.manualDetail.beginTime))
          if (arr.manualDetail.endTime!=null) {
            arr.manualDetail.endTime = formatDate(new Date(arr.manualDetail.endTime))
          }else{
            arr.manualDetail.endTime=false
          }
          if (arr.manualDetail.beginTime == 'NaN-NaN-NaN NaN:NaN:NaN') {
            arr.manualDetail.beginTime = ''
          }
          let geocode = new T.Geocoder()
          arr.latlng=''
          geocode.getLocation(new T.LngLat(arr.manualDetail.coordinate[0] , arr.manualDetail.coordinate[1]), aaa => {
            arr.latlng = aaa.formatted_address
          })
          arr.floater =''
          if (arr.manualDetail.floater!=null) {
            if (arr.manualDetail.floater.length>0) {
              for (let i = 0; i <  arr.manualDetail.floater.length; i++) {
                if (i == arr.manualDetail.floater.length - 1) {
                  arr.floater=arr.floater+arr.manualDetail.floater[i].name
                }else{
                  arr.floater=arr.floater+arr.manualDetail.floater[i].name+','
                }
              }
              // arr.manualDetail.floater.forEach(v => {
              //   arr.floater=arr.floater+v.name+','
              // });
            } 
          }
          
          arr.biont =''
          if (arr.manualDetail.biont!=null) {
            if (arr.manualDetail.biont.length>0) {
              for (let i = 0; i <  arr.manualDetail.biont.length; i++) {
                if (i == arr.manualDetail.biont.length - 1) {
                  arr.biont=arr.biont+arr.manualDetail.biont[i].name
                }else{
                  arr.biont=arr.biont+arr.manualDetail.biont[i].name+','
                }
              }
              // arr.manualDetail.biont.forEach(v => {
              //   arr.biont=arr.biont+v.name+','
              // });
            }
          }
          arr.govern =''
          
           if (arr.manualDetail.govern!=null) {
            if (arr.manualDetail.govern.length>0) {
              for (let i = 0; i <  arr.manualDetail.govern.length; i++) {
                if (i == arr.manualDetail.govern.length - 1) {
                  arr.govern=arr.govern+arr.manualDetail.govern[i].name
                }else{
                  arr.govern=arr.govern+arr.manualDetail.govern[i].name+','
                }
              }
              // arr.manualDetail.govern.forEach(v => {
              //   arr.govern=arr.govern+v.name+','
              // });
            }
          }
          arr.riskSource =''
         
           if (arr.manualDetail.riskSource!=null) {
             if (arr.manualDetail.riskSource.length>0) {
              for (let i = 0; i <  arr.manualDetail.riskSource.length; i++) {
                if (i == arr.manualDetail.riskSource.length - 1) {
                  arr.riskSource=arr.riskSource+arr.manualDetail.riskSource[i].name
                }else{
                  arr.riskSource=arr.riskSource+arr.manualDetail.riskSource[i].name+','
                }
              }
              // arr.manualDetail.riskSource.forEach(v => {
              //   arr.riskSource=arr.riskSource+v.name+','
              // });
            }
          }
          arr.emergency =''
           if (arr.manualDetail.emergency!=null) {
            if (arr.manualDetail.emergency.length>0) {
              for (let i = 0; i <  arr.manualDetail.emergency.length; i++) {
                if (i == arr.manualDetail.emergency.length - 1) {
                  arr.emergency=arr.emergency+arr.manualDetail.emergency[i].name
                }else{
                  arr.emergency=arr.emergency+arr.manualDetail.emergency[i].name+','
                }
              }
              // arr.manualDetail.emergency.forEach(v => {
              //   arr.emergency=arr.emergency+v.name+','
              // });
            } 
          }
          this.manualDetail = arr
          console.log( this.manualDetail);
        }
        if (arr.template.code == 'water') {
          arr.timeCreated = formatDate(new Date(arr.timeCreated))
          arr.waterDetail.beginTime = formatDate(new Date(arr.waterDetail.beginTime))
          
          if (arr.waterDetail.endTime !=null) {
           arr.waterDetail.endTime = formatDate(new Date(arr.waterDetail.endTime))
          }else{
            arr.waterDetail.endTime =false
          }
          if (arr.waterDetail.beginTime == 'NaN-NaN-NaN NaN:NaN:NaN') {
            arr.waterDetail.beginTime = ''
          }
          this.waterDetail = arr
        }
        
      })
      this.visible = true
     
    },
    handleOk() {
      this.imgList = []
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.sitution_info p {
  margin-bottom: 5px;
  font-size: 15p;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}
</style>
