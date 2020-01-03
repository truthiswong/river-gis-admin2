<template>
  <div class="supervise">
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
                      <p style="margin:0;">河道</p>
                    </a-col>
                    <a-col :span="6">
                      <a-switch size="small" v-model="riverShow" @click="onChangeRiverSwitch" />
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
      <h3 style="font-size: 16px; font-weight: 600; margin:10px 0 0 10px; text-align:center;">街道管理</h3>
      <a-divider style="margin: 10px 0 10px;" />
      <div class="right_content">
        <a-select
          showSearch
          :allowClear="true"
          placeholder="请输入街道"
          optionFilterProp="children"
          style="width: 100%"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          :filterOption="filterOption"
          v-model="defaultRiver"
        >
          <a-select-option
            :value="item.name"
            v-for="(item, index) in streetShowList"
            :key="index"
          >{{item.name}}</a-select-option>
        </a-select>
        <a-list size="small" bordered :dataSource="streetShowList" style="margin-top: 10px;">
          <a-list-item
            slot="renderItem"
            slot-scope="item, index"
            :key="index"
            @click="chooseRiver(item.name, item.id)"
            :class="{active_item: item.clicked}"
          >
            <a-row style="width:100%">
              <a-col :span="20">{{item.name}}</a-col>
              <a-col :span="4" style="text-align:right;">
                <a-popconfirm
                  title="确定要删除吗?"
                  @confirm="confirmDelete(item.id)"
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
        <a-popover title trigger="click" v-model="addRiverShow" class="bottom_add">
          <template slot="content">
            <a-button block @click="addDrawRiver">绘制</a-button>
            <el-upload
              class="upload-demo"
              ref="upload"
              :data="spotList"
              name="kmz"
              :headers="headers"
              action="/server/data/admin/street/save"
              :on-preview="handlePreview"
              :on-success="handleSuccess"
              :on-change="uploadChange"
              :show-file-list="false"
              :on-remove="handleRemove"
              :file-list="fileList"
              accept=".kmz, .kml"
              :limit="1"
              :auto-upload="false"
            >
              <a-button block style="margin-top: 10px;">上传KMZ</a-button>
            </el-upload>
          </template>
          <a-button type="primary" block @click="del1">添加街道</a-button>
        </a-popover>
      </div>
    </div>
    <!-- 鼠标跟随弹窗 -->
    <div
      class="mouse_alert"
      v-show="alertShow"
      :style="{left: alertLeft + 'px', top: alertTop + 'px'}"
    >
      <span>{{defaultRiver}}</span>
    </div>
    <!-- 添加街道 -->
    <add-street ref="addStreet" @cancel="cancelClick" @confirm="confirmClick"></add-street>
  </div>
</template>

<script>
// import WorldMap from "../../components/map/WorldMap.vue";
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import AddStreet from './modules/AddStreet.vue'
import { getRiverList, getStreetList, delStreet } from '@/api/login'
export default {
  name: 'StreetManage',
  components: {
    // 'world-map': WorldMap
    'add-street': AddStreet
  },
  data() {
    return {
      mapType: 'b', // 地图类型
      roadWordChange: true, // 道路标注
      mapLayerWord: '', // 道路层级
      autoDetection: false, // 自动监测点
      peopleDetection: false, // 人工监测点
      riverShow: false, // 河道
      streetShow: false, // 街道
      once: 0, // 移入次数
      riverShowList: [], // 河道
      streetShowList: [ // 街道                     
        //街道
        // {
        //   id: 0,
        //   name: '南京东路',
        //   clicked: true,
        //   lineData: [
        //     { lat: 31.21882, lng: 121.50364 },
        //     { lat: 31.21265, lng: 121.50227 },
        //     { lat: 31.20583, lng: 121.49703 },
        //     { lat: 31.19915, lng: 121.49197 },
        //     { lat: 31.19702, lng: 121.49591 },
        //   ]
        // },
      ],

      upload: '0',
      fileList: [],
      alertLeft: -1000,
      spotList: {
        projectId: '',
        name: '',
        controller: '',
        job: '',
        tel: ''
      },
      headers: {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
        'X-TENANT-ID': this.$store.state.tenantId
      },
      alertTop: -1000,
      alertShow: false,
      defaultRiver: '',

      addRiverShow: false,
      // 地图对象
      map: {},
      polylineHandler: '',
      polygonTool: '', // 创建标注工具对象
      polygon: '', // 多边形对象
      points: []
    }
  },
  watch: {
    $route(){
      this.getStreetShowList()
      this.getRiverShowList()
    }
  },
  mounted() {
    let host
    if (this.$store.state.isTestUrl) {
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

    this.getStreetShowList()
    this.getRiverShowList()
  },
  methods: {
    getStreetShowList() {
      getStreetList(this.$store.state.id)
        .then(res => {
          let arr = res.data.data
          arr.forEach(v => {
            v.lineData = v.region
            v.clicked = false
          })
          this.streetShowList = arr
          this.defaultRiver = this.streetShowList[0].name
          this.drawAllStreet()
        })
        .catch(err => {})
    },
    //河道列表
    getRiverShowList() {
      getRiverList(this.$store.state.id)
        .then(res => {
          let arr = res.data.data
          arr.forEach(v => {
            v.lineData = v.region
            v.clicked = false
          })
          this.riverShowList = arr
          this.drawAllStreet()
        })
        .catch(err => {})
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
    onChangeRiverSwitch() {
      // 河道显示
      console.log(this.riverShow)
      if (this.riverShow) {
        this.drawAllStreet()
        for (const item of this.riverShowList) {
          let polygonStreet = new T.Polygon(item.lineData, {
            color: 'blue', //线颜色
            weight: 3, //线宽
            opacity: 0.5, //透明度
            fillColor: '#FFFFFF', //填充颜色
            fillOpacity: 0, // 填充透明度
            title: item.name, // 名字
            id: item.id // id
          })
          //向地图上添加面
          this.map.addOverLay(polygonStreet)
          polygonStreet.addEventListener('click', this.polygonStreetClick)
          polygonStreet.addEventListener('mouseover', this.polygonStreetMouseover)
          polygonStreet.addEventListener('mousemove', this.polygonStreetMousemove)
          polygonStreet.addEventListener('mouseout', this.polygonStreetMouseout)
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
    },
    // 绘制所有街道
    drawAllStreet() {
      for (const overlay of this.map.getOverlays()) {
        for (const item of this.streetShowList) {
          if (item.id == overlay.options.id) {
            this.map.removeOverLay(overlay)
          }
        }
      }
      for (const item of this.streetShowList) {
        if (item.clicked == true) {
          this.setPolylineFn(item.lineData, 'red', 3, 1, 0, item.id, item.name)
        } else {
          this.setPolylineFn(item.lineData, 'blue', 3, 1, 0, item.id, item.name)
        }
      }
    },
    zoomChange() {
      console.log(this.map.getZoom())
    },
    // 地图选项
    onChange(e) {
      console.log(`checked = ${e.target.checked}`)
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    // 搜索
    handleChange(index) {
      console.log(`selected ${index}`)
      this.streetShowList.forEach(value => {
        if (value.name === index) {
          value.clicked = true
        } else {
          value.clicked = false
        }
      })
    },
    handleBlur() {
      console.log('blur')
    },
    handleFocus() {
      console.log('focus')
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 选中河流
    chooseRiver(index, id) {
      this.defaultRiver = index
      for (const item of this.streetShowList) {
        if (item.id == id) {
          item.clicked = true
          this.map.setViewport(item.lineData)
          // this.map.zoomOut()
          // this.map.addEventListener('zoomend', this.zoomChange)
        } else {
          item.clicked = false
        }
        this.drawAllStreet()
      }
    },
    // 河流删除
    confirmDelete(index) {
      // console.log(index)
      delStreet(index)
        .then(res => {
          this.map.clearOverLays()
          this.$message.success('删除成功')
          this.getStreetShowList()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
      // this.streetShowList.splice(this.streetShowList.findIndex(item => item.name === index), 1)
      // this.$message.success('删除成功')
      // this.drawAllStreet()
      this.defaultRiver = null
    },
    cancelDelete(e) {
      // this.$message.error('Click on No')
    },
    // 绘制按钮
    addDrawRiver() {
      //创建标注工具对象
      if (this.polygonTool) this.polygonTool.close()
      this.polygonTool = new T.PolygonTool(this.map, {
        showLabel: true,
        color: 'blue',
        weight: 3,
        opacity: 0.5,
        fillColor: '#FFFFFF',
        fillOpacity: 0.3,
        showLabel: false
      })
      this.polygonTool.open()
      this.polygonTool.setTips(`<p style="padding:0px;">单击确认起点, 双击结束绘制</p>`)
      this.$notification.warning({
        message: '提示',
        description: '请在地图上将街道绘制出来'
      })
      this.addRiverShow = false
      this.polygonTool.addEventListener('draw', this.addDrawRivered)
    },
    // 绘制完成
    addDrawRivered(e) {
      console.log(e.currentLnglats)
      //创建面对象
      this.$refs.addStreet.add(e.currentLnglats)
    },
    // 绘制取消
    cancelClick() {
      if (this.polygonTool) {
        for (const item of this.polygonTool.getPolygons()) {
          this.map.removeOverLay(item)
        }
      }
    },
    // 绘制确定
    confirmClick() {},
    // 设置绘制的多边形
    setPolylineFn(lineData, color, weight, opacity, fillOpacity, id, title) {
      this.polygon = new T.Polygon(lineData, {
        color: color, //线颜色
        weight: weight, //线宽
        opacity: 0.5, //透明度
        fillColor: '#FFFFFF', //填充颜色
        fillOpacity: fillOpacity, // 填充透明度
        id: id,
        title: title
      })
      //向地图上添加面
      this.map.addOverLay(this.polygon)
      this.polygon.addEventListener('click', this.polygonClick)
      this.polygon.addEventListener('mouseover', this.polygonMouseover)
      this.polygon.addEventListener('mousemove', this.polygonMousemove)
      this.polygon.addEventListener('mouseout', this.polygonMouseout)
    },
    // 多边形点击事件
    polygonClick(index) {
      this.$refs.addStreet.add()
      console.log(index)
      for (const item of this.streetShowList) {
        if (item.id == index.target.options.id) {
          this.$refs.addStreet.getStreet(item.id)
          item.clicked = true
        } else {
          item.clicked = false
        }
      }
    },
    // 多边形移入事件
    polygonMouseover(index) {
      if (this.once == 1) {
        return
      }
      for (const item of this.streetShowList) {
        if (item.id == index.target.options.id) {
          item.clicked = true
          this.defaultRiver = item.name
        } else {
          item.clicked = false
        }
      }
      this.drawAllStreet()
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
      for (const item of this.streetShowList) {
        item.clicked = false
      }
      this.drawAllStreet()
    },
    // 上传按钮
    uploadChange(file, fileList) {
      if (this.upload == '0') {
        this.$refs.addStreet.add1()
        this.fileList = fileList
        this.upload = '1'
      } else {
        this.upload = '0'
        this.fileList = []
      }
    },
    uploadSave(data) {
      this.spotList.projectId = data.projectId
      this.spotList.job = data.job
      this.spotList.name = data.name
      this.spotList.tel = data.tel
      this.spotList.controller = data.controller
      this.$refs.upload.submit()
    },
    del1() {
      this.upload = '0'
      this.fileList = []
    },
    handleSuccess(response, file, fileList) {
      this.getStreetShowList()
      console.log('111')

      this.$message.success('保存成功')
      this.fileList = []
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {}
  }
}
</script>
<style lang="less" scoped>
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
  width: 200px;
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
.mapChange {
  position: fixed;
  left: 10px;
  bottom: 10px;
  width: 120px;
  z-index: 1500;
}
.right {
  position: relative;
  width: 300px;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  // padding: 10px;
  background-color: white;
  .right_content {
    padding: 0 10px;
    width: 100%;
    height: calc(100vh - 170px);
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

  .bottom_add {
    position: absolute;
    left: 10px;
    right: 10px;
    bottom: 10px;
    margin: auto;
    width: 60%;
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
