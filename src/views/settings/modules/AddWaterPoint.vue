<template>
  <a-modal
    title="添加水质监测点"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask="true"
    :centered="true"
    :footer="null"
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form class="from">
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="名称">
              <a-input v-model="list.name" placeholder="名称" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="编号">
              <a-input v-model="list.code" placeholder="编号" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="等级">
              <a-input v-model="list.level" placeholder="等级" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="市考断面">
              <a-input v-model="list.section" placeholder="市考断面" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="地址">
              <a-input v-model="list.address" placeholder="请输入地址" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="经度">
              <a-input readOnly v-model="list.lng" placeholder="经度" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="纬度">
              <a-input readOnly v-model="list.lat" placeholder="纬度" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="水体名称">
              <!-- <a-input v-model="list.waterName" placeholder="水体名称" /> -->
              <a-select placeholder="水体名称" v-model="list.riverId"  @change="riverChange">
                <a-select-option v-for="(item, index) in riverShowList" :key="index" :value="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="水体编码">
              <a-input v-model="list.waterCode" placeholder="水体编码" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="管理等级">
              <a-input v-model="list.manageLevel" placeholder="管理等级" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="水体分类">
              <a-input v-model="list.waterType" placeholder="水体分类" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="行政区">
              <a-input v-model="list.area" placeholder="行政区" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="所在街道">
              <a-select placeholder="所在街道" v-model="list.streetId">
                <a-select-option v-for="(item, index) in streetShowList" :key="index" :value="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="所在村">
              <a-input v-model="list.village" placeholder="所在村" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="责任单位">
              <a-input v-model="list.dutyOrg" placeholder="责任单位" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="检测单位">
              <a-input v-model="list.monitorOrg" placeholder="检测单位" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="所属部门">
              <a-input v-model="list.department" placeholder="所属部门" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="原检测站编码">
              <a-input v-model="list.originalCode" placeholder="原检测站编码" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="备注">
              <a-input v-model="list.remark" placeholder="备注" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%; margin-top:10px;" type="flex" justify="space-around">
          <a-col :span="4">
            <a-button type="primary" block @click="handleCancel">取消</a-button>
          </a-col>
          <a-col :span="4">
            <a-button type="primary" block @click="handleSave">保存</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { testingSave, testingDetail } from '@/api/login'
export default {
  props: {
    //接收父组件传来的值
    pointInfo: { id: '', name: '', latlng: { lat: '', lng: '' } }
  },
  data() {
    return {
      list: {
        id: '',
        projectId: this.$store.state.id,
        type: '',
        lng: '',
        lat: '',
        name: '',
        code: '',
        level: '',
        section: '',
        waterName: '',
        waterCode: '',
        manageLevel: '',
        waterType: '',
        area: '',
        town: '',
        village: '',
        dutyOrg: '',
        monitorOrg: '',
        department: '',
        originalCode: '',
        remark: '',
        address: '',
        streetId:'',
        riverId:''
      },
      labelCol: {
        xs: { span: 18 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 6 },
        sm: { span: 18 }
      },
      visible: false,
      confirmLoading: false,
      riverShowList:[],
      streetShowList:[],
      selectedItems: [] //风险源类型
    }
  },
  computed: {
    filteredOptions() {
      return OPTIONS.filter(o => !this.selectedItems.includes(o))
    }
  },
  mounted() {},
  methods: {
    add(e, type,riverShowList,streetShowList) {
      this.riverShowList = riverShowList
      this.streetShowList = streetShowList
      if (type == 1) {
        this.list.type = 'fixed'
      } else {
        this.list.type = 'manual'
      }
      this.list.lng = e.lng
      this.list.lat = e.lat
      this.visible = true
    },
    add1(id,riverShowList,streetShowList) {
      this.riverShowList = riverShowList
      this.streetShowList = streetShowList
      testingDetail(id)
        .then(res => {
          var arr = res.data
          this.list.id = arr.id
          this.list.type = arr.type.code
          this.list.lng = arr.coordinate.lng
          this.list.lat = arr.coordinate.lat
          this.list.name = arr.name
          this.list.code = arr.code
          this.list.address = arr.address
          this.list.level = arr.level
          this.list.section = arr.section
          // this.list.waterName = arr.waterName
          if (arr.river) {
            this.list.riverId = arr.river.id
            this.list.waterCode = arr.river.code
          }
          if (arr.street) {
            this.list.streetId = arr.street.id
          }
          this.list.manageLevel = arr.manageLevel
          this.list.waterType = arr.waterType
          this.list.area = arr.area
          this.list.town = arr.town
          this.list.village = arr.village
          this.list.dutyOrg = arr.dutyOrg
          this.list.monitorOrg = arr.monitorOrg
          this.list.department = arr.department
          this.list.originalCode = arr.originalCode
          this.list.remark = arr.remark
          this.visible = true
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
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
    handleSave() {
      var data = this.list
      data.coordinate = data.lng + ',' + data.lat
      testingSave(data)
        .then(res => {
          if (this.list.type == 'fixed') {
            this.$parent.getFixedList()
          } else {
            this.$parent.getManualList()
          }
          this.handleCancel()
          this.$message.success('保存成功')
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    handleCancel() {
      this.visible = false
      this.list.id = ''
      this.list.type = ''
      this.list.lng = ''
      this.list.lat = ''
      this.list.name = ''
      this.list.code = ''
      this.list.level = ''
      this.list.section = ''
      this.list.waterName = ''
      this.list.waterCode = ''
      this.list.manageLevel = ''
      this.list.waterType = ''
      this.list.area = ''
      this.list.town = ''
      this.list.village = ''
      this.list.dutyOrg = ''
      this.list.monitorOrg = ''
      this.list.department = ''
      this.list.originalCode = ''
      this.list.remark = ''
      this.list.address = ''
      this.list.riverId = ''
      this.list.streetId = ''
      this.$emit('cancel')
    },
    riverChange(value){
      for (const item of this.riverShowList) {
        if (value==item.id) {
          this.list.waterCode = item.code
          if (item.supervisoryLevel !=null) {
            this.list.manageLevel = item.supervisoryLevel.name
          }else{
             this.list.manageLevel =''
          }
          
          break
        }
      }
    },
    filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)
    }
  }
}
</script>
<style scoped>
.ant-form-item {
  margin-bottom: 0;
}
.from {
  max-height: 520px;
}
</style>
