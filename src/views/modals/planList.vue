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
        </div> -->

        <!-- 弹框 -->
        <a-modal title="计划" :width="1100" :visible="visible" @ok="submitPlan" @cancel="cancleBtn" class="modal_plan">
            <span class="editIcon" @click="editModalTitle" v-if="editShow"><a-icon type="edit" /></span>
            <span style="position:absolute;top:12px;left:60px;" v-if="!editShow"><a-input placeholder="计划A" style="width:150px;margin-left:20px;"/></span>
            <a-spin size="large" :spinning="spinning">
            <div class="modal-body">
                <a-tabs  type="card" :animated="true">
                    <a-tab-pane v-for="option in planTab" :tab="option.name" :key="option.id"   >
                        <div class="card-info">
                            <a-form :form="planForm">
                                <div><span style="font-size:16px;font-weight:500;color: #1F1F1F;">人员:</span>
                                    <a-form-item :label="item.name+' ('+item.amount+'人)'" :label-col="labelCol" :wrapper-col="wrapperCol" v-for="item in option.roles"  :key="item.id">
                                        <a-checkbox-group v-model="item.workerId" >
                                            <a-checkbox v-for="chec in item.users"  :key="chec.id" :value="chec.id">{{chec.name}}</a-checkbox>
                                        </a-checkbox-group>
                                    </a-form-item>
                                </div>
                                <div><span style="font-size:16px;font-weight:500;color: #1F1F1F;">设备:</span>
                                    <a-form-item :label="item.name" :label-col="labelCol" :wrapper-col="wrapperCol" v-for="item in option.devices"  :key="item.id">
                                        <a-checkbox-group v-model="item.workerId" @change="sadsadasdsa()" style="width:100%;display:flex">
                                            <div  style="width:200px;margin:0 15px 10px 0;display:flex;justify-content:space-between"  v-for="devi in item.devices"  :key="devi.device.id">
                                                <a-checkbox disabled :value="devi.device.id" >{{devi.device.name}}</a-checkbox>
                                                <a-input-number class="changeNumber" :min="devi.amount1"  v-model="devi.amount" />
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
import { staffInspectPage,targetPage,groupingPage,deviceInspectPage,memberRiverSave,equipmentRiverSave,planPublish} from '@/api/login'
const treeData = [{
  title: '无人机正射影像',
  key: '0-0',
}, {
  title: '360全景图',
  key: '0-1',
  children: [
    { title: '黄浦江360(一)', key: '0-1-0-0' },
    { title: '黄浦江360(二)', key: '0-1-0-1' },
  ],
}]

const personList = ['张三','李四','王五']
export default {
    name:'planList',
    data(){
        return{
            spinning:true,
            teamId:'',
            checkedKeys: ['0-1-0-0'],
            selectedKeys: [],
            treeData,
            visible:false,
            planTab:[],
            noPlanTab:'one',
            planForm: this.$form.createForm(this),
            personList,
            personOne:[],
            labelCol:{
                xs:{span:15},
                sm:{span:3},
            },
            wrapperCol:{
                xs:{span:15},
                sm:{span:18},
            },
            number:20,
            editShow:true
        }
    },
    created(){

    },
    watch: {
        checkedKeys(val) {
        console.log('onCheck', val)
        }
    },
    methods:{
        getstaffInspectPage(id){
            this.visible = true;
            this.id = id
            var sdsd ={
                projectId:this.$store.state.id,
                id:this.id
            }
            groupingPage(sdsd).then(res=>{
                var arr = res.data
                for (const item of arr) {
                    item.roles = []
                    item.devices=[]
                    deviceInspectPage(item.id).then(res=>{
                        var arrr= res.data
                        arrr.forEach(v => {
                           v. workerId = []
                           v.name = v.deviceType.name
                           v.id = v.deviceType.id
                           for (const item of v.devices) {
                                item.amount1 = item.amount
                                v. workerId.push(item.device.id)
                           }
                        });
                        item.devices=arrr  
                        this.spinning=false
                    }).catch(err => {
                        this.spinning=false
                        // this.$message.error('加载数据失败')
                    })
                    staffInspectPage(item.id).then(res=>{
                        var ar= res.data
                        ar.forEach(v => {
                           v. workerId = []
                           v.name = v.role.name
                        });
                        item.roles = ar
                        
                    })
                }
                this.planTab = arr
               
            }).catch(err => {
                this.spinning=false
                this.$message.error('加载数据失败')
            })
            this.teamId = id
            
        },
        onSelect (selectedKeys, info) {
            this.selectedKeys = selectedKeys
        },
        handleOk(e){
            this.visible = false;
        },
        clickBtn(){
            
        },
        //卡片改变
        onTabChange(key,type){
            this[type] = key
        },
        //表单提交
        submitPlan(e){
            var worker =''
            var amount = ''
            for(const item of this.planTab){
                worker =''
                amount = ''
                for(const role of item.roles){
                    var data ={
                        id:'',
                        teamId:item.id,
                        roleId:role.role.id,
                        workerId:role.workerId.join(',')
                    }
                    memberRiverSave(data).then(res=>{

                    })

                }
                for(const devices of item.devices){
                    for(const am of devices.workerId){
                        // worker.push(am.workerId)
                        worker = worker +am+','
                    }
                    for( const devi of devices.devices){
                        amount = amount +devi.amount+','
                        // amount.push(devi.amount)
                    }
                }
                var arr ={
                    id:'',
                    teamId:item.id,
                    deviceId:worker,
                    amount:amount
                }
                equipmentRiverSave(arr).then(res=>{

                })
            }
            planPublish(this.id).then(res=>{
                this.$message.success('成功');
                this.spinning=true
                this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getPage()
                this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getinspectPointPage()
                this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.getNowPlan()
            })
            this.visible = false;
        },
        //人员修改
        numberChange(val){
        },
        cancleBtn(){
            this.spinning=true
            this.visible = false;
        },
        changeTab(key){

        },
        editModalTitle(){
            this.editShow = false; 
        },
        sadsadasdsa(e,id){
        },
    }
}
</script>
<style lang="less" scoped>

</style>
