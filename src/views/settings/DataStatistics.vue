<template>
  <div>
    <a-card>
      <a-breadcrumb style="font-size: 16px;">
        <a-breadcrumb-item>设置</a-breadcrumb-item>
        <a-breadcrumb-item>数据统计汇总</a-breadcrumb-item>
      </a-breadcrumb>
      <a-divider style="margin: 10px 0" />
      <a-row style="" type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>巡河汇总表</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button>导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style="" type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>河道调查统计</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button>导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style="" type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>排口数量汇总</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button>导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style="" type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>风险源数量汇总</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button>导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style="" type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>风险源变化统计</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button>导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style="" type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>排口变化统计</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button>导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style="" type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>风险源明细</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button>导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style="" type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>排口明细</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button>导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style="" type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>水面漂浮物明细</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button>导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style="" type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>督办单明细</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button>导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
      <a-row style="" type="flex" justify="space-between" align="middle">
        <a-col :span="4">
          <span>水质数据统计</span>
        </a-col>
        <a-col :span="16">
          <a-range-picker @change="onChange" />
        </a-col>
        <a-col :span="4" style="text-align: right;">
          <a-button>导出</a-button>
        </a-col>
      </a-row>
      <a-divider dashed style="margin: 10px 0" />
    </a-card>
  </div>
</template>

<script>
import { roleList, roleEnable, roleProhibit, roleDel } from '@/api/login'

export default {
  data() {
    return {
      data: []
    }
  },
  watch: {},
  mounted() {
    this.getList()
  },
  methods: {
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    getList() {
      roleList('')
        .then(res => {
          var arr = res.data.data
          for (let i = 0; i < arr.length; i++) {
            arr[i].type = arr[i].type.name
            arr[i].key = i + 1
          }
          this.data = arr
          console.log(arr)
        })
        .catch(err => {})
    }
  }
}
</script>

<style lang="less" scoped>
</style>
