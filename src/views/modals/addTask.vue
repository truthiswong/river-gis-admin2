<template>
  <div class="addTask_info" v-show="msg.isShow">
    <p class="addTask_title">追加任务</p>
    <a-form :form="addPlan" @submit="submitPlan" class="addTask_from">
      <a-form-item label="名称" :label-col="{span:6}" :wrapper-col="{span:16}">
        <a-input placeholder="请输入任务名称" v-model="listAppend.name"></a-input>
      </a-form-item>
      <a-form-item label="任务类型" :label-col="{span:6}" :wrapper-col="{span:16}">
        <a-select v-model="listAppend.template">
          <a-select-option value="uav">无人机</a-select-option>
          <a-select-option value="manual">人工调查</a-select-option>
          <a-select-option value="water">水质调查</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="任务内容" :label-col="{ span: 6}" :wrapper-col="{ span: 16}">
        <a-textarea placeholder="Basic usage" :rows="4" v-model="listAppend.content" />
      </a-form-item>
      <a-form-item
        label="位置"
        :label-col="{ span: 6}"
        :wrapper-col="{ span: 16 }"
        style="text-align:left;"
      >
        <a-radio-group v-model="listAppend.locationType">
          <a-radio-button value="point" @click="addPoint">点</a-radio-button>
          <a-radio-button value="line" @click="addLineTool">线</a-radio-button>
          <a-radio-button value="surface" @click="addPolygonTool">面</a-radio-button>
        </a-radio-group>
        <a-button v-show="btnShow" @click="searchDraw" style="width:90%;">查看</a-button>
      </a-form-item>
      <a-form-item label="任务职位" :label-col="{ span: 6}" :wrapper-col="{ span: 16 }">
        <a-select
          showSearch
          mode="multiple"
          :allowClear="true"
          placeholder="请选择"
          optionFilterProp="children"
          style="width: 100%"
          @change="handleChange1"
          :filterOption="filterOption"
          v-model="listAppend.roleId"
        >
          <a-select-option v-for="item in rolePage" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <!-- <a-form-item label="是否紧急" :label-col="{ span: 6}" :wrapper-col="{ span: 16 }" style="text-align:left;">
                <a-checkbox>紧急任务</a-checkbox>
      </a-form-item>-->
      <!-- <a-form-item label="图片上传" :label-col="{ span: 6}" :wrapper-col="{ span: 16 }" style="text-align:left;">
                <a-upload name="file" :multiple="true" action="''">
                    <a-button>
                        <a-icon type="upload" /> Click to Upload
                    </a-button>
                </a-upload>
      </a-form-item>-->
      <a-form-item :wrapper-col="{span:24}" style="text-align:center;margin-top:10px;">
        <a-button @click="cancleBtn" style="display:inline-block;width:40%;margin-right:10px;">取消</a-button>
        <a-button
          type="primary"
          @click="addPlanInfo"
          style="display:inline-block;width:40%;color:#FFFFFF;"
        >添加</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
import { roleList, inspectTaskSave } from '@/api/login'
export default {
  name: 'addTask',
  props: {
    msg: {
      isShow: {
        type: Boolean,
        default: false
      }
    }
  },
  data() {
    return {
      num: '',
      isShow: false,
      cBtn: true,
      addPlan: {},
      lineTool: '',
      btnShow: false,
      checked: false,
      clickPoint: false,
      clickLine: false,
      clickPolygon: false,
      lineLnglats: [],
      markLnglat: {},
      polygonDate: [],
      rolePage: [],
      listAppend: {
        planId: '',
        object: '',
        objectId: '',
        objectName: '',
        name: '',
        template: '',
        content: '',
        locationType: '',
        region: '',
        roleId: []
      }
    }
  },
  watch:{
      msg(e){
        console.log(e);
        
      },
  },
  methods: {
    getRoleList() {
      roleList('worker').then(res => {
        this.rolePage = res.data.data
      })
    },
    show(planId, id, name, code) {
      console.log(planId, id, name, code)
      this.listAppend.planId = planId
      this.listAppend.object = code
      this.listAppend.objectId = id
      this.listAppend.objectName = name
      this.isShow = true
      this.getRoleList()
    },
    cancle() {
      this.isShow = false

      this.clickPoint = false
      this.clickLine = false
      this.clickPolygon = false
      console.log(this.clickPoint)
    },
    handleChange1(index) {
      console.log(`selected ${index}`)
      this.rolePage.forEach(value => {
        if (value.name === index) {
          value.clicked = true
          this.map.setViewport(value.lineData)
          this.drawAllRiver()
        } else {
          value.clicked = false
        }
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    //获取绘制线坐标
    getLineDate(currentLnglats) {
      console.log(this)

      var _this = this
      _this.lineLnglats = currentLnglats
      console.log(this.lineLnglats)
    },
    //获取绘制点坐标
    getMarkDate(currentLnglat) {
      var _this = this
      _this.markLnglat = currentLnglat
      console.log(this.markLnglat)
    },
    //获取绘制面坐标
    getPolygonDate(currentLnglats) {
      var _this = this
      _this.polygonDate = currentLnglats
      console.log(this.polygonDate)
    },
    addPlanInfo() {
      console.log(this)
      this.msg.isShow = false
      this.$emit('confirmBtn', "gfgdf")
      var data = this.listAppend
      if (data.locationType == 'point') {
        data.region = this.markLnglat.lng + ',' + this.markLnglat.lat
      }
      if (data.locationType == 'line') {
        for (const item of this.lineLnglats) {
          data.region = data.region + item.lng + ',' + item.lat + '|'
        }
      }
      if (data.locationType == 'surface') {
        for (const item of this.polygonDate) {
          data.region = data.region + item.lng + ',' + item.lat + '|'
        }
      }
      data.roleId = data.roleId.join(',')
      inspectTaskSave(data).then(res => {
        this.$message.success('成功')
        this.listAppend.planId = ''
        this.listAppend.object = ''
        this.listAppend.objectId = ''
        this.listAppend.objectName = ''
        this.listAppend.name = ''
        this.listAppend.template = ''
        this.listAppend.content = ''
        this.listAppend.locationType = ''
        this.listAppend.region = ''
        this.listAppend.roleId = []
        this.isShow = false
        this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getinspectPointPage()
        this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getPage()
        this.$emit('cancleBtn')
      })
    },
    submitPlan() {},
    //画线
    chooseLocation() {
      this.$emit('chooseLocation')
      this.btnShow = true
    },
    cancleBtn() {
      this.isShow = false
    },
    addPoint() {
      if (this.clickPoint) {
        this.clickPoint = false
      } else {
        this.clickPoint = true
      }
      console.log('子组件：' + this.clickPoint)
      this.$emit('addPoint', this.clickPoint)
      if (this.btnShow == false) {
        this.btnShow = true
      }
    },
    addLineTool() {
      if (this.clickLine) {
        this.clickLine = false
      } else {
        this.clickLine = true
      }
      console.log('子组件：' + this.clickLine)
      this.$emit('addLineTool', this.clickLine)
      if (this.btnShow == false) {
        this.btnShow = true
      }
    },
    addPolygonTool() {
      if (this.clickPolygon) {
        this.clickPolygon = false
      } else {
        this.clickPolygon = true
      }
      console.log('子组件：' + this.clickPolygon)
      this.$emit('addPolygonTool', this.clickPolygon)
      if (this.btnShow == false) {
        this.btnShow = true
      }
    },
    //查看绘制
    searchDraw() {
      if (this.markLnglat) {
        console.log(this.markLnglat)
        // this.$emit('searchMarkDraw',this.markLnglat)
      }
      if (this.lineLnglats) {
        console.log(this.lineLnglats)
      }
      if (this.polygonDate) {
        console.log(this.polygonDate)
      }
    }
  }
}
</script>
<style lang="less">
.addTask_info {
  width: 100%;
  // border-top: 1px solid #e8e8e8;
}
.addTask_title {
  width: 100%;
  height: 34px;
  line-height: 34px;
  border: 1px solid #f5f5f5;
  text-align: left;
  padding-left: 15px;
  background-color: #f5f5f5;
}
.ant-form-item {
  margin-bottom: 3px;
  // margin-bottom:0;
}
.addTask_from {
  padding-left: 20px;
  text-align: center;
}
</style>
