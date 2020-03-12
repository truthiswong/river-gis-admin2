<template>
  <a-modal
    :title="name"
    :width="1200"
    :visible="visible"
    @ok="submitPlan"
    @cancel="cancleBtn"
    :maskClosable="false"
    class="palnDetail_modal"
  >
    <span class="editIcon" @click="editModalTitle" v-if="editShow">
      <a-icon type="edit" />
    </span>
    <span style="position:absolute;top:12px;left:200px;" v-if="!editShow">
      <a-input placeholder style="width:150px;margin-left:20px;" />
    </span>
    <div class="planDetail_info">
      <a-row style="padding-bottom:10px;">
        <a-col :span="3" style="font-size:15px;">下发时间:</a-col>
        <a-col :span="20">{{date}}</a-col>
      </a-row>
      <a-row>
        <a-col :span="3" style="font-size:15px;">下发人:</a-col>
        <a-col :span="20"></a-col>
      </a-row>
    </div>
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
                  <span style="font-size:16px;font-weight:500;color: #1F1F1F;margin:10px 0" >设备: <span>
                      <a-input  style="margin:0 10px 0 30px;width:150px" placeholder="请输入名称" v-model="nameAdditional"/>
                      <a-button block style="width:70px" @click="additionalClick(option.id)">添加</a-button>
                    </span></span>
                  <a-form-item
                    :label="add.name"
                    :label-col="labelCol"
                    :wrapper-col="wrapperCol"
                    v-for="(add,jj) in option.devices"
                    :key="jj"
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
                        <a-checkbox disabled :value="devi.device.id">{{devi.device.name}}</a-checkbox>
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
                      style="width:100%;display:flex"
                    >
                      <div
                        style="width:200px;margin:0 15px 10px 0;display:flex;justify-content:space-between"
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
</template>
<script>
import {
  staffInspectPage,
  planDetail,
  groupingPage,
  staffPage,
  memberRiverSave,
  equipmentRiverSave,
  deviceInspectPage,
  devicePage,
  planPublish
} from '@/api/login'
export default {
  name: 'planDetail',
  data() {
    return {
      nameAdditional:'',
      spinning: true,
      date: '',
      name: '',
      visible: false,
      teamId: '',
      planTab: [],
      noPlanTab: 'one',
      planForm: this.$form.createForm(this),
      personOne: [],
      labelCol: {
        xs: { span: 15 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 15 },
        sm: { span: 18 }
      },
      number: 3,
      editShow: true
    }
  },
  methods: {
    show(id) {
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
            })
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
          })
        }
        console.log(arr);
        
        this.planTab = arr
        this.spinning = false
      })
      planDetail(id).then(res => {
        this.name = res.data.name
        this.date = res.data.date
      })
      this.teamId = id
    },
    submitPlan(e) {
      var worker = ''
      var amount = ''
      var extraDeviceAmount = ''
      console.log(this.planTab);
      for (const item of this.planTab) {
        for (let i=0;i<item.roles.length;i++) {
          if (i + 1 == item.roles.length) {
            if (item.roles[i].workerId.length  == 0) {
              this.$message.warning('请全部分配人员')
              break
            }else{
              for (const item of this.planTab) {
                worker = ''
                amount = ''
                extraDeviceAmount=''
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
                equipmentRiverSave(arr).then(res => {

                }).catch(err => {
                  this.numvis = false
                })
              }
              planPublish(this.id).then(res => {
                this.$message.success('成功')
                this.spinning = true
                this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getPage()
                this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getPlanSave()
                this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getNowPlan()
              })
              this.visible = false
            }
          }else{
            if (item.roles[i].workerId.length  == 0) {
              this.$message.warning('请全部分配人员')
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
    cancleBtn() {
      this.spinning = true
      this.visible = false
    },
    //卡片改变
    onTabChange(key, type) {
      console.log(key, type)
      this[type] = key
    },
    //表单提交
    submitPlanInfo(e) {
      // e.preventDefault();
      console.log(e)
      this.visible = false
    },
    //人员修改
    personChange(checkedValues) {
      console.log('checked = ', checkedValues)
      console.log('value = ', this.value)
    },
    numberChange(val) {
      console.log('changed', val)
    },
    editModalTitle() {
      console.log(this.editShow)
      this.editShow = false
      console.log(this.editShow)
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
.editIcon {
  position: absolute;
  top: 18px;
  left: 200px;
  cursor: pointer;
}
.editIcon:hover {
  font-size: 16px;
}
.palnDetail_modal .ant-modal-body {
  padding: 0;
}
.planDetail_info {
  padding: 10px 20px;
  border-bottom: 1px solid #e8e8e8;
}
</style>
