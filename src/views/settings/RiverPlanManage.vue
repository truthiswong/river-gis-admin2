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
      <h3 style="font-size: 16px; font-weight: 600; margin:10px 0 0 10px; text-align:center;">巡河方案管理</h3>
      <a-divider style="margin: 10px 0 10px;" />
      <div style="padding: 0 10px">
        <section class="task_face">
          <a-select
            showSearch
            placeholder="请输入河流"
            optionFilterProp="children"
            style="width: 100%"
            @change="chooseRiver"
            :filterOption="filterOption"
            v-model="defaultRiver"
            v-show="!addLineShow"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, index) in riverList"
              :key="index"
            >{{item.name}}</a-select-option>
          </a-select>
          <a-collapse
            v-show="!addLineShow"
            defaultActiveKey="1"
            accordion
            size="small"
            style="margin-top:10px;"
            @change="collapseChange"
          >
            <a-collapse-panel
              v-for="item in lineTaskList"
              :key="item.id"
              :style="customStyle"
              class="custom_list"
            >
              <template slot="header">
                <a-row style="width:100%">
                  <a-col :span="9">{{item.name}}</a-col>
                  <a-col :span="15" style="text-align:right;padding-right:10px;">
                    <a-button
                      size="small"
                      type="primary"
                      style="margin-right:5px;"
                      @click="edit(item.id)"
                    >编辑</a-button>
                    <a-button
                      size="small"
                      @click.stop="defaultPlan(item.id)"
                    >{{item.primary?"默认":"设为默认"}}</a-button>
                  </a-col>
                </a-row>
              </template>
              <a-tree
                defaultExpandAll
                @select="onSelect"
                :selectedKeys="selectedKeys"
                :treeData="item.dataTree"
              ></a-tree>
              <!-- <a-directory-tree multiple defaultExpandAll @select="riverPlan" @expand="onExpand">
              <a-tree-node title="360" key="0-0">
                <a-tree-node title="调查点1" key="0-0-0" isLeaf />
                <a-tree-node title="调查点2" key="0-0-1" isLeaf />
              </a-tree-node>
              <a-tree-node title="人工调查" key="0-1">
                <a-tree-node title="人工调查1" key="0-1-0" isLeaf />
                <a-tree-node title="人工调查2" key="0-1-1" isLeaf />
              </a-tree-node>
              <a-tree-node title="巡河线路1" key="0-2"></a-tree-node>
              </a-directory-tree>-->
            </a-collapse-panel>
          </a-collapse>
          <a-form v-show="addLineShow" style="width: 100%;">
            <a-form-item
              label="方案名称"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-input placeholder v-model="list.name" />
            </a-form-item>
            <a-form-item
              label="关联河道"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-select
                showSearch
                placeholder="请输入河流添加"
                optionFilterProp="children"
                style="width: 100%"
                @change="chooseRiver"
                :filterOption="filterOption"
                v-model="defaultRiver"
                disabled
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in riverList"
                  :key="index"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="任务线路"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-select
                showSearch
                mode="multiple"
                :allowClear="true"
                placeholder="请选择"
                optionFilterProp="children"
                style="width: 100%"
                :filterOption="filterOption"
                v-model="list.lineId"
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in lineList"
                  :key="index"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="调查点任务"
              :label-col="formItemLayout.labelCol"
              :wrapper-col="formItemLayout.wrapperCol"
            >
              <a-select
                showSearch
                mode="tags"
                :allowClear="true"
                placeholder="请选择"
                optionFilterProp="children"
                style="width: 100%"
                :filterOption="filterOption"
                v-model="list.pointId"
              >
                <a-select-option
                  :value="item.id"
                  v-for="(item, index) in spotList"
                  :key="index"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-form>
        </section>
        <a-button
          type="primary"
          block
          class="bottom_add"
          @click="addTask"
          v-show="!addLineShow"
        >创建方案</a-button>
        <!-- 线路任务按钮 -->
        <a-row
          v-show="addLineShow"
          class="bottom_add"
          type="flex"
          justify="space-around"
          align="middle"
        >
          <a-col :span="7">
            <a-button type="primary" block @click="taskCancel">取消</a-button>
          </a-col>
          <a-col :span="7">
            <a-popconfirm
              title="确定要删除吗?"
              @confirm="spotDel()"
              @cancel="cancelDelete"
              okText="确定"
              cancelText="取消"
            >
              <a-button type="primary" block>删除</a-button>
            </a-popconfirm>
          </a-col>
          <a-col :span="7">
            <a-button type="primary" block @click="taskSave">保存</a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </div>
</template>

<script>
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const formTailLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
import {
  getRiverList,
  programmeList,
  programmeSave,
  programmeDetail,
  programmeRemove,
  programmePrimary,
  taskSpotList,
  taskLineList
} from '@/api/login'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT

const treeData = [
  // {
  //   title: '360',
  //   key: 'wqewfsaf',
  //   children: [
  //     {
  //       title: '360调查点1',
  //       key: 'adasdwqeqwe',
  //       riverData: [
  //         {
  //           lat: 31.24539,
  //           lng: 121.48686
  //         },
  //         {
  //           lat: 31.24616,
  //           lng: 121.48411
  //         },
  //         {
  //           lat: 31.2466,
  //           lng: 121.4824
  //         },
  //         {
  //           lat: 31.24612,
  //           lng: 121.48051
  //         },
  //         {
  //           lat: 31.24484,
  //           lng: 121.47901
  //         },
  //         {
  //           lat: 31.24462,
  //           lng: 121.47939
  //         },
  //         {
  //           lat: 31.24543,
  //           lng: 121.48089
  //         },
  //         {
  //           lat: 31.2459,
  //           lng: 121.48261
  //         },
  //         {
  //           lat: 31.2448,
  //           lng: 121.4857
  //         },
  //         {
  //           lat: 31.2444,
  //           lng: 121.4872
  //         }
  //       ]
  //     },
  //     {
  //       title: '360调查点2',
  //       value: '0-0-1',
  //       key: '0-0-1',
  //       riverData: [
  //         {
  //           lat: 31.21882,
  //           lng: 121.50364
  //         },
  //         {
  //           lat: 31.21265,
  //           lng: 121.50227
  //         },
  //         {
  //           lat: 31.20583,
  //           lng: 121.49703
  //         },
  //         {
  //           lat: 31.19915,
  //           lng: 121.49197
  //         },
  //         {
  //           lat: 31.19702,
  //           lng: 121.49591
  //         },
  //         {
  //           lat: 31.2164,
  //           lng: 121.50759
  //         },
  //         {
  //           lat: 31.21948,
  //           lng: 121.50759
  //         }
  //       ]
  //     },
  //     {
  //       title: '360调查点3',
  //       value: '0-0-2',
  //       key: '0-0-2',
  //       riverData: [
  //         {
  //           lat: 31.25153,
  //           lng: 121.52409
  //         },
  //         {
  //           lat: 31.25355,
  //           lng: 121.53085
  //         },
  //         {
  //           lat: 31.25858,
  //           lng: 121.53934
  //         },
  //         {
  //           lat: 31.25535,
  //           lng: 121.54334
  //         },
  //         {
  //           lat: 31.2499,
  //           lng: 121.53353
  //         },
  //         {
  //           lat: 31.24786,
  //           lng: 121.52737
  //         },
  //         {
  //           lat: 31.24682,
  //           lng: 121.51709
  //         },
  //         {
  //           lat: 31.25111,
  //           lng: 121.51711
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   title: '人工调查点',
  //   value: '0-1',
  //   key: '0-1',
  //   children: [
  //     {
  //       title: '调查点1',
  //       value: '0-1-0',
  //       key: '0-1-0',
  //       riverData: [
  //         {
  //           lat: 31.24539,
  //           lng: 121.48686
  //         }
  //       ]
  //     },
  //     {
  //       title: '调查点2',
  //       value: '0-1-1',
  //       key: '0-1-1',
  //       riverData: [
  //         {
  //           lat: 31.21882,
  //           lng: 121.50364
  //         }
  //       ]
  //     },
  //     {
  //       title: '调查点3',
  //       key: '0-1-2',
  //       riverData: [
  //         {
  //           lat: 31.25153,
  //           lng: 121.52409
  //         }
  //       ]
  //     }
  //   ]
  // }
]
export default {
  name: 'RiverPlanManage',
  components: {
    // 'world-map': WorldMap
  },
  data() {
    return {
      list: {
        id: '',
        projectId: this.$store.state.id,
        name: '',
        lineId: [],
        pointId: [],
        primary: false
      },
      defaultRiver: '',
      addRiverShow: false, // 气泡卡片
      lineList: [], //任务路线
      spotList: [], //任务点
      // activeKey: 0, //
      lineTaskList: [
        // {
        //   id: 0,
        //   name: '黄浦江方案1',
        //   key: 0,
        //   default: true
        // },
        // {
        //   id: 1,
        //   name: '黄浦江方案2',
        //   key: 1,
        //   default: false
        // },
        // {
        //   id: 2,
        //   name: '黄浦江方案3',
        //   key: 2,
        //   default: false
        // }
      ],
      customStyle: 'background: #fff;margin: 0;overflow: hidden',
      addRiverShow: false,
      addLineShow: false, // 线路任务显示
      addPointShow: false, // 点任务显示
      // 添加线路任务
      checkNick: false,
      formItemLayout,
      formTailLayout,
      form: this.$form.createForm(this),

      SHOW_PARENT,
      value: '',
      riverList: [
        // {
        //   id: 0,
        //   name: '黄浦江',
        //   clicked: true
        // },
        // {
        //   id: 1,
        //   name: '大治河',
        //   clicked: false
        // },
        // {
        //   id: 2,
        //   name: '川杨河',
        //   clicked: false
        // },
        // {
        //   id: 3,
        //   name: '蕰藻浜',
        //   clicked: false
        // },
        // {
        //   id: 4,
        //   name: '龙华港',
        //   clicked: false
        // },
        // {
        //   id: 5,
        //   name: '太浦河',
        //   clicked: false
        // },
        // {
        //   id: 6,
        //   name: '太湖',
        //   clicked: false
        // }
      ],
      expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      treeData,

      // 地图对象
      map: {},
      // 地图节点对象（里面含节点对象、区域对象、任务弹窗对象）
      mapPoint: new Map()
    }
  },
  mounted() {
    this.initCruisePlan()
    this.getList()
  },
  watch: {
    $route(){
      this.initCruisePlan()
      this.getList()
    },
    checkedKeys(val) {
      console.log('onCheck', val)
    }
  },
  methods: {
    getList() {
      getRiverList(this.$store.state.id)
        .then(res => {
          var arr = res.data.data
          arr.forEach(v => {
            v.clicked = false
          })
          this.riverList = arr
        })
        .catch(err => {})
    },
    //编辑
    edit(id) {
      this.addLineShow = true
      programmeDetail(id)
        .then(res => {
          var arr = res.data
          this.list.id = arr.id
          this.list.name = arr.name
          this.list.primary = arr.primary
          var lineId = []
          var pointId = []
          if (arr.lines != null) {
            arr.lines.forEach(v => {
              lineId.push(v.id)
            })
          }
          if (arr.points != null) {
            arr.points.forEach(v => {
              pointId.push(v.id)
            })
          }
          console.log(lineId, pointId)

          this.list.lineId = lineId
          this.list.pointId = pointId
        })
        .catch(err => {})
    },
    //删除
    spotDel() {
      if (this.list.id == '') {
        this.$message.error('请先保存任务')
      } else {
        programmeRemove(this.list.id)
          .then(res => {
            this.$message.success('删除成功')
            this.taskCancel()
            this.chooseRiver()
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
      }
    },
    cancelDelete(e) {
      // this.$message.error('Click on No')
    },
    initCruisePlan() {
      const that = this
      //初始化地图控件
      let zoom = 14
      that.map = new T.Map('map')
      that.map.centerAndZoom(new T.LngLat(121.495505, 31.21098), zoom)
      // this.map.TileLayerOptions({zIndex: 1});

      // 初始化天气插件
      /*        let a = d.getElementById('weather-float-he')
        if (a) {
          a.parentNode.removeChild(a)
        }
        a = d.createElement('div')
        a.id = 'weather-float-he'
        let b = d.getElementsByTagName('body')[0]
        b.appendChild(a);
        let c = d.createElement('link')
        c.rel = 'stylesheet'
        c.href = 'https://apip.weatherdt.com/float/static/css/tqw_widget_float.css?v=0101'
        let s = d.createElement('script')
        s.src = 'https://apip.weatherdt.com/float/static/js/tqw_widget_float.js?v=0101'
        let sn = d.getElementsByTagName('script')[0]
        sn.parentNode.insertBefore(c, sn)
        sn.parentNode.insertBefore(s, sn);*/
    },
    //请求点线任务
    collapseChange(key) {
      // console.log(key);
      // if (key != undefined) {
      //   taskSpotList(key).then(res => {
      //     console.log(res);
      //   }).catch(err => {
      //   })
      //   taskLineList(key).then(res => {
      //     console.log(res);
      //   }).catch(err => {
      //   })
      // }
    },
    hiddenMenuChange(expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
    },
    // 注册事件
    // 注册添加点击事件
    addMapClick() {
      this.removeMapClick()
      this.map.addEventListener('click', this.MapClick)
    },
    // 地图点击事件
    MapClick(e) {
      const postion = []
      const that = this
      let icon = new T.Icon({
        iconUrl: 'http://api.tianditu.gov.cn/img/map/markerA.png',
        iconSize: new T.Point(19, 27),
        iconAnchor: new T.Point(10, 25)
      })
      //向地图上添加自定义标注
      // let marker = new T.Marker(new T.LngLat(postion), {icon: icon});
      let marker = new T.Marker(new T.LngLat(e.lnglat.lng, e.lnglat.lat), { icon: icon })
      this.map.addOverLay(marker)
      //向地图上添加圆
      let circle = new T.Circle(new T.LngLat(e.lnglat.lng, e.lnglat.lat), 1000, {
        color: 'blue',
        weight: 2,
        opacity: 0.5,
        fillColor: '#FFFFFF',
        fillOpacity: 0.5,
        lineStyle: 'solid'
      })
      this.map.addOverLay(circle)

      // 添加文字标注
      let labeName = '专向调查点' + (this.mapPoint.size + 1)
      let label = new T.Label({
        text: `<b style="border-radius: 3px">${labeName}<b>`,
        position: marker.getLngLat(),
        offset: new T.Point(-56, 20)
      })
      this.map.addOverLay(label)

      // 向mapPoint对象添加节点
      let mapPointChild = { marker: marker, circle: circle, label: label }
      this.mapPoint.set(labeName, mapPointChild)

      // 向地图注册标注点击事件
      //移除标注的点击事件，防止多次注册
      removeMarkerClick()
      //注册标注的点击事件
      marker.addEventListener('click', MarkerClick)

      function removeMarkerClick() {
        //移除标注的点击事件
        marker.removeEventListener('click', MarkerClick)
      }

      function MarkerClick(e) {
        console.log('这是标注点击事件' + e)
        console.log(e)
        //设置显示地图的中心点和级别
        // that.map.centerAndZoom(new T.LngLat(e.lnglat.lng, e.lnglat.lat));
        that.map.centerAndZoom(new T.LngLat(e.lnglat.lng + 0.01, e.lnglat.lat))
      }
    },
    // 地图删除事件
    removeMapClick() {
      this.map.removeEventListener('click', this.MapClick)
    },
    onSelect(selectedKeys, info) {
      console.log(selectedKeys, info)

      this.selectedKeys = selectedKeys
      var info = info.node.dataRef
      this.clearLays()
      if (info.children) {
        for (var i = 0; i < info.children.length; i++) {
          if (info.children[i].riverData.length > 1) {
            console.log(info.children[i].riverData)
            this.positionArea(info.children[i].riverData)
            this.map.setZoom('13')
          }
          if (info.children[i].riverData.length == 1) {
            this.map.setZoom('10')
            this.setMarkerInfo(info.children[i].riverData)
          }
        }
      } else {
        if (info.riverData.length > 1) {
          this.positionArea(info.riverData)
        }
        if (info.riverData.length == 1) {
          this.map.setZoom('14')
          this.setMarkerInfo(info.riverData)
        }
      }
    },
    //定位到选中地
    positionArea(val) {
      this.map.setViewport(val)
      this.setPolygonLine(val, 'red', 3, 0)
      this.polygon.addEventListener('click', this.polygonClick)
    },
    //绘制多边形
    setPolygonLine(layerData, color, weighe, fillOpacity) {
      this.polygon = new T.Polygon(layerData, {
        color: color,
        weight: weighe,
        opacity: 0.5,
        fillColor: '#FFFFFF',
        fillOpacity: fillOpacity
      })
      this.map.addOverLay(this.polygon)
    },
    //绘制标注点
    setMarkerInfo(riverData) {
      this.map.setViewport(riverData)
      this.map.setZoom('14')
      for (var i = 0; i < riverData.length; i++) {
        var lng = riverData[i].lng
        var lat = riverData[i].lat
        var point = new T.LngLat(lng, lat)
        var marker = new T.Marker(point)
        this.map.addOverLay(marker)
        var markerInfo = new T.InfoWindow('信息窗口')
        marker.addEventListener('click', function() {
          marker.openInfoWindow(markerInfo)
        })
      }
    },
    // 弹窗点击确认事件
    modalClick(v) {
      this[v].click()
    },
    //右侧菜单列表追加任务
    additionalTask(o) {},
    // 打开弹窗
    openPopup(v) {
      this.transferAttribute = this[v]
      this.transferAttribute.visible = true
    },
    // 地图选项
    onChange(e) {
      console.log(`checked = ${e.target.checked}`)
    },
    // 选择方案详情
    riverPlan(keys) {
      console.log('Trigger Select', keys)
    },
    onExpand() {
      console.log('Trigger Expand')
    },
    // 设为默认方案
    defaultPlan(index) {
      var data = {
        id: index,
        riverId: this.defaultRiver
      }
      programmePrimary(data)
        .then(res => {
          this.$message.success('保存成功')
          this.chooseRiver()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
      // this.lineTaskList.forEach(value=>{
      //   if (value.name === index) {
      //     value.default = true
      //   } else {
      //     value.default = false
      //   }
      // })
    },

    // 创建方案
    addTask() {
      this.addLineShow = true
    },
    // 关联河道
    chooseRiver(index) {
      console.log(`selected ${index}`)
      var data = {
        id:this.defaultRiver,
        prid:this.$store.state.id
      }
      programmeList(data)
        .then(res => {
          var arr = res.data.data
          for (let a = 0; a < arr.length; a++) {
            if (arr[a].points != null) {
              arr[a].points.forEach(v => {
                v.riverData = [{ lat: '', lng: '' }]
                v.title = v.name
                v.key = v.id
                v.riverData[0].lat = v.coordinate[1]
                v.riverData[0].lng = v.coordinate[0]
              })
            } else {
              arr[a].points = []
            }
            if (arr[a].lines != null) {
              arr[a].lines.forEach(v => {
                v.riverData = []
                v.title = v.name
                v.key = v.id
              })
            } else {
              arr[a].lines = []
            }
            arr[a].dataTree = arr[a].lines.concat(arr[a].points)
          }
          this.lineTaskList = arr
        })
        .catch(err => {})
      taskSpotList(this.defaultRiver)
        .then(res => {
          var arr = res.data
          this.spotList = arr
        })
        .catch(err => {})
      taskLineList(this.defaultRiver)
        .then(res => {
          var arr = res.data
          this.lineList = arr
        })
        .catch(err => {})
      this.riverList.forEach(value => {
        if (value.name === index) {
          value.clicked = true
        } else {
          value.clicked = false
        }
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 线路任务按钮
    taskCancel() {
      this.addLineShow = false
      this.list.id = ''
      this.list.name = ''
      this.list.lineId = []
      this.list.pointId = []
      this.list.primary = false
    },
    taskSave() {
      var data = this.list
      data.lineId = data.lineId.join(',')
      data.pointId = data.pointId.join(',')
      data.riverId = this.defaultRiver
      programmeSave(data)
        .then(res => {
          this.addLineShow = false
          this.$message.success('保存成功')
          this.chooseRiver()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    // 添加调查点任务
    addRiverPlan(value) {
      console.log('onChange ', value)
      this.value = value
    },
    //清楚覆盖物
    clearLays() {
      this.map.clearOverLays()
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
  height: calc(100vh - 170px);
  overflow: auto;
}

.ant-form-item {
  margin-bottom: 10px;
}

.bottom_add {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  margin: auto;
  width: 70%;
}
</style>