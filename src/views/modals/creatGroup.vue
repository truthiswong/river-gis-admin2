<template>
  <div class="group_info">
    <div class="creat_btn">
      <a-button class="creatBtn" @click="getGroupingSave">创建分组</a-button>
    </div>
    <div class="group_detail">
      <div class="detail_modal">
        <div style="width:100%;">
          <div class="group_title">
            <a-row type="flex" justify="space-between" align="middle">
              <a-col :span="8">
                <span class="group_font">未分组</span>
              </a-col>
            </a-row>
          </div>
          <draggable class="list-group" :list="nothingTaskList" group="people" @change="log">
            <div
              class="list-group-item listItem"
              v-for="element in nothingTaskList"
              :key="element.id"
            >{{element.objectName}}</div>
          </draggable>
        </div>
        <div style="width:100%;" v-for="item in groupingList" :key="item.id">
          <div class="group_title">
            <a-row type="flex" justify="space-between" align="middle">
              <a-col :span="8">
                <span class="group_font">{{item.name}}</span>
              </a-col>
              <a-col :span="3">
                <a-popconfirm
                  title="是否确认删除?"
                  @confirm="getGroupingDel(item.id)"
                  @cancel="cancel"
                  okText="确认"
                  cancelText="取消"
                >
                  <a-button shape="circle" icon="close" style="font-size:8px;"></a-button>
                </a-popconfirm>
              </a-col>
            </a-row>
          </div>
          <draggable class="list-group" :list="item.taskList" group="people" @change="log">
            <div
              class="list-group-item listItem"
              v-for="element in item.taskList"
              :key="element.id"
            >{{element.objectName}}</div>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import '../../assets/css/creatGroup.less'
import { groupingPage, groupingSave, groupingDel, targetPage, targetSetTeam } from '@/api/login'

let data = [{ name: '黄浦江', id: 1 }, { name: '长江', id: 2 }, { name: '黄河', id: 3 }, { name: '鸭绿江', id: 4 }]
let dataTwo = [{ name: '洞庭湖', id: 5 }, { name: '太湖', id: 6 }, { name: '黑龙江', id: 7 }]
export default {
  name: 'creatGroup',
  data() {
    return {
      data,
      dataTwo,
      id: '',
      ishidden: 3,
      taskList: [],
      nothingTaskList: [],
      groupingList: [],
      groupingList1: []
    }
  },
  methods: {
    //生成计划
    planGeneration(id) {
      this.id = id
      var data = {
        id: this.id,
        projectId: this.$store.state.id,
        teamId: 'no'
      }
      targetPage(data).then(res => {
        var arr = res.data.data
        this.nothingTaskList = arr
        this.taskList = arr
      })
      this.getList()
    },
    //判断有无分组
    judge() {
      this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.showPlanJudge(this.groupingList)
    },
    //分组保存
    getGroupingSave() {
      var data = {
        id: '',
        planId: this.id,
        name: ''
      }
      groupingSave(data)
        .then(res => {
          this.$message.success('成功')
          this.getList()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    //分组列表
    getList() {
      var sdsd = {
        projectId: this.$store.state.id,
        id: this.id
      }
      groupingPage(sdsd).then(res => {
        var arr = res.data
        // arr[0].taskList =taskList
        arr.forEach(v => {
          v.taskList = []
          let data = {
            id: this.id,
            teamId: v.id,
            projectId: this.$store.state.id
          }
          targetPage(data).then(res => {
            v.taskList = res.data.data
          })
        })
        this.groupingList = arr
      })
    },
    //分组删除
    getGroupingDel(id) {
      groupingDel(id)
        .then(res => {
          this.$message.success('删除成功')
          this.getList()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    cancel() {},
    nextBtn() {
      this.$emit('showPlan', this.ishidden)
      console.log(this.ishidden)
    },
    add() {
      this.list.push({ name: 'Juan' })
    },
    replace() {
      this.list = [{ name: 'Edgard' }]
    },
    clone(el) {
      return {
        name: el.name + ' cloned'
      }
    },
    log(evt) {
      if (evt.removed != undefined) {
        console.log(evt.removed.element.id)
        for (const item of this.groupingList) {
          for (const ar of item.taskList) {
            if (evt.removed.element.id == ar.id) {
              var data = {
                id: evt.removed.element.id,
                teamId: item.id
              }
              targetSetTeam(data).then(res => {
                // this.getList()
              })
            }
          }
        }
      } else {
      }
      // window.console.log(evt);
    }
  }
}
</script>