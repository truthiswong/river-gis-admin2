<template>
  <div>
    <a-card>
      <a-breadcrumb style="font-size: 16px;">
        <a-breadcrumb-item>设置</a-breadcrumb-item>
        <a-breadcrumb-item>数据统计汇总</a-breadcrumb-item>
      </a-breadcrumb>
      <a-divider style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>巡河汇总表</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange1" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button @click="onExport(1)">导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>河道调查统计</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange2" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button @click="onExport(2)">导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>排口数量汇总</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange3" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button @click="onExport(3)">导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>风险源数量汇总</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange4" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button @click="onExport(4)">导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>风险源变化统计</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange5" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button @click="onExport(5)">导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>排口变化统计</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange6" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button @click="onExport(6)">导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>风险源明细</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange7" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button @click="onExport(7)">导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>排口明细</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange8" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button @click="onExport(8)">导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>水面漂浮物明细</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange9" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button @click="onExport(9)">导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>督办单明细</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange10" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button @click="onExport(10)">导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>水质数据统计</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange11" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button @click="onExport(11)">导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
    </a-card>
  </div>
</template>

<script>
import { onExport1, onExport2, onExport3} from '@/api/statistics'

export default {
  data() {
    return {
      dateString1: [],
      dateString2: [],
      dateString3: [],
      dateString4: [],
      dateString5: [],
      dateString6: [],
      dateString7: [],
      dateString8: [],
      dateString9: [],
      dateString10: [],
      dateString11: [],
      data: []
    }
  },
  watch: {},
  mounted() {},
  methods: {
    onChange1(date, dateString) {
      this.dateString1 = dateString
    },
    onChange2(date, dateString) {
      this.dateString2 = dateString
    },
    onChange3(date, dateString) {
      this.dateString3 = dateString
    },
    onChange4(date, dateString) {
      this.dateString4 = dateString
    },
    onChange5(date, dateString) {
      this.dateString5 = dateString
    },
    onChange6(date, dateString) {
      this.dateString6 = dateString
    },
    onChange7(date, dateString) {
      this.dateString7 = dateString
    },
    onChange8(date, dateString) {
      this.dateString8 = dateString
    },
    onChange9(date, dateString) {
      this.dateString9 = dateString
    },
    onChange10(date, dateString) {
      this.dateString10 = dateString
    },
    onChange11(date, dateString) {
      this.dateString11 = dateString
    },
    onExport(index) {
      let dataurl = ''
      if (index == 1) {
        // 巡河汇总表
        if (this.dateString1.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          let data = {
            projectId: this.$store.state.id,
            startDate: this.dateString1[0],
            endDate: this.dateString1[1]
          }
          onExport1(data).then(res => {
            let arr = res.data
            console.log(arr)
          })
        }
      } else if (index == 2) {
        // 河道调查统计
        if (this.dateString2.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          dataurl = '2.doc'
        }
      } else if (index == 3) {
        // 排口数量汇总
        if (this.dateString2.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          dataurl = '2.doc'
        }
      } else if (index == 4) {
        // 风险源数量汇总
        if (this.dateString2.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          dataurl = '2.doc'
        }
      } else if (index == 5) {
        // 风险源变化统计
        if (this.dateString2.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          dataurl = '2.doc'
        }
      } else if (index == 6) {
        // 排口变化统计
        if (this.dateString2.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          dataurl = '2.doc'
        }
      } else if (index == 7) {
        // 风险源明细
        if (this.dateString2.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          dataurl = '2.doc'
        }
      } else if (index == 8) {
        // 排口明细
        if (this.dateString2.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          dataurl = '2.doc'
        }
      } else if (index == 9) {
        // 水面漂浮物明细
        if (this.dateString2.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          dataurl = '2.doc'
        }
      } else if (index == 10) {
        // 督办单明细
        if (this.dateString2.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          dataurl = '2.doc'
        }
      } else if (index == 11) {
        // 水质数据统计
        if (this.dateString2.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          dataurl = '2.doc'
        }
      }
      let down = document.createElement('a')
      down.href = dataurl
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
