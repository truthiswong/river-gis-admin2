<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-breadcrumb style="font-size: 16px;">
        <a-breadcrumb-item>设置</a-breadcrumb-item>
        <a-breadcrumb-item>督办单管理</a-breadcrumb-item>
      </a-breadcrumb>
      <a-divider style="margin: 10px 0" />
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="督办单名称">
              <a-input v-model="queryParam.id" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="所属街道">
              <a-select v-model="queryParam.status" placeholder="请选择" default-value="0">
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="所属河道">
                <a-input-number v-model="queryParam.callNo" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="风险源类型">
                <a-select v-model="queryParam.useStatus" placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="调查日期">
                <!-- <a-date-picker v-model="queryParam.date" style="width: 100%" placeholder="请输入查询日期"/> -->
                <a-range-picker style="width: 100%" @change="onChange" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="标签搜索">
                <a-select placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
            >
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.addSupervisory.add()" style="margin-bottom: 15px;">添加</a-button>
    </div>
    <a-table :columns="columns" :dataSource="loadData" bordered>
      <template slot="action" slot-scope="row">
        <a @click="$refs.addSupervisory.add1(row.id)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定要删除吗?"
          @confirm="confirmDelete(row.id)"
          @cancel="cancelDelete"
          okText="确定"
          cancelText="取消"
        >
          <a>删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <add-supervisory ref="addSupervisory" @ok="handleOk"  :streetList="streetList" :riverList="riverList" :labelList="labelList"/>
    <step-by-step-modal ref="modal" @ok="handleOk" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { STable, Ellipsis } from '@/components'
import StepByStepModal from './modules/StepByStepModal'
import AddSupervisory from './modules/AddSupervisory'
import { getRoleList, getServiceList } from '@/api/manage'
import {SupervisePage,SuperviseSave,SuperviseDel,SuperviseDetail,getStreetList,getRiverList,paramList} from '@/api/login'
export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    AddSupervisory,
    StepByStepModal
  },
  data() { 
    return {
      streetList:[],
      riverList:[],
      labelList:[],
      mdl: {},
      id:'',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '序号',
          dataIndex: 'key',
          sorter: true
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '所属街道',
          dataIndex: 'description',
        },
        {
          title: '所属河道',
          dataIndex: 'callNo',
        },
        {
          title: '风险源类型',
          dataIndex: 'status',
        },
        {
          title: '编辑人',
          dataIndex: 'editor',
          sorter: true
        },
        {
          title: '调查日期',
          dataIndex: 'updatedAt',
          sorter: true
        },
        {
          title: '操作',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      
      loadData: [
        // {
        //   key:'1',
        //   no:'督办单1',
        //   description:'上钢新村街道',
        //   callNo:'黄浦江',
        //   status:'排口',
        //   editor:'张三',
        //   updatedAt:'2019-7-8',
        // },
        // {
        //   key:'2',
        //   no:'督办单1',
        //   description:'上钢新村街道',
        //   callNo:'黄浦江',
        //   status:'排口',
        //   editor:'张三',
        //   updatedAt:'2019-7-8',
        // },
      ],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  watch: {
    $route(){
      this.getPage()
      this.getType()
    },
  },
  mounted(){
    this.getPage()
    this.getType()
  },
  methods: {
    getPage(){
      SupervisePage(this.$store.state.id).then(res => {
        function formatDate(now) { 
          var year=now.getFullYear() //取得4位数的年份
          var month=now.getMonth()+1  //取得日期中的月份，其中0表示1月，11表示12月
          var date=now.getDate()      //返回日期月份中的天数（1到31）
          var hour=now.getHours()     //返回日期中的小时数（0到23）
          var minute=now.getMinutes() //返回日期中的分钟数（0到59）
          var second=now.getSeconds() //返回日期中的秒数（0到59）
          return year+"-"+month+"-"+date
        }
        var arr = res.data.data
        for (let i = 0; i < arr.length; i++) {
          arr[i].key = i + 1
          arr[i].description =arr[i].street.name
          arr[i].updatedAt = formatDate(new Date(arr[i].surveyDate))
          arr[i].callNo = ''
          for (let a = 0; a < arr[i].rivers.length; a++) {
            arr[i].callNo =arr[i].callNo + arr[i].rivers[a].name + ' '
          }
          arr[i].status = ''
          for (let a = 0; a < arr[i].riskSourceType.length; a++) {
            arr[i].status =arr[i].status + arr[i].riskSourceType[a].name + ' '
          }
        }
        this.loadData = arr
      }).catch(err => {
      })
    },
    getType(){
      getStreetList(this.$store.state.id).then(res => {
        var arr = res.data.data
        this.streetList = arr
      }).catch(err => {
      })
      getRiverList(this.$store.state.id).then(res => {
        var arr = res.data.data
        this.riverList=arr
      }).catch(err => {
      })
      var data ={
        type:'risk_source_type'
      }
      paramList(data).then(res => {
        var arr = res.data
        this.labelList=arr
      }).catch(err => {
      })
    },
    onChange(date, dateString) {
      console.log(date, dateString)
    },
    del(id){
      this.id = id
    },
    confirmDelete(id) {
      SuperviseDel(id).then(res => {
          this.$message.success('删除成功')
          this.id=''
          this.getPage()
        }).catch(err => {})
    },
    cancelDelete(){},
    handleOk() {
      this.$refs.table.refresh()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>
