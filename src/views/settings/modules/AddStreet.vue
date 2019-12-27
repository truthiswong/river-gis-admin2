<template>
  <a-modal
    title="添加街道"
    :width="400"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :mask="true"
    :centered="true"
    :footer=null
    :maskClosable="false"
  >
    <a-spin :spinning="confirmLoading">
      <a-form class="from">
        <p>街道信息</p>
        <a-row style="width:100%">
          <a-col :span="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="街道名称">
              <a-input placeholder="请输入街道名称" v-model="list.name"/>
            </a-form-item>
          </a-col>
        </a-row>
        <p style="margin-top: 10px;">负责人信息</p>
        <a-row style="width:100%">
          <a-col :span="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="姓名">
              <a-input placeholder="请输入姓名" v-model="list.controller"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="职位">
              <a-input placeholder="请输入职位" v-model="list.job"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="24">
            <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="联系电话">
              <a-input placeholder="请输入联系电话" v-model="list.tel"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width:100%; margin-top:10px;" type="flex" justify="space-around">
          <a-col :span="6">
            <a-button type="primary" block @click="handleCancel">取消</a-button>
          </a-col>
          <a-col :span="6">
            <a-button type="primary" block @click="SaveStreet">保存</a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters']
import { informationStreet,getSaveStreet } from '@/api/login'
export default {
  data() {
    return {
      save:'1',
      list:{
        id:'',
        name:'',
        controller:'',
        job:'',
        tel:'',
      },
      region:[],
      labelCol: {
        xs: { span: 18 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 18 }
      },
      visible: false,
      confirmLoading: false,
      selectedItems: [], //风险源类型
      headers: {
        authorization: 'authorization-text'
      },
      form: this.$form.createForm(this)
    }
  },
  computed: {
    filteredOptions() {
      return OPTIONS.filter(o => !this.selectedItems.includes(o))
    }
  },
  methods: {
    add(currentLnglats) {
      this.save = '1'
      this.visible = true
      if (currentLnglats!=undefined) {
        this.region=currentLnglats
      }
    },
    add1() {
      this.save = '2'
      this.visible = true
    },
    //街道详情
    getStreet(id){
      informationStreet(id).then(res => {
        let arr = res.data
        console.log(arr);
        this.list.controller= arr.controller
        this.list.id= arr.id
        this.list.job= arr.job
        this.list.name= arr.name
        this.list.tel= arr.tel
        this.region= arr.region
      }).catch(err => {

      })
    },
    //河道保存
    SaveStreet(){   
      var data = {
        id:this.list.id,
        projectId:this.$store.state.id,
        name:this.list.name,
        controller:this.list.controller,
        job:this.list.job,
        tel:this.list.tel,
      }
      for (let i = 0; i < this.region.length; i++) {
        if (i == 0) {
          data.region =  this.region[i].lng +','+ this.region[i].lat + '|'
        }else if(i ==this.region.length-1 ){
          data.region = data.region +  this.region[i].lng +','+ this.region[i].lat
        }else{
          data.region = data.region +  this.region[i].lng +','+ this.region[i].lat + '|'
        }
      }
      if (this.save == '1') {
        getSaveStreet(data).then(res => {
          this.$message.success('保存成功')
          this.handleCancel()
          this.$parent.getStreetShowList();
          
        }).catch(err => {
          this.$message.error(err.response.data.message)
        })
      }else{
        this.$parent.uploadSave(data);
        this.handleCancel()
      }
      
    },
    //关闭取消输入框
    handleCancel(){
      this.visible = false
      this.list.id=''
      this.list.name=''
      this.list.controller=''
      this.list.job=''
      this.list.tel=''
      this.region=[]
    },
    // 添加河流
    addRiver(value) {
      console.log(value)

    },
    // 风险源类型
    handleChange(selectedItems) {
      this.selectedItems = selectedItems
      console.log(selectedItems)
    },
    // 文件上传
    fileUpload(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    // 标签
    handleChangeTag(value) {
      console.log(`selected ${value}`)
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
    // handleCancel() {
    //   this.visible = false
    // },
    // 选择地址
    onChange(value, selectedOptions) {
      console.log(value, selectedOptions);
    },
    filter(inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
    },
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
