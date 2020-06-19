<template>
  <div style="width:100%;height:calc(100vh - 64px);" ref="monitor">
    <water-quality ref="waterquality"></water-quality>
    <split-pane :min-percent="25" :default-percent="81.5" split="vertical">
      <template slot="paneL">
        <div class="left-info">
          <!-- <img src="../../assets/map.jpg" style="width:100%;height: calc(100vh - 66px);"> -->
          <div id="map" class="map"></div>
          <div class="leftShow" v-if="noTitleKey === 'addPlan' || nosuperKey === 'taskCard'">
            <div class="left-date">
              <el-date-picker
                v-model="picker"
                type="date"
                placeholder="选择日期"
                style="width:100%;"
                value-format="yyyy-MM-dd"
                @change="selectData"
              ></el-date-picker>
            </div>
            <!-- 天气 -->
            <div class="weather">
              <div>
                <img v-show="weatherData.img" :src="weatherData.img" alt="天气" />
              </div>
              <div>
                <p>实时天气: {{weatherData.text}}</p>
                <p>风力: {{weatherData.wind_scale}}级</p>
              </div>
              <div class="weather_right">
                <a-icon
                  class="right_icon"
                  type="caret-left"
                  :class="rightIcon == true ? 'right_icon_active':''"
                  @click="rightIconClick"
                />
                <!-- 天气弹窗 -->
                <div class="weather_alert" v-show="rightIcon">
                  <div class="weather_content">
                    <a-select style="width: 200px" v-model="itgePortId">
                      <a-select-option
                        v-for="item in tigePage"
                        :key="item.locationId"
                        :value="item.portId"
                      >{{item.portName}}</a-select-option>
                    </a-select>
                    <div id="main1" style="width:500px;height:450px"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 新建计划时展示 -->
            <div
              class="left-patrol"
              v-if="noTitleKey === 'addPlan' || nosuperKey === 'taskCard'"
              v-show="jurisdiction"
            >
              <p class="left-patrol-title">
                <img style="vertical-align: middle;" src="./img/patrolPlan.png" alt />
                <span style="vertical-align: middle;">推荐巡河方案</span>
              </p>
              <div class="patrol-plan">
                <!-- <a-tree defaultExpandAll v-model="checkedPlan" @select="selectPatrol" :treeData="patrolPlanInfo"/> -->
                <a-collapse v-model="activeKey" @change="changeCollapse" accordion>
                  <a-collapse-panel
                    :header="item.river.name"
                    style="text-align: left"
                    v-for="item in patrolPlanInfo"
                    :key="item.river.id"
                  >
                    <p style="margin:0;">{{text}}</p>
                  </a-collapse-panel>
                </a-collapse>
              </div>
            </div>
            <!-- 河岸风险源 -->
            <!-- v-show="riverRisk" -->
            <div class="river_risk_alert">
              <a-collapse>
                <a-collapse-panel>
                  <div slot="header">
                    <img style="vertical-align: middle;" src="./img/riverRiskIcon.png" alt />
                    <span style="vertical-align: middle;">河岸风险源</span>
                  </div>
                  <div class="river_risk_content">
                    <div class="river_risk_type">
                      <img src="./img/level1.png" alt />
                      <img src="./img/level2.png" alt />
                      <img src="./img/level3.png" alt />
                      <img src="./img/level4.png" alt />
                      <img src="./img/levelno.png" alt />
                    </div>
                    <div class="river_risk_list">
                      <a-row
                        style="width:100%"
                        type="flex"
                        justify="space-between"
                        align="middle"
                        v-for="item in riskSourceList"
                        :key="item.id"
                      >
                        <a-col :span="18">
                          <img :src="item.icon" alt />
                          <span>{{item.name}}({{item.num}})</span>
                        </a-col>
                        <a-col :span="6" style="text-align: right;">
                          <a-switch
                            size="small"
                            v-model="item.clicked"
                            @click="onDrawType(item.id,item.clicked)"
                          />
                        </a-col>
                      </a-row>
                    </div>
                  </div>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </div>
          <!-- 今日计划监管页轨迹 -->
          <div style="display:none;">
            <div class="super_weather">
              <!-- <img src="../../assets/weather.jpg" alt /> -->
            </div>
            <div class="left_riverInfo">
              <a-tabs defaultActiveKey="1" @change="changeInfo">
                <a-tab-pane tab="水质数据" key="1">
                  <a-row class="rInfo_row">
                    <a-col :span="12">
                      <span class="rInfo_title">水体名称&nbsp;:</span>
                      <span class="rInfo_info">黄浦江</span>
                    </a-col>
                    <a-col :span="10" :offset="2">
                      <span class="rInfo_info">2019-8-22 13:00</span>
                    </a-col>
                  </a-row>
                  <a-row class="rInfo_row">
                    <a-col :span="12">
                      <span class="rInfo_title">断面名称&nbsp;:</span>
                      <span class="rInfo_info">黄浦江</span>
                    </a-col>
                  </a-row>
                </a-tab-pane>
                <a-tab-pane tab="河长信息" key="2"></a-tab-pane>
              </a-tabs>
            </div>
          </div>
          <div class="map_operate">
            <ul>
              <li @click="setCenter">
                <img src="../../assets/restoration.png" alt="复位" />
              </li>
              <li style="border-radius: 40px;">
                <img @click="mapZoomIn" src="../../assets/max.png" alt="放大" />
                <img @click="mapZoomOut" src="../../assets/min.png" alt="缩小" />
              </li>
              <li>
                <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
                  <div slot="content" style="width:120px;">
                    <a-row>
                      <a-radio-group v-model="mapType" @change="onMapChange">
                        <a-col :span="24">
                          <a-radio value="a">
                            <span style="margin-left:10px;">2D影像图</span>
                          </a-radio>
                        </a-col>
                        <a-col :span="24">
                          <a-radio value="b">
                            <span style="margin-left:10px;">卫星影像图</span>
                          </a-radio>
                        </a-col>
                      </a-radio-group>
                    </a-row>
                    <a-row>
                      <a-col :span="24">
                        <a-switch
                          size="small"
                          v-model="roadWordChange"
                          @click="onRoadChangeSwitch"
                        />
                        <span style="margin-left:7px;">道路标注</span>
                      </a-col>
                    </a-row>
                    <a-row>
                      <a-col :span="24">
                        <a-switch
                          size="small"
                          v-model="layerImageChange"
                          @click="onLayerImageSwitch"
                        />
                        <span style="margin-left:7px;">正射开关</span>
                      </a-col>
                    </a-row>
                  </div>
                  <img src="../../assets/mapIcon.png" alt="图像" title="图像" />
                </a-popover>
              </li>
              <li class="popMore">
                <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
                  <template slot="content" style="overflow-y: scroll;">
                    <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
                      <div slot="content" style="min-width: 180px;">
                        <a-row type="flex" justify="space-between" align="middle">
                          <a-col :span="20">
                            <img
                              style="width:20px;height:20px;margin-right:5px;"
                              src="./img/riverRisk.png"
                            />
                            <span>河岸风险源({{statisticsList.riskSource}})</span>
                          </a-col>
                          <a-col :span="4" style="text-align:right;">
                            <a-switch size="small" v-model="riverRisk" @click="onRiverRisk" />
                          </a-col>
                        </a-row>
                        <a-row type="flex" justify="space-between" align="middle">
                          <a-col :span="20">
                            <img
                              style="width:20px;height:20px;margin-right:5px;"
                              src="./img/riskMap.png"
                            />
                            <span>风险地图({{statisticsList.riskMap}})</span>
                          </a-col>
                          <a-col :span="4" style="text-align:right;">
                            <a-switch size="small" v-model="riskMap" @click="onRiskMap" />
                          </a-col>
                        </a-row>
                        <a-row type="flex" justify="space-between" align="middle">
                          <a-col :span="20">
                            <img
                              style="width:20px;height:20px;margin-right:5px;"
                              src="./img/waterQualityIcon.png"
                            />
                            <span>水质数据({{regulatorWaterCountData}})</span>
                          </a-col>
                          <a-col :span="4" style="text-align:right;">
                            <a-switch size="small" v-model="waterQuality" @click="onWaterQuality" />
                          </a-col>
                        </a-row>
                        <a-row type="flex" justify="space-between" align="middle">
                          <a-col :span="20">
                            <img
                              style="width:20px;height:20px;margin-right:5px;"
                              src="./img/waterFlotageIcon.png"
                            />
                            <span>水面漂浮物({{statisticsList.floatage}})</span>
                          </a-col>
                          <a-col :span="4" style="text-align:right;">
                            <a-switch size="small" v-model="waterFlotage" @click="onWaterFlotage" />
                          </a-col>
                        </a-row>
                        <a-row type="flex" justify="space-between" align="middle">
                          <a-col :span="20">
                            <img
                              style="width:20px;height:20px;margin-right:5px;"
                              src="./img/outletIcon.png"
                            />
                            <span>排口({{statisticsList.discharge}})</span>
                          </a-col>
                          <a-col :span="4" style="text-align:right;">
                            <a-switch size="small" v-model="outlet" @click="onOutlet" />
                          </a-col>
                        </a-row>
                        <a-row type="flex" justify="space-between" align="middle">
                          <a-col :span="20">
                            <img
                              style="width:20px;height:20px;margin-right:5px;"
                              src="./img/surveyPointIcon1.png"
                            />
                            <span>专项调查点({{pointCountData}})</span>
                          </a-col>
                          <a-col :span="4" style="text-align:right;">
                            <a-switch size="small" v-model="surveyPoint" @click="onSurveyPoint" />
                          </a-col>
                        </a-row>
                      </div>
                      <div>
                        <span>风险管理</span>
                      </div>
                    </a-popover>
                    <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
                      <template slot="content">
                        <a-row
                          v-for="item in otherList"
                          :key="item.id"
                          style="width:150px"
                          type="flex"
                          justify="space-between"
                          align="middle"
                        >
                          <a-col :span="20">
                            <!-- <img style="width:20px;height:20px;margin-right:5px;"
                            :src="item.drawType.icon" />-->
                            <span>{{item.name}}({{item.num}})</span>
                          </a-col>
                          <a-col :span="4" style="text-align: right;">
                            <a-switch
                              size="small"
                              style
                              v-model="item.clicked"
                              @click="onWaterLandLoss(item.id,item.clicked)"
                            />
                          </a-col>
                        </a-row>
                      </template>
                      <div>
                        <span>其他({{statisticsList.other}})</span>
                      </div>
                    </a-popover>
                  </template>
                  <img src="../../assets/more.png" alt="更多" title="更多" />
                </a-popover>
              </li>
            </ul>
          </div>
          <div class="accordion_alert" v-show=" riskMap || waterQuality || riverRisk || outlet">
            <a-collapse accordion class="custom_collapse" v-model="accordionAlertKey">
              <a-collapse-panel
                header="河岸风险源"
                :style="customStyle"
                v-show="riverRisk"
                class="custom_list"
                key="riverRisk"
              >
                <a-select
                  showSearch
                  mode="tags"
                  :allowClear="true"
                  placeholder="请选择河岸风险源等级"
                  optionFilterProp="children"
                  style="width: 100%"
                  @change="riverRiskChange"
                  v-model="riskSourceLevel"
                  :filterOption="riverRiskFilterOption"
                >
                  <a-select-option value="one">Ⅰ级</a-select-option>
                  <a-select-option value="two">Ⅱ级</a-select-option>
                  <a-select-option value="three">Ⅲ级</a-select-option>
                  <a-select-option value="four">Ⅳ级</a-select-option>
                </a-select>
              </a-collapse-panel>
              <a-collapse-panel
                header="排口"
                :style="customStyle"
                v-show="outlet"
                class="custom_list"
                key="outlet"
              >
                <a-select
                  showSearch
                  mode="tags"
                  :allowClear="true"
                  placeholder="请选择排口类别"
                  optionFilterProp="children"
                  style="width: 100%"
                  @change="waterQualityChange"
                  :filterOption="waterQualityFilterOption"
                  v-model="dischargeLevel"
                >
                  <a-select-option value="rainwater">雨水</a-select-option>
                  <a-select-option value="life">生活</a-select-option>
                  <a-select-option value="mix">混合</a-select-option>
                  <a-select-option value="industrial">工业</a-select-option>
                  <a-select-option value="powerplant">电厂温排水</a-select-option>
                  <a-select-option value="other">其他</a-select-option>
                </a-select>
              </a-collapse-panel>
            </a-collapse>
          </div>
          <search-river ref="selectPatrol" class="riverSearchModal"></search-river>
          <add-survey ref="addSurvey" class="riverSearchModal"></add-survey>
        </div>
      </template>
      <template slot="paneR">
        <div class="right-info">
          <div class="right-body">
            <!-- <a-card
              class="mainCard"
              :tabList="planCard"
              :activeTabKey="noTitleKey"
              @tabChange="key => onTabChange(key,'noTitleKey')"
              v-if="firstShow"
            ></a-card>-->
            <a-tabs
              :activeKey="SamedayAndNewlybuild"
              defaultActiveKey="addPlan"
              @change="onTabChange"
              v-show="firstShow"
              class="custom_tabs mainCard"
            >
              <a-tab-pane key="addPlan">
                <span slot="tab">
                  <a-icon type="plus-circle" />新建计划
                </span>
                <!-- 新建计划 -->
                <div class="task_face">
                  <a-spin size="large" :spinning="spinning">
                    <!-- 判断显示内容 -->
                    <div v-if="ishidden == 1">
                      <a-row
                        v-show="jurisdiction"
                        type="flex"
                        justify="center"
                        style="margin-bottom:15px;margin-top:15px;text-align:center;"
                      >
                        <a-col :span="12">
                          <a-button style="padding:0 22px;color:#1890ff;" @click="addRiverBtn">
                            <img
                              style="width: 13px;height: 13px;margin-right: 4px;vertical-align: middle;"
                              src="./img/addRiverIcon.png"
                            />
                            <span style="vertical-align: middle;color: rgba(32, 56, 104, 1);">添加河道</span>
                          </a-button>
                        </a-col>
                        <a-col :span="12">
                          <a-button @click="addSurveyPoint" class="commBtn">
                            <img
                              style="width: 16px;height: 16px;vertical-align: middle;"
                              src="./img/addSurveyPointIcon.png"
                            />
                            <span style="vertical-align: middle;color: rgba(32, 56, 104, 1);">添加调查点</span>
                          </a-button>
                        </a-col>
                      </a-row>
                      <div class="riverInfo" v-for="item in riverMontion" :key="item.value">
                        <div class="river_info">
                          <a-row type="flex" justify="space-between" align="middle">
                            <a-col :span="18">{{item.objectName}}</a-col>
                            <a-col :span="3">
                              <a-popconfirm
                                title="是否确认删除?"
                                @confirm="getInspectPointDel(item.id)"
                                @cancel="cancel"
                                okText="确认"
                                cancelText="取消"
                              >
                                <a-button
                                  shape="circle"
                                  icon="close"
                                  style="font-size:8px;"
                                  v-show="jurisdiction"
                                ></a-button>
                              </a-popconfirm>
                            </a-col>
                          </a-row>
                        </div>
                        <a-tree
                          checkable
                          defaultExpandAll
                          :defaultSelectedKeys="defaultSelect"
                          v-model="item.taskChoose"
                          @select="onSelect"
                          :selectedKeys="selectedKeys"
                          :treeData="item.taskPage"
                        ></a-tree>
                        <div v-show="hidingJudgment2">
                          <a-button
                            class="addTask_btn commBtn"
                            icon="plus"
                            @click="addTaskBtn(item.objectId,item.objectName,item.code,item)"
                            v-if="item.isShow == false"
                            v-show="jurisdiction"
                          >追加任务</a-button>
                        </div>
                        <div class="addTask_info" v-show="item.isShow">
                          <p class="addTask_title">追加任务</p>
                          <a-form class="addTask_from">
                            <a-form-item label="名称" :label-col="{span:6}" :wrapper-col="{span:16}">
                              <a-input placeholder="请输入任务名称" v-model="listAppend.name"></a-input>
                            </a-form-item>
                            <a-form-item
                              label="任务类型"
                              :label-col="{span:6}"
                              :wrapper-col="{span:16}"
                            >
                              <a-select v-model="listAppend.template">
                                <a-select-option value="uav">无人机</a-select-option>
                                <a-select-option value="manual">人工调查</a-select-option>
                                <a-select-option value="water">水质调查</a-select-option>
                              </a-select>
                            </a-form-item>
                            <a-form-item
                              label="任务内容"
                              :label-col="{ span: 6}"
                              :wrapper-col="{ span: 16}"
                            >
                              <a-textarea
                                placeholder="Basic usage"
                                :rows="4"
                                v-model="listAppend.content"
                              />
                            </a-form-item>
                            <a-form-item
                              label="位置"
                              :label-col="{ span: 6}"
                              :wrapper-col="{ span: 16 }"
                              style="text-align:left;"
                            >
                              <a-radio-group v-model="listAppend.locationType">
                                <a-radio-button value="point" @click.stop="addPoint">点</a-radio-button>
                                <a-radio-button value="line" @click.stop="addLineTool">线</a-radio-button>
                                <a-radio-button value="polygon" @click.stop="addPolygonTool">面</a-radio-button>
                              </a-radio-group>
                              <!-- <a-button v-show="btnShow" @click="searchDraw" style="width:90%;">查看</a-button> -->
                            </a-form-item>
                            <a-form-item
                              label="任务职位"
                              :label-col="{ span: 6}"
                              :wrapper-col="{ span: 16 }"
                            >
                              <a-select
                                showSearch
                                mode="multiple"
                                :allowClear="true"
                                placeholder="请选择"
                                optionFilterProp="children"
                                style="width: 100%"
                                v-model="listAppend.roleId"
                              >
                                <a-select-option
                                  v-for="item in rolePage"
                                  :value="item.id"
                                  :key="item.id"
                                >{{item.name}}</a-select-option>
                              </a-select>
                            </a-form-item>
                            <a-form-item
                              :wrapper-col="{span:24}"
                              style="text-align:center;margin-top:10px;"
                            >
                              <a-button
                                @click="cancleBtn(item.objectName)"
                                style="display:inline-block;width:40%;margin-right:10px;"
                              >取消</a-button>
                              <a-button
                                type="primary"
                                @click="addPlanInfo"
                                style="display:inline-block;width:40%;color:#FFFFFF;"
                              >添加</a-button>
                            </a-form-item>
                          </a-form>
                        </div>
                        <!-- <add-task
                          ref="addTask"
                          :msg="newTaskObj"
                          @chooseLocation="addLineTool"
                          @cancleBtn="cancelAddTask"
                          @confirmBtn="confirmAddTask($event)"
                          @addPoint="addPoint"
                          @addLineTool="addLineTool"
                          @addPolygonTool="addPolygonTool"
                        ></add-task>-->
                      </div>
                    </div>
                    <div v-show="ishidden == 2">
                      <creat-group ref="creatGroup"></creat-group>
                    </div>
                    <div v-show="ishidden == 3">
                      <plan-list ref="planList"></plan-list>
                    </div>
                  </a-spin>
                </div>
              </a-tab-pane>
              <a-tab-pane key="nowPlan">
                <span slot="tab">
                  <a-icon type="calendar" />当日计划
                </span>
                <!-- 今日计划 -->
                <div class="task_face">
                  <a-spin size="large" :spinning="spinning">
                    <a-collapse
                      v-model="activePlanKey"
                      class="active_plan"
                      v-for=" item in planListPage"
                      :key="item.plan.id"
                    >
                      <a-collapse-panel :key="item.plan.id" class="collapse_header">
                        <template slot="header">
                          <a-row type="flex" justify="space-between" align="middle">
                            <a-col :span="8">
                              <span>{{item.plan.name}}</span>
                            </a-col>
                            <a-col :span="16">
                              <a-progress :percent="item.plan.percentage" />
                            </a-col>
                          </a-row>
                        </template>
                        <div class="planGroup">
                          <a-collapse
                            v-model="activeGroupKey"
                            v-for=" index in item.teams"
                            :key="index.team.id"
                          >
                            <a-collapse-panel :key="index.team.id" class="collapse_group">
                              <template slot="header">
                                <a-row type="flex" justify="space-between" align="middle">
                                  <a-col :span="8">
                                    <span>{{index.team.name}}</span>
                                  </a-col>
                                  <a-col :span="16">
                                    <a-progress :percent="index.team.percentage" />
                                  </a-col>
                                </a-row>
                              </template>
                              <div class="river_group">
                                <a-collapse
                                  v-model="activeRiverKey"
                                  style="border-bottom:1px solid d9d9d9;"
                                  v-for=" targetId in index.targets"
                                  :key="targetId.id"
                                >
                                  <a-collapse-panel
                                    :key="targetId.target.id"
                                    class="collapse_river"
                                  >
                                    <template slot="header">
                                      <a-row type="flex" justify="space-between" align="middle">
                                        <a-col :span="16">
                                          <span
                                            style="padding:3px 5px;background-color:#2DBFFC;color:#fff;margin-right:3px;border-radius:10px;height: 20px;font-size: 10px;"
                                          >{{targetId.completeTaskNum}}/{{targetId.totalTaskNum}}</span>
                                          <span
                                            @click="choosePointTask1(targetId.target.id,targetId)"
                                          >{{targetId.target.objectName}}</span>
                                        </a-col>
                                        <a-col :span="8" v-if="hidingJudgment3 == true">
                                          <a-popconfirm
                                            :title="'是否确认删除'+targetId.target.objectName+'?'"
                                            okText="确认"
                                            cancelText="取消"
                                            @confirm="del(targetId.target.id)"
                                          >
                                            <a v-show="jurisdiction">删除</a>
                                          </a-popconfirm>
                                        </a-col>
                                      </a-row>
                                    </template>
                                    <div style="padding:10px 10px;">
                                      <div>
                                        <div class="riverGroup_info">未完成</div>
                                        <a-tree
                                          v-model="checkedKeys"
                                          @select="onSelect"
                                          :selectedKeys="selectedKeys"
                                          :treeData="targetId.incomplete"
                                        ></a-tree>
                                      </div>
                                      <div class>
                                        <div class="riverGroup_success">已完成</div>
                                        <a-tree
                                          v-model="checkedKeys"
                                          @select="onSelect"
                                          :selectedKeys="selectedKeys"
                                          :treeData="targetId.complete"
                                          class="tree_succ"
                                        >
                                          <template slot="custom" slot-scope="item">
                                            <span class>
                                              <a-button @click.stop="searchItme(item.id)">查看</a-button>
                                            </span>
                                            <span>{{ item.name }}</span>
                                          </template>
                                        </a-tree>
                                      </div>
                                      <div>
                                        <div class="riverGroup_warning">已取消</div>
                                        <a-tree
                                          v-model="checkedKeys"
                                          @select="onSelect"
                                          :selectedKeys="selectedKeys"
                                          :treeData="targetId.anomalous"
                                        ></a-tree>
                                      </div>
                                    </div>
                                    <div class="addTaskBtn" v-show="hidingJudgment2">
                                      <!-- <a-button class="addTask_btn" icon="plus" @click="addNewTask">追加任务</a-button> -->
                                      <a-button
                                        class="addTask_btn commBtn"
                                        icon="plus"
                                        v-show="jurisdiction"
                                        @click="addTaskBtnDay(item.plan.id,targetId.target.objectId,targetId.target.objectName,targetId.target.object.code,index.team.id,index.team.id,targetId)"
                                        v-if="targetId.isShow == false"
                                      >追加任务</a-button>
                                      <div class="addTask_info" v-show="targetId.isShow">
                                        <p class="addTask_title">追加任务</p>
                                        <a-form class="addTask_from">
                                          <a-form-item
                                            label="名称"
                                            :label-col="{span:6}"
                                            :wrapper-col="{span:16}"
                                          >
                                            <a-input
                                              placeholder="请输入任务名称"
                                              v-model="listAppend.name"
                                            ></a-input>
                                          </a-form-item>
                                          <a-form-item
                                            label="任务类型"
                                            :label-col="{span:6}"
                                            :wrapper-col="{span:16}"
                                          >
                                            <a-select v-model="listAppend.template">
                                              <a-select-option value="uav">无人机</a-select-option>
                                              <a-select-option value="manual">人工调查</a-select-option>
                                              <a-select-option value="water">水质调查</a-select-option>
                                            </a-select>
                                          </a-form-item>
                                          <a-form-item
                                            label="任务内容"
                                            :label-col="{ span: 6}"
                                            :wrapper-col="{ span: 16}"
                                          >
                                            <a-textarea
                                              placeholder="Basic usage"
                                              :rows="4"
                                              v-model="listAppend.content"
                                            />
                                          </a-form-item>
                                          <a-form-item
                                            label="位置"
                                            :label-col="{ span: 6}"
                                            :wrapper-col="{ span: 16 }"
                                            style="text-align:left;"
                                          >
                                            <a-radio-group v-model="listAppend.locationType">
                                              <a-radio-button value="point" @click.stop="addPoint">点</a-radio-button>
                                              <a-radio-button
                                                value="line"
                                                @click.stop="addLineTool"
                                              >线</a-radio-button>
                                              <a-radio-button
                                                value="polygon"
                                                @click.stop="addPolygonTool"
                                              >面</a-radio-button>
                                            </a-radio-group>
                                            <!-- <a-button v-show="btnShow" @click="searchDraw" style="width:90%;">查看</a-button> -->
                                          </a-form-item>
                                          <a-form-item
                                            label="任务职位"
                                            :label-col="{ span: 6}"
                                            :wrapper-col="{ span: 16 }"
                                          >
                                            <a-select
                                              showSearch
                                              mode="multiple"
                                              :allowClear="true"
                                              placeholder="请选择"
                                              optionFilterProp="children"
                                              style="width: 100%"
                                              v-model="listAppend.roleId"
                                            >
                                              <a-select-option
                                                v-for="item in rolePage"
                                                :value="item.id"
                                                :key="item.id"
                                              >{{item.name}}</a-select-option>
                                            </a-select>
                                          </a-form-item>
                                          <!-- <a-form-item label="是否紧急" :label-col="{ span: 6}" :wrapper-col="{ span: 16 }" style="text-align:left;">
                                                    <a-checkbox>紧急任务</a-checkbox>
                                          </a-form-item>-->
                                          <!-- <a-form-item label="图片上传" :label-col="{ span: 6}" :wrapper-col="{ span: 16 }" style="text-align:left;">
                                                    <a-upload name="file" :multiple="true" action="''">
                                                        <a-button>
                                                            <a-icon type="upload" /> Click to Upload
                                                        </a-button>
                                                    </a-upload>
                                          </a-form-item>-->
                                          <a-form-item
                                            :wrapper-col="{span:24}"
                                            style="text-align:center;margin-top:10px;"
                                          >
                                            <a-button
                                              @click="cancleBtn(targetId.target.objectName)"
                                              style="display:inline-block;width:40%;margin-right:10px;"
                                            >取消</a-button>
                                            <a-button
                                              type="primary"
                                              @click="addPlanInfo"
                                              style="display:inline-block;width:40%;color:#FFFFFF;"
                                            >添加</a-button>
                                          </a-form-item>
                                        </a-form>
                                      </div>
                                    </div>
                                  </a-collapse-panel>
                                </a-collapse>
                              </div>
                            </a-collapse-panel>
                          </a-collapse>
                        </div>
                        <div class="btn_group">
                          <a-row type="flex" justify="space-around">
                            <a-col :span="10">
                              <a-button class="groupBtn" @click="detailPlan(item.plan.id)">详情</a-button>
                            </a-col>
                            <a-col :span="10">
                              <a-button
                                class="groupBtn"
                                @click="supervision_btn(item.plan.id)"
                                v-show="hidingJudgment1"
                              >监管</a-button>
                              <a-button class="groupBtn" @click="updateTime" v-if="undone">修改时间</a-button>
                            </a-col>
                          </a-row>
                        </div>
                      </a-collapse-panel>
                    </a-collapse>
                  </a-spin>
                </div>
              </a-tab-pane>
            </a-tabs>
            <!-- 首页内容展示 -->
            <a-card
              :tabList="superCard"
              :activeTabKey="nosuperKey"
              @tabChange="key => onsuperChange(key,'nosuperKey')"
              v-if="!firstShow"
            >
              <div v-if="nosuperKey === 'taskCard'">
                <a-collapse
                  v-model="activePlanKey"
                  class="active_plan"
                  v-for=" item in planListPage"
                  :key="item.plan.id"
                >
                  <a-collapse-panel :key="item.plan.id" class="collapse_header">
                    <template slot="header">
                      <a-row type="flex" justify="space-between" align="middle">
                        <a-col :span="8">
                          <span>{{item.plan.name}}</span>
                        </a-col>
                        <a-col :span="16">
                          <a-progress :percent="item.plan.percentage" />
                        </a-col>
                      </a-row>
                    </template>
                    <div class="planGroup">
                      <a-collapse
                        v-model="activeGroupKey"
                        v-for=" index in item.teams"
                        :key="index.team.id"
                      >
                        <a-collapse-panel :key="index.team.id" class="collapse_group">
                          <template slot="header">
                            <a-row type="flex" justify="space-between" align="middle">
                              <a-col :span="8">
                                <span>{{index.team.name}}</span>
                              </a-col>
                              <a-col :span="16">
                                <a-progress :percent="index.team.percentage" />
                              </a-col>
                            </a-row>
                          </template>
                          <div class="river_group">
                            <a-collapse
                              v-model="activeRiverKey"
                              style="border-bottom:1px solid d9d9d9;"
                              v-for=" targetId in index.targets"
                              :key="targetId.id"
                            >
                              <a-collapse-panel :key="targetId.target.id" class="collapse_river">
                                <template slot="header">
                                  <a-row type="flex" justify="space-between" align="middle">
                                    <a-col :span="16">
                                      <div>{{targetId.target.objectName}}</div>
                                    </a-col>
                                    <a-col :span="8">
                                      <a-popconfirm
                                        :title="'是否确认删除'+targetId.target.objectName+'?'"
                                        okText="确认"
                                        cancelText="取消"
                                        @confirm="del(targetId.target.id)"
                                      >
                                        <a v-show="jurisdiction">删除</a>
                                      </a-popconfirm>
                                    </a-col>
                                  </a-row>
                                </template>
                                <div style="padding:10px 10px;">
                                  <div>
                                    <div class="riverGroup_info">未完成</div>
                                    <a-tree
                                      v-model="checkedKeys"
                                      @select="onSelect"
                                      :selectedKeys="selectedKeys"
                                      :treeData="targetId.incomplete"
                                    ></a-tree>
                                  </div>
                                  <div class>
                                    <div class="riverGroup_success">已完成</div>
                                    <a-tree
                                      v-model="checkedKeys"
                                      @select="onSelect"
                                      :selectedKeys="selectedKeys"
                                      :treeData="targetId.complete"
                                      class="tree_succ"
                                    >
                                      <template slot="custom" slot-scope="item">
                                        <span class>
                                          <a-button class @click.stop="searchItme(item.id)">查看</a-button>
                                        </span>
                                        <span>{{ item.name }}</span>
                                      </template>
                                    </a-tree>
                                  </div>
                                  <div>
                                    <div class="riverGroup_warning">已取消</div>
                                    <a-tree
                                      v-model="checkedKeys"
                                      @select="onSelect"
                                      :selectedKeys="selectedKeys"
                                      :treeData="targetId.anomalous"
                                    ></a-tree>
                                  </div>
                                </div>
                              </a-collapse-panel>
                            </a-collapse>
                          </div>
                        </a-collapse-panel>
                      </a-collapse>
                    </div>
                  </a-collapse-panel>
                </a-collapse>
              </div>
              <div v-if="nosuperKey === 'personCard'">
                <a-collapse
                  v-model="activePlanKey"
                  class="active_plan"
                  v-for=" item in regulatoryPage"
                  :key="item.plan.id"
                >
                  <a-collapse-panel :key="item.plan.id" class="collapse_header">
                    <template slot="header">
                      <a-row type="flex" justify="space-between" align="middle">
                        <a-col :span="8">
                          <span>{{item.plan.name}}</span>
                        </a-col>
                        <!-- <a-col :span="16">
                          <a-progress :percent="70" />
                        </a-col>-->
                      </a-row>
                    </template>
                    <div class="planGroup">
                      <a-collapse
                        v-model="activeGroupKey"
                        v-for=" index in item.teams"
                        :key="index.team.id"
                      >
                        <a-collapse-panel :key="index.team.id" class="collapse_group">
                          <template slot="header">
                            <a-row type="flex" justify="space-between" align="middle">
                              <a-col :span="8">
                                <span>{{index.team.name}}</span>
                              </a-col>
                              <!-- <a-col :span="16">
                                <a-progress :percent="70" />
                              </a-col>-->
                            </a-row>
                          </template>
                          <div class="plan_personInfo">
                            <a-checkbox-group @change="onChange" v-model="item.checkbox">
                              <a-row>
                                <a-col
                                  class="person_check"
                                  :span="24"
                                  v-for="(asdsad,asassa) in index.staffs"
                                  :key="asassa"
                                >
                                  <a-row type="flex" justify="space-around" align="middle">
                                    <a-col :span="20">
                                      <a-checkbox
                                        class="checkboxClass"
                                        :value="asdsad.id"
                                      >{{asdsad.name}}&nbsp;({{asdsad.role}})</a-checkbox>
                                    </a-col>
                                    <a-col :span="4" style="line-height:30px;">
                                      <div
                                        :style="'line-height:30px;width:10px;height:10px;border-radius:50%;background-color:'+asdsad.rgb"
                                      ></div>
                                    </a-col>
                                  </a-row>
                                </a-col>
                              </a-row>
                            </a-checkbox-group>
                          </div>
                        </a-collapse-panel>
                      </a-collapse>
                    </div>
                  </a-collapse-panel>
                </a-collapse>
              </div>
            </a-card>
          </div>
          <!-- 底部 -->
          <div class="addPlan_foot" v-show="noTitleKey === 'addPlan'">
            <div v-if="ishidden == 1">
              <a-row type="flex" justify="space-around" v-show="jurisdiction">
                <a-col :span="10">
                  <a-button class="groupBtn" @click="newPlan_btn" v-show="hidingJudgment">生成计划</a-button>
                  <!-- <a-button class="groupBtn" @click="newPlan_btn" >生成计划</a-button> -->
                </a-col>
                <a-col :span="10">
                  <a-popover title="加入计划" placement="topLeft" trigger="click" :width="100">
                    <template slot="content">
                      <a-list size="small">
                        <a-list-item v-for="item in planExisting" :key="item.id">
                          <a-row
                            type="flex"
                            justify="space-around"
                            align="middle"
                            style="width:100%;"
                          >
                            <a-col :span="18">
                              <span>{{item.name}}</span>
                            </a-col>
                            <a-col :span="6">
                              <a-icon type="plus" @click="addToPlan(item.id)" class="addToPlan" />
                            </a-col>
                          </a-row>
                        </a-list-item>
                      </a-list>
                    </template>
                    <a-button
                      class="groupBtn"
                      @click="getplanPageList"
                      v-show="hidingJudgment3"
                    >加入计划</a-button>
                  </a-popover>
                </a-col>
              </a-row>
            </div>
            <div v-if="ishidden == 2">
              <a-row type="flex" justify="space-around">
                <a-col :span="10">
                  <a-button class="groupBtn" @click="canclePlanBtn">取消</a-button>
                </a-col>
                <a-col :span="10">
                  <a-button class="groupBtn" @click="showPlanBtn">下一步</a-button>
                </a-col>
              </a-row>
            </div>
            <div v-if="ishidden == 3">
              <a-row type="flex" justify="space-around">
                <a-col :span="10">
                  <a-button class="groupBtn" @click="previousBtn">上一步</a-button>
                </a-col>
                <a-col :span="10">
                  <a-button class="groupBtn" @click="reHome">返回首页</a-button>
                </a-col>
              </a-row>
            </div>
          </div>
          <div class="addPlan_foot" v-if="!firstShow">
            <div v-if="ishidden == 4">
              <a-button style="width:90%;" @click="returnPre">返回上一级</a-button>
            </div>
          </div>
        </div>
      </template>
    </split-pane>
    <!-- 弹框 -->
    <add-new-task ref="addNewTask"></add-new-task>
    <plan-detail ref="planDetail"></plan-detail>
    <sitution-info ref="situtionInfo"></sitution-info>
    <update-time ref="updateTime"></update-time>
    <communication ref="communication"></communication>
    <!-- 河道信息弹框 -->
    <a-modal
      :visible="infoVisible"
      :mask="false"
      :width="400"
      class="cmModal custom_modal"
      @ok="showOk"
      :confirmLoading="confirmLoading"
      @cancel="showCancel"
    >
      <template slot="closeIcon">
        <a-icon type="close-circle" />
      </template>
      <template slot="title">
        <span>河道信息</span>
      </template>
      <div>
        <p>河道名称：{{asasd.name}} {{asasd.objectName}}</p>
      </div>
    </a-modal>
    <!-- 推荐巡河方案 -->
    <a-modal
      :visible="infoVisibleRecommend"
      :mask="false"
      :width="400"
      class="cmModal custom_modal"
      @ok="recommendOk"
      :confirmLoading="confirmLoading"
      @cancel="recommendCancel"
    >
      <template slot="closeIcon">
        <a-icon type="close-circle" />
      </template>
      <template slot="title">
        <span>河道信息</span>
      </template>
      <div>
        <p>河道名称：{{recommend.name}}</p>
      </div>
    </a-modal>
    <!-- 添加调查点信息弹框 -->
    <a-modal
      :visible="inspectVisible"
      :mask="false"
      :width="400"
      class="custom_modal"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <template slot="closeIcon">
        <a-icon type="close-circle" />
      </template>
      <template slot="title">
        <span>调查点编辑/添加</span>
      </template>
      <a-form>
        <a-form-item label="选择任务" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-select
            showSearch
            :allowClear="true"
            placeholder="请选择"
            optionFilterProp="children"
            style="width: 100%"
            @change="handleChange"
            :filterOption="filterOption"
            v-model="taskId"
            :disabled="inspectPointId"
          >
            <a-select-option
              :value="item.id"
              v-for="(item, index) in spotTaskList"
              :key="index"
            >{{item.title}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
    <div
      class="mouse_alert"
      v-show="alertShow"
      :style="{left: alertLeft + 'px', top: alertTop + 'px'}"
    >
      <span>{{defaultLineTask}}</span>
    </div>
  </div>
</template>

<script>
import {
  weatherList,
  planPage,
  planSave,
  inspectPointPage,
  inspectPointSave,
  inspectPointDel,
  taskList,
  taskSpotList,
  targetPage,
  targetSave,
  targetDel,
  taskInspectPage,
  getRiverList,
  groupingPage,
  planPageList,
  taskChoose,
  joinPlanTask,
  dataManual,
  locusManual,
  inspectTaskDetail,
  recommendFangan,
  roleList,
  inspectTaskSave,
  mapdrawPage,
  mapdrawPageRiskSource,
  paramList,
  inspectPointPageRiver,
  getWaterStation,
  getTigeList,
  getMapdrawCount,
  getRegulatorWaterCount,
  getPointCount
} from '@/api/login'
import 'ol/ol.css'
// import Map from "ol/Map"
import View from 'ol/View'
// import TileLayer from 'ol/layer/Tile'
import LayerGroup from 'ol/layer/Group'
import XYZ from 'ol/source/XYZ'
import Draw from 'ol/interaction/Draw'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import searchRiver from '../modals/searchRiver'
import addTask from '../modals/addTask'
import creatGroup from '../modals/creatGroup'
import planList from '../modals/planList'
import addSurvey from '../modals/addSurvey'
import addNewTask from '../modals/addNewTask'
import planDetail from '../modals/planDetail'
import situtionInfo from './modules/situtionInfo'
import updateTime from './modules/updateTime'
import communication from './modules/communication'
import waterquality from '../supervise/modules/waterQualityData'
import '../../assets/css/monitor.less'
import Vue from 'vue'
import qs from 'qs'
// token
import { ACCESS_TOKEN } from '@/store/mutation-types'
var echarts = require('echarts/lib/echarts')
// 引入提示框和标题组件
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/dataZoom')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
const personInfo = [
  {
    id: 1,
    name: '张三',
    position: '飞手',
    point: {
      lat: 31.21098,
      lng: 121.495505
    }
  },
  {
    id: 2,
    name: '李四',
    position: '调查员',
    point: {
      lat: 31.21038,
      lng: 121.485505
    }
  },
  {
    id: 3,
    name: '王五',
    position: '司机',
    point: {
      lat: 31.21098,
      lng: 121.475505
    }
  }
]

const riverData = [
  {
    lat: 31.21882,
    lng: 121.50364
  },
  {
    lat: 31.21265,
    lng: 121.50227
  },
  {
    lat: 31.20583,
    lng: 121.49703
  },
  {
    lat: 31.19915,
    lng: 121.49197
  },
  {
    lat: 31.19702,
    lng: 121.49591
  },
  {
    lat: 31.2164,
    lng: 121.50759
  },
  {
    lat: 31.21948,
    lng: 121.50759
  }
]

const LineData = [
  {
    lat: 31.21842,
    lng: 121.50458
  },
  {
    lat: 31.21265,
    lng: 121.50427
  },
  {
    lat: 31.20583,
    lng: 121.49903
  }
]

const cardData = [
  {
    lat: 31.21098,
    lng: 121.495505
  },
  {
    lat: 31.21038,
    lng: 121.485505
  },
  {
    lat: 31.21098,
    lng: 121.475505
  }
]

const riverMontion = [
  // {
  //   id: 0,
  //   objectName: '监测点1',
  //   code: 'point',
  //   clicked: false,
  //   latlng: { lat: 31.219, lng: 121.499 },
  //   taskPage: [
  //     { key: '0-1', title: 'a', latlng: { lat: 31.21882, lng: 121.50364 } },
  //     { key: '0-2', title: 'b', latlng: { lat: 31.21265, lng: 121.50227 } }
  //   ]
  // },
  // { id: 1, objectName: '监测点2', code: 'point', clicked: false, latlng: { lat: 31.204, lng: 121.479 } },
  // {
  //   id: 2,
  //   objectName: '黄浦江',
  //   code: 'river',
  //   clicked: false,
  //   latlng: [
  //     { lat: 31.21882, lng: 121.50364 },
  //     { lat: 31.21265, lng: 121.50227 },
  //     { lat: 31.20583, lng: 121.49703 },
  //     { lat: 31.19915, lng: 121.49197 },
  //     { lat: 31.19702, lng: 121.49591 },
  //     { lat: 31.2164, lng: 121.50757 },
  //     { lat: 31.21948, lng: 121.50758 }
  //   ]
  // }
]
export default {
  name: 'Analysis',
  components: {
    'search-river': searchRiver,
    'add-task': addTask,
    'creat-group': creatGroup,
    'plan-list': planList,
    'add-survey': addSurvey,
    'add-new-task': addNewTask,
    'plan-detail': planDetail,
    'sitution-info': situtionInfo,
    'update-time': updateTime,
    communication,
    'water-quality': waterquality
  },
  data() {
    return {
      jurisdiction: this.$store.state.operationPermission[0], //权限
      accordionAlertKey: ['phonePhoto'], // 手风琴
      akakak: '/iii.amr',
      threePicker: '',
      confirmLoading: false,
      hidingJudgment: true, //计划显示方案
      hidingJudgment1: true,
      regulatoryPage: [], //监管列表
      planExisting: [], //已有计划
      planListPage: [], //计划列表
      planListPage1: [], //计划列表
      inspectVisible: false, //调查点弹窗
      spotTaskList: [],
      taskId: '',
      inspectPointId: false,
      picker: '',
      customStyle: 'background: #fff;margin: 0;overflow: hidden', // 折叠面板样式
      planCard: [
        {
          key: 'addPlan',
          tab: '新建计划',
          scopedSlots: {
            tab: 'customRender'
          }
        },
        {
          key: 'nowPlan',
          tab: '当日计划',
          scopedSlots: {
            tab: 'customRender'
          }
        }
      ],
      SamedayAndNewlybuild: 'addPlan',
      rolePage: [],
      listAppend: {
        planId: '',
        object: '',
        objectId: '',
        objectName: '',
        name: '',
        template: '',
        content: '',
        locationType: '',
        region: '',
        teamId: '',
        roleId: []
      },
      weatherData: {
        text: '',
        img: '',
        temperature: '',
        wind_direction: '',
        wind_scale: '',
        clouds: ''
      }, //天气
      lineLnglats: [],
      markLnglat: {},
      polygonDate: [],
      planList1: {
        id: '',
        name: ''
      },
      superCard: [
        {
          key: 'taskCard',
          tab: '任务'
        },
        {
          key: 'personCard',
          tab: '轨迹'
        }
      ],
      recommend: {
        name: '',
        id: ''
      }, //推荐巡河方案内容
      taskPage: [],
      noTitleKey: 'addPlan',
      nosuperKey: 'taskCard',
      checkedKeys: [],
      selectedKeys: [],
      defaultSelect: [], //默认选中树节点
      riverMontion, //新建计划列表模拟数据
      LineData, //模拟河道内任务点数据
      clickId: '',
      clickName: '',
      cardData, //车辆轴迹位置信息
      ishidden: 1,
      checkedPlan: [],
      cBtn: true,
      activePlanKey: ['1'],
      activeGroupKey: ['11'],
      activeRiverKey: ['111'],
      activeKey: [],
      activeTwo: [],
      personInfo,
      mapType: 'a',
      text: '当前河道方位内出现红色风险源',
      // 地图对象
      map: {},
      mapType: 'b',
      mapLayer2d: '', // 2D影像图
      mapLayerSatellite: '', // 卫星影像图
      mapLayerWord: '', // 道路标注
      roadWordChange: true, // 道路标注
      layerImageChange: false, // 正射影像显隐
      mapLayerImage: '', // 正射影像
      layer: [],
      // 地图节点对象（里面含节点对象、区域对象、任务弹窗对象）
      mapPoint: new Map(),
      markerTool: '', // 工具-点
      lineTool: '', //工具-线
      polygonTool: '', ////工具-面
      lng: '', //坐标点
      lat: '',
      circle: '', //圆
      riverData,
      polygon: '', // 多边形对象
      markerInfo: '', //任务弹出框
      treenfo: [],
      infoVisible: false,
      infoVisibleRecommend: false, //推荐训和方案
      firstShow: true,
      childNode: '',
      checked: false,
      undone: false,
      clickPoint: '', //是否绘制点按钮
      clickLine: '', //是否绘制线按钮
      clickPolygon: '', //是否绘制面按钮
      mapMarkers: new Map(),
      riskMap: false, // 风险地图
      alertLeft: -1000,
      alertTop: -1000,
      alertShow: false,
      spinning: true,
      defaultLineTask: '',
      hidingJudgment3: false,
      appendLatlngList: [], //追加任务坐标点
      isShow: false,
      riskMapPoints: [],
      waterQuality: false, // 水质
      waterQualityPoints: [],
      waterFlotage: false, // 水质漂浮物
      waterFlotagePoints: [],
      riverRisk: false, // 河岸风险源
      riverRiskPoints: [],
      waterLandLoss: false, // 水土流失
      waterLandLossPoints: [],
      waterRatio: false, // 水面率
      waterRatioPoints: [],
      bottomMud: false, // 底泥
      bottomMudPoints: [],
      statisticsList: {
        //数据统计
        riskMap: '',
        riskSource: '',
        discharge: '',
        floatage: '',
        other: ''
      },
      addTaskCode: '1',
      patrolPlanInfo: [],
      riverList: [],
      asasd: {},
      newTaskObj: {}, // 新建计划传值
      outlet: false, // 排口
      dischargeLevel: [], //排口绘制等级
      outletPoints: [], //排口数据
      surveyPoint: false, // 专项调查点
      pointCountData: '', //专项调查点统计
      regulatorWaterCountData: '', //水质数据统计
      moreLoadOnce: '1',
      itgePortId: '',
      surveyPointPoints: [
        // {
        //   id: 0,
        //   name: '专项调查点1',
        //   clicked: false,
        //   imgUrl: require('./img/surveyPointIcon.png'),
        //   latlng: { lat: 31.22041, lng: 121.50384 }
        // }
      ],
      otherList: [], //其他
      otherPoints: [], //其他绘制数据
      riskSourceList: [], //河岸风险源
      riskPolygonData: [], // 风险地图数据
      riskSourceLevel: [], //风险源风险等级
      tigePage: [], //潮汐列表
      rightIcon: false,
      addplanListId: '',
      rbgList: [
        '#8cc540',
        '#27bbbc',
        '#019fde',
        '#6f62da',
        '#d674e9',
        '#fa7a91',
        '#ff1244',
        '#ff8345',
        '#f8bd0b',
        '#8b572a'
      ],
      translateId: 84987546, //追加任务本地保存id
      translateIdList: [] //追加任务本地保存数据
    }
  },
  watch: {
    $route() {
      this.getPicker()
      this.getTask()
      this.getList()
      this.getPage()
      this.getRecommendFangan()
      this.map.panTo(this.$store.state.projectCoordinate, 14)
    },
    itgePortId() {
      for (const item of this.tigePage) {
        if (item.portId == this.itgePortId) {
          this.drawLine(item.tide)
          break
        }
      }
    },
    //选中树节点
    checkedKeys(val) {}
  },
  mounted() {
    let year = new Date().getFullYear() //取得4位数的年份
    let month = new Date().getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
    let day = new Date().getDate() //返回日期月份中的天数（1到31）
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }
    let token = Vue.ls.get(ACCESS_TOKEN)
    let zoom = 14
    let twoDimensionURL =
      'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
    this.mapLayer2d = new T.TileLayer(twoDimensionURL, {
      minZoom: 4,
      maxZoom: 18,
      zIndex: 10
    })
    let satelliteURL = 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
    this.mapLayerSatellite = new T.TileLayer(satelliteURL, {
      minZoom: 4,
      maxZoom: 18,
      zIndex: 10
    })
    // 创建自定义图层对象
    let wordLabel = 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
    this.mapLayerWord = new T.TileLayer(wordLabel, {
      minZoom: 4,
      maxZoom: 18,
      zIndex: 15
    })
    // 正射影像
    let mapImage = `${this.$store.state.serverUrl}/server/data/admin/regulator/uav/data/mbtiles?x={x}&y={y}&z={z}&X-TENANT-ID=${this.$store.state.tenantId}&projectId=${this.$store.state.id}&Authorization=${token}`
    this.mapLayerImage = new T.TileLayer(mapImage, {
      minZoom: 4,
      maxZoom: 23,
      zIndex: 12
    })
    this.map = new T.Map('map', {
      minZoom: 4,
      maxZoom: 23,
      layers: [this.mapLayerSatellite, this.mapLayerWord]
    })
    this.map.centerAndZoom(this.$store.state.projectCoordinate, zoom)
    //添加比例尺控件
    this.map.addControl(new T.Control.Scale())
    this.getPicker()
    this.getTask()
    this.getList()
    this.getPage()
    this.getRecommendFangan()
    this.getParamList()
    this.getMapPageData()
    // this.drawLine()
    this.tideList()
  },
  methods: {
    rightIconClick() {
      this.rightIcon = !this.rightIcon
    },
    tideList() {
      var picker = this.picker.split('-')
      var data = {
        date: picker[0] + picker[1] + picker[2]
      }
      this.tigePage = []
      getTigeList(data).then(res => {
        var arr = res.data
        this.tigePage = arr
        if (this.tigePage.length > 0) {
          if (this.itgePortId != '') {
            for (const item of this.tigePage) {
              if (item.portId == this.itgePortId) {
                this.drawLine(item.tide)
                break
              }
            }
          } else {
            this.itgePortId = arr[0].portId
          }
        } else {
          this.itgePortId = ''
          // this.$message.warning('当前日期下无潮汐数据');
          this.drawLine([])
        }
      })
    },
    getplanPageList() {
      var picker = this.picker.split('-')
      var data = {
        status: 'publish',
        projectId: this.$store.state.id,
        year: picker[0],
        month: picker[1],
        day: picker[2]
      }
      planPageList(data).then(res => {
        this.planExisting = res.data
      })
    },
    //获取绘制类型
    getParamList() {
      let data = {
        type: 'draw_type'
      }
      paramList(data)
        .then(res => {
          this.paramPage = res.data
          let arr = []
          for (const item of res.data) {
            this.$set(item, 'clicked', false)
            if (
              item.id != '5da8374dea6c157d2d61007c' &&
              item.id != '5da8389eea6c157d2d61007f' &&
              item.id != '5dafe6c8ea6c159999a0549c'
            ) {
              item.num = null
              arr.push(item)
            }
          }
          this.otherList = arr
          this.getOtherDataStatistics()
        })
        .catch(err => {
          this.$message.warning('绘制类型数据加载失败')
        })
      var datarisk = {
        type: 'risk_source_type'
      }
      paramList(datarisk).then(res => {
        res.data.forEach(v => {
          v.clicked = false
        })
        this.riskSourceList = res.data
        this.getDataStatistics()
      })
    },
    //-----------------------------------------------推荐巡河方案*-------------------------------------------------------
    //推荐巡河方案
    getRecommendFangan() {
      let picker = this.picker.split('-')
      let data = {
        projectId: this.$store.state.id,
        year: picker[0],
        month: picker[1],
        day: picker[2]
      }
      recommendFangan(data).then(res => {
        this.patrolPlanInfo = res.data
      })
    },
    //选择推荐训和方案
    changeCollapse(key) {
      this.map.clearOverLays() //将之前绘制的清除
      // 设置绘制的多边形
      for (const item of this.patrolPlanInfo) {
        if (key == item.river.id) {
          let polygon = new T.Polygon(item.river.region, {
            color: 'red', //线颜色
            weight: '3', //线宽
            opacity: 0.5, //透明度
            fillColor: '#FFFFFF', //填充颜色
            fillOpacity: '0', // 填充透明度
            title: item.river.name,
            id: item.river.id
          })
          //向地图上添加面
          this.map.setViewport(item.river.region)
          this.map.addOverLay(polygon)
          polygon.addEventListener('click', this.recommendClick)
          for (const index of item.taskLines) {
            let line = new T.Polyline(index.line, {
              color: 'blue', //线颜色
              weight: 3, //线宽
              opacity: 0.5, //透明度
              id: index.id,
              name: index.name
            })
            //向地图上添加线
            this.map.addOverLay(line)
          }
          for (const points of item.taskPoints) {
            let markerTool = new T.Marker(points.coordinate, {
              title: points.name,
              id: points.id
            })
            this.map.addOverLay(markerTool)
          }
        }
      }
    },
    //推荐巡河方案点击事件
    recommendClick(index) {
      this.recommend.id = index.target.options.id
      this.recommend.name = index.target.options.title
      this.infoVisibleRecommend = true
    },
    recommendOk() {
      this.confirmLoading = true
      var ar = {
        id: '',
        planId: this.planList1.id,
        object: 'river',
        objectId: this.recommend.id,
        objectName: this.recommend.name
      }
      targetSave(ar)
        .then(res => {
          this.$message.success('成功')

          this.recommendCancel()
        })
        .catch(err => {
          this.confirmLoading = false
          this.$message.error(err.response.data.message)
        })
    },
    recommendCancel() {
      this.infoVisibleRecommend = false
      this.recommend.id = ''
      this.recommend.name = ''
      this.confirmLoading = false
      this.getinspectPointPage()
    },
    //-----------------------------------------------推荐巡河方案*-------------------------------------------------------
    getList() {
      //河道列表
      getRiverList(this.$store.state.id)
        .then(res => {
          let arr = res.data.data
          arr.forEach(v => {
            v.lineData = v.region
            v.clicked = false
          })
          this.riverList = arr
          if (this.$refs.selectPatrol.visible == true) {
            this.addRiverRefresh()
          }
        })
        .catch(err => {})
    },
    //目标列表
    getinspectPointPage() {
      var list = {
        id: this.planList1.id,
        projectId: this.$store.state.id
      }
      targetPage(list)
        .then(res => {
          var arr = res.data.data
          if (arr.length > 0) {
            for (let a = 0; a < arr.length; a++) {
              arr[a].taskChoose = []
              arr[a].isShow = false
              if (arr[a].object.code != 'river') {
                arr[a].latlng = arr[a].coordinate
              } else {
                arr[a].latlng = arr[a].region
              }
              arr[a].taskPage = []
              arr[a].clicked = false
              arr[a].code = arr[a].object.code
              var data = {
                id: this.planList1.id,
                object: arr[a].object.code,
                objectId: arr[a].objectId,
                projectId: this.$store.state.id
              }
              taskInspectPage(data)
                .then(res => {
                  var ar = res.data.data
                  if (this.noTitleKey == 'nowPlan') {
                  } else {
                    this.newlyBuildTask(ar)
                  }
                  ar.forEach(v => {
                    v.key = v.id
                    v.title = v.name
                    v.latlng = v.region[0]
                    v.code = v.status.code
                    arr[a].taskChoose.push(v.id)
                  })

                  arr[a].taskPage = ar
                  this.spinning = false
                })
                .catch(err => {
                  this.spinning = false
                  this.$message.error('加载任务数据失败')
                })
            }
            this.riverMontion = arr

            if (this.noTitleKey == 'nowPlan') {
              this.planDayDraw()
            } else {
              this.judgeDate()
            }
          } else {
            this.riverMontion = arr
            this.spinning = false
          }
        })
        .catch(err => {
          this.spinning = false
          this.$message.error('加载数据失败')
        })
    },
    newlyBuildTask(item) {
      for (const key of item) {
        if (key.locationType.code == 'point') {
          if (key.pic) {
            let icon = new T.Icon({
              iconUrl: key.pic,
              iconSize: new T.Point(41, 40),
              iconAnchor: new T.Point(21, 40)
            })
            var markerTool = new T.Marker(key.region[0], {
              icon: icon
            })
            this.map.addOverLay(markerTool)
          } else {
            var markerTool = new T.Marker(key.region[0], {})
            this.map.addOverLay(markerTool)
          }
        } else if (key.locationType.code == 'line') {
          let line = new T.Polyline(key.region, {})
          //向地图上添加线
          this.map.addOverLay(line)
        } else {
          let polygon = new T.Polygon(key.region, {
            color: 'blue', //线颜色
            weight: 2, //线宽
            opacity: 0.5, //透明度
            fillColor: '#FFFFFF', //填充颜色
            fillOpacity: 0.5 // 填充透明度
          })
          //向地图上添加面
          this.map.addOverLay(polygon, {})
        }
      }
      // for (const key in item) {

      // }
    },
    //显示河道或调查点
    judgeDate() {
      this.map.clearOverLays() //将之前绘制的清除
      var sss = this.riverMontion
      for (var i = 0; i < sss.length; i++) {
        var code = sss[i].code
        if (code == 'point') {
          this.renderingTarget(sss[i])
        }
        if (code == 'river') {
          this.drawAllRiver(sss[i])
        }
      }
    },
    //绘制目标调查点
    renderingTarget(task) {
      let icon = new T.Icon({
        iconUrl: 'http://api.tianditu.gov.cn/img/map/markerA.png',
        iconSize: new T.Point(19, 27),
        iconAnchor: new T.Point(10, 25)
      })
      let marker = new T.Marker(new T.LngLat(task.latlng.lng, task.latlng.lat), {
        icon: icon
      })
      this.map.addOverLay(marker)
      if (task.clicked == true) {
        let circle = new T.Circle(task.latlng, 1000, {
          color: 'red',
          weight: 2,
          opacity: 0.5,
          fillColor: '#FFFFFF',
          fillOpacity: 0.4,
          lineStyle: 'solid'
        })
        circle.disableEdit()
        this.map.addOverLay(circle)
        this.pointTarget(task.taskPage)
      } else {
        let circle = new T.Circle(task.latlng, 1000, {
          color: 'blue',
          weight: 2,
          opacity: 0.5,
          fillColor: '#FFFFFF',
          fillOpacity: 0.4,
          lineStyle: 'solid'
        })
        circle.disableEdit()
        this.map.addOverLay(circle)
        this.pointTarget(task.taskPage)
      }
      // this.pointTarget(data.taskPage)
    },
    pointTarget(taskPage) {
      for (const item of taskPage) {
        console.log(item)

        if (item.type.code == 'dot') {
          let markerTool = new T.Marker(item.region[0], {
            title: item.name,
            id: item.id
          })
          this.map.addOverLay(markerTool)
        } else if (item.type.code == 'plan') {
          let markerTool = new T.Marker(item.region[0], {
            title: item.name,
            id: item.id
          })
          this.map.addOverLay(markerTool)
        } else {
          let line = new T.Polyline(item.region, {
            color: 'blue', //线颜色
            weight: 3, //线宽
            opacity: 0.5, //透明度
            id: item.id,
            name: item.name
          })
          //向地图上添加线
          this.map.addOverLay(line)
        }
        // markerTool.addEventListener('click', this.taskPointClick)
      }
    },
    judgeDate1(id) {
      for (const item of this.planListPage) {
        for (const a of item.teams) {
          for (const b of a.targets) {
            var code = b.code
            if (code == 'point') {
              this.showSurverPoint1(b)
            }
            if (code == 'river') {
              this.drawAllRiver(b)
            }
          }
        }
      }
    },
    showSurverPoint1(arr) {
      let icon = new T.Icon({
        iconUrl: 'http://api.tianditu.gov.cn/img/map/markerA.png',
        iconSize: new T.Point(19, 27),
        iconAnchor: new T.Point(10, 25)
      })
      //向地图上添加中心标注
      this.lng = arr.latlng.lng
      this.lat = arr.latlng.lat
      let marker = new T.Marker(new T.LngLat(this.lng, this.lat), {
        icon: icon
      })
      this.map.addOverLay(marker)
      var data = {
        coordinate: this.lng + ',' + this.lat,
        radius: '1'
      }
      if (arr.clicked == true) {
        this.addCircle(this.lng, this.lat, 1000, 'red', 2, arr.id)
      } else {
        this.addCircle(this.lng, this.lat, 1000, 'blue', 2, arr.id)
      }
    },
    showSurverPoint(arr) {
      let icon = new T.Icon({
        iconUrl: 'http://api.tianditu.gov.cn/img/map/markerA.png',
        iconSize: new T.Point(19, 27),
        iconAnchor: new T.Point(10, 25)
      })
      //向地图上添加中心标注
      this.lng = arr.latlng.lng
      this.lat = arr.latlng.lat
      let marker = new T.Marker(new T.LngLat(this.lng, this.lat), {
        icon: icon
      })
      this.map.addOverLay(marker)
      marker.addEventListener('click', this.clickCircle)
      var data = {
        coordinate: this.lng + ',' + this.lat,
        radius: '1'
      }
      if (arr.clicked == true) {
        this.addCircle(this.lng, this.lat, 1000, 'red', 2, arr.id)
      } else {
        this.addCircle(this.lng, this.lat, 1000, 'blue', 2, arr.id)
      }
      //向地图上添加圆
      // this.circle = new T.Circle(new T.LngLat(this.lng, this.lat), 1000, {
      //   color: 'blue',
      //   weight: 2,
      //   opacity: 0.5,
      //   fillColor: '#FFFFFF',
      //   fillOpacity: 0.4,
      //   lineStyle: 'solid',
      //   id: arr.id
      // })
      // this.map.addOverLay(this.circle)
      // this.circle.addEventListener('click',this.clickCircle)
    },
    addCircle(lng, lat, radius, color, weight, id) {
      // this.map.removeOverLay(this.circle)
      this.circle = new T.Circle(new T.LngLat(lng, lat), radius, {
        color: color,
        weight: weight,
        opacity: 0.5,
        fillColor: '#FFFFFF',
        fillOpacity: 0.4,
        lineStyle: 'solid',
        id: id
      })
      this.map.addOverLay(this.circle)
      this.circle.addEventListener('click', this.clickCircle)
    },
    clickCircle(e) {
      var point = []
      for (const item of this.riverMontion) {
        if (e.lnglat.lat == item.latlng.lat && e.lnglat.lng == item.latlng.lng) {
          item.clicked = true
          point = item
          this.taskId = item.taskPage[0].title
          this.inspectPointId = true
          this.inspectVisible = true
        } else {
          item.clicked = false
        }
        this.judgeDate()
      }
      // this.showSurverPoint(point)
    },
    //获取当前时间
    getPicker() {
      function formatDate(now) {
        var year = now.getFullYear() //取得4位数的年份
        var month = now.getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
        var day = now.getDate() //返回日期月份中的天数（1到31）
        if (month < 10) {
          month = '0' + month
        }
        if (day < 10) {
          day = '0' + day
        }
        return year + '-' + month + '-' + day
      }
      this.picker = formatDate(new Date())
      var d = new Date()
      d.setMonth(d.getMonth() - 3)
      this.threePicker = d.toLocaleDateString()
      this.getWeatherList()
      this.getPlanSave()
    },
    //任务点列表
    getTask() {
      var data = {
        type: 'dot',
        id: this.$store.state.id
      }
      taskList(data).then(res => {
        var arr = res.data.data
        arr.forEach(v => {
          v.name = v.content
        })
        this.spotTaskList = arr
      })
      roleList('worker').then(res => {
        this.rolePage = res.data.data
      })
    },
    //获取天气
    getWeatherList() {
      this.weatherData.text = ''
      this.weatherData.temperature = ''
      this.weatherData.wind_direction = ''
      this.weatherData.wind_scale = ''
      this.weatherData.img = ''
      this.weatherData.clouds = ''
      var date = this.picker.split('-')
      let data = {
        date: date[0] + date[1] + date[2],
        locationId: this.$store.state.weatherId
      }
      weatherList(data)
        .then(res => {
          let arr = res.data
          if (arr.code == 0) {
            this.weatherData.img = require('../supervise/img/weather/0.png')
          } else if (arr.code == 1) {
            this.weatherData.img = require('../supervise/img/weather/1.png')
          } else if (arr.code == 2) {
            this.weatherData.img = require('../supervise/img/weather/0.png')
          } else if (arr.code == 3) {
            this.weatherData.img = require('../supervise/img/weather/1.png')
          } else if (arr.code == 4) {
            this.weatherData.img = require('../supervise/img/weather/4.png')
          } else if (arr.code == 5) {
            this.weatherData.img = require('../supervise/img/weather/5.png')
          } else if (arr.code == 6) {
            this.weatherData.img = require('../supervise/img/weather/6.png')
          } else if (arr.code == 7) {
            this.weatherData.img = require('../supervise/img/weather/5.png')
          } else if (arr.code == 8) {
            this.weatherData.img = require('../supervise/img/weather/6.png')
          } else if (arr.code == 9) {
            this.weatherData.img = require('../supervise/img/weather/9.png')
          } else if (arr.code == 10) {
            this.weatherData.img = require('../supervise/img/weather/10.png')
          } else if (arr.code == 11) {
            this.weatherData.img = require('../supervise/img/weather/11.png')
          } else if (arr.code == 12) {
            this.weatherData.img = require('../supervise/img/weather/12.png')
          } else if (arr.code == 13) {
            this.weatherData.img = require('../supervise/img/weather/13.png')
          } else if (arr.code == 14) {
            this.weatherData.img = require('../supervise/img/weather/14.png')
          } else if (arr.code == 15) {
            this.weatherData.img = require('../supervise/img/weather/15.png')
          } else if (arr.code == 16) {
            this.weatherData.img = require('../supervise/img/weather/16.png')
          } else if (arr.code == 17) {
            this.weatherData.img = require('../supervise/img/weather/17.png')
          } else if (arr.code == 18) {
            this.weatherData.img = require('../supervise/img/weather/17.png')
          } else if (arr.code == 19) {
            this.weatherData.img = require('../supervise/img/weather/19.png')
          } else if (arr.code == 20) {
            this.weatherData.img = require('../supervise/img/weather/20.png')
          } else if (arr.code == 21) {
            this.weatherData.img = require('../supervise/img/weather/21.png')
          } else if (arr.code == 22) {
            this.weatherData.img = require('../supervise/img/weather/22.png')
          } else if (arr.code == 23) {
            this.weatherData.img = require('../supervise/img/weather/23.png')
          } else if (arr.code == 24) {
            this.weatherData.img = require('../supervise/img/weather/24.png')
          } else if (arr.code == 25) {
            this.weatherData.img = require('../supervise/img/weather/25.png')
          } else if (arr.code == 26) {
            this.weatherData.img = require('../supervise/img/weather/26.png')
          } else if (arr.code == 27) {
            this.weatherData.img = require('../supervise/img/weather/26.png')
          } else if (arr.code == 28) {
            this.weatherData.img = require('../supervise/img/weather/28.png')
          } else if (arr.code == 29) {
            this.weatherData.img = require('../supervise/img/weather/28.png')
          } else if (arr.code == 30) {
            this.weatherData.img = require('../supervise/img/weather/30.png')
          } else if (arr.code == 31) {
            this.weatherData.img = require('../supervise/img/weather/31.png')
          } else if (arr.code == 32) {
            this.weatherData.img = require('../supervise/img/weather/32.png')
          } else if (arr.code == 33) {
            this.weatherData.img = require('../supervise/img/weather/32.png')
          } else if (arr.code == 34) {
            this.weatherData.img = require('../supervise/img/weather/34.png')
          } else if (arr.code == 35) {
            this.weatherData.img = require('../supervise/img/weather/34.png')
          } else if (arr.code == 36) {
            this.weatherData.img = require('../supervise/img/weather/36.png')
          } else if (arr.code == 37) {
            this.weatherData.img = require('../supervise/img/weather/37.png')
          } else if (arr.code == 38) {
            this.weatherData.img = require('../supervise/img/weather/38.png')
          } else {
            this.weatherData.img = require('../supervise/img/weather/99.png')
          }
          this.weatherData.text = arr.text
          this.weatherData.temperature = arr.temperature
          this.weatherData.wind_direction = arr.wind_direction
          this.weatherData.wind_scale = arr.wind_scale
          this.weatherData.clouds = arr.clouds
        })
        .catch(err => {
          // this.$message.error('天气数据不存在');
        })
    },
    //--------------------------------------------------------------------------------------------当日计划---------------------------------------
    //计划列表
    getPage() {
      var picker = this.picker.split('-')
      var data = {
        status: 'publish',
        projectId: this.$store.state.id,
        year: picker[0],
        month: picker[1],
        day: picker[2]
      }

      function formatDate(now) {
        var year = now.getFullYear() //取得4位数的年份
        var month = now.getMonth() + 1 //取得日期中的月份，其中0表示1月，11表示12月
        var date = now.getDate() //返回日期月份中的天数（1到31）
        return year + '-' + month + '-' + date
      }

      function tab(date1) {
        // var oDate1 =  new Date(date1)
        // var oDate2 = new Date()
        var oDate1 = new Date(date1)
        let c = new Date()
        let b = c.toLocaleDateString().split('/')
        let a = b[0] + '-' + b[1] + '-' + b[2]
        var oDate2 = new Date(a)
        if (oDate1.getTime() > oDate2.getTime()) {
          return true
        } else {
          return false
        }
        // if (oDate1.getTime() < oDate2.getTime()) {
        //   console.log(oDate1.getTime(),oDate2.getTime());

        //   return false
        // } else {

        //    return true
        // }
      }

      function tab1(date1) {
        var oDate1 = new Date(date1)
        var oDate2 = new Date()
        if (oDate1.getTime() < oDate2.getTime()) {
          return true
        } else {
          return false
        }
      }

      function tab2(date1, date2) {
        var oDate1 = new Date(date1)
        var oDate2 = new Date(date2)
        if (oDate1.getTime() >= oDate2.getTime()) {
          return true
        } else {
          return false
        }
      }
      this.hidingJudgment = tab(this.picker)
      this.hidingJudgment1 = tab1(this.picker)
      this.hidingJudgment2 = tab2(this.picker, formatDate(new Date()))
      this.hidingJudgment3 = tab(this.picker)
      this.planListPage = []
      planPage(data)
        .then(res => {
          var arr = res.data
          var k = 0
          for (const item of arr) {
            k = k + 1
            item.plan.completeTaskNum = 0
            item.plan.totalTaskNum = 0
            item.plan.name = item.plan.name.slice(0, 2) + '-' + k
            for (const a of item.teams) {
              a.team.completeTaskNum = 0
              a.team.totalTaskNum = 0
              if (a.targets != undefined) {
                for (const b of a.targets) {
                  a.team.completeTaskNum = a.team.completeTaskNum + b.completeTaskNum
                  a.team.totalTaskNum = a.team.totalTaskNum + b.totalTaskNum
                  item.plan.completeTaskNum = item.plan.completeTaskNum + b.completeTaskNum
                  item.plan.totalTaskNum = item.plan.totalTaskNum + b.totalTaskNum
                  b.isShow = false
                  b.clicked = false
                  b.code = b.target.object.code
                  if (b.target.object.code == 'point') {
                    b.latlng = b.target.coordinate
                  } else {
                    b.latlng = b.target.region
                  }
                  for (const c of b.incomplete) {
                    c.key = c.id
                    c.title = c.name
                    c.latlng = c.region[0]
                    c.scopedSlots = {
                      title: 'custom'
                    }
                  }
                  for (const c of b.inprogress) {
                    c.key = c.id
                    c.title = c.name
                    c.latlng = c.region[0]
                    c.scopedSlots = {
                      title: 'custom'
                    }
                  }
                  for (const c of b.complete) {
                    c.key = c.id
                    c.title = c.name
                    c.latlng = c.region[0]
                    c.scopedSlots = {
                      title: 'custom'
                    }
                  }
                  for (const c of b.anomalous) {
                    c.key = c.id
                    c.title = c.name
                    c.latlng = c.region[0]
                    c.scopedSlots = {
                      title: 'custom'
                    }
                  }
                }
              } else {
                a.targets = []
              }
              a.team.percentage = a.team.completeTaskNum / a.team.totalTaskNum
              if (a.team.percentage == NaN) {
                a.team.percentage = 0
              } else {
                a.team.percentage = a.team.percentage * 100
                a.team.percentage = Math.ceil(a.team.percentage)
              }
            }
            item.plan.percentage = item.plan.completeTaskNum / item.plan.totalTaskNum
            if (item.plan.percentage == NaN) {
              item.plan.percentage = 0
            } else {
              item.plan.percentage = item.plan.percentage * 100
              item.plan.percentage = Math.ceil(item.plan.percentage)
            }
          }
          this.spinning = false
          this.planListPage = arr
          if (this.planListPage.length == 0 && hidingJudgment == true) {
            this.hidingJudgment = true
          } else {
            this.hidingJudgment = false
          }
        })
        .catch(err => {
          this.spinning = false
          // if (err.response != undefined) {
          //   if (err.response.data.success == false && hidingJudgment == true) {
          //     this.hidingJudgment = true
          //   } else {
          //     this.hidingJudgment = false
          //   }
          // }
        })
    },
    //当日计划绘制
    planDayDraw() {
      this.map.clearOverLays() //将之前绘制的清除

      for (const item of this.planListPage) {
        for (const a of item.teams) {
          for (const b of a.targets) {
            // if (b.target.id == id) {
            // b.clicked = true
            if (b.code == 'point') {
              this.planDayDrawTarget(b)
            }
            if (b.code == 'river') {
              this.planDayDrawRiver(b)
            }
            // } else {
            //   b.clicked = false
            // }
          }
        }
      }
    },
    //当日计划绘制目标调查点
    planDayDrawTarget(task) {
      let icon = new T.Icon({
        iconUrl: 'http://api.tianditu.gov.cn/img/map/markerA.png',
        iconSize: new T.Point(19, 27),
        iconAnchor: new T.Point(10, 25)
      })
      let marker = new T.Marker(new T.LngLat(task.latlng.lng, task.latlng.lat), {
        icon: icon
      })
      this.map.addOverLay(marker)
      if (task.clicked == true) {
        let circle = new T.Circle(task.latlng, 1000, {
          color: 'red',
          weight: 2,
          opacity: 0.5,
          fillColor: '#FFFFFF',
          fillOpacity: 0.4,
          lineStyle: 'solid'
        })
        circle.disableEdit()
        this.map.addOverLay(circle)
      } else {
        let circle = new T.Circle(task.latlng, 1000, {
          color: 'blue',
          weight: 2,
          opacity: 0.5,
          fillColor: '#FFFFFF',
          fillOpacity: 0.4,
          lineStyle: 'solid'
        })
        circle.disableEdit()

        this.map.addOverLay(circle)
      }
      this.planDayDrawSpot(task)
    },
    //当日计划绘制河道，调查点内的任务
    planDayDrawSpot(taskPage) {
      console.log(taskPage)

      for (const item of taskPage.anomalous) {
        if (item.region.length == 1) {
          if (item.pic) {
            let icon = new T.Icon({
              iconUrl: item.pic,
              iconSize: new T.Point(41, 40),
              iconAnchor: new T.Point(21, 40)
            })
            let markerTool = new T.Marker(item.latlng, {
              icon: icon,
              title: item.name,
              id: item.id
            })
            this.map.addOverLay(markerTool)
            this.showPosition(markerTool, item)
          } else {
            let markerTool = new T.Marker(item.latlng, {
              title: item.name,
              id: item.id
            })
            this.map.addOverLay(markerTool)
            this.showPosition(markerTool, item)
          }
        } else {
          if (taskPage.clicked == true) {
            let line = new T.Polyline(item.region, {
              color: 'orange', //线颜色
              weight: 3, //线宽
              opacity: 0.5, //透明度
              id: item.id,
              name: item.name
            })
            //向地图上添加线
            this.map.addOverLay(line)
          } else {
            let line = new T.Polyline(item.region, {
              color: 'orange', //线颜色
              weight: 3, //线宽
              opacity: 0.5, //透明度
              id: item.id,
              name: item.name
            })
            //向地图上添加线
            this.map.addOverLay(line)
            this.showPosition(line, item)
          }
        }
      }
      for (const item of taskPage.complete) {
        if (item.region.length == 1) {
          if (item.pic) {
            let icon = new T.Icon({
              iconUrl: item.pic,
              iconSize: new T.Point(41, 40),
              iconAnchor: new T.Point(21, 40)
            })
            let markerTool = new T.Marker(item.latlng, {
              icon: icon,
              title: item.name,
              id: item.id
            })
            this.map.addOverLay(markerTool)
            this.showPosition(markerTool, item)
          } else {
            let markerTool = new T.Marker(item.latlng, {
              title: item.name,
              id: item.id
            })
            this.map.addOverLay(markerTool)
            this.showPosition(markerTool, item)
          }
        } else {
          if (taskPage.clicked == true) {
            let line = new T.Polyline(item.region, {
              color: 'green', //线颜色
              weight: 3, //线宽
              opacity: 0.5, //透明度
              id: item.id,
              name: item.name
            })
            //向地图上添加线
            this.map.addOverLay(line)
            this.showPosition(line, item)
          } else {
            let line = new T.Polyline(item.region, {
              color: 'green', //线颜色
              weight: 3, //线宽
              opacity: 0.5, //透明度
              id: item.id,
              name: item.name
            })
            //向地图上添加线
            this.map.addOverLay(line)
            this.showPosition(line, item)
            // line.addEventListener('click', this.planDayDrawClick)
          }
        }
        // markerTool.addEventListener('click', this.taskPointClick)
      }
      for (const item of taskPage.incomplete) {
        if (item.region.length == 1) {
          if (item.pic) {
            let icon = new T.Icon({
              iconUrl: item.pic,
              iconSize: new T.Point(41, 40),
              iconAnchor: new T.Point(21, 40)
            })
            let markerTool = new T.Marker(item.latlng, {
              icon: icon,
              title: item.name,
              id: item.id
            })
            this.map.addOverLay(markerTool)
            this.showPosition(markerTool, item)
          } else {
            let markerTool = new T.Marker(item.latlng, {
              title: item.name,
              id: item.id
            })
            this.map.addOverLay(markerTool)
            this.showPosition(markerTool, item)
          }
        } else {
          let line = new T.Polyline(item.region, {
            color: 'blue', //线颜色
            weight: 3, //线宽
            opacity: 0.5, //透明度
            id: item.id,
            name: item.name
          })
          //向地图上添加线
          this.map.addOverLay(line)
          this.showPosition(line, item)
        }
      }
    },
    //当日计划绘制河道，调查点内的任务点击事件
    planDayDrawClick(arr) {
      this.$refs.situtionInfo.show(arr.target.options.id)
    },
    //当日计划绘制河道
    planDayDrawRiver(arr) {
      if (arr.clicked == true) {
        this.planDayDrawlineFn(arr.latlng, 'red', 3, 1, 0, arr.target.objectName, arr.target.id)
      } else {
        this.planDayDrawlineFn(arr.latlng, 'blue', 3, 1, 0, arr.target.objectName, arr.target.id)
      }
      this.planDayDrawSpot(arr)
    },
    // 设置绘制的多边形
    planDayDrawlineFn(lineData, color, weight, opacity, fillOpacity, title, id) {
      this.polygon = new T.Polygon(lineData, {
        color: color, //线颜色
        weight: weight, //线宽
        opacity: 0.5, //透明度
        fillColor: '#FFFFFF', //填充颜色
        fillOpacity: fillOpacity, // 填充透明度
        title: title,
        id: id
      })
      //向地图上添加面
      this.map.addOverLay(this.polygon, {})
      // this.polygon.addEventListener('click', this.polylineClick)
    },
    //--------------------------------------------------------------------------------------------当日计划---------------------------------------
    //计划保存
    getPlanSave() {
      var picker = this.picker.split('-')
      var data = {
        id: '',
        projectId: this.$store.state.id,
        name: '',
        year: picker[0],
        month: picker[1],
        day: picker[2]
      }
      planSave(data)
        .then(res => {
          this.planList1.id = res.data.id
          this.planList1.name = res.data.name
          this.getinspectPointPage()
        })
        .catch(err => {
          this.planList1.id
        })
    },
    //调查点保存
    handleOk() {
      if (this.inspectPointId == true) {
        this.handleCancel()
      } else {
        this.confirmLoading = true
        var data = {
          id: '',
          planId: this.planList1.id,
          name: '',
          coordinate: this.lng + ',' + this.lat,
          radius: '1',
          fromTaskId: this.taskId
        }
        inspectPointSave(data).then(res => {
          this.$message.success('添加调查点成功')
          var arr = res.data
          var ar = {
            id: '',
            planId: this.planList1.id,
            object: 'point',
            objectId: arr.id,
            objectName: arr.name
            // coordinate: this.lng + ',' + this.lat
          }
          targetSave(ar)
            .then(res => {
              this.handleCancel()
            })
            .catch(err => {
              this.confirmLoading = false
              this.$message.error(err.response.data.message)
            })
          // this.getinspectPointPage()
        })
      }
    },
    //关闭调查点窗口
    handleCancel() {
      this.map.clearOverLays()
      this.getinspectPointPage()
      this.taskId = ''
      this.confirmLoading = false
      this.inspectPointId = false
      this.inspectVisible = false
    },
    //今日计划河道（目标）删除
    del(id) {
      targetDel(id)
        .then(res => {
          this.$message.success('删除成功')
          this.getPage()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    //目标删除
    getInspectPointDel(id) {
      targetDel(id)
        .then(res => {
          this.$message.success('删除成功')
          this.map.clearOverLays()
          this.getinspectPointPage()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    //当日计划显示河道调查点
    choosePointTask1(id) {
      for (const item of this.planListPage) {
        for (const a of item.teams) {
          for (const b of a.targets) {
            if (b.target.id == id) {
              b.clicked = true
              if (b.code == 'point') {
                let arr = []
                arr.push(b.latlng)
                this.map.setViewport(arr)
              } else {
                this.map.setViewport(b.latlng)
              }
              this.map.setZoom('14')
            } else {
              b.clicked = false
            }
          }
        }
      }
      this.planDayDraw()
    },
    choosePointTask(id) {
      for (const item of this.riverMontion) {
        console.log(item)

        if (item.id === id) {
          if (item.code == 'point') {
            let arr = []
            arr.push(item.latlng)
            this.map.setViewport(arr)
          } else {
            this.map.setViewport(item.latlng)
          }
          this.map.setZoom('14')
          item.clicked = true
        } else {
          item.clicked = false
        }
      }
      this.judgeDate()
    },
    allPointTask(arr) {
      this.map.clearOverLays()
      for (const item of arr) {
        this.drawAllPoint(item.latlng)
      }
    },
    // 绘制所有河流
    drawAllRiver(arr) {
      if (arr.clicked == true) {
        this.setPolylineFn(arr.latlng, 'red', 3, 1, 0, arr.objectName, arr.id)
        this.pointTarget(arr.taskPage)
      } else {
        this.setPolylineFn(arr.latlng, 'blue', 3, 1, 0, arr.objectName, arr.id)
      }
    },
    drawOneRiver(arr) {
      this.map.removeOverLay(this.polygon) //将之前绘制的清除
      if (arr.clicked == true) {
        this.setPolylineFn(arr.latlng, 'red', 3, 1, 0, arr.objectName, arr.id)
      } else {
        this.setPolylineFn(arr.latlng, 'blue', 3, 1, 0, arr.objectName, arr.id)
      }
    },
    drawRiver() {
      this.map.clearOverLays() //将之前绘制的清除
      for (const item of this.riverList) {
        if (item.clicked == true) {
          this.setPolygonFn(item.lineData, 'red', 3, 1, 0, item.name, item.id)
        } else {
          // this.setPolygonFn(item.lineData, 'blue', 3, 1, 0, item.name, item.id)
        }
      }
    },
    // 设置绘制的多边形
    setPolylineFn(lineData, color, weight, opacity, fillOpacity, title, id) {
      this.polygon = new T.Polygon(lineData, {
        color: color, //线颜色
        weight: weight, //线宽
        opacity: 0.5, //透明度
        fillColor: '#FFFFFF', //填充颜色
        fillOpacity: fillOpacity, // 填充透明度
        title: title,
        id: id
      })
      //向地图上添加面
      this.map.addOverLay(this.polygon, {})
      this.polygon.addEventListener('click', this.polylineClick)
    },
    // 设置绘制的多边形
    setPolygonFn(lineData, color, weight, opacity, fillOpacity, title, id) {
      this.polygon = new T.Polygon(lineData, {
        color: color, //线颜色
        weight: weight, //线宽
        opacity: 0.5, //透明度
        fillColor: '#FFFFFF', //填充颜色
        fillOpacity: fillOpacity, // 填充透明度
        title: title,
        id: id,
        lineData: lineData
      })
      //向地图上添加面
      this.map.addOverLay(this.polygon, {})
      this.polygon.addEventListener('click', this.polygonClick)
    },
    // 选中河流
    chooseRiver(id) {
      for (const item of this.riverList) {
        if (item.id == id) {
          item.clicked = true
          this.map.setViewport(item.lineData)
          // this.map.zoomOut()
          // this.map.addEventListener('zoomend', this.zoomChange)
        } else {
          item.clicked = false
        }
        this.drawRiver()
      }
    },
    //多边形点击事件
    polylineClick(index) {
      for (var item of this.riverMontion) {
        if (item.id == index.target.options.id) {
          item.clicked = true
          this.asasd = item
          this.infoVisible = true
        } else {
          item.clicked = false
        }
        this.drawOneRiver(item)
      }
    },
    polygonClick(index) {
      for (var item of this.riverList) {
        if (item.id == index.target.options.id) {
          item.clicked = true
          this.asasd = item
          this.infoVisible = true
        } else {
          item.clicked = false
        }
      }
      this.drawRiver()
    },
    cancel() {},
    handleChange(index) {},
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    getTdLayer(lyr) {
      var url =
        'http://t{0-7}.tianditu.com/DataServer?T=' + lyr + '&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
      this.layer = new TileLayer({
        source: new XYZ({
          url: url
        })
      })
      return this.layer
    },
    //选中添加河道或今日计划面板
    onTabChange(key, type) {
      this[type] = key
      if (key == 'addPlan') {
        this.SamedayAndNewlybuild = 'addPlan'
        this.noTitleKey = 'addPlan'
        this.ishidden = 1
        this.judgeDate()
      }
      if (key == 'nowPlan') {
        this.SamedayAndNewlybuild = 'nowPlan'
        this.noTitleKey = 'nowPlan'
        this.planDayDraw()
        // //判断子节点
        // var sutree = this.sutreeData
        // console.log(this.sutreeData.length)
        // for (var j = 0; j < this.sutreeData.length; j++) {
        //   this.diguiTree(this.sutreeData[j])
        // }
      }
    },
    diguiTree(item) {
      // 没有children了，所以是叶子节点
      if (item.children == null) {
        item.isChildNode = true
      } else {
        item.isChildNode = false
        for (var i = 0; i < item.children.length; i++) {
          this.diguiTree(item.children[i])
        }
      }
    },
    onsuperChange(key, type) {
      this[type] = key
      if (key == 'taskCard') {
        this.loadPoint()
      }
      if (key == 'personCard') {
        this.cardTrack()
        //默认全部选中  当页面渲染完成时执行
        setTimeout(function() {
          var cbArr = document.getElementsByClassName('checkboxClass')
          for (var i = 0; i < cbArr.length; i++) {
            cbArr[i].click()
          }
        }, 500)
      }
    },
    //日期选择
    selectData(date) {
      let e = this.picker.split('-')
      // let d = new Date(e[0]+'/'+e[1]+'/'+e[2])
      let d = new Date(this.picker)
      d.setMonth(d.getMonth() - 3)
      this.threePicker = d.toLocaleDateString()
      this.spinning = true
      this.map.clearOverLays() //将之前绘制的清除
      this.riverMontion = []
      this.firstShow = true
      this.nosuperKey = 'taskCard'
      if (this.firstShow == true) {
        this.getPage()
        this.getPlanSave()
      } else {
        this.loadPoint()
      }
      this.moreLoadOnce = '1'
      this.getMapPageData()
      this.getWeatherList()
      this.tideList()
    },

    //选中巡河方案
    selectPatrol() {},
    addTaskBtn(id, name, code, aa) {
      this.appendLatlngList = []
      if (aa.code == 'point') {
        this.appendLatlngList.push(aa.latlng)
      } else {
        this.appendLatlngList = aa.latlng
      }
      this.map.setViewport(this.appendLatlngList)
      this.map.setZoom('16')
      for (const item of this.riverMontion) {
        if (item.objectId == id) {
          item.isShow = true
        }
      }
      this.listAppend.planId = this.planList1.id
      this.listAppend.object = code
      this.listAppend.objectId = id
      this.listAppend.objectName = name
      this.isShow = true
      this.addTaskCode = '1'
      this.cBtn = false
      // this.$refs.addTask.chooseLocation()
    },
    addTaskBtnDay(planId, id, name, code, teaid, teamid, aa) {
      // console.log(aa);

      // this.appendLatlngList=[]
      // if (latlng.code=="point") {
      //   this.appendLatlngList.push(aa.latlng)
      // }else{
      //   this.appendLatlngList=aa.latlng
      // }
      this.addTaskCode = '2'
      for (const item of this.planListPage) {
        for (const a of item.teams) {
          for (const b of a.targets) {
            if (b.target.objectName == name) {
              b.isShow = true
            }
          }
        }
      }
      this.listAppend.planId = planId
      this.listAppend.teamId = teamid
      this.listAppend.object = code
      this.listAppend.objectId = id
      this.listAppend.objectName = name
      this.cBtn = false
      // this.$refs.addTask.chooseLocation()
    },
    //右侧模块选择框修改
    handleChange() {},
    //选中树节点内容
    onCheck(checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    //生成计划
    newPlan_btn() {
      var ids = []
      for (const item of this.riverMontion) {
        for (const index of item.taskChoose) {
          ids.push(index)
        }
      }
      if (ids.length != 0) {
        this.addplanListId = this.planList1.id
        let data = {
          ids: ids.join(','),
          planId: this.planList1.id
        }
        taskChoose(data).then(res => {})
        this.ishidden = 2
        this.$refs.creatGroup.planGeneration(this.planList1.id)
      } else {
        this.$message.warning('请选择任务')
      }
    },
    //底部取消按钮
    canclePlanBtn() {
      this.planList1.id = this.addplanListId
      this.ishidden = 1
    },
    //底部下一步按钮
    showPlanBtn() {
      this.$refs.creatGroup.judge()
      // this.ishidden = 3
      // this.$refs.planList.getstaffInspectPage(this.planList1.id)
    },
    showPlanJudge(list) {
      let arr = false
      if (list.length != 0) {
        for (let i = 0; i < list.length; i++) {
          if (i + 1 == list.length) {
            if (list[i].taskList.length != 0) {
              // this.ishidden = 3
              this.$refs.planList.getstaffInspectPage(this.planList1.id)
            } else {
              this.$message.warning('不能有空分组')
            }
          } else {
            if (list[i].taskList.length == 0) {
              this.$message.warning('不能有空分组')
              break
            } else {
            }
          }
        }
      } else {
        this.$message.warning('请先创建分组')
      }
    },
    getNowPlan() {
      this.SamedayAndNewlybuild = 'nowPlan'
      this.noTitleKey = 'nowPlan'
    },
    //底部上一步按钮
    previousBtn() {
      this.planList1.id = this.addplanListId
      this.ishidden = 2
    },
    //返回首页
    reHome() {
      this.ishidden = 1
    },
    //底部返回上一级按钮
    returnPre() {
      this.map.clearOverLays()
      this.getinspectPointPage()
      this.getPage()
      this.firstShow = true
      this.nosuperKey = 'taskCard'
    },
    //今日计划中组点击
    selectGroup() {},
    //当日计划模块追加任务
    addNewTask() {
      this.$refs.addNewTask.showtask()
    },
    //当日计划模块详情按钮
    detailPlan(id) {
      this.$refs.planDetail.show(id)
      // this.$refs.communication.show()
    },
    //今日计划模块监管按钮
    supervision_btn(key) {
      this.map.clearOverLays() //将之前绘制的清除
      this.firstShow = !this.firstShow
      if (this.firstShow == false) {
        this.ishidden = 4
        this.loadPoint()
      }
    },
    changeInfo(key) {},
    searchItme(id) {
      console.log(id)

      this.$refs.situtionInfo.show(id)
    },
    //今日计划模块修改时间
    updateTime() {
      this.$refs.updateTime.show()
    },
    //加入已有计划
    addToPlan(id) {
      var ids = []
      for (const item of this.riverMontion) {
        for (const index of item.taskChoose) ids.push(index)
      }
      if (ids.length == 0) {
        this.$message.warning('请先选择河道或调查点')
      } else {
        this.addplanListId = this.planList1.id
        var data = {
          sourcePlanId: this.planList1.id,
          taskIds: ids.join(','),
          targetPlanId: id
        }
        joinPlanTask(data)
          .then(res => {
            this.$refs.creatGroup.planGeneration(id)
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
            this.$refs.creatGroup.planGeneration(id)
          })
        this.ishidden = 2

        this.planList1.id = id
      }
    },
    showOk() {
      // var arrInfo =  this.asasd
      // arrInfo.clicked = false
      // console.log(arrInfo)
      // this.drawOneRiver(arrInfo)
      // var reh = ''
      // for (const item of this.asasd.region) {
      //   reh = reh + item.lng + ',' + item.lat + '|'
      // }
      this.confirmLoading = true
      var ar = {
        id: '',
        planId: this.planList1.id,
        object: 'river',
        objectId: this.asasd.id,
        objectName: this.asasd.name
      }
      targetSave(ar)
        .then(res => {
          this.$message.success('成功')
          this.map.setViewport(this.asasd.lineData)
          this.map.setZoom('14')
          this.infoVisible = false
          this.handleCancel()
        })
        .catch(err => {
          this.confirmLoading = false
          this.$message.error(err.response.data.message)
        })
    },
    showCancel() {
      this.infoVisible = false
      // var arrInfo =  this.asasd
      // arrInfo.clicked = false
      // this.drawOneRiver(arrInfo)
    },
    //轨迹模块人员点击事件
    onChange(checkedValues) {
      this.checkPoint(checkedValues)
    },
    checkPoint(vals) {
      this.map.clearOverLays()
      vals.forEach(v => {
        for (const reg of this.regulatoryPage) {
          for (const index of reg.teams) {
            for (const staffs of index.staffs) {
              if (v == staffs.id) {
                if (staffs.point.length > 0) {
                  let line = new T.Polyline(staffs.point, {
                    color: staffs.rgb, //线颜色
                    weight: 3, //线宽
                    id: staffs.id
                  })
                  //向地图上添加线
                  this.map.addOverLay(line)

                  let markerTool = new T.Marker(staffs.point[0], {})
                  this.map.addOverLay(markerTool)
                }
              }
            }
          }
        }
      })
    },
    isExistInArr(arr, item) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == item) {
          return true
        }
      }
      return false
    },
    isExistInMarkers() {},
    //********************************地图操作事件***************************************** */
    // 指北针
    compass() {},
    // 复位
    setCenter() {
      this.map.panTo(this.$store.state.projectCoordinate, 14)
    },
    // 放大
    mapZoomIn() {
      this.map.zoomIn()
    },
    // 缩小
    mapZoomOut() {
      this.map.zoomOut()
    },
    allPointTask(pointLists, tool) {
      for (const item of pointLists) {
        this.drawAllPoint(item.latlng, tool)
      }
    },
    // 监听所有的开关属性
    // 监听所有的开关属性
    watchAllSwitch() {
      // 风险地图
      this.onRiskMap()
      // 水质数据
      this.onWaterQuality()
      // 水质漂浮物
      this.onWaterFlotage()
      // 排口
      this.onOutlet()
      // 河岸风险源
      this.onRiverRisk()
      // 水土流失
      // this.onWaterLandLoss()
      // 水面率
      this.onWaterRatio()
      // 底泥
      this.onBottomMud()
      // 专项调查点
      this.onSurveyPoint()
      // 河道连通性
      this.onRiverLink()
      // 水陆分布
      this.onLandAndWater()
    },
    // 添加标注图片
    drawAllPoint(latlng, tool) {
      tool = new T.Marker(latlng)
      this.map.addOverLay(tool)
      tool.addEventListener('click', this.taskPointClick)
    },
    // 任务点点击事件
    taskPointClick(index) {
      for (const item of this.taskPage) {
        if (index.lnglat.lat === item.latlng.lat && index.lnglat.lng === item.latlng.lng) {
          this.taskId = item.taskPage[0].title
          this.inspectPointId = true
          this.inspectVisible = true
        }
      }
    },
    //图像显示修改
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
    onRoadChangeSwitch() {
      if (this.roadWordChange) {
        this.map.addLayer(this.mapLayerWord)
      } else {
        this.map.removeLayer(this.mapLayerWord)
      }
    },
    // 正射开关
    onLayerImageSwitch() {
      if (this.layerImageChange) {
        this.map.addLayer(this.mapLayerImage)
      } else {
        this.map.removeLayer(this.mapLayerImage)
      }
    },
    //任务模块任务点
    loadPoint() {
      //随机标注点
      this.map.clearOverLays()
      var picker = this.picker.split('-')
      var data = {
        id: '',
        projectId: this.$store.state.id,
        name: '',
        // year: '2019',
        // month: '11',
        // day: '28'
        year: picker[0],
        month: picker[1],
        day: picker[2],
        from: 'app'
      }
      dataManual(data).then(res => {
        var arr = res.data.data
        for (const item of arr) {
          var marker = new T.Marker(item.coordinate, {
            id: item.id,
            coordinate: item.coordinate
          })
          this.map.addOverLay(marker)
          marker.addEventListener('click', this.taskPointClick)
        }
      })
    },
    taskPointClick(index) {
      this.$refs.communication.show(index, this.picker.split('-'))
    },
    //车辆轴迹
    cardTrack() {
      var lineconfig = {
        color: '#2C64A7', //线的颜色
        weight: 5, //线的宽度
        opacity: 0.9, //线的透明度
        lineStyle: 'solid' //线的样式
      }
      var picker = this.picker.split('-')
      var data = {
        projectId: this.$store.state.id,
        year: picker[0],
        month: picker[1],
        day: picker[2],
        status: 'publish'
      }
      locusManual(data).then(res => {
        var arr = res.data
        var k = 0
        for (const item of arr) {
          k = k + 1
          item.checkbox = []
          item.plan.name = item.plan.name.slice(0, 2) + '-' + k
          let aa = 0
          for (const a of item.teams) {
            for (const b of a.staffs) {
              if (aa > 9) {
                b.rgb = this.rbgList[0]
              } else {
                b.rgb = this.rbgList[aa]
              }
              var points1 = []
              for (const cc of b.locus) {
                points1.push(new T.LngLat(cc[0], cc[1]))
              }
              aa = aa + 1
              b.id = b.staff.id
              b.name = b.staff.worker.name
              b.role = b.staff.role.name
              b.point = points1
            }
          }
        }
        this.regulatoryPage = arr
      })
      // var line = new T.Polyline(this.cardData, lineconfig) //创建线条的对象
      // //向地图上添加线
      // this.map.addOverLay(line)
      // this.addIcon()
    },
    //添加车辆起点图标
    addIcon() {
      var startIcon = 'http://lbs.tianditu.gov.cn/images/bus/start.png' //起点图标
      var icon = new T.Icon({
        iconUrl: startIcon,
        iconSize: new T.Point(44, 34),
        iconAnchor: new T.Point(12, 31)
      })
      var marker = new T.Marker(new T.LngLat(121.495505, 31.21098), {
        icon: icon
      })
      this.map.addOverLay(marker)
    },
    //添加河道按钮事件
    addRiverBtn() {
      if (this.markerTool) {
        this.markerTool.close()
      }
      this.drawRiver()
      this.$refs.selectPatrol.show(this.riverList)
      this.$refs.addSurvey.close()
    },
    addRiverRefresh() {
      this.$refs.selectPatrol.show(this.riverList)
    },
    asdasdsadsa() {
      this.$refs.waterquality.add()
    },
    //添加任务点
    addTaskPoint(riverData) {
      if (riverData.region.length != undefined) {
        for (var i = 0; i < riverData.region.length; i++) {
          var lnglat = new T.LngLat(riverData.region[i].lng, riverData.region[i].lat)
          var marker = new T.Marker(lnglat)
          this.showPosition(marker, riverData)
        }
      } else {
        var lnglat = new T.LngLat(riverData.lng, riverData.lat)

        var marker = new T.Marker(lnglat)

        this.showPosition(marker, riverData)
        this.map.addOverLay(marker)
      }
    },
    //地图上信息弹框
    showPosition(marker, riverData) {
      inspectTaskDetail(riverData.id).then(res => {
        marker.addEventListener('click', function() {
          var html =
            "<div style='margin:0px;'>" +
            "<div style='line-height:30px;font-size:18px;margin-bottom:5px'>" +
            riverData.name +
            '</div>' +
            "<div style='line-height:25px;'>" +
            "<div><span style='color:;'>任务名称</span>：" +
            res.data.name +
            '</div>' +
            '<div>任务内容：' +
            res.data.content +
            '</div>'
          // +'<div>位置信息：上海市徐汇区龙川北路422-5' +
          // '</div>'
          // +'<div>备注：' +
          // '<div>当月计划执行次数：5' +
          // '</div>' +
          // '<div>当月待执行次数：2' +
          // '</div>' +
          // '</div>' +
          // '</div>' +
          // '</div>'
          var infoWin = new T.InfoWindow(html)
          marker.openInfoWindow(infoWin)
        })
      })
    },
    // showPosition(marker, riverData) {
    //   inspectTaskDetail(riverData.id).then(res => {
    //     marker.addEventListener('click', function() {
    //       var html =
    //         "<div style='margin:0px;'>" +
    //         "<div style='line-height:30px;font-size:18px;margin-bottom:5px'>" +
    //         riverData.name +
    //         '</div>' +
    //         "<div style='line-height:25px;'>" +
    //         "<div><span style='color:;'>任务名称</span>：" +
    //         res.data.name +
    //         '</div>' +
    //         '<div>任务内容：' +
    //         res.data.content +
    //         '</div>'
    //       // +'<div>位置信息：上海市徐汇区龙川北路422-5' +
    //       // '</div>'
    //       // +'<div>备注：' +
    //       // '<div>当月计划执行次数：5' +
    //       // '</div>' +
    //       // '<div>当月待执行次数：2' +
    //       // '</div>' +
    //       // '</div>' +
    //       // '</div>' +
    //       // '</div>'
    //       var infoWin = new T.InfoWindow(html)
    //       marker.openInfoWindow(infoWin)
    //     })
    //   })
    // },
    //河道计划点击事件
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
      this.treeinfo = info.node.dataRef
      var info = info.node.dataRef
      if (info.children) {
        for (var i = 0; i < info.children.length; i++) {
          if (info.children[i].riverData.length > 1) {
            this.map.setZoom('12')
            // this.positionArea(info.children[i].riverData)
            this.addPolyLine(info.children[i].riverData, info)
          }
          if (info.children[i].riverData.length == 1) {
            this.map.setZoom('12')
            this.addTaskPoint(info.children[i].riverData, info)
          }
        }
      } else {
        this.map.setViewport(info.latlng)
        this.map.setZoom('13')
        this.addTaskPoint(info)
      }
    },
    //获取绘制线坐标
    getLineDate(e) {
      this.lineLnglats = e.currentLnglats
    },
    //取消追加任务
    cancelAddTask() {
      this.cBtn = true
    },
    // 确认追加任务
    confirmAddTask(e) {
      this.newTaskObj = {
        planId: this.planList1.id,
        objectId: id,
        objectName: name,
        isShow: false,
        object: code
      }
    },
    //添加调查点
    addSurveyPoint() {
      this.map.clearOverLays() //将之前绘制的清除
      this.addSurveyPoints()
    },
    // 添加调查点
    addSurveyPoints() {
      if (this.markerTool) {
        this.markerTool.close()
      }
      let icon = new T.Icon({
        iconUrl: 'http://api.tianditu.gov.cn/img/map/markerA.png',
        iconSize: new T.Point(19, 27),
        iconAnchor: new T.Point(10, 25)
      })
      this.markerTool = new T.MarkTool(this.map, {
        icon: icon,
        follow: true
      })
      this.markerTool.open()

      this.markerTool.addEventListener('mouseup', this.addPointed)
    },
    // 添加调查点后
    addPointed(e) {
      let circle = new T.Circle(e.currentLnglat, 1000, {
        color: 'blue',
        weight: 2,
        opacity: 0.5,
        fillColor: '#FFFFFF',
        fillOpacity: 0.4,
        lineStyle: 'solid'
      })
      circle.disableEdit()
      this.map.addOverLay(circle)
      this.inspectVisible = true
      this.lat = e.currentLnglat.lat
      this.lng = e.currentLnglat.lng
      var data = {
        projectId: this.$store.state.id,
        coordinate: e.currentLnglat.lng + ',' + e.currentLnglat.lat,
        radius: '1'
      }
      taskSpotList(data).then(res => {
        var arr = res.data
        arr.forEach(v => {
          v.latlng = v.coordinate
        })
        this.pointTargetAround(arr)
      })
    },
    pointTargetAround(taskPage) {
      for (const item of taskPage) {
        let markerTool = new T.Marker(item.coordinate, {
          title: item.name,
          id: item.id
        })
        this.map.addOverLay(markerTool)
      }
    },
    //画点
    addPoint(clickPoint, num) {
      if (this.markerTool1) {
        this.markerTool1.clear()
        this.markerTool1.close()
      }
      if (this.lineTool) {
        this.lineTool.clear()
        this.lineTool.close()
      }
      if (this.polygonTool) {
        this.polygonTool.clear()
        this.polygonTool.close()
      }
      this.map.setViewport(this.appendLatlngList)
      this.map.setZoom('16')
      this.clickPoint = clickPoint
      this.markerTool1 = new T.MarkTool(this.map, {
        id: this.translateId
      })
      this.markerTool1.open()
      this.markerTool1.addEventListener('mouseup', this.addPointDate)
      // this.markerTool1.addEventListener('mouseup', this.addPointed)
    },
    addPointDate(e) {
      this.markLnglat = e.currentLnglat
    },
    //追加任务画线
    addLineTool(clickLine) {
      if (this.markerTool1) {
        this.markerTool1.clear()
        this.markerTool1.close()
      }
      if (this.lineTool) {
        this.lineTool.clear()
        this.lineTool.close()
      }
      if (this.polygonTool) {
        this.polygonTool.clear()
        this.polygonTool.close()
      }
      this.map.setViewport(this.appendLatlngList)
      this.map.setZoom('16')
      this.clickLine = clickLine
      this.lineTool = new T.PolylineTool(this.map, {
        id: this.translateId
      })
      this.lineTool.open()
      this.lineTool.setTips(`<p style="padding:0px;">单击确认起点, 双击结束绘制</p>`)
      this.lineTool.addEventListener('draw', this.getLineDate)
    },
    //画面
    addPolygonTool(clickPolygon) {
      if (this.markerTool1) {
        this.markerTool1.clear()
        this.markerTool1.close()
      }
      if (this.lineTool) {
        this.lineTool.clear()
        this.lineTool.close()
      }
      if (this.polygonTool) {
        this.polygonTool.clear()
        this.polygonTool.close()
      }
      this.map.setViewport(this.appendLatlngList)
      this.map.setZoom('16')
      this.clickPolygon = clickPolygon
      this.polygonTool = new T.PolygonTool(this.map, {
        showLabel: true,
        color: 'blue',
        weight: 3,
        opacity: 0.5,
        id: this.translateId,
        fillColor: '#FFFFFF',
        fillOpacity: 0.5
      })
      this.polygonTool.open()
      this.polygonTool.addEventListener('draw', this.addPolygonDate)
    },
    addPolygonDate(e) {
      this.polygonDate = e.currentLnglats
    },
    //显示地图上调查点内任务点
    addMorePoint() {
      var dLng = this.lng
      var dLat = this.lat
      var marker1
      var content
      var data_info = []
      for (var i = 0; i < 2; i++) {
        dLng = dLng + 0.0001 * Math.floor(Math.random() * 10 + 1)
        dLat = dLat + 0.0001 * Math.floor(Math.random() * 10 + 1)
        data_info[i] = [dLng, dLat, '地址:地址' + i]
      }
      for (var i = 0; i < data_info.length; i++) {
        marker1 = new T.Marker(new T.LngLat(data_info[i][0], data_info[i][1]))
        content = data_info[i][2]
        this.map.addOverLay(marker1)

        marker1.addEventListener('click', function(e) {
          var point = e.lnglat
          marker1 = new T.Marker(point)
          var markerInfoWin = new T.InfoWindow(content, {
            offset: new T.Point(0, -30)
          })
          marker1.openInfoWindow(markerInfoWin, point)
        })
        // this.addClickHandler(content,marker1);
      }
    },
    addClickHandler(content, marker) {
      marker.addEventListener('click', function(e) {
        this.openInfo(content, e)
      })
    },
    //添加信息弹框
    openInfo() {
      var point = e.lnglat
      marker1 = new T.Marker(point)
      var markerInfoWin = new T.InfoWindow(content)
      marker1.openInfoWindow(markerInfoWin, point)
    },
    //高亮河道
    searchMap() {
      this.removeMapClick()
      var infoVisible = this.infoVisible
      // 绘制多边形
      this.polygon = new T.Polygon(this.riverData, {
        color: 'blue',
        weight: 3,
        opacity: 0.5,
        fillColor: '#FFFFFF',
        fillOpacity: 0
      })
      this.map.addOverLay(this.polygon)
      this.map.setViewport(this.riverData)
      this.polygon.addEventListener('click', this.showOk)
      //显示河道标注点及信息
      this.addTaskPoint(this.LineData)
    },
    //添加标注点及信息框
    addRiverPoint() {
      var markers = new T.Marker(new T.LngLat(121.50162, 31.2088))
      this.map.addOverLay(markers)
      this.markerInfo =
        "<div style='margin:0px;'>" +
        "<div style='line-height:30px;font-size:18px;margin-bottom:5px'>" +
        '采集水样标本</div>' +
        "<div style='line-height:25px;'>" +
        "<div><span style='color:;'>任务名称</span>：水样调查" +
        '</div>' +
        '<div>任务内容：现场测定：ph、溶解氧、浊度（3次）、电导率、透明度' +
        '</div>' +
        '<div>位置信息：上海市徐汇区龙川北路422-5' +
        '</div>' +
        '<div>备注：' +
        '<div>当月计划执行次数：5' +
        '</div>' +
        '<div>当月待执行次数：2' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
      var content = this.markerInfo
      var markerInfoWin = new T.InfoWindow()
      markerInfoWin.setContent(content)
      markers.addEventListener('click', function() {
        markers.openInfoWindow(markerInfoWin)
      })
    },
    //描绘多边形
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
    //定位到选中地
    positionArea(val) {
      this.map.setViewport(val)
      this.setPolygonLine(val, 'red', 3, 0)
      // val.addEventListener('click', this.polygonClick)
    },
    //描绘线
    addPolyLine(lineData) {
      var lines = new T.PolyLine(lineData)
      this.map.addOverLay(lines)
      lines.addEventListener('mouseover', this.treeHover)
    },
    treeHover() {
      // this.selectedKeys
    },
    // mouseOverTask(e) {
    //   var getLng = e.lnglat.getLng()
    //   var getLat = e.lnglat.getLat()
    //   for (var i = 0; i < this.treeData.length; i++) {
    //     if (this.treeData[i].children) {
    //       for (var item of this.treeData[i].children) {
    //         if (getLat == item.riverData[i].lat && getLng == item.riverData[i].lng) {
    //           var mouseSelect = item.key
    //           this.selectedKeys = mouseSelect.split(',')
    //         }
    //       }
    //     }
    //   }
    // },
    // mouseOutTask(e) {
    //   var getLng = e.lnglat.getLng()
    //   var getLat = e.lnglat.getLat()
    //   for (var i = 0; i < this.treeData.length; i++) {
    //     if (this.treeData[i].children) {
    //       for (var item of this.treeData[i].children) {
    //         if (getLat == item.riverData[i].lat && getLng == item.riverData[i].lng) {
    //           var mouseSelect = this.treeData[i].key
    //           this.selectedKeys = mouseSelect.split(',')
    //         }
    //       }
    //     }
    //   }
    // }
    //追加任务
    addPlanInfo() {
      let data = this.listAppend
      if (data.locationType == 'point') {
        data.region = this.markLnglat.lng + ',' + this.markLnglat.lat
      }
      if (data.locationType == 'line') {
        for (const item of this.lineLnglats) {
          data.region = data.region + item.lng + ',' + item.lat + '|'
        }
      }
      if (data.locationType == 'polygon') {
        for (const item of this.polygonDate) {
          data.region = data.region + item.lng + ',' + item.lat + '|'
        }
      }
      console.log(data)

      data.status = 'incomplete'
      data.roleId = data.roleId.join(',')
      inspectTaskSave(data)
        .then(res => {
          this.$message.success('成功')
          this.getinspectPointPage()
          this.getPage()
          this.cancleBtn(this.listAppend.objectName)
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    cancleBtn(name) {
      if (this.addTaskCode == '1') {
        for (const item of this.riverMontion) {
          if (item.objectName == name) {
            item.isShow = false
          }
        }
      }
      if (this.addTaskCode == '2') {
        for (const item of this.planListPage) {
          for (const a of item.teams) {
            for (const b of a.targets) {
              if (b.target.objectName == name) {
                b.isShow = false
              }
            }
          }
        }
      }
      this.listAppend.teamId = ''
      this.listAppend.planId = ''
      this.listAppend.object = ''
      this.listAppend.objectId = ''
      this.listAppend.objectName = ''
      this.listAppend.name = ''
      this.listAppend.template = ''
      this.listAppend.content = ''
      this.listAppend.locationType = ''
      this.listAppend.region = ''
      this.listAppend.roleId = []
    },
    onOutlet() {
      if (this.outlet) {
        let point1 = []
        let point2 = []
        for (const item of this.outletPoints) {
          if (item.locationType.code == 'point') {
            item.latlng = {
              lng: item.point[0],
              lat: item.point[1]
            }
            point1.push(item)
          }
          if (item.locationType.code == 'line') {
            this.lineDraw(item.line, item.frameColor, 3, item.framePellucidity, item.id, '', item.innerType.code)
            let markerTool
            if (item.drawType.icon) {
              let icon = new T.Icon({
                iconUrl: item.drawType.icon,
                iconSize: new T.Point(41, 40),
                iconAnchor: new T.Point(21, 40)
              })
              markerTool = new T.Marker(item.line[0], {
                icon: icon,
                id: item.id,
                title: item.innerName,
                code: item.innerType.code
              })
              this.map.addOverLay(markerTool)
              if (this.sharedChecked) {
                let points = []
                for (const point of item.line) {
                  points.push([point.lng, point.lat])
                }
                item.pointsData = points
                this.olSharedDrawLine(item.pointsData, item.id, 'olMap1', item.frameColor, item.framePellucidity)
              }
            } else {
              markerTool = new T.Marker(item.line[0], {
                title: item.innerName,
                id: item.id
              })
              this.map.addOverLay(markerTool)
            }
          }
          if (item.locationType.code == 'polygon') {
            this.noodlesDraw(
              item.polygon,
              item.frameColor,
              3,
              item.framePellucidity,
              item.shapeColor,
              item.shapePellucidity,
              item.innerName,
              item.id,
              item.innerType.code
            )
            let markerTool
            if (item.drawType.icon) {
              let icon = new T.Icon({
                iconUrl: item.drawType.icon,
                iconSize: new T.Point(41, 40),
                iconAnchor: new T.Point(21, 40)
              })
              markerTool = new T.Marker(item.polygon[0], {
                icon: icon,
                id: item.id,
                title: item.innerName,
                code: item.innerType.code
              })
              this.map.addOverLay(markerTool)
              if (this.sharedChecked) {
                let points = []
                for (const point of item.polygon) {
                  points.push([point.lng, point.lat])
                }
                item.pointsData = []
                item.pointsData.push(points)
                this.olSharedDrawPolygon(
                  item.pointsData,
                  item.id,
                  'olMap1',
                  item.frameColor,
                  item.framePellucidity,
                  item.shapeColor,
                  item.shapePellucidity
                )
              }
            } else {
              markerTool = new T.Marker(item.polygon[0], {
                title: item.innerName,
                id: item.id
              })
              this.map.addOverLay(markerTool)
            }
          }
        }
        if (point1.length > 0) {
          this.spotDraw(point1)
        }
      } else {
        this.removeOverLays(this.outletPoints)
      }
    },
    // 河岸风险源
    onRiverRisk() {
      if (this.riverRisk) {
      } else {
        this.riskSourceList.forEach(v => {
          v.clicked = false
        })
        this.removeOverLays(this.riverRiskPoints)
      }
    },
    // 河岸风险源子栏
    onDrawType(id, clicked) {
      // 点击时间轴切换先清除上一次的地图数据
      let data1 = []
      let data2 = []
      // 双球开关风险源关闭
      if (this.sharedChecked) {
        for (const item of this.riverRiskPoints) {
          if (item.drawType.id == id) {
            data1.push(item)
          }
        }
        for (const item of this.riverRiskPointsRight) {
          if (item.drawType.id == id) {
            data2.push(item)
          }
        }
      }
      let point = []
      let point2 = []
      if (clicked) {
        for (const item of this.riverRiskPoints) {
          if (item.drawType.id == id) {
            if (item.locationType.code == 'point') {
              item.latlng = {
                lng: item.point[0],
                lat: item.point[1]
              }
              point.push(item)
            }
            if (item.locationType.code == 'line') {
              this.lineDraw(item.line, item.frameColor, 3, item.framePellucidity, item.id, '', item.innerType.code)
              let markerTool
              if (item.drawType.icon) {
                let icon = new T.Icon({
                  iconUrl: item.drawType.icon,
                  iconSize: new T.Point(41, 40),
                  iconAnchor: new T.Point(21, 40)
                })
                markerTool = new T.Marker(item.line[0], {
                  icon: icon,
                  id: item.id,
                  title: item.innerName,
                  code: item.innerType.code
                })
                this.map.addOverLay(markerTool)
              } else {
                markerTool = new T.Marker(item.line[0], {
                  title: item.innerName,
                  id: item.id
                })
                this.map.addOverLay(markerTool)
              }
              // markerTool.addEventListener('click', this.panoramaPointClick)
            }
            if (item.locationType.code == 'polygon') {
              this.noodlesDraw(
                item.polygon,
                item.frameColor,
                3,
                item.framePellucidity,
                item.shapeColor,
                item.shapePellucidity,
                '',
                item.id,
                item.innerType.code
              )
              let markerTool
              if (item.drawType.icon) {
                let icon = new T.Icon({
                  iconUrl: item.drawType.icon,
                  iconSize: new T.Point(41, 40),
                  iconAnchor: new T.Point(21, 40)
                })
                markerTool = new T.Marker(item.polygon[0], {
                  icon: icon,
                  id: item.id,
                  title: item.innerName,
                  code: item.innerType.code
                })
                this.map.addOverLay(markerTool)
              } else {
                // markerTool = new T.Marker(item.latlng, { title: item.innerName, id: item.id, code: item.innerType.code })
                // this.map.addOverLay(markerTool)
                markerTool = new T.Marker(item.polygon[0], {
                  title: item.innerName,
                  id: item.id
                })
                this.map.addOverLay(markerTool)
              }
            }
          }
        }
        this.spotDraw(point)
        // 双球开关
      } else {
        let data1 = []
        let data2 = []
        for (const item of this.riverRiskPoints) {
          if (item.drawType.id == id) {
            data1.push(item)
          }
        }
        this.removeOverLays(data1)
      }
    },
    // 风险地图
    onRiskMap() {
      this.removeOverLays(this.riskPolygonData)
      if (this.riskMap) {
        // 风险地图绘制的面
        if (this.riskPolygonData.length != 0) {
          for (const item of this.riskPolygonData) {
            this.setRiskPolyline(
              item.lineData,
              item.borderColor,
              3,
              item.borderOpacity,
              item.fullColor,
              item.fullOpacity,
              '',
              item.id
            )
          }
        }
      }
    },
    // 获取风险地图
    getRiskMapList() {
      // this.removeOverLays(this.riskPolygonData)
      var time = this.threePicker
      var picker = time.split('/')
      var data = {
        projectId: this.$store.state.id,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker,
        innerType: 'riskMap'
      }
      mapdrawPage(data).then(res => {
        let arr = res.data
        let ar = []
        for (const item of arr) {
          item.borderColor = item.frameColor
          item.borderOpacity = item.framePellucidity / 100
          item.fullColor = item.shapeColor
          item.fullOpacity = item.shapePellucidity / 100
          item.id = item.id
          item.lineData = item.polygon
          ar.push(item)
        }
        this.riskPolygonData = []
        this.riskPolygonData = ar
        this.onRiskMap()
      })
    },
    // 获取水质数据
    getWaterQualityPoints() {
      var time = this.threePicker
      var picker = time.split('/')
      var data = {
        projectId: this.$store.state.id,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker
      }
      getWaterStation(data)
        .then(res => {
          let arr = res.data
          this.waterQualityPoints = arr
          this.regulatorWaterCount()
          this.onWaterQuality()
        })
        .catch(err => {})
    },
    // 水质数据
    onWaterQuality() {
      this.removeOverLays(this.waterQualityPoints)
      if (this.waterQuality) {
        if (this.waterQualityPoints.length > 0) {
          for (const item of this.waterQualityPoints) {
            var icon = new T.Icon({
              iconUrl: require('./img/onWaterQuality.png'),
              iconSize: new T.Point(41, 40),
              iconAnchor: new T.Point(21, 40)
            })
            this.waterQualityMarker = new T.Marker(item.coordinate, {
              icon: icon,
              item: item,
              id: item.id,
              title: item.name
            })
            this.map.addOverLay(this.waterQualityMarker)
            // if (this.historyData) {
            //   this.waterQualityMarker.addEventListener('click', this.waterQualityHistoryClick)
            // } else {
            //   this.waterQualityMarker.addEventListener('click', this.waterQualityClick)
            //   // this.waterQualityMarker.addEventListener("click",function(e){
            //   //   let point = item.coordinate;
            //   //   that.waterQualityMarker = new T.Marker(point);// 创建标注
            //   //   let markerInfoWin = new T.InfoWindow(item.name,{offset:new T.Point(0,-30)}); // 创建信息窗口对象
            //   //   that.map.openInfoWindow(markerInfoWin,point); //开启信息窗口
            //   // });
            // }
          }
        }
      } else {
      }
    },
    // 水面漂浮物
    onWaterFlotage() {
      if (this.waterFlotage) {
        let point = []
        let point2 = []
        for (const item of this.waterFlotagePoints) {
          if (item.locationType.code == 'point') {
            item.latlng = {
              lat: item.point[1],
              lng: item.point[0]
            }
            point.push(item)
          }
          if (item.locationType.code == 'line') {
            this.lineDraw(item.line, item.frameColor, 3, item.framePellucidity, item.id, '', item.innerType.code)
            let markerTool
            if (item.drawType.icon) {
              let icon = new T.Icon({
                iconUrl: item.drawType.icon,
                iconSize: new T.Point(41, 40),
                iconAnchor: new T.Point(21, 40)
              })
              markerTool = new T.Marker(item.line[0], {
                icon: icon,
                id: item.id,
                title: item.innerName,
                code: item.innerType.code
              })
              this.map.addOverLay(markerTool)
              if (this.sharedChecked) {
                let points = []
                for (const point of item.line) {
                  points.push([point.lng, point.lat])
                }
                item.pointsData = points
                this.olSharedDrawLine(item.pointsData, item.id, 'olMap1', item.frameColor, item.framePellucidity)
              }
            } else {
              markerTool = new T.Marker(item.line[0], {
                title: item.innerName,
                id: item.id
              })
              this.map.addOverLay(markerTool)
            }
          }
          if (item.locationType.code == 'polygon') {
            this.noodlesDraw(
              item.polygon,
              item.frameColor,
              3,
              item.framePellucidity,
              item.shapeColor,
              item.shapePellucidity,
              item.innerName,
              item.id,
              item.innerType.code
            )
            let markerTool
            if (item.drawType.icon) {
              let icon = new T.Icon({
                iconUrl: item.drawType.icon,
                iconSize: new T.Point(41, 40),
                iconAnchor: new T.Point(21, 40)
              })
              markerTool = new T.Marker(item.polygon[0], {
                icon: icon,
                id: item.id,
                title: item.innerName,
                code: item.innerType.code
              })
              this.map.addOverLay(markerTool)
              if (this.sharedChecked) {
                let points = []
                for (const point of item.polygon) {
                  points.push([point.lng, point.lat])
                }
                item.pointsData = []
                item.pointsData.push(points)
                this.olSharedDrawPolygon(
                  item.pointsData,
                  item.id,
                  'olMap1',
                  item.frameColor,
                  item.framePellucidity,
                  item.shapeColor,
                  item.shapePellucidity
                )
              }
            } else {
              markerTool = new T.Marker(item.polygon[0], {
                title: item.innerName,
                id: item.id
              })
              this.map.addOverLay(markerTool)
            }
          }
        }
        if (point.length > 0) {
          this.spotDraw(point)
        }
      } else {
        this.removeOverLays(this.waterFlotagePoints)
      }
    },
    // 获取专项调查点
    getSurveyPointPoints() {
      var time = this.threePicker
      var picker = time.split('/')
      var data = {
        projectId: this.$store.state.id,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker,
        mediaType: 'image'
      }
      inspectPointPageRiver(data).then(res => {
        let arr = res.data.data
        arr.forEach(v => {
          v.clicked = false
        })
        this.pointCount()
        this.surveyPointPoints = arr
        this.onSurveyPoint()
      })
    },
    //水面漂浮物绘制数据
    getFloatageMapDrawPage() {
      var time = this.threePicker
      var picker = time.split('/')
      var data = {
        projectId: this.$store.state.id,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker,
        innerType: 'floatage'
      }
      mapdrawPage(data).then(res => {
        let arr = res.data
        let ar = []
        arr.forEach(v => {
          v.shapePellucidity = v.shapePellucidity / 100
          v.framePellucidity = v.framePellucidity / 100
          if (v.drawType == undefined) {
            v.drawType = {
              code: '',
              id: ''
            }
          }
          if (v.innerType != undefined) {
            ar.push(v)
          }
        })
        this.waterFlotagePoints = ar
        this.onWaterFlotage()
      })
    },
    // 河岸风险源过滤
    riverRiskFilterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 河岸风险源
    riverRiskChange(value) {
      this.removeOverLays(this.riverRiskPoints)
      this.getRiskSourceMapDrawPage(true)
    },
    //其他绘制数据
    getOtherMapDrawPage() {
      var time = this.threePicker
      var picker = time.split('/')
      var data = {
        projectId: this.$store.state.id,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker,
        innerType: 'other'
      }
      mapdrawPage(data).then(res => {
        let arr = res.data
        let ar = []
        arr.forEach(v => {
          v.shapePellucidity = v.shapePellucidity / 100
          v.framePellucidity = v.framePellucidity / 100
          if (v.drawType == undefined) {
            v.drawType = {
              code: '',
              id: ''
            }
          }
          if (v.innerType != undefined) {
            ar.push(v)
          }
        })
        this.otherPoints = ar
        // 点击切换重新绘制触发
        for (const item of this.otherList) {
          if (item.clicked == true) {
            this.onWaterLandLoss(item.id, true)
          }
        }
      })
    },
    //专项调查点
    onSurveyPoint() {
      this.removeOverLays(this.surveyPointPoints)
      if (this.surveyPoint) {
        for (const item of this.surveyPointPoints) {
          let icon = new T.Icon({
            iconUrl: require('./img/surveyPointIcon.png'),
            iconSize: new T.Point(41, 40),
            iconAnchor: new T.Point(21, 40)
          })
          let marker = new T.Marker(item.coordinate, {
            icon: icon,
            id: item.id,
            title: item.name
          })
          this.map.addOverLay(marker)
          // marker.addEventListener('click', this.taskPointClick)
        }
      } else {
      }
    },
    // 其他
    onWaterLandLoss(id, clicked) {
      if (clicked) {
        let point = []
        for (const item of this.otherPoints) {
          if (item.drawType.id == id) {
            if (item.locationType.code == 'point') {
              item.latlng = {
                lng: item.point[0],
                lat: item.point[1]
              }
              point.push(item)
            }
            if (item.locationType.code == 'line') {
              if (item.innerName) {
              } else {
                item.innerName = ''
              }
              this.lineDraw(
                item.line,
                item.frameColor,
                3,
                item.framePellucidity,
                item.id,
                item.innerName,
                item.innerType.code
              )
            }
            if (item.locationType.code == 'polygon') {
              if (item.innerName) {
              } else {
                item.innerName = ''
              }
              this.noodlesDraw(
                item.polygon,
                item.frameColor,
                3,
                item.framePellucidity,
                item.shapeColor,
                item.shapePellucidity,
                item.innerName,
                item.id,
                item.innerType.code
              )
            }
          }
        }
        this.spotDraw(point)
      } else {
        let data = []
        for (const item of this.otherPoints) {
          if (item.drawType.id == id) {
            data.push(item)
          }
        }
        this.removeOverLays(data)
      }
    },
    // 设置绘制的多边形
    setRiskPolyline(lineData, color, weight, opacity, fillColor, fillOpacity, title, id) {
      let polygon = new T.Polygon(lineData, {
        color: color, //线颜色
        weight: weight, //线宽
        opacity: opacity, //透明度
        fillColor: fillColor, //填充颜色
        fillOpacity: fillOpacity, // 填充透明度
        title: title, // 名字
        id: id // id
      })
      //向地图上添加面
      this.map.addOverLay(polygon)
      // polygon.addEventListener('click', this.riskPolygonClick)
    },
    //风险源绘制数据
    getRiskSourceMapDrawPage(riskSourceType) {
      var riskSourceLevel = qs.stringify(
        {
          riskSourceLevel: this.riskSourceLevel
        },
        {
          indices: false
        }
      )
      var time = this.threePicker
      var picker = time.split('/')
      var data = {
        projectId: this.$store.state.id,
        // startDate: picker[0]+'-'+picker[1]+'-'+picker[2],
        // endDate: this.picker,
        innerType: 'riskSource'
      }
      mapdrawPageRiskSource(data, riskSourceLevel).then(res => {
        let arr = res.data
        let ar = []
        arr.forEach(v => {
          v.shapePellucidity = v.shapePellucidity / 100
          v.framePellucidity = v.framePellucidity / 100
          if (v.drawType == undefined) {
            v.drawType = {
              code: '',
              id: ''
            }
          }
          if (v.innerType != undefined) {
            ar.push(v)
          }
        })
        this.riverRiskPoints = ar
        // 点击切换重新绘制触发
        for (const item of this.riskSourceList) {
          if (item.clicked) {
            this.onDrawType(item.id, true)
          }
        }
        if (riskSourceType == true) {
          for (const risk of this.riskSourceList) {
            if (risk.clicked == true) {
              let point = []
              for (const item of this.riverRiskPoints) {
                if (item.drawType.id == risk.id) {
                  if (item.locationType.code == 'point') {
                    item.latlng = {
                      lng: item.point[0],
                      lat: item.point[1]
                    }
                    point.push(item)
                  }
                  if (item.locationType.code == 'line') {
                    this.lineDraw(
                      item.line,
                      item.frameColor,
                      3,
                      item.framePellucidity,
                      item.id,
                      '',
                      item.innerType.code
                    )
                    let markerTool
                    if (item.drawType.icon) {
                      let icon = new T.Icon({
                        iconUrl: item.drawType.icon,
                        iconSize: new T.Point(41, 40),
                        iconAnchor: new T.Point(21, 40)
                      })
                      markerTool = new T.Marker(item.line[0], {
                        icon: icon,
                        id: item.id,
                        title: item.innerName,
                        code: item.innerType.code
                      })
                      this.map.addOverLay(markerTool)
                    } else {
                      markerTool = new T.Marker(item.line[0], {
                        title: item.innerName,
                        id: item.id
                      })
                      this.map.addOverLay(markerTool)
                    }
                    // markerTool.addEventListener('click', this.panoramaPointClick)
                  }
                  if (item.locationType.code == 'polygon') {
                    this.noodlesDraw(
                      item.polygon,
                      item.frameColor,
                      3,
                      item.framePellucidity,
                      item.shapeColor,
                      item.shapePellucidity,
                      '',
                      item.id,
                      item.innerType.code
                    )
                    let markerTool
                    if (item.drawType.icon) {
                      let icon = new T.Icon({
                        iconUrl: item.drawType.icon,
                        iconSize: new T.Point(41, 40),
                        iconAnchor: new T.Point(21, 40)
                      })
                      markerTool = new T.Marker(item.polygon[0], {
                        icon: icon,
                        id: item.id,
                        title: item.innerName,
                        code: item.innerType.code
                      })
                      this.map.addOverLay(markerTool)
                    } else {
                      // markerTool = new T.Marker(item.latlng, { title: item.innerName, id: item.id, code: item.innerType.code })
                      // this.map.addOverLay(markerTool)
                      markerTool = new T.Marker(item.polygon[0], {
                        title: item.innerName,
                        id: item.id
                      })
                      this.map.addOverLay(markerTool)
                    }
                  }
                }
              }
              this.spotDraw(point)
            }
          }
        }
      })
    },
    //获取排口绘制数据
    getDischargeMapDrawPage() {
      if (this.dischargeLevel.length > 0) {
        var dischargeLevel = this.dischargeLevel.join(',')
      } else {
        var dischargeLevel = ''
      }
      var time = this.threePicker
      var picker = time.split('/')
      var data = {
        projectId: this.$store.state.id,
        dischargeType: dischargeLevel,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker,
        innerType: 'discharge'
      }
      mapdrawPage(data).then(res => {
        let arr = res.data
        let ar = []
        arr.forEach(v => {
          v.shapePellucidity = v.shapePellucidity / 100
          v.framePellucidity = v.framePellucidity / 100
          if (v.drawType == undefined) {
            v.drawType = {
              code: '',
              id: ''
            }
          }
          if (v.innerType != undefined) {
            ar.push(v)
          }
        })
        this.outletPoints = ar
        this.onOutlet()
      })
    },
    // 水质监测点过滤
    waterQualityFilterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 水质监测点
    waterQualityChange(value) {
      this.removeOverLays(this.outletPoints)
      this.getDischargeMapDrawPage()
    },
    removeOverLays(itemList) {
      for (const overlay of this.map.getOverlays()) {
        for (const item of itemList) {
          if (item.id == overlay.options.id) {
            this.map.removeOverLay(overlay)
          }
        }
      }
    },
    //绘制点
    spotDraw(pointLists) {
      let markerTool
      for (const item of pointLists) {
        if (item.drawType.icon) {
          let icon = new T.Icon({
            iconUrl: item.drawType.icon,
            iconSize: new T.Point(41, 40),
            iconAnchor: new T.Point(21, 40)
          })
          markerTool = new T.Marker(item.latlng, {
            icon: icon,
            id: item.id,
            title: item.innerName,
            code: item.innerType.code
          })
          this.map.addOverLay(markerTool)
        } else {
          markerTool = new T.Marker(item.latlng, {
            title: item.innerName,
            id: item.id,
            code: item.innerType.code
          })
          this.map.addOverLay(markerTool)
        }
        // if (item.innerType.code == 'riskSource') {
        //   markerTool.addEventListener('click', this.sourceRiskClick)
        // } else if (item.innerType.code == 'discharge') {
        //   markerTool.addEventListener('click', this.sourceRiskClick)
        // } else if (item.innerType.code == 'floatage') {
        //   markerTool.addEventListener('click', this.floatageClick)
        // }else if (item.innerType.code == 'other') {
        //   markerTool.addEventListener('click', this.otherClick)
        // }
      }
    },
    //绘制线
    lineDraw(points, color, weight, opacity, id, name, code) {
      let line = new T.Polyline(points, {
        color: color, //线颜色
        weight: weight, //线宽
        opacity: opacity, //透明度
        id: id,
        title: name,
        code: code
      })
      //向地图上添加线
      this.map.addOverLay(line)
      // if (code == 'riskSource') {
      //   line.addEventListener('click', this.sourceRiskClick)
      // }
      // if (code == 'discharge') {
      //   line.addEventListener('click', this.sourceRiskClick)
      // }
      // if (code == 'floatage') {
      //   line.addEventListener('click', this.floatageClick)
      // }
      // if (code== 'other') {
      //   line.addEventListener('click', this.otherClick)
      // }
    },
    // 绘制面
    noodlesDraw(lineData, color, weight, opacity, fillColor, fillOpacity, title, id, code) {
      let polygon = new T.Polygon(lineData, {
        color: color, //线颜色
        weight: weight, //线宽
        opacity: opacity, //透明度
        fillColor: fillColor, //填充颜色
        fillOpacity: fillOpacity, // 填充透明度
        title: title, // 名字
        id: id, // id
        code: code
      })
      //向地图上添加面
      this.map.addOverLay(polygon)
      // if (code == 'riskSource') {
      //   polygon.addEventListener('click', this.sourceRiskClick)
      // }
      // if (code == 'discharge') {
      //   polygon.addEventListener('click', this.sourceRiskClick)
      // }
      // if (code == 'floatage') {
      //   polygon.addEventListener('click', this.floatageClick)
      // }
      // if (code== 'other') {
      //   polygon.addEventListener('click', this.otherClick)
      // }
    },
    // 获取当前页面数据
    getMapPageData() {
      if (this.moreLoadOnce == '1') {
        //获取风险源绘制数据
        this.removeOverLays(this.riverRiskPoints)
        this.getRiskSourceMapDrawPage(true)
        //其他绘制数据
        this.removeOverLays(this.otherPoints)
        this.getOtherMapDrawPage(true)
        //获取排口绘制数据
        this.removeOverLays(this.outletPoints)
        this.getDischargeMapDrawPage()
        //获取漂浮物绘制数据
        this.removeOverLays(this.waterFlotagePoints)
        this.getFloatageMapDrawPage()
        // 获取专项调查点
        this.removeOverLays(this.surveyPointPoints)
        this.getSurveyPointPoints()
        // 获取风险地图
        this.removeOverLays(this.riskPolygonData)
        this.getRiskMapList()
        // 获取水质数据
        this.removeOverLays(this.waterQualityPoints)
        this.getWaterQualityPoints()
        this.onSurveyPoint()
        this.getOtherDataStatistics()
        this.getDataStatistics()
        // this.getUavPhoto()//无人机照片
        this.moreLoadOnce = '2'
      }
    },
    //其他子栏数据统计
    getOtherDataStatistics() {
      var time = this.threePicker
      var picker = time.split('/')

      this.otherList.forEach(v => {
        var data = {
          projectId: this.$store.state.id,
          startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
          endDate: this.picker,
          innerType: 'other',
          typeId: v.id
        }
        getMapdrawCount(data).then(res => {
          v.num = res.data
        })
      })
    },
    //水质数据统计
    regulatorWaterCount() {
      var time = this.threePicker
      var picker = time.split('/')
      var data = {
        projectId: this.$store.state.id,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker
      }
      getRegulatorWaterCount(data).then(res => {
        this.regulatorWaterCountData = res.data
      })
    },
    //调查点
    pointCount() {
      var time = this.threePicker
      var picker = time.split('/')
      var data = {
        projectId: this.$store.state.id,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker
      }
      getPointCount(data).then(res => {
        this.pointCountData = res.data
      })
    },
    //数据统计
    getDataStatistics() {
      var time = this.threePicker
      var picker = time.split('/')
      //风险源总数
      var data = {
        projectId: this.$store.state.id,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker,
        innerType: 'riskSource'
      }
      getMapdrawCount(data).then(res => {
        this.statisticsList.riskSource = res.data
      })
      //排口总数
      var data1 = {
        projectId: this.$store.state.id,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker,
        innerType: 'discharge'
      }
      getMapdrawCount(data1).then(res => {
        this.statisticsList.discharge = res.data
      })
      //漂浮物
      var data2 = {
        projectId: this.$store.state.id,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker,
        innerType: 'floatage'
      }
      getMapdrawCount(data2).then(res => {
        this.statisticsList.floatage = res.data
      })
      var data3 = {
        projectId: this.$store.state.id,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker,
        innerType: 'other'
      }
      //其他
      getMapdrawCount(data3).then(res => {
        this.statisticsList.other = res.data
      })
      var data4 = {
        projectId: this.$store.state.id,
        startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
        endDate: this.picker,
        innerType: 'riskMap'
      }
      //风险地图
      getMapdrawCount(data4).then(res => {
        this.statisticsList.riskMap = res.data
      })
      //风险源子项
      this.riskSourceList.forEach(v => {
        var data = {
          projectId: this.$store.state.id,
          startDate: picker[0] + '-' + picker[1] + '-' + picker[2],
          endDate: this.picker,
          innerType: 'riskSource',
          typeId: v.id
        }
        getMapdrawCount(data).then(res => {
          v.num = res.data
        })
      })
    },
    drawLine(date) {
      var myChart = echarts.init(document.getElementById('main1'))
      myChart.setOption({
        xAxis: {
          name: '潮时(Hrs)',
          nameLocation: 'center',
          nameTextStyle: {
            lineHeight: 56,
            fontSize: 15
          },
          axisLabel: {
            show: true
          },
          type: 'category',
          data: [
            '00:00',
            '01:00',
            '02:00',
            '03:00',
            '04:00',
            '05:00',
            '06:00',
            '07:00',
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00',
            '24:00'
          ]
        },
        tooltip: {
          trigger: 'item'
        },
        yAxis: {
          nameLocation: 'center',
          nameTextStyle: {
            lineHeight: 56,
            fontSize: 15
          },
          type: 'value',
          name: '潮高(cm)'
        },
        series: [
          {
            data: date,
            type: 'line',
            smooth: true
          }
        ]
      })
    }
  }
}
</script>

<style lang="less" scoped>
// @import '../../assets/css/monitor.less';

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

.weather_alert {
  display: block;
  position: absolute;
  left: 50px;
  top: -13px;
  z-index: 888;
  padding-left: 20px;

  .weather_content {
    width: 500px;
    height: 500px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 1px 4px 10px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    padding: 10px;

    .weather_basic {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .weather_basic_content {
        width: 50%;
        color: #595959;
        font-size: 12px;
        margin-bottom: 12px;
      }
    }

    .weather24 {
      padding: 15px 9px;
      box-sizing: border-box;
      width: 100%;

      border-top: 1px solid rgba(216, 216, 216, 0.5);
      border-bottom: 1px solid rgba(216, 216, 216, 0.5);
      font-size: 12px;
      display: flex;

      .time24 {
        width: 30px;
        margin-right: 22px;
        display: flex;
        flex-direction: column;
      }
    }
  }
}

.splitter-pane splitter-paneL vertical {
  width: 72%;
}

.splitter-pane-resizer vertical {
  left: 72%;
}

.splitter-pane splitter-paneR vertical {
  width: 28%;
}

.task_face {
  width: 100%;
  height: calc(100vh - 157px);
  overflow: auto;
}

.addTask_info {
  width: 100%;
  // border-top: 1px solid #e8e8e8;
}

.addTask_title {
  width: 100%;
  height: 34px;
  line-height: 34px;
  border: 1px solid #f5f5f5;
  text-align: left;
  padding-left: 15px;
  background-color: #f5f5f5;
}

.ant-form-item {
  margin-bottom: 3px;
  // margin-bottom:0;
}

.addTask_from {
  padding-left: 20px;
  text-align: center;
}
</style>