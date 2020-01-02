<template>
  <div class="supervise">
    <!-- 任务管理 -->
    <div class="left">
      <div id="map" ref="worldMap"></div>
      <ul class="menu">
        <li>
          <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
            <template slot="content">
              <a-row style="width: 100%;">
                <a-col :span="24">
                  <a-radio-group @change="onMapChange" v-model="mapType">
                    <a-radio-button value="a">2D影像图</a-radio-button>
                    <a-radio-button value="b">卫星影像图</a-radio-button>
                  </a-radio-group>
                </a-col>
              </a-row>
              <a-row style="width: 100%; margin-top: 8px;">
                <a-col :span="16">
                  <span>道路标注</span>
                </a-col>
                <a-col :span="8" style="text-align: right;">
                  <a-switch size="small" v-model="roadWordChange" @click="onChangeSwitch" />
                </a-col>
              </a-row>
            </template>
            <template slot="title">
              <span>图像</span>
            </template>
            <img src="../../assets/img/map.png" alt="图像" title="图像" />
          </a-popover>
        </li>
        <li>
          <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
            <template slot="content" style="overflow-y: scroll;">
              <a-list size="small">
                <a-list-item>
                  <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                    <a-col :span="18">
                      <p style="margin:0;">街道</p>
                    </a-col>
                    <a-col :span="6">
                      <a-switch size="small" v-model="streetShow" />
                    </a-col>
                  </a-row>
                </a-list-item>
                <a-list-item>
                  <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                    <a-col :span="18">
                      <p style="margin:0;">河道</p>
                    </a-col>
                    <a-col :span="6">
                      <a-switch size="small" v-model="riverShow" />
                    </a-col>
                  </a-row>
                </a-list-item>
              </a-list>
            </template>
            <template slot="title">
              <span>更多</span>
            </template>
            <img src="../../assets/img/more.png" alt="更多" title="更多" />
          </a-popover>
        </li>
      </ul>
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
    <!-- 鼠标跟随弹窗 -->
    <div
      class="mouse_alert"
      v-show="alertShow"
      :style="{left: alertLeft + 'px', top: alertTop + 'px'}"
    >
      <span>{{defaultRiver}}</span>
    </div>
    <!-- 添加 -->
    <add-water-point ref="addWaterPoint" :pointInfo="pointInfo" @cancel="cancelClick" @confirm="confirmClick"></add-water-point>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import AddWaterPoint from './modules/AddWaterPoint.vue'
import { testingPage, testingDel, getRiverList, getStreetList } from '@/api/login'
export default {
  name: 'TaskManage',
  components: {
    'add-water-point': AddWaterPoint
  },
  data() {
    return {
      mapType: 'b', // 地图类型
      roadWordChange: true, // 道路标注
      mapLayerWord: '', // 道路层级
      riverShow: false, // 河道
      streetShow: false, // 街道
      once: 0, // 移入次数
      riverShowList: [], // 河道
      streetShowList: [], //街道
      defaultRiver: '',
      alertLeft: -1000,
      alertTop: -1000,
      alertShow: false,

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
      addLineShow: false, // 线路任务显示
      addPointShow: false, // 点任务显示
      // 添加线路任务
      checkNick: false,
      form: this.$form.createForm(this),

      // 地图对象
      map: {},
      pointInfo: { id: '', name: '', clicked: '', latlng: { lat: '', lng: '' } } // 点信息
    }
  },
  watch: {
    $route() {
      this.getLineList()
      this.getRiverStreeList() //获取街道河道
      this.getRoleList()
      this.riverListGet()
      this.getStructDeviceList()
    },
    // 河道显示
    riverShow() {
      this.watchAllSwitch()
    },
    // 街道显示
    streetShow() {
      this.watchAllSwitch()
    }
  },
  mounted() {
    let host
    if (true) {
      host = this.$store.state.testServerUrl
    } else {
      host = this.$store.state.prodServerUrl
    }
    let token = Vue.ls.get(ACCESS_TOKEN)
    let zoom = 14
    let twoDimensionURL =
      'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
    this.mapLayer2d = new T.TileLayer(twoDimensionURL, { minZoom: 4, maxZoom: 18, zIndex: 10 })
    let satelliteURL = 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
    this.mapLayerSatellite = new T.TileLayer(satelliteURL, { minZoom: 4, maxZoom: 18, zIndex: 10 })
    // 创建自定义图层对象
    let wordLabel = 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
    this.mapLayerWord = new T.TileLayer(wordLabel, { minZoom: 4, maxZoom: 18, zIndex: 15 })
    // 正射影像
    let mapImage = `${host}/server/data/admin/regulator/uav/data/mbtiles?year=&month&day&x={x}&y={y}&z={z}&X-TENANT-ID=jl:jlgis@2019&Authorization=${token}`
    this.mapLayerImage = new T.TileLayer(mapImage, { minZoom: 4, maxZoom: 23, zIndex: 12 })
    this.map = new T.Map('map', {
      minZoom: 4,
      maxZoom: 23,
      layers: [this.mapLayerSatellite, this.mapLayerWord, this.mapLayerImage]
    })
    this.map.centerAndZoom(new T.LngLat(121.43429, 31.15847), zoom)
    //添加比例尺控件
    let scale = new T.Control.Scale()
    // scale.setColor("red")
    this.map.addControl(scale)
    // this.scale.setColor({color: '#f00'})

    this.getFixedList()
    this.getManualList()
    this.getRiverStreeList()
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
      let marker = new T.Marker(latlng, { icon: icon, id: id, title: title })
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
      this.markerTool = new T.MarkTool(this.map, { icon: icon, follow: true })
      this.markerTool.open()
      this.markerTool.getMarkers()
      this.markerTool.addEventListener('mouseup', this.addTaskFixedPointed)
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
      this.markerTool = new T.MarkTool(this.map, { icon: icon, follow: true })
      this.markerTool.open()
      this.markerTool.getMarkers()
      this.markerTool.addEventListener('mouseup', this.addTaskPeoplePointed)
    },
    // 返回标注点的坐标
    addTaskPeoplePointed(e) {
      this.$refs.addWaterPoint.add(e.currentLnglat, this.type)
      console.log(e)
    },
    // 绘制取消
    cancelClick() {
      if (this.markerTool) {
        for (const item of this.markerTool.getMarkers()) {
          this.map.removeOverLay(item)
        }
      }
    },
    // 绘制确定
    confirmClick() {},
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
    },
    // 图像
    onMapChange(e) {
      if (e.target.value == 'a') {
        this.map.addLayer(this.mapLayer2d)
        this.map.removeLayer(this.mapLayerSatellite)
      } else if (e.target.value == 'b') {
        this.map.addLayer(this.mapLayerSatellite)
        this.map.removeLayer(this.mapLayer2d)
      }
    },
    // 道路开关
    onChangeSwitch() {
      if (this.roadWordChange) {
        this.map.addLayer(this.mapLayerWord)
      } else {
        this.map.removeLayer(this.mapLayerWord)
      }
    },
    // 获取所有河道街道列表
    getRiverStreeList() {
      getStreetList(this.$store.state.id)
        .then(res => {
          let arr = res.data.data
          arr.forEach(v => {
            v.lineData = v.region
            v.clicked = false
          })
          this.streetShowList = arr
        })
        .catch(err => {})
      getRiverList(this.$store.state.id)
        .then(res => {
          let arr = res.data.data
          arr.forEach(v => {
            v.lineData = v.region
            v.clicked = false
          })
          this.riverShowList = arr
        })
        .catch(err => {})
    },
    // 检测所有开关
    watchAllSwitch() {
      // 街道显示
      if (this.streetShow) {
        for (const item of this.streetShowList) {
          let polygon = new T.Polygon(item.lineData, {
            color: 'blue', //线颜色
            weight: 3, //线宽
            opacity: 0.5, //透明度
            fillColor: '#FFFFFF', //填充颜色
            fillOpacity: 0, // 填充透明度
            title: item.name, // 名字
            id: item.id // id
          })
          //向地图上添加面
          this.map.addOverLay(polygon)
          polygon.addEventListener('click', this.polygonStreetClick)
          polygon.addEventListener('mouseover', this.polygonStreetMouseover)
          polygon.addEventListener('mousemove', this.polygonStreetMousemove)
          polygon.addEventListener('mouseout', this.polygonStreetMouseout)
        }
      } else {
        for (const overlay of this.map.getOverlays()) {
          for (const item of this.streetShowList) {
            if (item.id == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
          }
        }
      }
      // 河道显示
      if (this.riverShow) {
        for (const item of this.riverShowList) {
          let polygon = new T.Polygon(item.lineData, {
            color: 'blue', //线颜色
            weight: 3, //线宽
            opacity: 0.5, //透明度
            fillColor: '#FFFFFF', //填充颜色
            fillOpacity: 0, // 填充透明度
            title: item.name, // 名字
            id: item.id // id
          })
          //向地图上添加面
          this.map.addOverLay(polygon)
          polygon.addEventListener('click', this.polygonRiverClick)
          polygon.addEventListener('mouseover', this.polygonMouseover)
          polygon.addEventListener('mousemove', this.polygonMousemove)
          polygon.addEventListener('mouseout', this.polygonMouseout)
        }
      } else {
        for (const overlay of this.map.getOverlays()) {
          for (const item of this.riverShowList) {
            if (item.id == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
          }
        }
      }
    },
    // 多边形点击事件
    polygonRiverClick(index) {
      console.log(index)
    },
    // 多边形移入事件
    polygonMouseover(index) {
      if (this.once == 1) {
        return
      }
      for (const item of this.riverShowList) {
        if (item.id == index.target.options.id) {
          this.defaultRiver = item.name
        }
      }
      this.once++
    },
    polygonMousemove() {
      let event = event || window.event //兼容写法
      this.alertLeft = event.pageX + 10
      this.alertTop = event.pageY - 44
      this.alertShow = true
    },
    // 多边形移出事件
    polygonMouseout() {
      this.once--
      this.alertShow = false
    },
    // 多边形点击事件
    polygonStreetClick(index) {
      console.log(index)
    },
    // 多边形移入事件
    polygonStreetMouseover(index) {
      if (this.once == 1) {
        return
      }
      for (const item of this.streetShowList) {
        if (item.id == index.target.options.id) {
          this.defaultRiver = item.name
        }
      }
      this.once++
    },
    polygonStreetMousemove() {
      let event = event || window.event //兼容写法
      this.alertLeft = event.pageX + 10
      this.alertTop = event.pageY - 44
      this.alertShow = true
    },
    // 多边形移出事件
    polygonStreetMouseout() {
      this.once--
      this.alertShow = false
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

.weather {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 120px;
  height: 40px;
  z-index: 999;
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
}
.bottom_add {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  margin: auto;
  width: 60%;
}

.mouse_alert {
  position: absolute;
  z-index: 999;
  border: 1px solid #333;
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  padding: 0 4px;
  border-radius: 3px;
  box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.5);
  span {
    color: rgba(255, 0, 0, 0.8);
    font-size: 14px;
  }
}
.menu {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 36px;
  z-index: 888;
  margin: 0;
  padding: 0;
  list-style-type: none;
  li {
    width: 100%;
    background: white;
    border-radius: 50%;
    box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
    margin-top: 10px;
    img {
      width: 100%;
      height: 36px;
      padding: 10px;
    }
  }
}
.ant-col-6 {
  text-align: right;
}
</style>
