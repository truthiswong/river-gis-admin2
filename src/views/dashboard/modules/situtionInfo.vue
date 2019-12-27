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
        <div class style="margin-bottom:15px;">
          <p>任务开始前数据</p>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">无人机编号:</a-col>
            <a-col :span="8">{{uavDetail.uavCode}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">无人机电池:</a-col>
            <a-col :span="8">{{uavDetail.batteryCode}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">内存卡编号:</a-col>
            <a-col :span="8">{{uavDetail.storageCardCode}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">ipad编号:</a-col>
            <a-col :span="8">{{uavDetail.ipadCode}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">任务开始时间:</a-col>
            <a-col :span="8">{{uavDetail.beginTime}}</a-col>
          </a-row>
        </div>
        <div>
          <p>任务结束后数据</p>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">电池剩余电量:</a-col>
            <a-col :span="8">{{uavDetail.batteryPower}}%</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">任务结束时间:</a-col>
            <a-col :span="8">{{uavDetail.endTime}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">备注:</a-col>
            <a-col :span="8">{{uavDetail.remark}}</a-col>
          </a-row>
        </div>
      </div>
      <div class v-if="sitution == 'manual'">
        <div class style="margin-bottom:15px;">
          <p>任务开始前数据</p>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">调查的河道及位置点:</a-col>
            <a-col :span="8">{{manualDetail.uavCode}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">调查时间:</a-col>
            <a-col :span="8">{{manualDetail.beginTime}}</a-col>
          </a-row>
        </div>
        <div>
          <p>任务结束后数据</p>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">河道水体水色:</a-col>
            <a-col :span="8">{{manualDetail.color.name}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">河道水体流动性:</a-col>
            <a-col :span="8">{{manualDetail.flow.name}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">河道刺鼻性气味:</a-col>
            <a-col :span="8">{{manualDetail.smell.name}}%</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">打捞人员作业:</a-col>
            <a-col :span="8">{{manualDetail.salvagerWork}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">增氧机作业:</a-col>
            <a-col :span="8">{{manualDetail.aeratorWork}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">河道及其河岸的风险源:</a-col>
            <a-col :span="8">{{manualDetail.riskSource.name}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">河道其他水质风险:</a-col>
            <a-col :span="8">{{manualDetail.animalAndPlant}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">备注:</a-col>
            <a-col :span="8">{{manualDetail.remark}}</a-col>
          </a-row>
        </div>
      </div>
      <div class v-if="sitution == 'water'">
        <div class style="margin-bottom:15px;">
          <p>任务开始前数据</p>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">调查的河道及位置点:</a-col>
            <a-col :span="8"></a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">调查时间:</a-col>
            <a-col :span="8">{{waterDetail.beginTime}}</a-col>
          </a-row>
        </div>
        <div>
          <p>任务结束后数据</p>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">水温:</a-col>
            <a-col :span="8">{{waterDetail.temperature}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">Ph:</a-col>
            <a-col :span="8">{{waterDetail.ph}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">氧化还原电位:</a-col>
            <a-col :span="8">{{waterDetail.redox}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">溶解氧:</a-col>
            <a-col :span="8">{{waterDetail.ntu}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">浊度:</a-col>
            <a-col :span="8">{{waterDetail.cond}}</a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">检测设备的问题:</a-col>
            <a-col :span="8"></a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col :span="8">备注:</a-col>
            <a-col :span="8">{{waterDetail.remark}}</a-col>
          </a-row>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
import { inspectTaskDetail } from '@/api/login'
export default {
  name: 'situtionInfo',
  data() {
    return {
      visible: false,
      sitution: '',
      uavDetail: {},
      manualDetail: {},
      waterDetail: {}
    }
  },
  methods: {
    show(id) {
      inspectTaskDetail(id).then(res => {
        var arr = res.data
        console.log(arr)

        this.sitution = arr.template.code
        function formatDate(now) {
          var year = now.getFullYear() //取得4位数的年份
          var month = now.getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
          var date = now.getDate() //返回日期月份中的天数（1到31）
          var hour = now.getHours() //返回日期中的小时数（0到23）
          var minute = now.getMinutes() //返回日期中的分钟数（0到59）
          var second = now.getSeconds() //返回日期中的秒数（0到59）
          return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
        }
        if (arr.template.code == 'uav') {
          arr.uavDetail.beginTime = formatDate(new Date(arr.uavDetail.beginTime))
          arr.uavDetail.endTime = formatDate(new Date(arr.uavDetail.endTime))
          this.uavDetail = arr.uavDetail
        }
        if (arr.template.code == 'manual') {
          arr.manualDetail.beginTime = formatDate(new Date(arr.manualDetail.beginTime))
          if (arr.manualDetail.beginTime == 'NaN-NaN-NaN NaN:NaN:NaN') {
            arr.manualDetail.beginTime = ''
          }
          this.manualDetail = arr.manualDetail
        }
        if (arr.template.code == 'water') {
          arr.waterDetail.beginTime = formatDate(new Date(arr.waterDetail.beginTime))
          if (arr.waterDetail.beginTime == 'NaN-NaN-NaN NaN:NaN:NaN') {
            arr.waterDetail.beginTime = ''
          }
          this.waterDetail = arr.waterDetail
        }
      })
      this.visible = true
    },
    handleOk() {
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
