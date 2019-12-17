<template>
  <div class="supervise">
    <!-- 任务管理 -->
    <div class="left">
      <div id="map" ref="worldMap"></div>
      <!-- <world-map></world-map> -->
      <div class="mapChange">
        <a-row style="width:100%">
          <a-col :span="24">
            <a-checkbox @change="onChange">水质监测点</a-checkbox>
          </a-col>
          <a-col :span="24">
            <a-checkbox @change="onChange">风险源</a-checkbox>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="right">
      <h3
        style="font-size: 16px; font-weight: 600; margin:10px 0 0 10px; text-align:center;"
      >水质监测点管理</h3>
      <a-divider style="margin: 10px 0 0;" />
      <div style="padding: 0 10px">
        <a-tabs defaultActiveKey="1" @change="callback" v-model="actionTab" class="custom_tabs">
          <a-tab-pane tab="固定监测点" key="1">
            <section class="task_face">
              <a-list size="small" bordered :dataSource="fixedPointList" style="margin-top: 10px;">
                <a-list-item
                  slot="renderItem"
                  slot-scope="item, index"
                  :key="index"
                  @click="fixedPoint(item.name, item.id)"
                  :class="{active_item: item.clicked}"
                >
                  <a-row style="width:100%">
                    <a-col :span="20">{{item.name}}</a-col>
                    <a-col :span="4" style="text-align:right;">
                      <a-popconfirm
                        title="确定要删除吗?"
                        @confirm="del(item.id)"
                        @cancel="cancelDelete"
                        okText="确定"
                        cancelText="取消"
                      >
                        <a href="#">删除</a>
                      </a-popconfirm>
                    </a-col>
                  </a-row>
                </a-list-item>
              </a-list>
            </section>
          </a-tab-pane>
          <a-tab-pane tab="人工监测点" key="2" forceRender>
            <section class="task_face">
              <a-list size="small" bordered :dataSource="peoplePointList" style="margin-top: 10px;">
                <a-list-item
                  slot="renderItem"
                  slot-scope="item, index"
                  :key="index"
                  @click="peoplePoint(item.name, item.id)"
                  :class="{active_item: item.clicked}"
                >
                  <a-row style="width:100%">
                    <a-col :span="20">{{item.name}}</a-col>
                    <a-col :span="4" style="text-align:right;">
                      <a-popconfirm
                        title="确定要删除吗?"
                        @confirm="del(item.id)"
                        @cancel="cancelDelete"
                        okText="确定"
                        cancelText="取消"
                      >
                        <a href="#">删除</a>
                      </a-popconfirm>
                    </a-col>
                  </a-row>
                </a-list-item>
              </a-list>
            </section>
          </a-tab-pane>
        </a-tabs>
        <a-button type="primary" block class="bottom_add" @click="addTask">添加</a-button>
      </div>
      <a-button type="primary" block class="bottom_add" @click="addTask">添加</a-button>
    </div>
    <!-- 添加 -->
    <add-water-point ref="addWaterPoint" :pointInfo="pointInfo"></add-water-point>
  </div>
</template>

<script>
import AddWaterPoint from './modules/AddWaterPoint.vue'
import { testingPage, testingDel } from '@/api/login'
export default {
  name: 'TaskManage',
  components: {
    'add-water-point': AddWaterPoint
  },
  data() {
    return {
      addRiverShow: false, // 气泡卡片
      actionTab: '1', //tab
      type: '1',
      fixedPointList: [
        // { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.21493, lng: 121.49566 } },
        // { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.22344, lng: 121.47892 } },
        // { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.20649, lng: 121.47712 } }
      ],
      peoplePointList: [
        // { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.26493, lng: 121.45566 } },
        // { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.27344, lng: 121.43892 } },
        // { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.25649, lng: 121.43712 } }
      ],
      addRiverShow: false,
      addLineShow: false, // 线路任务显示
      addPointShow: false, // 点任务显示
      // 添加线路任务
      checkNick: false,
      form: this.$form.createForm(this),

      // 地图对象
      map: {},
      // 地图节点对象（里面含节点对象、区域对象、任务弹窗对象）
      mapPoint: new Map(),
      pointInfo: { id: '', name: '', clicked: '', latlng: { lat: '', lng: '' } } // 点信息
    }
  },
  watch: {
    $route(){
      this.getLineList()
      this.getRiverStreeList() //获取街道河道
      this.getRoleList()
      this.riverListGet()
      this.getStructDeviceList()
    }
  },
  mounted() {
    this.initMap()
    this.getFixedList()
    this.getManualList()
  },
  methods: {
    //固定监测分页
    getFixedList() {
      var data = {
        id: 'fixed',
        prid: this.$store.state.id
      }
      testingPage(data)
        .then(res => {
          var arr = res.data.data
          arr.forEach(v => {
            v.latlng = v.coordinate
            v.clicked = false
          })
          console.log(arr)

          this.fixedPointList = arr
          this.allPointTask(this.fixedPointList)
        })
        .catch(err => {})
    },
    //人工监测分页
    getManualList() {
      var data = {
        id: 'manual',
        prid: this.$store.state.id
      }
      testingPage(data)
        .then(res => {
          var arr = res.data.data
          arr.forEach(v => {
            v.latlng = v.coordinate
            v.clicked = false
          })
          this.peoplePointList = arr
        })
        .catch(err => {})
    },
    initMap() {
      //初始化地图控件
      let zoom = 14
      this.map = new T.Map('map')
      this.map.centerAndZoom(new T.LngLat(121.495505, 31.21098), zoom)
      this.markerTool = new T.MarkTool(this.map, { follow: true })
    },
    allPointTask(pointLists) {
      this.map.clearOverLays()
      for (const item of pointLists) {
        this.drawAllPoint(item.latlng, item.id, item.name)
      }
    },
    // 添加标注图片
    drawAllPoint(latlng, id, title) {
      let iconUrl
      if (this.actionTab == 1) {
        iconUrl = require('../../assets/img/fixedIcon.png')
      } else {
        iconUrl = require('../../assets/img/peopleIcon.png')
      }
      let icon = new T.Icon({
        iconUrl: iconUrl,
        iconSize: new T.Point(41, 40),
        iconAnchor: new T.Point(21, 40)
      })
      let marker = new T.Marker(latlng, { icon: icon , id: id, title: title})
      this.map.addOverLay(marker)
      marker.addEventListener('click', this.taskPointClick)
      marker.addEventListener('mouseover', this.taskPointMouse)
      marker.addEventListener('mouseout	', this.taskPointMouse)
    },
    // 任务点点击移入移出事件
    taskPointMouse(e) {
      if (this.actionTab == 1) {
        for (const item of this.fixedPointList) {
          if (e.target.options.id === item.id) {
            item.clicked = true
          } else {
            item.clicked = false
          }
        }
      } else {
        for (const item of this.peoplePointList) {
          if (e.target.options.id === item.id) {
            item.clicked = true
          } else {
            item.clicked = false
          }
        }
      }
    },
    // 任务点点击事件
    taskPointClick(e) {
      if (this.actionTab == 1) {
        for (const item of this.fixedPointList) {
          if (e.target.options.id === item.id) {
            item.clicked = true
            this.pointInfo = item
            this.$refs.addWaterPoint.add1(item.id)
          } else {
            item.clicked = false
          }
        }
      } else {
        for (const item of this.peoplePointList) {
          if (e.target.options.id === item.id) {
            item.clicked = true
            this.$refs.addWaterPoint.add1(item.id)
            this.pointInfo = item
          } else {
            item.clicked = false
          }
        }
      }
    },
    // 注册添加固定监测点击事件
    addTaskFixedPoint() {
      let icon = new T.Icon({
        iconUrl: require('../../assets/img/fixedIcon.png'),
        iconSize: new T.Point(41, 40),
        iconAnchor: new T.Point(21, 40)
      })
      let markerTool = new T.MarkTool(this.map, { icon: icon, follow: true })
      markerTool.open()
      markerTool.getMarkers()
      markerTool.addEventListener('mouseup', this.addTaskFixedPointed)
    },
    addTaskFixedPointed(e) {
      this.$refs.addWaterPoint.add(e.currentLnglat, this.type)
      console.log(e)
    },
    // 注册添加固定监测点击事件
    addTaskPeoplePoint() {
      let icon = new T.Icon({
        iconUrl: require('../../assets/img/peopleIcon.png'),
        iconSize: new T.Point(41, 40),
        iconAnchor: new T.Point(21, 40)
      })
      let markerTool = new T.MarkTool(this.map, { icon: icon, follow: true })
      markerTool.open()
      markerTool.getMarkers()
      markerTool.addEventListener('mouseup', this.addTaskPeoplePointed)
    },
    // 返回标注点的坐标
    addTaskPeoplePointed(e) {
      this.$refs.addWaterPoint.add(e.currentLnglat, this.type)
      console.log(e)
    },

    // tab切换
    callback(key) {
      let arr = []
      this.map.clearOverLays()
      this.type = key
      if (key == 1) {
        this.allPointTask(this.fixedPointList)
        for (const item of this.fixedPointList) {
          arr.push(item.latlng)
          // this.map.setViewport(arr)
        }
      } else {
        this.allPointTask(this.peoplePointList)
        for (const item of this.peoplePointList) {
          arr.push(item.latlng)
          // this.map.setViewport(arr)
        }
      }
    },

    // 地图选项
    onChange(e) {
      console.log(`checked = ${e.target.checked}`)
    },
    // 固定监测点
    fixedPoint(index, id) {
      this.defaultRiver = index
      this.fixedPointList.forEach(value => {
        if (value.id === id) {
          value.clicked = true
          let arr = []
          arr.push(value.latlng)
          this.map.setViewport(arr)
        } else {
          value.clicked = false
        }
      })
    },
    // 人工监测点
    peoplePoint(index, id) {
      this.defaultRiver = index
      this.peoplePointList.forEach(value => {
        if (value.id === id) {
          value.clicked = true
          let arr = []
          arr.push(value.latlng)
          this.map.setViewport(arr)
        } else {
          value.clicked = false
        }
      })
    },
    del(index) {
      testingDel(index)
        .then(res => {
          if (this.type == 1) {
            this.getFixedList()
          } else {
            this.getManualList()
          }
          this.$message.success('删除成功')
        })
        .catch(err => {})
    },
    cancelDelete(e) {
      // this.$message.error('Click on No')
    },
    // 添加任务按钮
    addTask() {
      if (this.actionTab == 1) {
        this.addTaskFixedPoint()
      } else {
        this.addTaskPeoplePoint()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.supervise {
  position: relative;
  height: calc(100vh - 64px);
  width: 100vw;
}
#map {
  width: 100%;
  height: 100%;
}
.mapChange {
  position: fixed;
  left: 10px;
  bottom: 10px;
  width: 120px;
  z-index: 1500;
}
.weather {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 120px;
  height: 40px;
  z-index: 999;
}
.menu {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 40px;
  z-index: 999;
  margin: 0;
  padding: 0;
  // overflow: hidden;
  list-style-type: none;
  li {
    width: 100%;
    background: white;
    border-radius: 50%;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
    margin-top: 5px;
    img {
      width: 100%;
      height: 40px;
      padding: 10px;
    }
  }
}

.left {
  position: relative;
  width: calc(100% - 300px);
  height: 100%;
  display: inline-block;
  vertical-align: top;
}
.right {
  position: relative;
  width: 300px;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  // padding: 10px;
  background-color: white;
}
.task_face {
  width: 100%;
  height: calc(100vh - 180px);
  overflow: auto;
}

.ant-spin-container {
  .ant-list-item:hover {
    background-color: #eee;
  }
  .active_item {
    background-color: #eee;
  }
}
.ant-form-item {
  margin-bottom: 0;
}

.bottom_add {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  margin: auto;
  width: 60%;
}
</style>
