<template>
  <div>
    <a-modal
      :visible="visible"
      @ok="submitPlan"
      @cancel="cancleBtn"
      :maskClosable="false"
      class="custom_modal"
      v-dragModal
    >
      <template slot="closeIcon">
        <a-icon type="close-circle" />
      </template>
      <template slot="title">
        <span>追加任务</span>
      </template>
      <a-form :form="addPlan" @submit="submitPlan" style="margin:10px 0;">
        <a-form-item label="名称" :label-col="{span:6}" :wrapper-col="{span:16}">
          <a-input placeholder="请输入任务名称"></a-input>
        </a-form-item>
        <a-form-item label="任务类型" :label-col="{span:6}" :wrapper-col="{span:16}">
          <a-select>
            <a-select-option value="无人机">无人机</a-select-option>
            <a-select-option value="采水样">采水样</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="任务内容" :label-col="{ span: 6}" :wrapper-col="{ span: 16}">
          <a-textarea placeholder="Basic usage" :rows="4" />
        </a-form-item>
        <a-form-item
          label="位置"
          :label-col="{ span: 6}"
          :wrapper-col="{ span: 16 }"
          style="text-align:left;"
        >
          <span style="cursor: pointer;color: #2fa0ec;font-size:12px;">选择位置（地图上选点/画线）</span>
        </a-form-item>
        <a-form-item label="任务职位" :label-col="{ span: 6}" :wrapper-col="{ span: 16 }">
          <a-select style="width: 100%">
            <a-select-option value="选择任务">选择任务</a-select-option>
            <a-select-option value="采水样">采水样</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          label="是否紧急"
          :label-col="{ span: 6}"
          :wrapper-col="{ span: 16 }"
          style="text-align:left;"
        >
          <a-checkbox>紧急任务</a-checkbox>
        </a-form-item>
        <a-form-item
          label="图片上传"
          :label-col="{ span: 6}"
          :wrapper-col="{ span: 16 }"
          style="text-align:left;"
        >
          <a-upload name="file" :multiple="true" action="''">
            <a-button>
              <a-icon type="upload" />Click to Upload
            </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'addNewTask',
  data() {
    return {
      visible: false,
      addPlan: {}
    }
  },
  methods: {
    showtask() {
      this.visible = true
    },
    submitPlan(e) {
      // e.preventDefault();
      console.log(e)
      this.visible = false
    },
    cancleBtn() {
      this.visible = false
    }
  }
}
</script>

<style scoped>
</style>