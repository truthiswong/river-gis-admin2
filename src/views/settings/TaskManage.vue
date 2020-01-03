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
                      <p style="margin:0;">自动监测点</p>
                    </a-col>
                    <a-col :span="6">
                      <a-switch size="small" v-model="autoDetection" />
                    </a-col>
                  </a-row>
                </a-list-item>
                <a-list-item>
                  <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                    <a-col :span="18">
                      <p style="margin:0;">人工监测点</p>
                    </a-col>
                    <a-col :span="6">
                      <a-switch size="small" v-model="peopleDetection" />
                    </a-col>
                  </a-row>
                </a-list-item>
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
            <img src="../../assets/img/more.png" alt="更多" title="更多" @click="onMoreLoad" />
          </a-popover>
        </li>
      </ul>
    </div>
    <div class="right">
      <h3 style="font-size: 16px; font-weight: 600; margin:10px 0 0 10px; text-align:center;">任务管理</h3>
      <a-divider style="margin: 10px 0 0;" />
      <div style="padding: 0 10px">
        <a-spin :spinning="spinning" :delay="delayTime">
          <a-tabs defaultActiveKey="1" @change="callback" v-model="actionTab" class="custom_tabs">
            <a-tab-pane tab="线路任务" key="1">
              <section class="task_face">
                <a-list
                  size="small"
                  bordered
                  :dataSource="lineTaskList"
                  style="margin-top: 10px;"
                  v-show="!addLineShow"
                >
                  <a-list-item
                    slot="renderItem"
                    slot-scope="item, index"
                    :key="index"
                    @click="chooseLineTask(item.id)"
                    :class="{active_item: item.clicked}"
                  >
                    <a-row style="width:100%">
                      <a-col :span="20">{{item.name}}</a-col>
                      <a-col :span="4" style="text-align:right;">
                        <a-popconfirm
                          title="确定要删除吗?"
                          @confirm="confirmLineDelete(item.id)"
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
                <a-form v-show="addLineShow" style="width: 100%;">
                  <a-form-item
                    label="任务名称"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入任务名称" v-model="lineList.title" />
                  </a-form-item>
                  <a-form-item
                    label="任务内容"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入任务内容" v-model="lineList.content" />
                  </a-form-item>
                  <a-form-item
                    label="月计划次数"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入月计划次数" v-model="lineList.times" />
                  </a-form-item>
                  <a-form-item
                    label="涉及线路"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      :data="lineList"
                      name="kmz"
                      :headers="headers"
                      action="/server/data/admin/task/save"
                      :on-preview="handlePreview"
                      :on-success="handleSuccess"
                      :on-change="uploadChange"
                      :on-remove="handleRemove"
                      :file-list="fileList"
                      accept=".kmz, .kml"
                      :limit="1"
                      :auto-upload="false"
                    >
                      <a-button type="primary" icon="upload">上传KMZ文件</a-button>
                    </el-upload>
                  </a-form-item>
                  <a-form-item
                    label="高度(m)"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入高度" v-model="lineList.altitude" />
                  </a-form-item>
                  <a-form-item
                    label="长度(m)"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入长度" v-model="lineList.length" />
                  </a-form-item>
                  <a-form-item
                    label="时长(min)"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入时长" v-model="lineList.duration" />
                  </a-form-item>
                  <a-form-item
                    label="速度(km/h)"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入速度" v-model="lineList.velocity" />
                  </a-form-item>
                  <a-form-item
                    label="任务模板"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-select style="width: 100%" v-model="lineList.template">
                      <a-select-option value="uav">无人机</a-select-option>
                      <a-select-option value="manual">人工调查</a-select-option>
                      <a-select-option value="water">水质调查</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item
                    label="关联河道"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-select
                      showSearch
                      mode="multiple"
                      :allowClear="true"
                      placeholder="请输入河流添加"
                      optionFilterProp="children"
                      style="width: 100%"
                      @change="handleChange"
                      :filterOption="filterOption"
                      v-model="riverId"
                    >
                      <a-select-option
                        :value="item.id"
                        v-for="(item, index) in riverList"
                        :key="index"
                      >{{item.name}}</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item
                    label="人员配置"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <el-checkbox-group v-model="roleId">
                      <div v-for="(city, index)  in personnelList" :key="index" style>
                        <el-checkbox :label="city.id" style="width: 100px;">{{city.name}}</el-checkbox>
                        <a-input-number
                          size="small"
                          :min="1"
                          :max="100000"
                          :defaultValue="1"
                          v-model="city.num"
                          style="width: 70px;margin-left:5px"
                        />
                      </div>
                    </el-checkbox-group>
                  </a-form-item>
                  <a-form-item
                    label="设备配置"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  ></a-form-item>
                  <a-collapse size="small" style="margin-top:10px;" :bordered="false">
                    <a-collapse-panel
                      :style="customStyle"
                      v-for=" item in equipmentList"
                      :key="item.id"
                    >
                      <template slot="header">{{item.name}}</template>
                      <a-collapse size="small" style="margin-top:10px;" :bordered="false">
                        <a-collapse-panel
                          :style="customStyle"
                          v-for=" option in item.children"
                          :key="option.id"
                        >
                          <template slot="header">{{option.name}}</template>
                          <a-checkbox-group
                            style="display:flex;flex-wrap:wrap;"
                            v-model="deviceTypeId"
                          >
                            <a-row
                              style="width:100%"
                              v-for="index in option.children"
                              :key="index.id"
                            >
                              <a-col :span="12" offset="4" style="height:30px;">
                                <a-checkbox :value="index.id" @change="peopleChoose">{{index.name}}</a-checkbox>
                              </a-col>
                              <a-col :span="8" style="height:30px;text-align:right;">
                                <a-input-number
                                  size="small"
                                  :min="1"
                                  :max="100000"
                                  :defaultValue="1"
                                  @change="peopleNum"
                                  v-model="index.num"
                                  style="width: 70px;"
                                />
                              </a-col>
                            </a-row>
                          </a-checkbox-group>
                        </a-collapse-panel>
                      </a-collapse>
                    </a-collapse-panel>
                  </a-collapse>
                  <a-form-item
                    label="备注"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入备注" v-model="lineList.remark" />
                  </a-form-item>
                  <a-form-item
                    label="人员职责"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入人员职责" v-model="lineList.duty" />
                  </a-form-item>
                </a-form>
              </section>
            </a-tab-pane>
            <a-tab-pane tab="点任务" key="2" forceRender>
              <section class="task_face">
                <a-collapse defaultActiveKey="1" accordion style="margin-top:10px;">
                  <!-- -->
                  <a-collapse-panel
                    v-show="!addPointShow"
                    v-for="item in pointTaskList"
                    :key="item.id"
                    :style="customStyle"
                    class="custom_list"
                  >
                    <template slot="header">
                      <a-row style="width:100%">
                        <a-col :span="9">{{item.name}}</a-col>
                        <a-col :span="14" style="text-align:right;" :pull="1">
                          <a-button
                            size="small"
                            type="primary"
                            style="margin-right:10px;"
                            @click="choosePointEdit(item.id)"
                          >编辑</a-button>
                          <a-button
                            size="small"
                            type="primary"
                            @click="chooseTask(item.id)"
                          >{{item.pointListName}}</a-button>
                        </a-col>
                      </a-row>
                    </template>
                    <a-list
                      size="small"
                      :bordered="false"
                      :dataSource="item.pointList"
                      v-show="!addLineShow"
                    >
                      <a-list-item
                        slot="renderItem"
                        slot-scope="point, index"
                        :key="index"
                        @click="choosePointTask(item.id, point.name)"
                        :class="{active_item: point.clicked}"
                        style="padding: 10px 16px;"
                      >
                        <a-row style="width:100%">
                          <a-col :span="17">{{point.name}}</a-col>
                          <a-col :span="6" style="text-align:right;">
                            <a-popconfirm
                              title="确定要删除吗?"
                              @confirm="confirmPiontDelete(point.id, point.name)"
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
                  </a-collapse-panel>
                </a-collapse>
                <a-form v-show="addPointShow" style="width: 100%;">
                  <a-form-item
                    label="任务名称"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入任务名称" v-model="spotList.title" />
                  </a-form-item>
                  <a-form-item
                    label="任务内容"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-textarea :autosize="{ minRows: 2, maxRows: 6 }" v-model="spotList.content" />
                  </a-form-item>
                  <a-form-item
                    label="任务高度"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入任务高度" v-model="spotList.altitude" />
                  </a-form-item>
                  <a-form-item
                    label="任务时长(min)"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入任务时长" v-model="spotList.duration" />
                  </a-form-item>
                  <a-form-item
                    label="备注"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-textarea
                      placeholder="请输入备注信息"
                      :autosize="{ minRows: 2, maxRows: 6 }"
                      v-model="spotList.remark"
                    />
                  </a-form-item>
                  <a-form-item
                    label="任务职责"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-input placeholder="请输入任务职责" v-model="spotList.duty" />
                  </a-form-item>
                  <a-form-item
                    label="任务模板"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <a-select placeholder="请选择" style="width: 100%" v-model="spotList.template">
                      <a-select-option value="uav">无人机</a-select-option>
                      <a-select-option value="manual">人工调查</a-select-option>
                      <a-select-option value="water">水质调查</a-select-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item
                    label="任务图标"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <div style="display:flex">
                      <viewer>
                        <img :src="attachmentJpg" alt style="height:30px;margin-right:10px" />
                      </viewer>
                      <el-upload
                        class="upload-demo"
                        ref="upload1"
                        :data="spotList"
                        name="pic"
                        :headers="headers"
                        action="/server/data/admin/task/save"
                        :on-preview="handlePreview"
                        :on-success="handleSuccess1"
                        :on-change="uploadChange1"
                        :show-file-list="false"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        :limit="1"
                        :auto-upload="false"
                      >
                        <a-button type="primary" icon="upload">上传</a-button>
                      </el-upload>
                    </div>
                  </a-form-item>
                  <a-form-item
                    label="人员配置"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  >
                    <el-checkbox-group v-model="spotList.roleId">
                      <div v-for="(city, index)  in personnelList" :key="index" style>
                        <el-checkbox :label="city.id" style="width: 100px;">{{city.name}}</el-checkbox>
                        <a-input-number
                          size="small"
                          :min="1"
                          :max="100000"
                          :defaultValue="1"
                          v-model="city.num"
                          style="width: 50px;margin-left:5px"
                        />
                      </div>
                    </el-checkbox-group>
                  </a-form-item>
                  <a-form-item
                    label="设备配置"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol"
                  ></a-form-item>
                  <a-collapse size="small" style="margin-top:10px;" :bordered="false">
                    <a-collapse-panel
                      :style="customStyle"
                      v-for=" item in equipmentList"
                      :key="item.id"
                    >
                      <template slot="header">{{item.name}}</template>
                      <a-collapse size="small" style="margin-top:10px;" :bordered="false">
                        <a-collapse-panel
                          :style="customStyle"
                          v-for=" option in item.children"
                          :key="option.id"
                        >
                          <template slot="header">{{option.name}}</template>
                          <a-checkbox-group
                            style="display:flex;flex-wrap:wrap;"
                            v-model="deviceTypeId"
                          >
                            <a-row
                              style="width:100%"
                              v-for="index in option.children"
                              :key="index.id"
                            >
                              <a-col :span="12" offset="4" style="height:30px;">
                                <a-checkbox :value="index.id" @change="peopleChoose">{{index.name}}</a-checkbox>
                              </a-col>
                              <a-col :span="8" style="height:30px;text-align:right;">
                                <a-input-number
                                  size="small"
                                  :min="1"
                                  :max="100000"
                                  :defaultValue="1"
                                  @change="peopleNum"
                                  v-model="index.num"
                                  style="width: 70px;"
                                />
                              </a-col>
                            </a-row>
                          </a-checkbox-group>
                        </a-collapse-panel>
                      </a-collapse>
                    </a-collapse-panel>
                  </a-collapse>
                </a-form>
              </section>
            </a-tab-pane>
          </a-tabs>
        </a-spin>
        <a-button
          type="primary"
          block
          class="bottom_add"
          @click="addTask"
          v-show="(actionTab==1 && !addLineShow) || (actionTab==2 && !addPointShow)"
        >{{actionTab==1?"添加线路任务":"添加点任务"}}</a-button>
        <!-- 线路任务按钮 -->
        <a-row
          v-show="(actionTab==1 && addLineShow) || (actionTab==2 && addPointShow)"
          style="width:100%;"
          class="bottom_add"
          type="flex"
          justify="space-around"
          align="middle"
        >
          <a-col :span="6">
            <a-button type="primary" block @click="taskCancel">取消</a-button>
          </a-col>
          <a-col :span="6">
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
          <a-col :span="6">
            <a-button type="primary" block @click="taskSave">保存</a-button>
          </a-col>
        </a-row>
      </div>
    </div>
    <!-- 鼠标跟随弹窗 -->
    <div
      class="mouse_alert"
      v-show="alertShow"
      :style="{left: alertLeft + 'px', top: alertTop + 'px'}"
    >
      <span>{{defaultLineTask}}</span>
    </div>
    <!-- 添加河流 -->
    <add-task-point ref="addTaskPoint" @cancel="cancelClick" @confirm="confirmClick"></add-task-point>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import AddTaskPoint from './modules/AddTaskPoint.vue'

import {
  taskList,
  getTaskSave,
  roleList,
  getTaskDetail,
  getRiverList,
  taskSpotPage,
  taskPointDel,
  taskRemove,
  structDeviceList,
  getStreetList,
  testingPage,
  testingDel
} from '@/api/login'
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const formTailLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

export default {
  name: 'TaskManage',
  components: {
    'add-task-point': AddTaskPoint
  },
  data() {
    return {
      moreLoadOnce: 0, // 更多加载一次
      mapType: 'b', // 地图类型
      roadWordChange: true, // 道路标注
      mapLayerWord: '', // 道路层级
      autoDetection: false, // 自动监测点
      peopleDetection: false, // 人工监测点
      riverShow: false, // 河道
      streetShow: false, // 街道
      once: 0, // 移入次数
      riverShowList: [], // 河道
      streetShowList: [], //街道
      fixedPointList: [], //固定监测点
      peoplePointList: [], //人工监测点
      spinning: true,
      delayTime: 500,
      attachmentJpg: '', //图片
      alertLeft: -1000,
      alertTop: -1000,
      taskId: '',
      alertShow: false,
      fileList: [], //上传列表
      personnelList: [], //人员列表
      equipmentList: [], //设备列表
      //线任务数据
      lineList: {
        id: '',
        projectId: this.$store.state.id,
        type: 'line',
        title: '',
        content: '',
        altitude: '',
        duration: '',
        length: '',
        velocity: '',
        remark: '',
        times: '',
        duty: '',
        template: '',
        roleId: '',
        roleNum: '',
        deviceId: '',
        deviceNum: '',
        deviceTypeId: '',
        deviceNum: '',
        riverId: ''
      },
      roleId: [], //分配人员角色
      deviceTypeId: [], //任务分配设备
      deviceId: [], //分配设备
      riverId: [], //关联河道
      spotList: {
        //点任务数据
        title: '',
        id: '',
        projectId: this.$store.state.id,
        type: 'dot',
        content: '',
        altitude: '',
        duration: '',
        remark: '',
        duty: '',
        template: '',
        roleId: [],
        deviceNum: '',
        roleNum: ''
      },
      headers: {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
        'X-TENANT-ID': this.$store.state.tenantId
      },
      addRiverShow: false, // 气泡卡片
      actionTab: '1', //tab
      defaultLineTask: '无人机正射影像',
      lineTaskList: [
        // {
        //   id: 0,
        //   name: '无人机正射影像',
        //   clicked: false,
        //   lineData: [
        //     { lat: 31.21493, lng: 121.49566 },
        //     { lat: 31.22344, lng: 121.47892 },
        //     { lat: 31.20649, lng: 121.47712 },
        //     { lat: 31.20469, lng: 121.47482 },
        //     { lat: 31.21469, lng: 121.51482 }
        //   ]
        // }
      ],
      addRiverShow: false,
      addLineShow: false, // 线路任务显示
      addPointShow: false, // 点任务显示
      // 添加线路任务
      checkNick: false,
      formItemLayout,
      formTailLayout,
      form: this.$form.createForm(this),

      defaultRiver: '黄浦江',
      riverList: [
        // {
        //   id: 0,
        //   name: '黄浦江',
        //   clicked: true
        // }
      ],
      customStyle: 'background: #fff;margin: 0;overflow: hidden', // 折叠面板样式
      pointTaskList: [
        //任务点
        // {
        //   id: 0,
        //   name: '360',
        //   pointList: [
        //     { id: 0, name: '坐标点1', clicked: false, latlng: { lat: 31.21493, lng: 121.49566 } },
        //     { id: 1, name: '坐标点2', clicked: false, latlng: { lat: 31.22344, lng: 121.47892 } },
        //     { id: 2, name: '坐标点3', clicked: false, latlng: { lat: 31.20649, lng: 121.47712 } }
        //   ]
        // }
      ],

      // 地图对象
      map: {},
      once: 0 // 移入次数
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
    // this.scale.setColor({color: '#f00'})

    this.getLineList() // 获取线路任务
    this.getList() // 获取点列表
    this.getRoleList()
    this.riverListGet()
    this.getStructDeviceList()
  },
  watch: {
    $route() {
      this.getLineList()
      this.getRiverStreeList() //获取街道河道
      this.getRoleList()
      this.riverListGet()
      this.getStructDeviceList()
    },
    autoDetection() {
      // 自动监测点
      this.watchAllSwitch()
    },
    peopleDetection() {
      //人工监测点
      this.watchAllSwitch()
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
  methods: {
    //点列表
    getList() {
      var data = {
        type: 'dot',
        id: this.$store.state.id
      }
      taskList(data)
        .then(res => {
          var arr = res.data.data
          arr.forEach(v => {
            v.name = v.title
            v.clicked = false
            v.pointListName = '添加点'
            v.pointList = []
            this.gettTaskPointList(v.id)
          })
          this.pointTaskList = arr
        })
        .catch(err => {})
    },
    //任务点列表
    gettTaskPointList(key) {
      if (key != undefined) {
        taskSpotPage(key)
          .then(res => {
            var arr = res.data.data
            for (let a = 0; a < arr.length; a++) {
              arr[a].clicked = false
              arr[a].latlng = arr[a].coordinate
            }
            for (let i = 0; i < this.pointTaskList.length; i++) {
              if (this.pointTaskList[i].id == key) {
                this.pointTaskList[i].pointList = arr
              }
            }
            if (this.actionTab == 2) {
              this.allPointTask()
            }
          })
          .catch(err => {})
      }
    },
    // 线列表
    getLineList() {
      var data = {
        type: 'line',
        id: this.$store.state.id
      }
      this.spinning = true
      taskList(data)
        .then(res => {
          var arr = res.data.data
          arr.forEach(v => {
            v.clicked = false
            v.name = v.title
            if (v.coordinate == null) {
              v.lineData = []
            } else {
              v.lineData = v.coordinate
            }
          })
          this.lineTaskList = arr
          this.spinning = false
          this.drawAllLine()
        })
        .catch(err => {
          this.spinning = false
          this.$message.error('数据加载失败')
        })
    },
    //人员配置列表
    getRoleList() {
      roleList('worker')
        .then(res => {
          var arr = res.data.data
          this.personnelList = arr
        })
        .catch(err => {})
    },
    getStructDeviceList() {
      structDeviceList().then(res => {
        var arr = res.data
        this.equipmentList = arr
      })
    },
    // 点击更多
    onMoreLoad() {
      if (!this.moreLoadOnce) {
        this.getRiverStreeList() //获取街道河道
        this.getFixedList() // 获取固定监测点
        this.getManualList() // 获取人工监测点
        this.moreLoadOnce++
      }
    },
    //河道列表
    riverListGet() {
      getRiverList(this.$store.state.id)
        .then(res => {
          var arr = res.data.data
          this.riverList = arr
        })
        .catch(err => {})
    },
    // 添加所有的线
    drawAllLine() {
      for (const item of this.lineTaskList) {
        this.drawLine(item.lineData, 'blue', 3, 0.5, 'blue', 0, item.id, item.name)
      }
    },
    // 线路任务
    chooseLineTask(index) {
      this.defaultLineTask = index
      for (const item of this.lineTaskList) {
        if (item.id === index) {
          item.clicked = true
          this.map.setViewport(item.lineData)
        } else {
          item.clicked = false
        }
      }
      console.log(this.lineTaskList)
      this.drawAllLine()
    },
    // 绘制线
    drawLine(points, color, weight, opacity, fillColor, fillOpacity, id, name) {
      let line = new T.Polygon(points, {
        color: color, //线颜色
        weight: weight, //线宽
        opacity: opacity, //透明度
        fillColor: fillColor, //填充颜色
        fillOpacity: fillOpacity, //填充透明度
        id: id,
        name: name
      })
      //向地图上添加线
      this.map.addOverLay(line)
      line.addEventListener('click', this.taskLineClick)
      line.addEventListener('mouseover', this.taskLineMouseover)
      line.addEventListener('mousemove', this.taskLineMousemove)
      line.addEventListener('mouseout	', this.taskLineMouseout)
    },
    // 线路任务删除
    confirmLineDelete(id) {
      taskRemove(id)
        .then(res => {
          this.$message.success('保存成功')
          this.getLineList()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
      this.defaultLineTask = null
    },
    //点任务删除
    spotDel() {
      if (this.spotList.id == '') {
        this.$message.error('请先保存任务')
      } else {
        taskRemove(this.spotList.id)
          .then(res => {
            this.$message.success('删除成功')
            this.taskCancel()
            this.getList()
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
      }
    },
    cancelDelete(e) {
      // this.$message.error('Click on No')
    },
    // 线点击事件
    taskLineClick(item) {
      console.log(item.target.options.id)
      getTaskDetail(item.target.options.id)
        .then(res => {
          var arr = res.data
          this.lineList.title = arr.info.title
          this.lineList.id = arr.info.id
          this.lineList.content = arr.info.content
          this.lineList.altitude = arr.info.altitude
          this.lineList.duration = arr.info.duration
          this.lineList.remark = arr.info.remark
          this.lineList.duty = arr.info.duty
          this.lineList.template = arr.info.template.code
          // this.attachmentJpg = arr.info.kmz
          this.lineList.times = arr.info.times
          this.lineList.length = arr.info.length
          this.lineList.velocity = arr.info.velocity
          var sz = []
          var zs = []
          var aa = []
          for (const item of arr.line.rivers) {
            aa.push(item.id)
          }
          this.riverId = aa
          for (let i = 0; i < arr.staff.length; i++) {
            sz.push(arr.staff[i].role.id)
            for (let a = 0; a < this.personnelList.length; a++) {
              if (arr.staff[i].role.id == this.personnelList[a].id) {
                this.personnelList[a].num = arr.staff[i].amount
                break
              }
            }
          }
          this.roleId = sz
          for (const item of arr.device) {
            zs.push(item.device.id)
            for (const d of this.equipmentList) {
              for (const cc of d.children) {
                for (const aa of cc.children) {
                  if (item.device.id == aa.id) {
                    aa.num = item.amount
                    break
                  }
                }
              }
            }
          }
          this.deviceTypeId = zs
        })
        .catch(err => {})
      this.addTask()
    },
    // 线移入事件
    taskLineMouseover(index) {
      let event = event || window.event //兼容写法
      this.alertLeft = event.pageX + 10
      this.alertTop = event.pageY - 44
      this.alertShow = true
      if (this.once == 1) {
        return
      }
      for (const item of this.lineTaskList) {
        if (item.id == index.target.options.id) {
          this.defaultLineTask = item.name
          for (const overlay of this.map.getOverlays()) {
            if (item.id == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
          }
          this.drawLine(item.lineData, 'red', 3, 0.5, '', 0, item.id, item.name)
        }
      }
      this.once++
    },
    taskLineMousemove() {
      let event = event || window.event //兼容写法
      this.alertLeft = event.pageX + 10
      this.alertTop = event.pageY - 44
    },
    taskLineMouseout(index) {
      this.once--
      this.alertShow = false
      for (const item of this.lineTaskList) {
        if (item.id == index.target.options.id) {
          this.defaultLineTask = item.name
          for (const overlay of this.map.getOverlays()) {
            if (item.id == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
          }
          this.drawLine(item.lineData, 'blue', 3, 0.5, 'blue', 0, item.id, item.name)
        }
      }
    },
    // 添加所有的标注点
    allPointTask() {
      // this.map.clearOverLays()
      for (const item of this.pointTaskList) {
        for (const point of item.pointList) {
          for (const overlay of this.map.getOverlays()) {
            if (point.id == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
          }
          this.drawAllPoint(point.latlng, point.id, point.name, item.pic)
        }
      }
    },
    // 添加标注图片
    drawAllPoint(latlng, id, title, iconUrl) {
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
    // 点点击事件
    taskPointClick(index) {
      for (const item of this.pointTaskList) {
        for (const point of item.pointList) {
          if (index.target.options.id === point.id) {
            this.$refs.addTaskPoint.edit(point.id)
            point.clicked = true
          } else {
            point.clicked = false
          }
        }
      }
    },
    // 任务点点击移入移出事件
    taskPointMouse(index) {
      for (const item of this.pointTaskList) {
        for (const point of item.pointList) {
          if (index.target.options.id === point.id) {
            point.clicked = true
          } else {
            point.clicked = false
          }
        }
      }
    },
    // 任务点进入事件
    taskPointMouseover(index) {
      console.log(index)
    },
    // 任务点离开事件
    taskPointMouseout(index) {
      console.log(index)
    },
    // 点击取消弹窗
    cancelClick() {
      if (this.markerTool) {
        var markers = this.markerTool.getMarkers()
        for (const item of markers) {
          this.map.removeOverLay(item)
        }
      }
      for (const item of this.pointTaskList) {
        item.pointListName = '添加点'
        item.clicked = false
      }
    },
    // 点击确定弹窗
    confirmClick() {
      this.getList()
    },
    searchResult(result) {
      this.$refs.addTaskPoint.add(result.formatted_address, result.location, this.taskId)
      if (result.getStatus() == 0) {
      } else {
        this.$message.error('获取地址失败')
      }
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },

    // 点任务选择
    chooseTask(key) {
      this.taskId = key
      this.addTaskPoint(key)
    },
    // 注册添加点击事件
    addTaskPoint(index) {
      for (const item of this.pointTaskList) {
        if (item.id == index) {
          item.clicked = !item.clicked
          if (item.clicked) {
            item.pointListName = '取消点'
            if (this.markerTool) {
              this.markerTool.close()
            }
            let icon = new T.Icon({
              iconUrl: item.pic,
              iconSize: new T.Point(41, 40),
              iconAnchor: new T.Point(21, 40)
            })
            this.markerTool = new T.MarkTool(this.map, { icon: icon, follow: true })
            this.markerTool.open()
            this.markerTool.addEventListener('mouseup', this.addTaskPointed)
          } else {
            item.pointListName = '添加点'
            if (this.markerTool) {
              this.markerTool.close()
            }
          }
        } else {
          item.clicked = false
          item.pointListName = '添加点'
        }
      }
    },
    // 返回标注点的坐标
    addTaskPointed(e) {
      // console.log(e.currentLnglat.lng)
      // console.log(e.currentLnglat.lat)
      let geocode = new T.Geocoder()
      geocode.getLocation(e.currentLnglat, this.searchResult)
      // console.log(e)
    },
    // 编辑
    choosePointEdit(id) {
      getTaskDetail(id)
        .then(res => {
          var arr = res.data
          this.spotList.title = arr.info.title
          this.spotList.id = arr.info.id
          this.spotList.content = arr.info.content
          this.spotList.altitude = arr.info.altitude
          this.spotList.duration = arr.info.duration
          this.spotList.remark = arr.info.remark
          this.spotList.duty = arr.info.duty
          this.spotList.template = arr.info.template.code
          this.attachmentJpg = arr.info.pic
          var sz = []
          var zs = []

          for (let i = 0; i < arr.staff.length; i++) {
            for (let a = 0; a < this.personnelList.length; a++) {
              if (arr.staff[i].role.id == this.personnelList[a].id) {
                sz.push(arr.staff[i].role.id)
                this.personnelList[a].num = arr.staff[i].amount
                break
              }
            }
          }
          this.spotList.roleId = sz
          for (const item of arr.device) {
            for (const d of this.equipmentList) {
              for (const cc of d.children) {
                for (const aa of cc.children) {
                  if (item.device.id == aa.id) {
                    zs.push(item.device.id)
                    aa.num = item.amount
                    break
                  }
                }
              }
            }
          }
          this.deviceTypeId = zs
        })
        .catch(err => {})
      this.addTask()
    },
    // 选择任务点
    choosePointTask(id, index) {
      for (const item of this.pointTaskList) {
        if (item.id === id) {
          for (const point of item.pointList) {
            if (index === point.name) {
              point.clicked = true
              let arr = []
              arr.push(point.latlng)
              this.map.setViewport(arr)
              this.map.setZoom(18)
            } else {
              point.clicked = false
            }
          }
        }
      }
    },
    // 删除任务点
    confirmPiontDelete(id, index) {
      taskPointDel(id)
        .then(res => {
          this.$message.success('保存成功')
          // for (const overlay of this.map.getOverlays()) {
          //   for (const item of this.lineTaskList) {
          //     if (item.id == id) {
          //       this.map.removeOverLay(overlay)
          //     }
          //   }
          // }
          for (const overlay of this.map.getOverlays()) {
            for (const item of this.pointTaskList) {
              for (const point of item.pointList) {
                if (point.id == overlay.options.id) {
                  this.map.removeOverLay(overlay)
                }
              }
            }
          }
          this.getList()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    // 添加任务点
    addTaskPointAlert() {
      console.log('1')
      this.$refs.addTaskPoint.add()
    },
    // tab切换
    callback(key) {
      if (key == 1) {
        for (const overlay of this.map.getOverlays()) {
          for (const item of this.pointTaskList) {
            for (const point of item.pointList) {
              if (point.id == overlay.options.id) {
                this.map.removeOverLay(overlay)
              }
            }
          }
        }
        this.drawAllLine()
      } else {
        for (const overlay of this.map.getOverlays()) {
          for (const item of this.lineTaskList) {
            if (item.id == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
          }
        }
        this.allPointTask()
        // this.getList()
      }
    },
    // 树形图
    onSelect(keys) {
      console.log('Trigger Select', keys)
    },
    onExpand(expandedKeys) {
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSelect(selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    // 线路人员选择
    peopleChoose(checkedValues) {},
    // 线路人员配置人数
    peopleNum(value) {
      console.log('changed', value)
    },
    // 线路任务添加
    check() {
      this.form.validateFields(err => {
        if (!err) {
          console.info('success')
        }
      })
    },
    handleChange(e) {
      this.checkNick = e.target.checked
      this.$nextTick(() => {
        this.form.validateFields(['nickname'], { force: true })
      })
    },
    // 添加任务按钮
    addTask() {
      if (this.actionTab == 1) {
        this.addLineShow = true
      } else if (this.actionTab == 2) {
        this.addPointShow = true
      }
    },
    // 关联河道
    handleChange(index) {
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
      if (this.actionTab == 1) {
        this.addLineShow = false
        this.lineList.id = ''
        this.lineList.title = ''
        this.lineList.content = ''
        this.lineList.altitude = ''
        this.lineList.duration = ''
        this.lineList.length = ''
        this.lineList.velocity = ''
        this.lineList.remark = ''
        this.lineList.times = ''
        this.lineList.duty = ''
        this.lineList.template = ''
        this.lineList.roleId = ''
        this.lineList.roleNum = ''
        this.lineList.deviceId = ''
        this.lineList.deviceNum = ''
        this.lineList.riverId = ''
        this.lineList.roleNum = ''
        this.roleId = []
        this.deviceId = []
        this.riverId = []
      } else if (this.actionTab == 2) {
        this.addPointShow = false
        this.spotList.title = ''
        this.spotList.id = ''
        this.spotList.content = ''
        this.spotList.altitude = ''
        this.spotList.duration = ''
        this.spotList.remark = ''
        this.spotList.duty = ''
        this.spotList.template = ''
        this.spotList.roleId = []
        this.spotList.roleNum = ''
        this.spotList.deviceTypeNum = ''
        this.attachmentJpg = ''
      }
      this.deviceTypeId = []
    },
    taskSave() {
      if (this.actionTab == 1) {
        for (let i = 0; i < this.roleId.length; i++) {
          for (let a = 0; a < this.personnelList.length; a++) {
            if (this.roleId[i] == this.personnelList[a].id) {
              if (this.lineList.roleNum != '') {
                this.lineList.roleNum = this.lineList.roleNum + ',' + this.personnelList[a].num
              } else {
                this.lineList.roleNum = this.personnelList[a].num
              }
            }
          }
        }
        for (const item of this.deviceTypeId) {
          for (const ar of this.equipmentList) {
            for (const arrr of ar.children) {
              for (const arr of arrr.children) {
                if (item == arr.id) {
                  if (this.lineList.deviceNum != '') {
                    this.lineList.deviceNum = this.lineList.deviceNum + ',' + arr.num
                  } else {
                    this.lineList.deviceNum = arr.num
                  }
                }
              }
            }
          }
        }
        this.lineList.roleId = this.roleId.join(',')
        this.lineList.riverId = this.riverId.join(',')
        this.lineList.deviceId = this.deviceTypeId.join(',')
        var data = this.lineList
        if (this.fileList.length == 0) {
          getTaskSave(data)
            .then(res => {
              this.$message.success('保存成功')
              this.taskCancel()
              this.getLineList()
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else {
          this.$refs.upload.submit()
        }
      } else if (this.actionTab == 2) {
        var data = this.spotList
        for (let i = 0; i < this.spotList.roleId.length; i++) {
          for (let a = 0; a < this.personnelList.length; a++) {
            if (this.spotList.roleId[i] == this.personnelList[a].id) {
              if (data.roleNum != '') {
                data.roleNum = data.roleNum + ',' + this.personnelList[a].num
              } else {
                data.roleNum = this.personnelList[a].num
              }
            }
          }
        }
        for (const item of this.deviceTypeId) {
          for (const ar of this.equipmentList) {
            for (const arrr of ar.children) {
              for (const arr of arrr.children) {
                if (item == arr.id) {
                  if (data.deviceNum != '') {
                    data.deviceNum = data.deviceNum + ',' + arr.num
                  } else {
                    data.deviceNum = arr.num
                  }
                }
              }
            }
          }
        }
        data.deviceId = this.deviceTypeId.join(',')
        data.roleId = data.roleId.join(',')
        if (this.fileList.length == 0) {
          getTaskSave(data)
            .then(res => {
              var arr = res.data
              this.$message.success('保存成功')
              this.taskCancel()
              this.getList()
            })
            .catch(err => {
              this.$message.error(err.response.data.message)
            })
        } else {
          this.$refs.upload1.submit()
        }
      }
    },
    //上传
    submitUpload() {},
    //上传成功
    handleSuccess(response, file, fileList) {
      this.taskCancel()
      this.$message.success('保存成功')
      this.getLineList()
    },
    handleSuccess1(response, file, fileList) {
      this.taskCancel()
      this.$message.success('保存成功')
      this.getList()
    },
    uploadChange(file, fileList) {
      if (this.fileList.length == 0) {
        this.fileList = fileList
      } else {
        this.fileList = []
      }
    },
    uploadChange1(file, fileList) {
      if (this.fileList.length == 0) {
        this.fileList = fileList
        this.attachmentJpg = URL.createObjectURL(file.raw)
      } else {
        this.fileList = []
      }
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},
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
          this.fixedPointList = arr
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
    allPointTestingTask(pointLists) {
      for (const item of pointLists) {
        this.drawTestingAllPoint(item.latlng, item.id, item.name, item.type.code)
      }
    },
    // 添加标注图片
    drawTestingAllPoint(latlng, id, title, type) {
      let iconUrl
      if (type == 'fixed') {
        iconUrl = require('../../assets/img/fixedIcon.png')
      } else if (type == 'manual') {
        iconUrl = require('../../assets/img/peopleIcon.png')
      }
      let icon = new T.Icon({
        iconUrl: iconUrl,
        iconSize: new T.Point(41, 40),
        iconAnchor: new T.Point(21, 40)
      })
      let marker = new T.Marker(latlng, { icon: icon, id: id, title: title })
      this.map.addOverLay(marker)
    },
    // 检测所有开关
    watchAllSwitch() {
      // 固定监测点
      if (this.autoDetection) {
        this.allPointTestingTask(this.fixedPointList)
      } else {
        for (const overlay of this.map.getOverlays()) {
          for (const item of this.fixedPointList) {
            if (item.id == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
          }
        }
      }
      //人工监测点
      if (this.peopleDetection) {
        this.allPointTestingTask(this.peoplePointList)
      } else {
        for (const overlay of this.map.getOverlays()) {
          for (const item of this.peoplePointList) {
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
<style lang="less">
.ant-form input[type='file'] {
  display: none;
}
</style>
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

.left {
  position: relative;
  width: calc(100% - 400px);
  height: 100%;
  display: inline-block;
  vertical-align: top;
}
.map_change {
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 140px;
  z-index: 1500;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 5px 10px;
  .ant-col-6 {
    padding-bottom: 4px;
  }
}
.right {
  position: relative;
  width: 400px;
  height: 100%;
  display: inline-block;
  vertical-align: top;
  // padding: 10px;
  background-color: white;
}
.task_face {
  width: 100%;
  height: calc(100vh - 195px);
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
