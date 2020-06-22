<template>
  <div class="planList">
    <!-- <div class="planList_info">
            <p class="info_title" @click="clickBtn">组一</p>
            <div class="info_body">
                <p class="plan_title">黄浦江</p>
                <a-tree checkable v-model="checkedKeys" :selectedKeys="selectedKeys" :treeData="treeData"></a-tree>
            </div>
        </div>
        <div class="planList_info">
            <p class="info_title">组二</p>
            <div class="info_body">
                <p class="plan_title">黄浦江</p>
                <a-tree checkable v-model="checkedKeys" :selectedKeys="selectedKeys" :treeData="treeData"></a-tree>
            </div>
    </div>-->

    <!-- 弹框 -->
    <a-modal
      title="计划"
      :width="1100"
      :visible="visible"
      @ok="submitPlan"
       :confirmLoading="confirmLoading"
      @cancel="cancleBtn"
      :maskClosable="false"
      class="modal_plan custom_modal"
    >
      <template slot="closeIcon">
        <a-icon type="close-circle" />
      </template>
      <template slot="title">
        <span>计划</span>
      </template>
      <span class="editIcon" @click="editModalTitle" v-if="editShow">
        <a-icon type="edit" />
      </span>
      <span style="position:absolute;top:12px;left:60px;" v-if="!editShow">
        <a-input placeholder="计划A" style="width:150px;margin-left:20px;" />
      </span>
      <a-spin size="large" :spinning="spinning">
      <div class="modal-body">
        <a-tabs type="card" :animated="true">
          <a-tab-pane v-for="(option,i) in planTab" :tab="option.name" :key="i">
            <div class="card-info">
              <a-form :form="planForm">
                <div>
                  <span style="font-size:16px;font-weight:500;color: #1F1F1F;">人员:</span>
                  <a-form-item
                    :label="item.name+' ('+item.amount+'人)'"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    v-for="(item,index) in option.roles"
                    :key="index"
                    style="margin-bottom:20px"
                  >
                    <a-checkbox-group v-model="item.workerId">
                      <a-checkbox
                        v-for="chec in item.users"
                        :key="chec.id"
                        :value="chec.id"
                      >{{chec.name}}</a-checkbox>
                    </a-checkbox-group>
                  </a-form-item>
                </div>
                <div>
                  <span style="font-size:16px;font-weight:500;color: #1F1F1F;margin:10px 0;" >设备: <span>
                      <a-input  style="margin:0 10px 0 30px;width:150px" placeholder="请输入名称" v-model="nameAdditional"/>
                      <a-button block style="width:70px" @click="additionalClick(option.id)">添加</a-button>
                    </span></span>
                  <a-form-item
                    :label="add.name"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    v-for="(add,jj) in option.devices"
                    :key="jj"
                    style="margin-top:20px"
                  >
                    <a-checkbox-group
                      v-model="add.workerId"
                      @change="sadsadasdsa()"
                      style="width:100%;display:flex"
                    >
                      <div
                        style="width:200px;margin:0 15px 10px 0;display:flex;justify-content:space-between"
                        v-for="devi in add.devices"
                        :key="devi.device.id"
                      >
                        <a-checkbox disabled :value="devi.device.id" style="color:#000000">{{devi.device.name}}</a-checkbox>
                        <a-input-number
                          class="changeNumber"
                          :min="devi.amount1"
                          v-model="devi.amount"
                        />
                      </div>
                    </a-checkbox-group>
                  </a-form-item>
                  <a-form-item
                    label="额外设备"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                  >
                    <a-checkbox-group
                      v-model="option.additionalList"
                      style="width:100%;display:flex;margin-bottom:20px"
                    >
                      <div
                        style="width:200px;margin:0 15px 10px 0;display:flex;justify-content:space-between;"
                        v-for="(ew,cc) in option.additional"
                        :key="cc"
                      >
                        <a-checkbox :value="ew.extraDevice">{{ew.extraDevice}}</a-checkbox>
                        <a-input-number
                          class="changeNumber"
                          v-model="ew.extraDeviceAmount"
                        />
                      </div>
                    </a-checkbox-group>
                  </a-form-item>
                </div>
              </a-form>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-spin>
    </a-modal>
  </div>
</template>
<script>
import '../../assets/css/planList.less'
import {
  staffInspectPage,
  targetPage,
  groupingPage,
  deviceInspectPage,
  memberRiverSave,
  equipmentRiverSave,
  planPublish,
  devicePage,
  staffPage
} from '@/api/login'
const treeData = [
  {
    title: '无人机正射影像',
    key: '0-0'
  },
  {
    title: '360全景图',
    key: '0-1',
    children: [{ title: '黄浦江360(一)', key: '0-1-0-0' }, { title: '黄浦江360(二)', key: '0-1-0-1' }]
  }
]

const personList = ['张三', '李四', '王五']
export default {
  name: 'planList',
  data() {
    return {
      nameAdditional:'',
      spinning: true,
      confirmLoading:false,
      teamId: '',
      checkedKeys: ['0-1-0-0'],
      selectedKeys: [],
      treeData,
      visible: false,
      planTab: [],
      noPlanTab: 'one',
      planForm: this.$form.createForm(this),
      personList,
      personOne: [],
      labelCol: {
        xs: { span: 15 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 15 },
        sm: { span: 18 }
      },
      number: 20,
      editShow: true,
      numvis: true
    }
  },
  created() {},
  watch: {
    checkedKeys(val) {
      console.log('onCheck', val)
    }
  },
  methods: {
    getstaffInspectPage(id) {
      this.visible = true
      this.id = id
      var sdsd = {
        projectId: this.$store.state.id,
        id: this.id
      }
      groupingPage(sdsd).then(res => {
        var arr = res.data
        for (const item of arr) {
          item.roles = []
          item.devices = []
          item.additional = []
          item.additionalList =[]
          devicePage(item.id).then(res => {
            var device = res.data.data
            deviceInspectPage(item.id).then(res => {
              var arrr = res.data
              var ddd = []
              var suc = []
              for (const qq of device) {
                if (qq.device) {
                }else{
                  ddd.push(qq)
                  suc.push(qq.extraDevice)
                }
              }
              arrr.forEach(v => {
                v.workerId = []
                v.name = v.deviceType.name
                v.id = v.deviceType.id
                for (const item of v.devices) {
                  v.workerId.push(item.device.id)
                  for (const qq of device) {
                    if (qq.device) {
                      if (item.device.id == qq.device.id) {
                        item.amount1 = qq.amount
                      }
                    }
                  }
                }
              })
              item.additional = ddd
              item.additionalList =suc
              item.devices = arrr
            }).catch(err => {    
              this.$message.error(err.response.data.message)
            })
          }).catch(err => {    
            this.$message.error(err.response.data.message)
          })
          staffPage(item.id).then(res => {
            var staff = res.data.data
            staffInspectPage(item.id).then(res => {
              var ar = res.data
              ar.forEach(v => {
                v.workerId = []
                v.name = v.role.name
                
                for (const ss of staff) {
                  v.id = ss.id
                  if (v.role.id == ss.role.id) {
                    v.workerId.push(ss.worker.id)
                  }
                }
              })
              item.roles = ar
            })
          }).catch(err => {
                  
            this.$message.error(err.response.data.message)
          })
        }
        console.log(arr);
        
        this.planTab = arr
        this.spinning = false
      }).catch(err => {    
        this.$message.error(err.response.data.message)
      })
      this.teamId = id
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },
    handleOk(e) {
      this.visible = false
    },
    clickBtn() {},
    //卡片改变
    onTabChange(key, type) {
      this[type] = key
    },
    //表单提交
    submitPlan(e) {
      this.confirmLoading=true
      var worker = ''
      var amount = ''
      var extraDeviceAmount = ''
      for (const item of this.planTab) {
        for (let i=0;i<item.roles.length;i++) {
          if (i + 1 == item.roles.length) {
            if (item.roles[i].workerId.length  == 0) {
              this.$message.warning('请全部分配人员')
              this.confirmLoading=false
              break
            }else{
              for (const item of this.planTab) {
                worker = ''
                amount = ''
                extraDeviceAmount = ''
                for (const role of item.roles) {
                  var data = {
                    id: '',
                    teamId: item.id,
                    roleId: role.role.id,
                    workerId: role.workerId.join(',')
                  }
                  memberRiverSave(data)
                    .then(res => {})
                    .catch(err => {
                      this.confirmLoading=false
                      this.numvis = false
                    })
                }
                for (const devices of item.devices) {
                  for (const am of devices.workerId) {
                    // worker.push(am.workerId)
                    worker = worker + am + ','
                  }
                  for (const devi of devices.devices) {
                    amount = amount + devi.amount + ','
                    // amount.push(devi.amount)
                  }
                }
                for (const numadd of item.additional) {
                  for (const addnum of item.additionalList) {
                    if (numadd.extraDevice == addnum) {
                      extraDeviceAmount=extraDeviceAmount + numadd.extraDeviceAmount+','
                    }
                  }
                }
                var arr = {
                  id: '',
                  teamId: item.id,
                  deviceId: worker,
                  amount: amount,
                  extraDevice:item.additionalList.join(','),
                  extraDeviceAmount:extraDeviceAmount
                }
                equipmentRiverSave(arr)
                  .then(res => {})
                  .catch(err => {
                    this.confirmLoading=false
                    this.numvis = false
                  })
              }
               this.t1 = setTimeout(() => {
                 planPublish(this.id).then(res => {
                   this.confirmLoading=false
                  this.$message.success('成功')
                  this.visible = false
                  // this.spinning = true
                  this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getPage()
                  this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getPlanSave()
                  this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getNowPlan()
                  
                }).catch(err => {
                  this.confirmLoading=false
                  this.$message.error(err.response.data.message)
                })
               },3000)
              
              
            }
          }else{
             
            if (item.roles[i].workerId.length  == 0) {
              this.$message.warning('请全部分配人员')
              this.confirmLoading=false
              //  this.spinning = false
              break
            } else {
              
            }
          }
        }
        
      }
    },
    additionalClick(id){
      for (const item of this.planTab) {
        if (item.id == id) {
          item.additional.push({extraDevice:this.nameAdditional,extraDeviceAmount:'1'})
          item.additionalList.push(this.nameAdditional)
          this.nameAdditional=''
          break
        }
      }
    },
    //人员修改
    numberChange(val) {},
    cancleBtn() {
      this.spinning = true
      this.visible = false
    },
    changeTab(key) {},
    editModalTitle() {
      this.editShow = false
    },
    sadsadasdsa(e, id) {}
  }
}
</script>
<style lang="less" scoped>

</style>
<style >
.ant-checkbox-disabled + span{
 color: #000000
}
</style>
