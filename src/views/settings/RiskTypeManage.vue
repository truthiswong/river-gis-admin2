<template>
  <div>
    <a-card>
      <a-breadcrumb style="font-size: 16px;">
        <a-breadcrumb-item>设置</a-breadcrumb-item>
        <a-breadcrumb-item>风险源类型管理</a-breadcrumb-item>
      </a-breadcrumb>
      <a-divider style="margin: 10px 0" />
      <a-button
        type="primary"
        icon="plus"
        style="margin-bottom:15px"
        @click="visible=true"
        v-show="jurisdiction"
      >添加</a-button>
      <a-table :columns="columns" :dataSource="data" bordered>
        <template slot="type" slot-scope="row">
          <viewer>
            <embed :src="row.icon" alt style="width:80px;" />
          </viewer>
        </template>
        <template slot="type1" slot-scope="row">
          <viewer>
            <embed :src="row.icon2" alt style="width:80px;" />
          </viewer>
        </template>
        <template slot="operation" slot-scope="row">
          <div v-show="jurisdiction">
            <a @click="add(row.id)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="是否确认删除?"
              @confirm="confirm"
              @cancel="cancel"
              okText="确认"
              cancelText="取消"
            >
              <a @click="del(row.id)">删除</a>
            </a-popconfirm>
          </div>
        </template>
      </a-table>
    </a-card>
    <a-modal v-model="visible" @ok="submitUpload" @cancel="handleCancel" class="custom_modal">
      <template slot="closeIcon">
        <a-icon type="close-circle" />
      </template>
      <template slot="title">
        <span>添加/编辑风险源</span>
      </template>
      <a-form>
        <a-form-item label="风险源类型名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
          <a-input placeholder="请输入风险源类型名称" v-model="list.name" />
        </a-form-item>
        <a-form-item label="PC标注样式" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
          <el-upload
            class="upload-demo"
            ref="upload"
            :data="list"
            name="icon"
            :headers="headers"
            action="/server/data/admin/param/save"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :file-list="fileList"
            :limit="1"
            :auto-upload="false"
          >
            <a-button type="primary" icon="plus">添加</a-button>
          </el-upload>
          <viewer>
            <img :src="attachmentJpg" alt style="width:70px" />
          </viewer>
        </a-form-item>
        <a-form-item label="APP标注样式" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
          <el-upload
            class="upload-demo"
            ref="upload1"
            :data="list"
            name="icon2"
            :headers="headers"
            action="/server/data/admin/param/save"
            :on-preview="handlePreview"
            :on-success="handleSuccess1"
            :on-change="handleChange1"
            :on-remove="handleRemove"
            :file-list="fileList1"
            :limit="1"
            :auto-upload="false"
          >
            <a-button type="primary" icon="plus">添加</a-button>
          </el-upload>
          <viewer>
            <img :src="attachmentJpg1" alt style="width:70px" />
          </viewer>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { paramList, paramSave, paramDel } from '@/api/login'
const columns = [
  {
    title: '序号',
    width: 80,
    dataIndex: 'key'
  },
  {
    title: '风险源类型名称',
    dataIndex: 'name'
  },
  {
    title: 'PC标注样式',
    scopedSlots: { customRender: 'type' }
  },
  {
    title: 'APP标注样式',
    scopedSlots: { customRender: 'type1' }
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    width: 160
  }
]
export default {
  data() {
    return {
      jurisdiction: this.$store.state.operationPermission[8], //权限
      fileList: [],
      attachmentJpg: '',
      fileList1: [],
      attachmentJpg1: '',
      id: '',
      list: {
        name: '',
        id: '',
        type: 'risk_source_type'
      },
      ruleValidate: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      visible: false,
      columns,
      data: [],
      headers: {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
        'X-TENANT-ID': this.$store.state.tenantId
      }
    }
  },
  watch: {
    $route() {
      this.getList()
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      var data = {
        type: 'risk_source_type'
      }
      paramList(data)
        .then(res => {
          var arr = res.data
          for (let i = 0; i < arr.length; i++) {
            arr[i].key = i + 1
          }
          this.data = arr
        })
        .catch(err => {})
    },
    handleCancel(e) {
      this.visible = false
      this.file = false
      this.fileList = []
      this.list.id = ''
      this.list.name = ''
      this.attachmentJpg = ''
    },
    add(id) {
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].id == id) {
          this.list.name = this.data[i].name
          this.attachmentJpg = this.data[i].icon
          this.attachmentJpg1 = this.data[i].icon2
          break
        }
      }
      this.list.id = id
      this.visible = true
    },
    del(id) {
      this.id = id
    },
    confirm(e) {
      var data = {
        id: this.id
      }
      paramDel(data)
        .then(res => {
          this.$message.success('删除成功')
          this.getList()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    cancel(e) {},
    submitUpload() {
      if (this.attachmentJpg != '' && this.attachmentJpg1 != '') {
        if (this.fileList.length == 0 && this.fileList1.length == 0) {
          var data = this.list
          paramSave(data)
            .then(res => {
              this.$message.success('保存成功')
              this.visible = false
              this.visible1 = false
              this.list.id = ''
              this.list.name = ''
              this.attachmentJpg = ''
              this.attachmentJpg1 = ''
              this.getList()
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else if (this.fileList.length != 0) {
          this.$refs.upload.submit()
        } else if (this.fileList1.length != 0) {
          this.$refs.upload1.submit()
        }
      } else {
        this.$message.error('图片不能为空')
      }
    },
    handleSuccess(response, file, fileList) {
      if (this.fileList1.length != 0) {
        this.list.id = response.data.id
        this.$refs.upload1.submit()
      } else {
        this.visible = false
        this.visible1 = false
        this.$message.success('保存成功')
        this.list.id = ''
        this.list.name = ''
        this.getList()
        this.attachmentJpg = ''
      }
    },
    handleChange(file, fileList) {
      if (this.fileList.length == 0) {
        this.fileList = fileList
      } else {
        this.fileList = []
      }
      console.log(file, fileList)
      this.attachmentJpg = ''
      this.attachmentJpg = URL.createObjectURL(file.raw)
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    handleSuccess1(response, file, fileList) {
      this.visible = false
      this.visible1 = false
      this.$message.success('保存成功')
      this.list.id = ''
      this.list.name = ''
      this.getList()
      this.attachmentJpg = ''
      this.attachmentJpg1 = ''
    },
    handleChange1(file, fileList) {
      if (this.fileList1.length == 0) {
        this.fileList1 = fileList
      } else {
        this.fileList1 = []
      }
      this.attachmentJpg1 = URL.createObjectURL(file.raw)
    }
  }
}
</script>

<style lang="less" >
.ant-form input[type='file'] {
  display: none;
}
</style>
