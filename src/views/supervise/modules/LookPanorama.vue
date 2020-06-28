<template>
  <div id="wrapper">
    <div class="left">
      <div id="pano"></div>
      <a-button class="log_out" @click="logOut">退出360</a-button>
    </div>
    <div class="right">
      <div id="panorama_map"></div>
    </div>
  </div>
</template>
<script>
import { panoramaImgList } from '@/api/login'
import PhotoSphereViewer from 'photo-sphere-viewer'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
export default {
  name: 'vtour',
  components: {},
  props: {
    msg: {
      id: '',
      panoramaPoints: []
    }
  },
  data() {
    return {
      // 地图对象
      panoramaMap: {},
      panoramaPoints: [
        // {
        //   id: 0,
        //   name: '监测点1',
        //   clicked: false,
        //   latlng: { lat: 31.21493, lng: 121.49566 },
        //   url: require('./img/test36001.jpg')
        // },
        // {
        //   id: 1,
        //   name: '监测点2',
        //   clicked: false,
        //   latlng: { lat: 31.22344, lng: 121.47892 },
        //   url: require('./img/test3602.jpg')
        // },
        // {
        //   id: 2,
        //   name: '监测点3',
        //   clicked: false,
        //   latlng: { lat: 31.20649, lng: 121.47712 },
        //   url: require('./img/test36001.jpg')
        // }
      ],
      panoramaLink: require('../img/test36001.jpg'), // 360链接
      panoramaName: 'test', // 360名字
      panoramaId: '12356' // 360id
    }
  },
  mounted() {
    //初始化地图控件
    let zoom = 14
    this.panoramaMap = new T.Map('panorama_map')
    this.panoramaMap.centerAndZoom(new T.LngLat(121.43429, 31.15847), zoom)
    //创建比例尺控件对象
    //添加比例尺控件
    this.panoramaMap.addControl(new T.Control.Scale())
    this.panoramaMap.setMinZoom(4)
    this.panoramaMap.setMaxZoom(18)
    this.getList()
  },
  methods: {
    getList() {
      this.msg.panoramaPoints.forEach(v => {
        v.url = require('../img/test36001.jpg')
      })
      let markerTool
      for (const item of this.msg.panoramaPoints) {
        if (item.id == this.msg.id) {
          let icon = new T.Icon({
            iconUrl: require('../img/panAddress.png'),
            iconSize: new T.Point(39, 40),
            iconAnchor: new T.Point(20, 40)
          })
          markerTool = new T.Marker(item.latlng, { icon: icon, title: item.name, id: item.id, zIndexOffset: 66 })
          let arr = []
          arr.push(item.latlng)
          this.panoramaMap.setViewport(arr)
          this.panoramaMap.setZoom(14)
        } else {
         let icon = new T.Icon({
          iconUrl: require('../img/360.png'),
          iconSize: new T.Point(41, 40),
          iconAnchor: new T.Point(21, 40)
        })
        markerTool = new T.Marker(item.latlng, { icon:icon,title: item.name, id: item.id })
        }
        this.panoramaMap.addOverLay(markerTool)
        markerTool.addEventListener('click', this.panoramaPointClick)
      }
      panoramaImgList(this.msg.id).then(res => {
        this.panoramaLink = res.data.panoramicPic
        this.panoramaName = res.data.title
        this.panoramaId = this.msg.id
        this.initPhotoSphere()
      })
    },
    // 360全景图
    onPanorama() {
      let markerTool
      for (const item of this.panoramaPoints) {
        let icon = new T.Icon({
          iconUrl: require('../img/360.png'),
          iconSize: new T.Point(41, 40),
          iconAnchor: new T.Point(21, 40)
        })
        markerTool = new T.Marker(item.latlng, { icon:icon,title: item.name, id: item.id })
        this.panoramaMap.addOverLay(markerTool)
        markerTool.addEventListener('click', this.panoramaPointClick)
        if (this.panoramaId == item.id) {
          this.panoramaLink = item.url
          this.panoramaName = item.name
        }
      }
      this.initPhotoSphere()
    },
    // 360点点击事件
    panoramaPointClick(e) {
      this.panoramaMap.clearOverLays()
      let markerTool
      for (const item of this.msg.panoramaPoints) {
        if (item.id == e.target.options.id) {
          var icon = new T.Icon({
            iconUrl: require('../img/panAddress.png'),
            iconSize: new T.Point(39, 40),
            iconAnchor: new T.Point(20, 40)
          })
          markerTool = new T.Marker(item.latlng, { icon: icon, title: item.name, id: item.id, zIndexOffset: 66 })
          let arr = []
          arr.push(item.latlng)
          this.panoramaMap.setViewport(arr)
          this.panoramaMap.setZoom(14)
          if (this.panoramaId != item.id) {
            panoramaImgList(item.id).then(res => {
              this.panoramaLink = res.data.panoramicPic
              this.panoramaName = res.data.title
              this.panoramaId = res.data.id
              this.PSV.setPanorama(this.panoramaLink)
              this.PSV.setCaption(res.data.title)
            })
          }
        } else {
          let icon = new T.Icon({
            iconUrl: require('../img/360.png'),
            iconSize: new T.Point(41, 40),
            iconAnchor: new T.Point(21, 40)
          })
          markerTool = new T.Marker(item.latlng, { icon:icon,title: item.name, id: item.id })
        }
        this.panoramaMap.addOverLay(markerTool)
        markerTool.addEventListener('click', this.panoramaPointClick)
      }
    },
    initPhotoSphere() {
      this.PSV = PhotoSphereViewer({
        container: document.getElementById('pano'),
        panorama: this.panoramaLink,
        caption: this.panoramaName,
        size: {
          width: '100%',
          height: '100%'
        },
        time_anim: false,
        default_long: 1.4441088145446443,
        default_lat: 0.0800613513013615,
        default_long: Math.PI / 2,
        default_fov: 90,
        sphere_correction: { pan: 30.01, tilt: 0, roll: 0 },
        // max_fov: 100,         // 最大缩放值
        // min_fov: 99,          // 最小缩放值
        // default_fov: 100, // 默认缩放值，在1-179之间
        // latitude_range: [0,0],//禁止上下滑动
        // mousewheel: false,    // 禁止鼠标滚轮缩放
        // navbar: false,
        // navbar: ['autorotate', 'zoom', 'markers', 'caption', 'fullscreen'],
        navbar: ['autorotate', 'zoom', 'caption', 'download', 'fullscreen'],
        theta_offset: 1000 // 旋转速度
        // markers: this.markersData
      })
    },
    logOut() {
      this.$emit('exitPanorama')
      // this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
#wrapper {
  position: absolute;
  top: 0;
  z-index: 1001;
  height: calc(100vh - 52px);
  width: 100vw;
}
.left {
  position: relative;
  width: calc(100% - 300px);
  height: 100%;
  display: inline-block;
  vertical-align: top;
  .log_out {
    position: absolute;
    right: 10px;
    bottom: 50px;
    z-index: 888;
  }
}
.right {
  position: relative;
  width: 300px;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  background-color: white;
}
#pano {
  height: 100%;
  width: 100%;
}
#panorama_map {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

