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
import { onExport1, onExport2, onExport3, onExport4, onExport5, onExport6, onExport7, onExport8, onExport9, onExport10, onExport11} from '@/api/statistics'

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
      loadingDownload: false,
      dataUrl: ''
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
            if (res.success) {
              this.download(res.data, `巡河汇总表${this.dateString1[0]}~${this.dateString1[1]}`)
            } else {
              return
            }
          })
        }
      } else if (index == 2) {
        // 河道调查统计
        if (this.dateString2.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          let data = {
            projectId: this.$store.state.id,
            startDate: this.dateString2[0],
            endDate: this.dateString2[1]
          }
          onExport2(data).then(res => {
            if (res.success) {
              this.download(res.data, `河道调查统计${this.dateString2[0]}~${this.dateString2[1]}`)
            } else {
              return
            }
          })
        }
      } else if (index == 3) {
        // 排口数量汇总
        if (this.dateString3.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          let data = {
            projectId: this.$store.state.id,
            startDate: this.dateString3[0],
            endDate: this.dateString3[1]
          }
          onExport3(data).then(res => {
            if (res.success) {
              this.download(res.data, `排口数量汇总${this.dateString3[0]}~${this.dateString3[1]}`)
            } else {
              return
            }
          })
        }
      } else if (index == 4) {
        // 风险源数量汇总
        if (this.dateString4.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          let data = {
            projectId: this.$store.state.id,
            startDate: this.dateString4[0],
            endDate: this.dateString4[1]
          }
          onExport4(data).then(res => {
            if (res.success) {
              this.download(res.data, `风险源数量汇总${this.dateString4[0]}~${this.dateString4[1]}`)
            } else {
              return
            }
          })
        }
      } else if (index == 5) {
        // 风险源变化统计
        if (this.dateString5.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          let data = {
            projectId: this.$store.state.id,
            startDate: this.dateString5[0],
            endDate: this.dateString5[1]
          }
          onExport5(data).then(res => {
            if (res.success) {
              this.download(res.data, `风险源变化统计${this.dateString5[0]}~${this.dateString5[1]}`)
            } else {
              return
            }
          })
        }
      } else if (index == 6) {
        // 排口变化统计
        if (this.dateString6.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          let data = {
            projectId: this.$store.state.id,
            startDate: this.dateString6[0],
            endDate: this.dateString6[1]
          }
          onExport6(data).then(res => {
            if (res.success) {
              this.download(res.data, `排口变化统计${this.dateString6[0]}~${this.dateString6[1]}`)
            } else {
              return
            }
          })
        }
      } else if (index == 7) {
        // 风险源明细
        if (this.dateString7.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          let data = {
            projectId: this.$store.state.id,
            startDate: this.dateString7[0],
            endDate: this.dateString7[1]
          }
          onExport7(data).then(res => {
            if (res.success) {
              this.download(res.data, `风险源明细${this.dateString7[0]}~${this.dateString7[1]}`)
            } else {
              return
            }
          })
        }
      } else if (index == 8) {
        // 排口明细
        if (this.dateString8.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          let data = {
            projectId: this.$store.state.id,
            startDate: this.dateString8[0],
            endDate: this.dateString8[1]
          }
          onExport8(data).then(res => {
            if (res.success) {
              this.download(res.data, `排口明细${this.dateString8[0]}~${this.dateString8[1]}`)
            } else {
              return
            }
          })
        }
      } else if (index == 9) {
        // 水面漂浮物明细
        if (this.dateString9.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          let data = {
            projectId: this.$store.state.id,
            startDate: this.dateString9[0],
            endDate: this.dateString9[1]
          }
          onExport9(data).then(res => {
            if (res.success) {
              this.download(res.data, `水面漂浮物明细${this.dateString9[0]}~${this.dateString9[1]}`)
            } else {
              return
            }
          })
        }
      } else if (index == 10) {
        // 督办单明细
        if (this.dateString10.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          let data = {
            projectId: this.$store.state.id,
            startDate: this.dateString10[0],
            endDate: this.dateString10[1]
          }
          onExport10(data).then(res => {
            if (res.success) {
              this.download(res.data, `督办单明细${this.dateString10[0]}~${this.dateString10[1]}`)
            } else {
              return
            }
          })
        }
      } else if (index == 11) {
        // 水质数据统计
        if (this.dateString11.length <= 0) {
          this.$message.warning('请选择日期')
          return
        } else {
          let data = {
            projectId: this.$store.state.id,
            startDate: this.dateString11[0],
            endDate: this.dateString11[1]
          }
          onExport11(data).then(res => {
            if (res.success) {
              this.download(res.data, `水质数据统计${this.dateString11[0]}~${this.dateString11[1]}`)
            } else {
              return
            }
          })
        }
      }
    },
    download(url, name) {
      console.log(name)
      let down = document.createElement('a')
      down.href = url
      down.download = name // 默认为文件的名字
      document.body.appendChild(down)
      down.click()
      down.remove()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
