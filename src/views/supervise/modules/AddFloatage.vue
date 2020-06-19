<template>
  <a-modal
    :width="980"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="saveClick"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :mask="false"
    class="custom_modal"
  >
    <template slot="closeIcon">
      <a-icon type="close-circle" />
    </template>
    <template slot="title">
      <span>水面漂浮物</span>
    </template>
    <a-spin :spinning="confirmLoading">
      <a-form class="from">
        <h3>名称</h3>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="名称">
              <a-input placeholder v-model="list.innerName" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="河道">
              <a-select
                :allowClear="true"
                placeholder="请输入河流"
                optionFilterProp="children"
                style="width: 100%"
                v-model="list.riverId"
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in riverList"
                  :key="index"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="街道">
              <a-select
                :allowClear="true"
                placeholder="请输入街道"
                optionFilterProp="children"
                style="width: 100%"
                v-model="list.streetId"
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
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="位置">
              <a-input placeholder v-model="list.address" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="面积(m²)">
              <a-input placeholder v-model="list.polygonSize" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="创建时间">
              <a-date-picker
                disabled
                style="width:100%;"
                format="YYYY-MM-DD"
                :value="moment(list.createTime, 'YYYY-MM-DD')"
                placeholder="选择日期"
                @change="onChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="12">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="备注">
              <a-textarea placeholder="请输入备注" v-model="list.remark" :rows="4" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-row style="width:100%;" type="flex" justify="space-around" v-show="jurisdiction">
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
    </template>
  </a-modal>
</template>

<script>
import moment from 'moment'
import { getRiverList, getStreetList, floatageSave, floatageDetails, mapdrawDetail, mapdrawDelete } from '@/api/login'
export default {
  data() {
    return {
      
      jurisdiction:this.$store.state.operationPermission[1],//权限
      labelCol: {
        xs: { span: 18 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 16 }
      },
      list: {
        drawId: '',
        innerName: '',
        address: '',
        riverId: '',
        streetId: '',
        polygonSize: '',
        createTime: '',
        remark: ''
      },
      visible: false,
      confirmLoading: false,
      riverList: [],
      streetList: []
    }
  },
  computed: {},
  mounted() {},
  methods: {
    moment,
    getList() {
      getRiverList(this.$store.state.id).then(res => {
        this.riverList = res.data.data
      })
      getStreetList(this.$store.state.id).then(res => {
        this.streetList = res.data.data
      })
    },
    detailList(row) {
      this.getList()
      // mapdrawDetail(row.target.options.id).then(res=>{
      //   this.list.lng=res.data.point[0]
      //   this.list.lat=res.data.point[1]
      // })
      this.list.drawId = row.target.options.id
      floatageDetails(row.target.options.id).then(res => {
        var arr = res.data
        this.list.innerName = arr.innerName
        this.list.address = arr.address
        this.list.polygonSize = arr.polygonSize
        this.list.riverId = arr.river.id
        this.list.streetId = arr.street.id
        // this.list.currentArea=
        this.list.createTime = moment(arr.createTime).format('YYYY-MM-DD')
        this.list.remark = arr.remark
      })
      this.visible = true
    },
    add(id, currentArea, result,defaultTime) {
      this.list.createTime = defaultTime
      this.getList()
      this.list.drawId = id
      this.list.address = result.formatted_address
      this.list.polygonSize = currentArea
      this.visible = true
    },
    saveClick() {
      let data = this.list
      floatageSave(data)
        .then(res => {
          this.$message.success('保存成功,请打开漂浮物按钮查看')
          this.$parent.drawSaveRefresh('floatage')
          this.handleCancel()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    onChange(date, dateString) {
      console.log(date, dateString)
      this.list.createTime = dateString
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
      this.visible = false
      this.list = {
        drawId: '',
        innerName: '',
        address: '',
        riverId: '',
        streetId: '',
        currentArea: '',
        createTime: '',
        remark: ''
      }
    },
    handleDelete() {
      mapdrawDelete(this.list.drawId)
        .then(res => {
          this.$message.success('删除成功')
          this.$parent.drawSaveRefresh('floatage')
          this.handleCancel()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
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
  // overflow-y: scroll;
  h3 {
    font-weight: 600;
    font-size: 15px;
  }
}
</style>
