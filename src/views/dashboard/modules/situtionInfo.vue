<template>
  <a-modal
    title="任务完成情况"
    :visible="visible"
    :width="600"
    @ok="handleOk"
    @cancel="handleOk"
    :maskClosable="false"
  >
    <div class="sitution_info">
      <div class v-if="sitution == 'uav'">
        <div class="title">任务信息</div>
        <div class="list">
          <div class="list_title" style="width: 112px;">任务名称：</div>
          <div class="list_content" style="width: 362px;">{{uavDetail.name}}</div>
          <div class="list_btn" style="margin-left: 20px;">{{uavDetail.status.name}}</div>
        </div>
        <div class="list">
          <div class="list_title" style="width: 112px;">任务类型：</div>
          <div class="list_content">{{uavDetail.template.name}}</div>
        </div>
        <div class="list">
          <div class="list_title" style="width: 112px;">发布时间：</div>
          <div class="list_content">{{uavDetail.timeCreated}}</div>
        </div>
        <div class="title" style="margin-top:20px" >设备信息</div>
        <div class="list" style="width:270px">
          <div class="list_title" style="width: 112px;">无人机编号：</div>
          <div class="list_content">{{uavDetail.uavDetail.uavCode}}</div>
        </div>
        <div class="list" v-for="(item,index) in uavDetail.uavDetail.batteryCode" :key="index">
          <span style="width:270px;display:flex">
            <p class="list_title" style="width: 112px;">无人机电池编号：</p>
            <span class="list_content">{{item}}</span>
          </span>
          <span style="width:270px;display:flex">
            <p class="list_title" style="width: 112px;">电池剩余电量：</p>
            <span class="list_content">{{uavDetail.uavDetail.batteryPower[index]}}</span>
          </span>
        </div>
        <div class="list">
          <span style="width:270px;display:flex">
            <p class="list_title" style="width: 112px;">内存卡编号：</p>
            <span class="list_content">{{uavDetail.uavDetail.storageCardCode}}</span>
          </span>
          <span style="width:270px;display:flex;display:flex">
            <p class="list_title" style="width: 112px;">ipad编号：</p>
            <span class="list_content">{{uavDetail.uavDetail.ipadCode}}</span>
          </span>
        </div>
        <div class="list">
          <span style="width:270px;display:flex">
            <p class="list_title" style="width: 112px;">任务开始时间：</p>
            <span class="list_content">{{uavDetail.uavDetail.beginTime}}</span>
          </span>
          <span style="width:270px;display:flex">
            <p class="list_title" v-if="uavDetail.uavDetail.endTime!=false" style="width: 112px;">任务结束时间：</p>
            <span class="list_content" v-if="uavDetail.uavDetail.endTime!=false">{{uavDetail.uavDetail.endTime}}</span>
          </span>
        </div>
        <div class="list">
          <div class="list_title" style="width: 112px;">备注：</div>
          <div class="list_content" style="width:430px">{{uavDetail.uavDetail.remark}}</div>
        </div>
        <!-- <a-row type="flex" align="middle">
          <a-col :span="8">内存卡编号:</a-col>
          <a-col :span="8">{{uavDetail.uavDetail.storageCardCode}}</a-col>
        </a-row>
        <a-row type="flex" align="middle">
          <a-col :span="8">ipad编号:</a-col>
          <a-col :span="8">{{uavDetail.uavDetail.ipadCode}}</a-col>
        </a-row>
        <a-row type="flex" align="middle">
          <a-col :span="8">任务开始时间:</a-col>
          <a-col :span="8">{{uavDetail.uavDetail.beginTime}}</a-col>
        </a-row>
        <a-row type="flex" align="middle" v-if="uavDetail.uavDetail.endTime!=false">
          <a-col :span="8">任务结束时间:</a-col>
          <a-col :span="8">{{uavDetail.uavDetail.endTime}}</a-col>
        </a-row>
        <a-row type="flex" align="middle">
          <a-col :span="8">备注:</a-col>
          <a-col :span="8">{{uavDetail.uavDetail.remark}}</a-col>
        </a-row> -->
      </div>
      <div class v-if="sitution == 'manual'">
        <div class="title">任务信息</div>
        <div class="list">
          <div class="list_title" style="width: 112px;">任务名称：</div>
          <div class="list_content" style="width: 362pxpx;">{{manualDetail.name}}</div>
          <div class="list_btn" style="margin-left:20px">{{manualDetail.status.name}}</div>
        </div>
        <div class="list">
          <div class="list_title" style="width: 112px;">任务类型：</div>
          <div class="list_content">{{manualDetail.template.name}}</div>
        </div>
        <div class="list">
          <div class="list_title" style="width: 112px;">发布时间：</div>
          <div class="list_content">{{manualDetail.timeCreated}}</div>
        </div>
        <div class="list">
          <div class="list_title" style="width: 112px;">详细位置：</div>
          <div class="list_content">{{manualDetail.latlng}}</div>
        </div>
        <div class="list">
          <div class="list_title" style="width: 112px;">坐标：</div>
          <div class="list_content">{{manualDetail.manualDetail.coordinate[0]}} , {{manualDetail.manualDetail.coordinate[1]}}</div>
        </div>
        <div class="title" style="margin-top:20px">反馈信息</div>
        <div class="list">
          <span style="width:270px;display:flex">
            <div class="list_title" style="width: 112px;">河道水体水色：</div>
            <div class="list_content" style="width: 155px;">{{manualDetail.manualDetail.color.name}}</div>
          </span>
          <span style="width:270px;display:flex">
            <div class="list_title left1" style="width: 112px;">河道水体流动性：</div>
            <div class="list_content left2">{{manualDetail.manualDetail.flow.name}}</div>
          </span>
        </div>
        <div class="list">
          <span style="width:270px;display:flex">
            <div class="list_title" style="width: 112px;">河道气味：</div>
            <div class="list_content" style="width: 155px;">{{manualDetail.manualDetail.smell.name}}</div>
          </span>
          <span style="width:270px;display:flex">
            <div class="list_title left1" style="width: 112px;">河道水位：</div>
            <div class="list_content left2" style="width: 156px;">{{manualDetail.manualDetail.level.name}}</div>
          </span>
        </div>
        <div class="list">
          <span style="width:270px;display:flex">
            <div class="list_title" style="width: 112px;">水面漂浮物情况：</div>
            <div class="list_content" style="width: 155px;">{{manualDetail.floater}}</div>
          </span>
          <span style="width:270px;display:flex">
            <div class="list_title left1" style="width: 112px;">河道内动植物：</div>
            <div class="list_content left2" style="width: 156px;">{{manualDetail.biont}}</div>
          </span>
        </div>
        <div class="list">
          <span style="width:270px;display:flex">
            <div class="list_title" style="width: 112px;">人工治理措施：</div>
            <div class="list_content" style="width: 155px;">{{manualDetail.govern}}</div>
          </span>
          <span style="width:270px;display:flex;">
            <span class="list_title left1" style="width: 112px;">风险源：</span>
            <span class="list_content left2" style="width: 156px;">{{manualDetail.riskSource}}</span>
          </span>
        </div>
        <div class="list">
          <span style="width:270px;display:flex">
            <div class="list_title" style="width: 112px;">任务开始时间：</div>
            <div class="list_content">{{manualDetail.manualDetail.beginTime}}</div>
          </span>
          <span style="width:270px;display:flex">
            <div class="list_title left1" v-if="manualDetail.manualDetail.endTime!=false" style="width: 112px;">任务结束时间：</div>
            <div class="list_content left2" v-if="manualDetail.manualDetail.endTime!=false">{{manualDetail.manualDetail.endTime}}</div>
          </span>
        </div>
        <div class="list">
          <div class="list_title" style="width: 112px;">突发情况：</div>
          <div class="list_content">{{manualDetail.emergency}}</div>
        </div>
        <!-- <div class="list" style="height:52px">
          <div class="list_title" style="width: 112px;">突然情况描述：</div>
          <div class="list_content" style="width:430px">{{manualDetail.manualDetail.emergencyRemark}}</div>
        </div>
        <div class="list" style="height:52px">
          <div class="list_title" style="width: 112px;">漂浮物描述：</div>
          <div class="list_content" style="width:430px">{{manualDetail.manualDetail.floaterRemark}}</div>
        </div> -->
        <div class="list" style="height:52px">
          <div class="list_title" style="width: 112px;">备注：</div>
          <div class="list_content" style="width:430px">{{manualDetail.manualDetail.remark}}</div>
        </div>
        <div style="display:flex;">
          <div class="list_title1" style="width: 112px;">照片：</div>
          <viewer   :images="imgList" style="display:flex; flex-wrap:wrap;padding-bottom:20px;margin-left:80px">
            <embed  v-for="item of imgList"  :key="item" :src="item.media" style="margin:0 5px 5px 0;width:80px;height:80px"/>
          </viewer>
        </div>
        <!-- <div class style="margin-bottom:15px;">
        </div> -->
      </div>
      <div class v-if="sitution == 'water'">
        <div class="title">任务信息</div>
        <div class="list">
          <div class="list_title" style="width: 125px;">任务名称：</div>
          <div class="list_content" style="width: 362px;">{{waterDetail.name}}</div>
          <div class="list_btn" style="margin-left:20px">{{waterDetail.status.name}}</div>
        </div>
        <div class="list">
          <div class="list_title" style="width: 125px;">任务类型：</div>
          <div class="list_content">{{waterDetail.template.name}}</div>
        </div>
        <div class="list">
          <div class="list_title" style="width: 125px;">发布时间：</div>
          <div class="list_content">{{waterDetail.timeCreated}}</div>
        </div>
        <div class="title" style="margin-top:20px">反馈信息</div>
        <div class="list">
          
          <span style="width:270px;display:flex">
            <div class="list_title" style="width: 125px;">水温℃：</div>
            <div class="list_content">{{waterDetail.waterDetail.temperature}}</div>
          </span>
          <span style="width:270px;display:flex">
            <div class="list_title left1" style="width: 125px;">ph：</div>
            <div class="list_content left2">{{waterDetail.waterDetail.ph}}</div>
          </span>
        </div>
        <div class="list">
          <span style="width:270px;display:flex">
            <div class="list_title" style="width: 125px;">氧化还原电位 mV：</div>
            <div class="list_content">{{waterDetail.waterDetail.redox}}</div>
          </span>
          <span style="width:270px;display:flex">
            <div class="list_title left1" style="width: 125px;">溶解氧 mg/L：</div>
            <div class="list_content left2">{{waterDetail.waterDetail.cond}}</div>
          </span>
        </div>
        <div class="list">
          <span style="width:270px;display:flex">
            <div class="list_title" style="width: 125px;">浊度 NTU：</div>
            <div class="list_content">{{waterDetail.waterDetail.ntu}}</div>
          </span>
        </div>
        <div class="list">
          
          <span style="width:270px;display:flex">
            <div class="list_title" style="width: 125px;">任务开始时间：</div>
            <div class="list_content">{{waterDetail.waterDetail.beginTime}}</div>
          </span>
          <span style="width:270px;display:flex">
            <div class="list_title left1" v-if="waterDetail.waterDetail.endTime!=false" style="width: 125px;">任务结束时间：</div>
            <div class="list_content left2" v-if="waterDetail.waterDetail.endTime!=false">{{waterDetail.waterDetail.endTime}}</div>
          </span>
        </div>
        <div class="list" style="height:52px">
          <div class="list_title" style="width: 125px;">备注：</div>
          <div class="list_content" style="width:430px">{{waterDetail.waterDetail.remark}}</div>
        </div>
        <div style="display:flex;">
          <div class="list_title1" style="width: 125px;">照片：</div>
          <viewer   :images="imgList" style="display:flex; flex-wrap:wrap;padding-bottom:20px;">
            <img  v-for="(item,index) of imgList"  :key="index" :src="item.media" style="margin:0 5px 5px 0;width:80px;height:80px"/>
          </viewer>
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
            // res.data.forEach(v => {
            //   let imgFile =v.media
              
            // });
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
.title{
  font-size:16px;
  font-family:PingFangSC-Medium,PingFang SC;
  font-weight:500;
  color:rgba(25,26,35,1);
  margin-bottom: 10px
}
.list{
  display: flex;
  min-height: 26px;
  width: 552px;
  margin-bottom: 6px;
  .list_title{
    left: 0px;
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(203,205,211,1);
    line-height:26px;
  }
  
  .list_content{
    box-sizing:border-box;
    left: 122px;
    top: 0;
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(82,90,111,1);
    line-height:26px;
  }
  .list_btn{
    right: 0;
    top: 0;
    width:62px;
    height:26px;
    background:rgba(6,176,123,0.1);
    border-radius:3px;
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(6,176,123,1);
    line-height: 26px;
    text-align: center
  }
  .left1{
    left: 284px;

  }
  .left2{
    left: 400px;
    
  }
}
.list_title1{
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(203,205,211,1);
    line-height:26px;
  }
</style>
