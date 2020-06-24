<template>
  <div>
    <a-card>
      <a-breadcrumb style="font-size: 16px;">
        <a-breadcrumb-item>设置</a-breadcrumb-item>
        <a-breadcrumb-item>数据统计汇总</a-breadcrumb-item>
      </a-breadcrumb>
      <a-divider style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="11">选择时间</a-col>
        <a-divider dashed type="vertical" style="height:2em; border-left: 1px dashed #e8e8e8;" />
        <a-col :span="11">
          <a-range-picker @change="onChange" />
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="11">
          <a-row style type="flex" justify="space-between" align="middle">
            <a-col :span="16">巡河汇总表</a-col>
            <a-col :span="8" style="text-align: right;">
              <a-button @click="onExport(1)">导出</a-button>
            </a-col>
          </a-row>
        </a-col>
        <a-divider dashed type="vertical" style="height:2em; border-left: 1px dashed #e8e8e8;" />
        <a-col :span="11">
          <a-row style type="flex" justify="space-between" align="middle">
            <a-col :span="16">河道调查统计</a-col>
            <a-col :span="8" style="text-align: right;">
              <a-button @click="onExport(2)">导出</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="11">
          <a-row style type="flex" justify="space-between" align="middle">
            <a-col :span="16">排口数量汇总</a-col>
            <a-col :span="8" style="text-align: right;">
              <a-button @click="onExport(3)">导出</a-button>
            </a-col>
          </a-row>
        </a-col>
        <a-divider dashed type="vertical" style="height:2em; border-left: 1px dashed #e8e8e8;" />
        <a-col :span="11">
          <a-row style type="flex" justify="space-between" align="middle">
            <a-col :span="16">风险源数量汇总</a-col>
            <a-col :span="8" style="text-align: right;">
              <a-button @click="onExport(4)">导出</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="11">
          <a-row style type="flex" justify="space-between" align="middle">
            <a-col :span="16">风险源变化统计</a-col>
            <a-col :span="8" style="text-align: right;">
              <a-button @click="onExport(5)">导出</a-button>
            </a-col>
          </a-row>
        </a-col>
        <a-divider dashed type="vertical" style="height:2em; border-left: 1px dashed #e8e8e8;" />
        <a-col :span="11">
          <a-row style type="flex" justify="space-between" align="middle">
            <a-col :span="16">排口变化统计</a-col>
            <a-col :span="8" style="text-align: right;">
              <a-button @click="onExport(6)">导出</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="11">
          <a-row style type="flex" justify="space-between" align="middle">
            <a-col :span="16">风险源明细</a-col>
            <a-col :span="8" style="text-align: right;">
              <a-button @click="onExport(7)">导出</a-button>
            </a-col>
          </a-row>
        </a-col>
        <a-divider dashed type="vertical" style="height:2em; border-left: 1px dashed #e8e8e8;" />
        <a-col :span="11">
          <a-row style type="flex" justify="space-between" align="middle">
            <a-col :span="16">排口明细</a-col>
            <a-col :span="8" style="text-align: right;">
              <a-button @click="onExport(8)">导出</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="11">
          <a-row style type="flex" justify="space-between" align="middle">
            <a-col :span="16">水面漂浮物明细</a-col>
            <a-col :span="8" style="text-align: right;">
              <a-button @click="onExport(9)">导出</a-button>
            </a-col>
          </a-row>
        </a-col>
        <a-divider dashed type="vertical" style="height:2em; border-left: 1px dashed #e8e8e8;" />
        <a-col :span="11">
          <a-row style type="flex" justify="space-between" align="middle">
            <a-col :span="16">督办单明细</a-col>
            <a-col :span="8" style="text-align: right;">
              <a-button @click="onExport(10)">导出</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="11">
          <a-row style type="flex" justify="space-between" align="middle">
            <a-col :span="16">水质数据统计</a-col>
            <a-col :span="8" style="text-align: right;">
              <a-button @click="onExport(11)">导出</a-button>
            </a-col>
          </a-row>
        </a-col>
        <a-divider dashed type="vertical" style="height:2em; border-left: 1px dashed #e8e8e8;" />
        <a-col :span="11">
          <a-row style type="flex" justify="space-between" align="middle"></a-row>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
    </a-card>
  </div>
</template>

<script>
import {
  onExport1,
  onExport2,
  onExport3,
  onExport4,
  onExport5,
  onExport6,
  onExport7,
  onExport8,
  onExport9,
  onExport10,
  onExport11
} from '@/api/statistics'

export default {
  data() {
    return {
      dateString: [],
      loadingDownload: false,
      dataUrl: ''
    }
  },
  watch: {},
  mounted() {},
  methods: {
    onChange(date, dateString) {
      console.log(dateString)
      this.dateString = dateString
    },
    onExport(index) {
      if (this.dateString.length <= 0) {
        this.$message.warning('请选择日期')
      } else {
        let data = {
          projectId: this.$store.state.id,
          startDate: this.dateString[0],
          endDate: this.dateString[1]
        }
        if (index == 1) {
          // 巡河汇总表
          onExport1(data)
            .then(res => {
              this.download(res.data)
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else if (index == 2) {
          // 河道调查统计
          onExport2(data)
            .then(res => {
              this.download(res.data)
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else if (index == 3) {
          // 排口数量汇总
          onExport3(data)
            .then(res => {
              this.download(res.data)
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else if (index == 4) {
          // 风险源数量汇总
          onExport4(data)
            .then(res => {
              this.download(res.data)
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else if (index == 5) {
          // 风险源变化统计
          onExport5(data)
            .then(res => {
              this.download(res.data)
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else if (index == 6) {
          // 排口变化统计
          onExport6(data)
            .then(res => {
              this.download(res.data)
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else if (index == 7) {
          // 风险源明细
          onExport7(data)
            .then(res => {
              this.download(res.data)
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else if (index == 8) {
          // 排口明细
          onExport8(data)
            .then(res => {
              this.download(res.data)
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else if (index == 9) {
          // 水面漂浮物明细
          onExport9(data)
            .then(res => {
              this.download(res.data)
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else if (index == 10) {
          // 督办单明细
          onExport10(data)
            .then(res => {
              this.download(res.data)
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else if (index == 11) {
          // 水质数据统计
          onExport11(data)
            .then(res => {
              this.download(res.data)
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        }
      }
    },
    download(url) {
      let down = document.createElement('a')
      down.href = url
      down.download = '' // 默认为文件的名字
      document.body.appendChild(down)
      down.click()
      down.remove()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
