<template>
  <div class="supervise">
    <div id="map" ref="worldMap" v-show="showView">
      <div class="time_quantum" v-show="!canDownload">{{timeQuantum}}</div>
      <div class="compass_pointer" @click="compass" title="指北针">
        <img class="pointer" src="../../assets/img/compassPointer.png" alt="指北针" />
      </div>
    </div>
    <div class="time_line">
      <ul class="time_ul">
        <li>
          <!--v-for="item in timeData" :key="item.id" -->
          <!-- <h6 style="font-size:12px;text-align:center;margin:0;">{{item.title}}</h6> -->
          <a-tooltip
            placement="right"
            class="time_item"
            trigger="hover"
            v-for="day in timeData"
            :key="day.date"
            @click="timeLineItem(day.date)"
            :class="{'time_item_clicked':day.clicked == true}"
          >
            <template slot="title">
              <span>{{day.date}}</span>
            </template>
            <div class="line_style">
              <div
                class="line"
                :class="{'time_bg_red':day.level == 0,'time_bg_blue':day.level == 1,'time_bg_gray':day.level == 2}"
              ></div>
            </div>
            <p>
              <span
                :class="{'time_bg_red':day.level == 0,'time_bg_blue':day.level == 1,'time_bg_gray':day.level == 2}"
              >{{day.title}}</span>
            </p>
          </a-tooltip>
        </li>
      </ul>
      <div class="time_set">
        <a-popover
          placement="rightBottom"
          trigger="click"
          v-model="timeSetShow"
          @visibleChange="setTimeShow"
        >
          <template slot="content">
            <a-range-picker
              @change="setTime"
              :defaultValue="[moment(startDate, dateFormat), moment(endDate, dateFormat)]"
              :format="dateFormat"
            />
          </template>
          <template slot="title">
            <span>设置时间段</span>
          </template>
          <a-button type="primary" icon="setting" block></a-button>
        </a-popover>
      </div>
    </div>
    <!-- 右侧时间轴 -->
    <div class="time_line time_line_right" v-show="sharedChecked || swipeChecked">
      <ul class="time_ul">
        <li v-for="item in timeDataRight" :key="item.id">
          <!-- <h6 style="font-size:12px;text-align:center;margin:0;">{{item.title}}</h6> -->
          <a-tooltip
            placement="right"
            class="time_item"
            trigger="hover"
            v-for="day in item.month"
            :key="day.id"
            @click="timeLineItem(item.title, day.title)"
            :class="{'time_item_clicked':day.clicked == true}"
          >
            <template slot="title">
              <span>{{item.title}}.{{day.title}}</span>
            </template>
            <div class="line_style">
              <div
                class="line"
                :class="{'time_bg_red':day.level == 0,'time_bg_blue':day.level == 1,'time_bg_gray':day.level == 2}"
              ></div>
            </div>
            <p>
              <span
                :class="{'time_bg_red':day.level == 0,'time_bg_blue':day.level == 1,'time_bg_gray':day.level == 2}"
              >{{day.title}}</span>
            </p>
          </a-tooltip>
        </li>
      </ul>
      <div class="time_set">
        <a-popover
          placement="rightBottom"
          trigger="click"
          v-model="timeSetShowRight"
          @visibleChange="setTimeShow"
        >
          <template slot="content">
            <a-range-picker
              @change="setTime"
              :defaultValue="[moment(startDate, dateFormat), moment(endDate, dateFormat)]"
              :format="dateFormat"
            />
          </template>
          <template slot="title">
            <span>设置时间段</span>
          </template>
          <a-button type="primary" icon="setting" block></a-button>
        </a-popover>
      </div>
    </div>
    <div class="weather" v-show="!sharedChecked && !swipeChecked">
      <img src="../../assets/sun.png" alt="天气" />
      <h3>29</h3>
      <div class="text">
        <div class="top">
          <span class="degree_logo">℃</span>
          <span class="weather_detail">晴(实时)</span>
          <span class="date">9月16日 星期一</span>
        </div>
        <p class="degree">晴转多云 24～29℃</p>
      </div>
      <div class="weather_right">
        <a-icon class="right_icon" type="caret-left" />
        <!-- 天气弹窗 -->
        <div class="weather_alert">
          <div class="weather_content">
            <div class="weather_basic">
              <div class="weather_basic_content">
                <img src="./img/water.png" alt style="margin-right:5px;height:12px;width:12px" />
                <span>未来2小时无雨</span>
              </div>
              <div class="weather_basic_content">
                <img src="./img/wind.png" alt style="margin-right:5px;height:12px;width:12px" />
                <span>东北风 3级</span>
              </div>
              <div class="weather_basic_content">
                <img src="./img/cloudiness.png" alt style="margin-right:5px;height:12px;width:12px" />
                <span>云量数据</span>
              </div>
            </div>
            <div class="weather24">
              <!-- <div class="time24" v-for="item in weatherList" :key="item.id">
                <div>{{item.temperature}}</div>

              </div>-->
              <div class="time24" v-for="item in weatherList" :key="item.id">
                <div style="text-align:center;">{{item.temperature}}</div>
                <img src="./img/fine.png" alt style="margin:12px 5px;height:19px;width:19px" />
                <div style="text-align:center;">{{item.time}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="accordion_alert"
      v-show="phonePhoto || riskMap || waterQuality || riverRisk || outlet"
    >
      <a-collapse accordion class="custom_collapse">
        <a-collapse-panel
          header="手机照片"
          :style="customStyle"
          v-show="phonePhoto"
          class="custom_list"
        >
          <a-upload name="file" :multiple="true" action :headers="headers" @change="phoneUpload">
            <a-button style="width:198px;" block>
              <a-icon type="upload" />上传照片
            </a-button>
            <div>
              <div v-for="item of phonePhotoPoints" :key="item.id">
                <img src="" alt="">
                <div>11111</div>
              </div>
            </div>
          </a-upload>
        </a-collapse-panel>
        <a-collapse-panel
          header="河岸风险源"
          :style="customStyle"
          v-show="riverRisk"
          class="custom_list"
        >
          <a-select
            showSearch
            mode="tags"
            :allowClear="true"
            placeholder="请选择河岸风险源等级"
            optionFilterProp="children"
            style="width: 100%"
            @change="riverRiskChange"
            :filterOption="riverRiskFilterOption"
          >
            <a-select-option value="1">Ⅰ级</a-select-option>
            <a-select-option value="2">Ⅱ级</a-select-option>
            <a-select-option value="3">Ⅲ级</a-select-option>
            <a-select-option value="4">Ⅳ级</a-select-option>
          </a-select>
        </a-collapse-panel>
        <a-collapse-panel header="风险地图" :style="customStyle" v-show="riskMap" class="custom_list">
          <a-card size="small" class="custom_card" style="width: 180px">
            <a-row style="width:100%">
              <a-col :span="12">边框颜色</a-col>
              <a-col :span="12" @click="chooseColor(1)">
                <p
                  style="height:20px;margin:0;border: 2px solid rgba(198, 198, 198, 0.8); background-clip: padding-box;"
                  :style="{background: borderColor}"
                ></p>
              </a-col>
            </a-row>
            <a-row style="width:100%">
              <a-col :span="12">填充颜色</a-col>
              <a-col :span="12" @click="chooseColor(2)">
                <p
                  style="height:20px;margin:0;border: 2px solid rgba(198, 198, 198, 0.8); background-clip: padding-box;"
                  :style="{background: fullColor}"
                ></p>
              </a-col>
            </a-row>
            <a-row style="width:100%">
              <a-col :span="24">边框透明度</a-col>
              <a-col :span="24">
                <a-slider
                  v-model="borderOpacity"
                  :tipFormatter="formatter"
                  :step="10"
                  :min="0"
                  :max="100"
                />
              </a-col>
            </a-row>
            <a-row style="width:100%">
              <a-col :span="24">填充不透明度</a-col>
              <a-col :span="24">
                <a-slider
                  v-model="fullOpacity"
                  :tipFormatter="formatter"
                  :step="10"
                  :min="0"
                  :max="100"
                />
              </a-col>
            </a-row>
            <a-button block @click="drawRiskMap">
              <a-icon type="edit" />绘制风险地图
            </a-button>
            <a-row
              v-show="isRiskSaveShow"
              style="width:100%; margin-top:10px;"
              type="flex"
              justify="space-between"
            >
              <a-col :span="10">
                <a-button @click="riskCradCancel" block>取消</a-button>
              </a-col>
              <a-col :span="10">
                <a-button @click="riskCradSave" block>保存</a-button>
              </a-col>
            </a-row>
          </a-card>
          <div class="color_wrap" v-show="colorAlertShow">
            <chrome-picker class v-model="riskMapColor" @input="changeColor(riskMapColor)"></chrome-picker>
          </div>
        </a-collapse-panel>
        <a-collapse-panel
          header="水质数据"
          :style="customStyle"
          v-show="waterQuality"
          class="custom_list"
        >
          <a-select
            showSearch
            mode="tags"
            :allowClear="true"
            placeholder="请选择水质数据等级"
            optionFilterProp="children"
            style="width: 100%"
            @change="waterQualityChange"
            :filterOption="waterQualityFilterOption"
          >
            <a-select-option value="1">Ⅰ-蓝色</a-select-option>
            <a-select-option value="2">Ⅱ-蓝色</a-select-option>
            <a-select-option value="3">Ⅲ-蓝色</a-select-option>
            <a-select-option value="4">Ⅳ-黄色</a-select-option>
            <a-select-option value="5">Ⅴ-橙色</a-select-option>
            <a-select-option value="6">Ⅵ-红色</a-select-option>
            <a-select-option value="7">Ⅶ-红色</a-select-option>
            <a-select-option value="8">Ⅷ-红色</a-select-option>
          </a-select>
        </a-collapse-panel>
        <a-collapse-panel header="排口" :style="customStyle" v-show="outlet" class="custom_list">
          <a-select
            showSearch
            mode="tags"
            :allowClear="true"
            placeholder="请选择排口等级"
            optionFilterProp="children"
            style="width: 100%"
            @change="waterQualityChange"
            :filterOption="waterQualityFilterOption"
          >
            <a-select-option value="1">Ⅰ级</a-select-option>
            <a-select-option value="2">Ⅱ级</a-select-option>
            <a-select-option value="3">Ⅲ级</a-select-option>
            <a-select-option value="4">Ⅳ级</a-select-option>
          </a-select>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <!-- 河岸风险源 -->
    <div class="river_risk_alert" v-show="riverRisk">
      <a-list size="small" style="padding:0 10px; max-height:240px; overflow: auto;">
        <a-list-item v-for="item in riskSourceList" :key="item.id">
          <a-row style="width:100%" type="flex" justify="space-between" align="middle">
            <a-col :span="18">
              <p style="margin:0;">{{item.name}}</p>
            </a-col>
            <a-col :span="6">
              <a-switch size="small" v-model="item.clicked" @click="onDrawType(item.id,item.clicked)"/>
            </a-col>
          </a-row>
        </a-list-item>
      </a-list>
    </div>
    <!-- 双球 -->
    <div class="showMap" id="showmap">
      <div class="half">
        <div id="roadMap" class="vmap"></div>
      </div>
      <div class="half">
        <div id="aerialMap" class="vmap"></div>
      </div>
    </div>
    <!-- 卷帘 -->
    <div id="layerMap" class="layerMap">
      <div class="main">
        <div id="lmap" class="lmap"></div>
      </div>
      <input id="swipe" class="swipe" type="range" />
    </div>

    <ul class="menu" :class="{menu_right:(sharedChecked || swipeChecked)}">
      <li @click="setCenter">
        <img src="../../assets/img/restoration.png" alt="复位" title="复位" />
      </li>
      <li @click="toolsShowFun">
        <img src="../../assets/img/draw.png" alt="工具" title="工具" />
      </li>
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
        <img
          src="../../assets/img/screenshot.png"
          id="export-png"
          @click="printImage"
          alt="截图"
          title="截图"
        />
      </li>
      <li @click="mapZoomIn">
        <img src="../../assets/img/max.png" alt="放大" title="放大" />
      </li>
      <li @click="mapZoomOut">
        <img src="../../assets/img/min.png" alt="缩小" title="缩小" />
      </li>
      <li>
        <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
          <template slot="content" style="overflow-y: scroll;">
            <a-list size="small">
              <a-list-item>
                <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                  <a-col :span="18">
                    <p style="margin:0;">查看历史数据</p>
                  </a-col>
                  <a-col :span="6">
                    <a-switch size="small" v-model="historyData" />
                  </a-col>
                </a-row>
              </a-list-item>
              <a-list-item>
                <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                  <a-col :span="18">
                    <p style="margin:0;">河道显示</p>
                  </a-col>
                  <a-col :span="6">
                    <a-switch size="small" v-model="riverShow" />
                  </a-col>
                </a-row>
              </a-list-item>
              <a-list-item>
                <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                  <a-col :span="18">
                    <p style="margin:0;">街道显示</p>
                  </a-col>
                  <a-col :span="6">
                    <a-switch size="small" v-model="streetShow" />
                  </a-col>
                </a-row>
              </a-list-item>
              <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
                <template slot="content">
                  <a-list size="small">
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">双球对比</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="sharedChecked" @click="sharedView" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">卷帘对比</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="swipeChecked" @click="layerSwipe" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                  </a-list>
                </template>
                <template slot="title">
                  <span>影像对比</span>
                </template>
                <a-list-item>
                  <p style="margin:0;">影像对比</p>
                </a-list-item>
              </a-popover>
              <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
                <template slot="content">
                  <a-list size="small">
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">手机照片</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="phonePhoto" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">无人机照片</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="UAVPhoto" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">360全景图</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="panorama" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                  </a-list>
                </template>
                <template slot="title">
                  <span>影像管理</span>
                </template>
                <a-list-item>
                  <p style="margin:0;">影像管理</p>
                </a-list-item>
              </a-popover>
              <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
                <template slot="content">
                  <a-list size="small">
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">河岸风险源</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="riverRisk" @click="onRiverRisk" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">风险地图</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="riskMap" @click="onRiskMap" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">水质数据</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="waterQuality" @click="onWaterQuality" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">水面漂浮物</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="waterFlotage" @click="onWaterFlotage" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">排口</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="outlet" @click="onOutlet" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">专项调查点</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="surveyPoint" @click="onSurveyPoint" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                  </a-list>
                </template>
                <template slot="title">
                  <span>风险管理</span>
                </template>
                <a-list-item>
                  <p style="margin:0;">风险管理</p>
                </a-list-item>
              </a-popover>
              <a-popover placement="leftBottom" arrowPointAtCenter trigger="click">
                <template slot="content">
                  <a-list size="small">
                    <a-list-item v-for="item in otherList" :key="item.id">
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">{{item.name}}</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch
                            size="small"
                            v-model="waterLandLoss"
                            @click="onWaterLandLoss(item.id)"
                          />
                        </a-col>
                      </a-row>
                    </a-list-item>
                    <!-- <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">水面率</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="waterRatio" @click="onWaterRatio" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">底泥</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="bottomMud" @click="onBottomMud" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">河道连通性</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="riverLink" @click="onRiverLink" />
                        </a-col>
                      </a-row>
                    </a-list-item>
                    <a-list-item>
                      <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                        <a-col :span="18">
                          <p style="margin:0;">水陆分布</p>
                        </a-col>
                        <a-col :span="6">
                          <a-switch size="small" v-model="landAndWater" @click="onLandAndWater" />
                        </a-col>
                      </a-row>
                    </a-list-item>-->
                  </a-list>
                </template>
                <template slot="title">
                  <span>其他</span>
                </template>
                <a-list-item>
                  <p style="margin:0;">其他</p>
                </a-list-item>
              </a-popover>
            </a-list>
          </template>
          <template slot="title">
            <span>更多</span>
          </template>
          <img src="../../assets/img/more.png" alt="更多" title="更多" @click="getMapdrawPage(gengduo)" />
        </a-popover>
      </li>
    </ul>
    <!-- 颜色选择框 -->
    <a-card
      size="small"
      title="地图绘制工具"
      v-show="toolCard"
      :style="{top: toolTop + 'px', left: toolLeft + 'px'}"
      class="custom_card tool_card"
      style="width: 180px"
    >
      <div v-show="toolIndex == 2 || toolIndex == 3">
        <a-row style="width:100%">
          <a-col :span="12">边框颜色</a-col>
          <a-col :span="12" @click="chooseColor(1)">
            <p
              style="height:20px;margin:0;border: 2px solid rgba(198, 198, 198, 0.8); background-clip: padding-box;"
              :style="{background: borderColor}"
            ></p>
          </a-col>
        </a-row>
        <a-row v-show="toolIndex == 3" style="width:100%">
          <a-col :span="12">填充颜色</a-col>
          <a-col :span="12" @click="chooseColor(2)">
            <p
              style="height:20px;margin:0;border: 2px solid rgba(198, 198, 198, 0.8); background-clip: padding-box;"
              :style="{background: fullColor}"
            ></p>
          </a-col>
        </a-row>
        <a-row style="width:100%">
          <a-col :span="24">边框透明度</a-col>
          <a-col :span="24">
            <a-slider
              v-model="borderOpacity"
              :tipFormatter="formatter"
              :step="10"
              :min="0"
              :max="100"
            />
          </a-col>
        </a-row>
        <a-row v-show="toolIndex == 3" style="width:100%">
          <a-col :span="24">填充不透明度</a-col>
          <a-col :span="24">
            <a-slider
              v-model="fullOpacity"
              :tipFormatter="formatter"
              :step="10"
              :min="0"
              :max="100"
            />
          </a-col>
        </a-row>
      </div>
      <a-row style="width:100%">
        <a-col :span="24">绘制类型</a-col>
        <a-col :span="24">
          <a-select style="width:100%;" v-model="drawTypeId">
            <a-select-option :value="item.id" v-for="item in paramPage" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row style="width:100%; margin-top:10px;" type="flex" justify="space-between">
        <a-col :span="10">
          <a-button @click="toolCradCancel" block>取消</a-button>
        </a-col>
        <a-col :span="10">
          <a-button @click="toolCradSave" block>保存</a-button>
        </a-col>
      </a-row>
      <div class="color_wrap" v-show="colorAlertShow">
        <chrome-picker class v-model="riskMapColor" @input="changeColor(riskMapColor)"></chrome-picker>
      </div>
    </a-card>
    <a-card size="small" v-show="toolsCard" class="custom_card tools_card">
      <a-button
        @click="toolsShowFun"
        shape="circle"
        size="small"
        icon="close"
        class="tools_card_close"
      />
      <a-radio-group>
        <a-radio-button value="0" @click="toolIndexFun(1)">点</a-radio-button>
        <a-radio-button value="1" @click="toolIndexFun(2)">线</a-radio-button>
        <a-radio-button value="2" @click="toolIndexFun(3)">面</a-radio-button>
        <a-radio-button value="3" @click="toolIndexFun(4)">测面</a-radio-button>
        <a-radio-button value="4" @click="toolIndexFun(5)">测距</a-radio-button>
      </a-radio-group>
    </a-card>
    <!-- 鼠标跟随弹窗 -->
    <div
      class="mouse_alert"
      v-show="alertShow"
      :style="{left: alertLeft + 'px', top: alertTop + 'px'}"
    >
      <span>{{defaultRiver}}</span>
    </div>
    <!-- 风险源信息 -->
    <risk-source-info ref="riskInfo"></risk-source-info>
    <!-- 添加风险源 -->
    <add-risk-source ref="addRisk"></add-risk-source>
    <!-- 水质监测点 -->
    <water-quality ref="waterQualityAlert"></water-quality>
    <!-- 照片编辑 -->
    <photo-edit ref="photoEdit"></photo-edit>
    <!-- 排口 -->
    <add-outlet ref="addOutlet"></add-outlet>
    <!-- 水面漂浮物 -->
    <add-floatage ref="AddFloatage"></add-floatage>
    <!-- 360全景图 -->
    <look-panorama ref="panorama"></look-panorama>
  </div>
</template>

<script>
import {
  getRiverList,
  getStreetList,
  getWaterQualityList,
  paramList,
  mapdrawSave,
  mapdrawPage,
  daydataList,
  weatherList,
  panoramaList,
  panoramaImgList,
  dataManual
} from '@/api/login'
import RiskSourceInfo from './modules/RiskSourceInfo'
import AddRiskSource from './modules/AddRiskSource'
import AddFloatage from './modules/AddFloatage'
import PhotoEdit from './modules/PhotoEdit'
import AddOutlet from './modules/AddOutlet'
import LookPanorama from './modules/LookPanorama'
import WaterQuality from './modules/waterQualityData'

import moment from 'moment' // 时间格式

import 'ol/ol.css'
import { Map, View, Feature } from 'ol'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import LayerGroup from 'ol/layer/Group'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import XYZ from 'ol/source/XYZ'
import { Style, Icon } from 'ol/style'
import Text from 'ol/style/Text'
// import { Point } from 'ol/geom'

import Point from 'ol/geom/Point'
import { fromLonLat } from 'ol/proj'
import TileJSON from 'ol/source/TileJSON'

// 拖拽缩放
// import { defaults as defaultInteractions, DragRotateAndZoom } from 'ol/interaction'

// import 'ol/ol.css'
// import Map from 'ol/Map'
// import View from 'ol/View'
// import TileLayer from 'ol/layer/Tile'
// import TileJSON from 'ol/source/TileJSON'
// import Feature from 'ol/Feature'
// import Point from 'ol/geom/Point'
// import { Vector } from 'ol/source'
// import { fromLonLat } from 'ol/proj'
// import WebGLPointsLayer from 'ol/layer/WebGLPoints'

import Vue from 'vue'
// token
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 截图
import htmlToImage from 'html-to-image'
// 颜色拾取器
import { Chrome } from 'vue-color'

// import { debounce } from '../../utils/utilsTool'

// 防抖函数
function debounce(func, wait = 500) {
  //可以放入项目中的公共方法中进行调用
  let timeout
  return function(event) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.call(this, event)
    }, wait)
  }
}

export default {
  name: 'Supervise',
  components: {
    'risk-source-info': RiskSourceInfo,
    'add-risk-source': AddRiskSource,
    'water-quality': WaterQuality,
    'photo-edit': PhotoEdit,
    'add-outlet': AddOutlet,
    'look-panorama': LookPanorama,
    'chrome-picker': Chrome,
    'add-floatage': AddFloatage
  },
  data() {
    return {
      headers: {
        // 文件上传
        authorization: 'authorization-text'
      },
      defaultTime: '', //默认日期
      otherList: [], //其他
      riskSourceList: [], //河岸风险源
      currentArea: '', //面积
      drawTypeId: '', //绘制类型
      mapdrawId: '5dde340a9ff8c45790c6b938', //基础绘制id
      paramPage: [], //绘制类型列表
      polygonList: [], //绘制面坐标
      pointList: {}, //绘制点坐标
      timeSetShow: false, // 时间弹窗显隐
      timeSetShowRight: false, // 右侧时间弹窗显隐
      timeData: [
        {
          id: 0,
          title: '2019.09',
          month: [
            { id: '30', title: '30', level: 0, clicked: false },
            { id: '29', title: '29', level: 1, clicked: false },
            { id: '28', title: '28', level: 2, clicked: false },
            { id: '27', title: '27', level: 2, clicked: false },
            { id: '26', title: '26', level: 1, clicked: false },
            { id: '25', title: '25', level: 1, clicked: false },
            { id: '24', title: '24', level: 1, clicked: false },
            { id: '23', title: '23', level: 0, clicked: false },
            { id: '22', title: '22', level: 0, clicked: false },
            { id: '21', title: '21', level: 2, clicked: false },
            { id: '20', title: '20', level: 2, clicked: false },
            { id: '19', title: '19', level: 1, clicked: false },
            { id: '18', title: '18', level: 0, clicked: false },
            { id: '17', title: '17', level: 2, clicked: false },
            { id: '16', title: '16', level: 2, clicked: false },
            { id: '15', title: '15', level: 0, clicked: false },
            { id: '14', title: '14', level: 1, clicked: false },
            { id: '13', title: '13', level: 0, clicked: false },
            { id: '12', title: '12', level: 1, clicked: false },
            { id: '11', title: '11', level: 1, clicked: false },
            { id: '10', title: '10', level: 0, clicked: false },
            { id: '09', title: '09', level: 1, clicked: false },
            { id: '08', title: '08', level: 0, clicked: false },
            { id: '07', title: '07', level: 2, clicked: false },
            { id: '06', title: '06', level: 0, clicked: false },
            { id: '05', title: '05', level: 2, clicked: false },
            { id: '04', title: '04', level: 2, clicked: false },
            { id: '03', title: '03', level: 0, clicked: false },
            { id: '02', title: '02', level: 1, clicked: false },
            { id: '01', title: '01', level: 1, clicked: false }
          ]
        },
        {
          id: 1,
          title: '2019.08',
          month: [
            { id: '31', title: '31', level: 0, clicked: false },
            { id: '30', title: '30', level: 0, clicked: false },
            { id: '29', title: '29', level: 1, clicked: false },
            { id: '28', title: '28', level: 2, clicked: false },
            { id: '27', title: '27', level: 2, clicked: false },
            { id: '26', title: '26', level: 1, clicked: false },
            { id: '25', title: '25', level: 1, clicked: false },
            { id: '24', title: '24', level: 1, clicked: false },
            { id: '23', title: '23', level: 0, clicked: false },
            { id: '22', title: '22', level: 0, clicked: false },
            { id: '21', title: '21', level: 2, clicked: false },
            { id: '20', title: '20', level: 2, clicked: false },
            { id: '19', title: '19', level: 1, clicked: false },
            { id: '18', title: '18', level: 0, clicked: false },
            { id: '17', title: '17', level: 2, clicked: false },
            { id: '16', title: '16', level: 2, clicked: false },
            { id: '15', title: '15', level: 0, clicked: false },
            { id: '14', title: '14', level: 1, clicked: false },
            { id: '13', title: '13', level: 0, clicked: false },
            { id: '12', title: '12', level: 1, clicked: false },
            { id: '11', title: '11', level: 1, clicked: false },
            { id: '10', title: '10', level: 0, clicked: false },
            { id: '09', title: '09', level: 1, clicked: false },
            { id: '08', title: '08', level: 0, clicked: false },
            { id: '07', title: '07', level: 2, clicked: false },
            { id: '06', title: '06', level: 0, clicked: false },
            { id: '05', title: '05', level: 2, clicked: false },
            { id: '04', title: '04', level: 2, clicked: false },
            { id: '03', title: '03', level: 0, clicked: false },
            { id: '02', title: '02', level: 1, clicked: false },
            { id: '01', title: '01', level: 1, clicked: false }
          ]
        }
      ],
      timeQuantum: '', // 时间段
      dateFormat: 'YYYY-MM-DD',
      startDate: '', // 开始日期
      endDate: '', // 结束日期
      timeDataRight: [
        {
          id: 0,
          title: '2019.09',
          month: [
            { id: '30', title: '30', level: 0, clicked: false },
            { id: '29', title: '29', level: 1, clicked: false },
            { id: '28', title: '28', level: 2, clicked: false },
            { id: '27', title: '27', level: 2, clicked: false },
            { id: '26', title: '26', level: 1, clicked: false },
            { id: '25', title: '25', level: 1, clicked: false },
            { id: '24', title: '24', level: 1, clicked: false },
            { id: '23', title: '23', level: 0, clicked: false },
            { id: '22', title: '22', level: 0, clicked: false },
            { id: '21', title: '21', level: 2, clicked: false },
            { id: '20', title: '20', level: 2, clicked: false },
            { id: '19', title: '19', level: 1, clicked: false },
            { id: '18', title: '18', level: 0, clicked: false },
            { id: '17', title: '17', level: 2, clicked: false },
            { id: '16', title: '16', level: 2, clicked: false },
            { id: '15', title: '15', level: 0, clicked: false },
            { id: '14', title: '14', level: 1, clicked: false },
            { id: '13', title: '13', level: 0, clicked: false },
            { id: '12', title: '12', level: 1, clicked: false },
            { id: '11', title: '11', level: 1, clicked: false },
            { id: '10', title: '10', level: 0, clicked: false },
            { id: '09', title: '09', level: 1, clicked: false },
            { id: '08', title: '08', level: 0, clicked: false },
            { id: '07', title: '07', level: 2, clicked: false },
            { id: '06', title: '06', level: 0, clicked: false },
            { id: '05', title: '05', level: 2, clicked: false },
            { id: '04', title: '04', level: 2, clicked: false },
            { id: '03', title: '03', level: 0, clicked: false },
            { id: '02', title: '02', level: 1, clicked: false },
            { id: '01', title: '01', level: 1, clicked: false }
          ]
        },
        {
          id: 1,
          title: '2019.08',
          month: [
            { id: '31', title: '31', level: 0, clicked: false },
            { id: '30', title: '30', level: 0, clicked: false },
            { id: '29', title: '29', level: 1, clicked: false },
            { id: '28', title: '28', level: 2, clicked: false },
            { id: '27', title: '27', level: 2, clicked: false },
            { id: '26', title: '26', level: 1, clicked: false },
            { id: '25', title: '25', level: 1, clicked: false },
            { id: '24', title: '24', level: 1, clicked: false },
            { id: '23', title: '23', level: 0, clicked: false },
            { id: '22', title: '22', level: 0, clicked: false },
            { id: '21', title: '21', level: 2, clicked: false },
            { id: '20', title: '20', level: 2, clicked: false },
            { id: '19', title: '19', level: 1, clicked: false },
            { id: '18', title: '18', level: 0, clicked: false },
            { id: '17', title: '17', level: 2, clicked: false },
            { id: '16', title: '16', level: 2, clicked: false },
            { id: '15', title: '15', level: 0, clicked: false },
            { id: '14', title: '14', level: 1, clicked: false },
            { id: '13', title: '13', level: 0, clicked: false },
            { id: '12', title: '12', level: 1, clicked: false },
            { id: '11', title: '11', level: 1, clicked: false },
            { id: '10', title: '10', level: 0, clicked: false },
            { id: '09', title: '09', level: 1, clicked: false },
            { id: '08', title: '08', level: 0, clicked: false },
            { id: '07', title: '07', level: 2, clicked: false },
            { id: '06', title: '06', level: 0, clicked: false },
            { id: '05', title: '05', level: 2, clicked: false },
            { id: '04', title: '04', level: 2, clicked: false },
            { id: '03', title: '03', level: 0, clicked: false },
            { id: '02', title: '02', level: 1, clicked: false },
            { id: '01', title: '01', level: 1, clicked: false }
          ]
        }
      ],
      weatherList: [
        {
          temperature: '26°',
          time: '10:00'
        },
        {
          temperature: '27°',
          time: '12:00'
        },
        {
          temperature: '24°',
          time: '14:00'
        },
        {
          temperature: '20°',
          time: '16:00'
        },
        {
          temperature: '16°',
          time: '18:00'
        },
        {
          temperature: '15°',
          time: '20:00'
        }
      ],
      startDateRight: '', // 开始日期
      endDateRight: '', // 结束日期

      customStyle: 'background: #fff;margin: 0;overflow: hidden', // 折叠面板样式
      canDownload: true, // 是否可以图片截图下载
      riskMapColor: {
        // 默认颜色
        hex: '#F32C11'
      },
      colorAlertShow: false, // 拾色器显隐
      colorIndex: 1, // 颜色选哪个
      borderColor: '#F32C11', // 边框颜色
      fullColor: '#F32C11', // 填充颜色
      borderOpacity: 80, // 边框透明度
      fullOpacity: 50, //填充透明度

      riskPolygonData: [], // 工具面数据
      riskIndexId: null, // 当前绘制id
      isRiskEdit: false, // 是否是编辑状态
      isRiskSaveShow: false, // 是否显示保存取消
      editIndex: '', //编辑的是哪个riskmap / tool

      // 地图对象
      map: null,
      map1: null,
      map2: null,
      mapLayer2d: '', // 2D影像图
      mapLayerSatellite: '', // 卫星影像图
      mapLayerWord: '', // 道路标注
      mapLayerImage: '', // 正射影像
      mapImage: '', // 正射影像url
      mapYear: '', // 地图年
      mapMonth: '', // 地图月
      mapDay: '', // 地图日
      mapType: 'b',
      roadWordChange: true, // 道路标注显隐
      sharedChecked: false, // 双球
      swipeChecked: false, // 卷帘
      showView: true,

      // openlayers 地图
      olMap1: null, // 双球左
      olMap2: null, // 双球右
      imglayerGroup: null,
      veclayerGroup: null,

      toolsCard: false, //工具卡片
      toolCard: false, //选中工具卡片
      toolTop: '', // 选中工具卡位置
      toolLeft: '', // 选中工具卡位置
      markerTool: '', // 工具-点
      lineTool: '', //工具-线
      polyline: '', // 线
      // polygon: '', // 面
      polygonTool: '', //工具-面
      lineToolNum: '', //工具-测距
      toolIndex: '', // 哪个工具
      toolIndexPointData: [], // 工具点数据
      toolIndexLineData: [], // 工具线数据
      toolIndexPolygonData: [], // 工具面数据
      toolIndexId: null, // 当前绘制id
      isToolEdit: false, // 是否是编辑状态

      mapLayer: '', // 地图图层

      historyData: false, // 历史数据
      riverShow: false, // 河道显示
      streetShow: false, // 街道显示
      phonePhoto: false, // 手机照片
      photoAlert: false, // 照片弹窗
      phonePhotoTool: '', // 手机照片工具
      UAVPhoto: false, // 无人机照片
      UAVPhotoTool: '', // 无人机照片工具
      panorama: false, // 360照片
      panoramaPoints: [
        { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.21493, lng: 121.49566 } },
        { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.22344, lng: 121.47892 } },
        { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.20649, lng: 121.47712 } }
      ],
      historyPoints: [
        { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.21493, lng: 121.49566 } },
        { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.22344, lng: 121.47892 } },
        { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.20649, lng: 121.47712 } }
      ],
      alertLeft: -1000,
      alertTop: -1000,
      alertShow: false, // 名字弹窗
      defaultRiver: '', // 河道街道名字
      once: 0, // 移入次数
      riverShowList: [], // 河道
      streetShowList: [], //街道
      phonePhotoPoints: [
        // {
        //   id: '111111111',
        //   name: '手机照片2',
        //   clicked: false,
        //   imgUrl: require('./img/phonePhoto2.jpg'),
        //   direction: 0,
        //   latlng: { lat: 31.24344, lng: 121.49892 }
        // },
        // {
        //   id: '222222222222',
        //   name: '手机照片3',
        //   clicked: false,
        //   imgUrl: require('./img/phonePhoto3.jpg'),
        //   direction: 0,
        //   latlng: { lat: 31.22649, lng: 121.49712 }
        // },
        // {
        //   id: '33333333333',
        //   name: '手机照片4',
        //   clicked: false,
        //   imgUrl: require('./img/phonePhoto4.jpg'),
        //   direction: 0,
        //   latlng: { lat: 31.19482, lng: 121.46819 }
        // },
        // {
        //   id: '4444444444444',
        //   name: '手机照片5',
        //   clicked: false,
        //   imgUrl: require('./img/phonePhoto5.jpg'),
        //   direction: 0,
        //   latlng: { lat: 31.19649, lng: 121.45995 }
        // }
      ],
      UAVPhotoPoints: [
        { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.24493, lng: 121.52566 } },
        { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.25344, lng: 121.50892 } },
        { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.23649, lng: 121.50712 } }
      ],

      riskMap: false, // 风险地图
      riskMapRiver: [
        {
          id: 0,
          name: '黄浦江',
          clicked: true,
          lineData: [
            { lat: 31.21882, lng: 121.50364 },
            { lat: 31.21265, lng: 121.50227 },
            { lat: 31.20583, lng: 121.49703 },
            { lat: 31.19915, lng: 121.49197 },
            { lat: 31.19702, lng: 121.49591 },
            { lat: 31.2164, lng: 121.50757 },
            { lat: 31.21948, lng: 121.50758 }
          ]
        },
        {
          id: 1,
          name: '大治河',
          clicked: false,
          lineData: [
            { lat: 31.25153, lng: 121.52409 },
            { lat: 31.25355, lng: 121.53085 },
            { lat: 31.25858, lng: 121.53934 },
            { lat: 31.25535, lng: 121.54334 },
            { lat: 31.2499, lng: 121.53353 },
            { lat: 31.24786, lng: 121.52737 },
            { lat: 31.24682, lng: 121.51709 },
            { lat: 31.25111, lng: 121.51711 }
          ]
        },
        {
          id: 2,
          name: '川杨河',
          clicked: false,
          lineData: [
            { lat: 31.24539, lng: 121.48686 },
            { lat: 31.24616, lng: 121.48411 },
            { lat: 31.2466, lng: 121.4824 },
            { lat: 31.24612, lng: 121.48051 },
            { lat: 31.24484, lng: 121.47901 },
            { lat: 31.24462, lng: 121.47939 },
            { lat: 31.24543, lng: 121.48089 },
            { lat: 31.2459, lng: 121.48261 },
            { lat: 31.2448, lng: 121.4857 },
            { lat: 31.2444, lng: 121.4872 }
          ]
        },
        {
          id: 3,
          name: '蕰藻浜',
          clicked: false,
          lineData: [
            { lat: 31.21717, lng: 121.51336 },
            { lat: 31.21691, lng: 121.51454 },
            { lat: 31.21768, lng: 121.51566 },
            { lat: 31.21768, lng: 121.51763 },
            { lat: 31.21733, lng: 121.51748 },
            { lat: 31.21739, lng: 121.51568 },
            { lat: 31.21664, lng: 121.51456 },
            { lat: 31.21669, lng: 121.51387 },
            { lat: 31.21699, lng: 121.51323 }
          ]
        },
        {
          id: 4,
          name: '龙华港',
          clicked: false,
          lineData: [
            { lat: 31.21493, lng: 121.49566 },
            { lat: 31.22344, lng: 121.47892 },
            { lat: 31.20649, lng: 121.47712 },
            { lat: 31.20469, lng: 121.47482 },
            { lat: 31.21469, lng: 121.51482 }
          ]
        }
      ],
      waterQuality: false, // 水质监测点
      waterQualityPoints: [
        /*{
          id: 0,
          name: '水质监测点1',
          clicked: false,
          imgUrl: require('./img/waterQualityIcon1.png'),
          latlng: { lat: 31.21935, lng: 121.50035 }
        }*/
      ],
      waterFlotage: false, // 水质漂浮物
      waterFlotagePoints: [
        { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.22222, lng: 121.52222 } },
        { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.23555, lng: 121.50555 } },
        { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.22333, lng: 121.51333 } }
      ],
      outlet: false, // 排口
      outletPoints: [
        { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.22222, lng: 121.52222 } },
        { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.23555, lng: 121.50555 } },
        { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.22333, lng: 121.51333 } }
      ],
      drawType:false,
      riverRisk: false, // 河岸风险源
      riverRiskPoints: [
        { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.20333, lng: 121.49999 } },
        { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.21666, lng: 121.48666 } },
        { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.22999, lng: 121.47333 } }
      ],
      waterLandLoss: false, // 水土流失
      waterLandLossPoints: [
        { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.09999, lng: 121.50333 } },
        { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.16666, lng: 121.48333 } },
        { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.05555, lng: 121.49666 } }
      ],
      waterRatio: false, // 水面率
      waterRatioPoints: [
        { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.26023, lng: 121.50565 } },
        { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.2396, lng: 121.5164 } },
        { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.22994, lng: 121.50955 } }
      ],
      bottomMud: false, // 底泥
      bottomMudPoints: [
        { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.23564, lng: 121.51066 } },
        { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.24315, lng: 121.49606 } },
        { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.23668, lng: 121.49656 } }
      ],
      surveyPoint: false, // 专项调查点
      surveyPointPoints: [
        {
          id: 0,
          name: '专项调查点1',
          clicked: false,
          imgUrl: require('./img/surveyPointIcon.png'),
          latlng: { lat: 31.22041, lng: 121.50384 }
        },
        {
          id: 1,
          name: '专项调查点2',
          clicked: false,
          imgUrl: require('./img/surveyPointIcon.png'),
          latlng: { lat: 31.21682, lng: 121.48964 }
        },
        {
          id: 2,
          name: '专项调查点3',
          clicked: false,
          imgUrl: require('./img/surveyPointIcon.png'),
          latlng: { lat: 31.21564, lng: 121.48648 }
        },
        {
          id: 3,
          name: '专项调查点4',
          clicked: false,
          imgUrl: require('./img/surveyPointIcon.png'),
          latlng: { lat: 31.22664, lng: 121.49048 }
        }
      ],
      gengduo: '1',
      riverLink: false, // 河道连通性
      riverLinkPoints: [
        { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.23841, lng: 121.516833 } },
        { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.24611, lng: 121.49364 } },
        { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.26, lng: 121.51684 } }
      ],
      landAndWater: false, // 水陆分布
      landAndWaterPoints: [
        { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.25031, lng: 121.51681 } },
        { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.24304, lng: 121.49392 } },
        { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.2645, lng: 121.49356 } }
      ],
      drawPage: []
    }
  },
  watch: {
    $route(){
      this.getTimeQuantum() // 获取时间段
      this.getRiverStreeList()

      this.getWaterQualityPoints()
    },
    // 历史数据
    historyData() {
      this.watchAllSwitch()
    },
    // 河道显示
    riverShow() {
      this.watchAllSwitch()
    },
    // 街道显示
    streetShow() {
      this.watchAllSwitch()
    },
    // 手机照片
    phonePhoto() {
      this.watchAllSwitch()
    },
    // 无人机照片
    UAVPhoto() {
      this.watchAllSwitch()
    },
    // 360全景图
    panorama() {
      this.watchAllSwitch()
    },
    // 风险地图
    riskMap() {
      this.watchAllSwitch()
    },
    // 水质
    waterQuality() {
      this.watchAllSwitch()
    },
    // 水质漂浮物
    waterFlotage() {
      this.watchAllSwitch()
    },
    // 排口
    outlet() {
      this.watchAllSwitch()
    },
    // 河岸风险源
    riverRisk() {
      this.watchAllSwitch()
    },
    drawType(){
      this.watchAllSwitch()
    },
    // 水土流失
    waterLandLoss() {
      this.watchAllSwitch()
    },
    // 水面率
    waterRatio() {
      this.watchAllSwitch()
    },
    // 底泥
    bottomMud() {
      this.watchAllSwitch()
    },
    // 专项调查点
    surveyPoint() {
      this.watchAllSwitch()
    },
    // 河道连通性
    riverLink() {
      this.watchAllSwitch()
    },
    // 水陆分布
    landAndWater() {
      this.watchAllSwitch()
    }
  },
  mounted() {
    let that = this
    let token = Vue.ls.get(ACCESS_TOKEN)
    // console.log(token)
    // 初始化地图控件
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
    this.mapImage = `http://jleco.jl-shgroup.com/server/data/admin/regulator/uav/data/mbtiles?year=${this.mapYear}&month=${this.mapMonth}&day=${this.mapDay}&x={x}&y={y}&z={z}&X-TENANT-ID=jl:jlgis@2019&Authorization=${token}`
    this.mapLayerImage = new T.TileLayer(this.mapImage, { minZoom: 4, maxZoom: 23, zIndex: 12 })
    this.map = new T.Map('map', {
      minZoom: 4,
      maxZoom: 23,
      layers: [this.mapLayerSatellite, this.mapLayerWord, this.mapLayerImage]
    })
    this.map.addEventListener('zoomend', this.mapZoomChange)

    this.map.centerAndZoom(new T.LngLat(121.43429, 31.15847), zoom)
    //添加比例尺控件
    this.map.addControl(new T.Control.Scale())
    this.getTimeQuantum() // 获取时间段
    this.getRiverStreeList()

    this.getWaterQualityPoints()
    this.getParamList()
    // this.getMapdrawPage()
    // console.log(this.$store.state.id, 'ssasasa')
  },
  methods: {
    //获取绘制类型
    getParamList() {
      var data = {
        type: 'draw_type'
      }
      paramList(data).then(res => {
        this.paramPage = res.data
        var arr = []
        for (const item of res.data) {
          if (
            item.id != '5da8374dea6c157d2d61007c' &&
            item.id != '5da8389eea6c157d2d61007f' &&
            item.id != '5dafe6c8ea6c159999a0549c'
          ) {
            arr.push(item)
          }
        }

        this.otherList = arr
      }).catch(err => {
        this.$message.warning('绘制类型数据加载失败')
      })
      var datarisk = {
        type: 'risk_source_type'
      }
      paramList(datarisk).then(res => {
        res.data.forEach(v => {
          v.clicked = false
        });
        this.riskSourceList = res.data
      })
      let ssss = {
        projectId: this.$store.state.id
        // year: picker[0],
        // month: picker[1],
        // day: picker[2]
      }
      panoramaList(ssss).then(res => {
        let hh = res.data.data
        hh.forEach(v => {
          v.name = v.title
          v.latlng = v.coordinate
        })
        this.panoramaPoints = hh
      })
    },
    getMapdrawPage(id) {
      var time = this.defaultTime
      var picker = time.split('-')
      var arr = {
        projectId: this.$store.state.id,
        year: picker[0],
        month: picker[1],
        day: picker[2]
      }
      if (id == '1') {
        mapdrawPage(arr).then(res => {
          let data = res.data
          let ar = []
          data.forEach(v => {
            v.shapePellucidity = v.shapePellucidity / 100
            v.framePellucidity = v.framePellucidity / 100
            if (v.innerType != undefined) {
              ar.push(v)
            }
          })
          this.drawPage = ar
        })
        this.gengduo = '2'
      }
      dataManual(arr).then(res=>{
        console.log(res.data.data);
        let arr = res.data.data 
        arr.forEach(v => {
          v.latlng = v.coordinate
          v.name = v.title
          v.clicked = false
          v.imgUrl = v.media
          v.direction =0
        });
        this.phonePhotoPoints = arr
      })
    },
    mapZoomChange() {
      // console.log(this.map.getZoom())
      if (this.map.getZoom() > 18) {
      }
    },
    getRiverStreeList() {
      getStreetList(this.$store.state.id)
        .then(res => {
          let arr = res.data.data
          arr.forEach(v => {
            if (v.region == null) {
              v.lineData = []
            } else {
              v.lineData = v.region
            }
            v.clicked = false
          })
          this.streetShowList = arr
        })
        .catch(err => {})
      getRiverList(this.$store.state.id)
        .then(res => {
          let arr = res.data.data
          arr.forEach(v => {
            if (v.region == null) {
              v.lineData = []
            } else {
              v.lineData = v.region
            }

            v.clicked = false
          })
          this.riverShowList = arr
        })
        .catch(err => {})
    },
    getWaterQualityPoints() {
      let parameter = { projectId: '', type: '' }
      parameter.projectId = this.$store.state.id
      parameter.type = '5db055a739fc3819607d93e3'
      getWaterQualityList(parameter)
        .then(res => {
          let arr = res.data.data
          this.waterQualityPoints = arr
        })
        .catch(err => {})
    },
    initMap() {
      // this.map = new Map({
      //   target: 'map',
      //   view: new View({
      //     center: [121.4955, 31.21098],
      //     zoom: 14
      //   }),
      //   layers: [
      //     new TileLayer({
      //       source: new XYZ({
      //         url: 'https://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
      //       }),
      //       isGroup: true,
      //       name: '天地图路网'
      //     }),
      //     new TileLayer({
      //       source: new XYZ({
      //         url: 'https://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
      //       }),
      //       isGroup: true,
      //       name: '天地图文字标注'
      //     })
      //   ]
      //   // interactions: defaultInteractions().extend([new DragRotateAndZoom()])
      // })
    },
    // 河岸风险源
    riverRiskChange(value) {
      console.log(value)
    },
    // 河岸风险源过滤
    riverRiskFilterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 水质监测点
    waterQualityChange(value) {
      console.log(value)
    },
    // 水质监测点过滤
    waterQualityFilterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 指北针
    compass() {},
    // 复位
    setCenter() {
      let lng = 121.095505
      let lat = 31.21098
      let zoom = 10
      this.map.panTo(new T.LngLat(lng, lat), zoom)
    },
    // 工具
    toolsShowFun() {
      this.toolsCard = !this.toolsCard
    },
    // 工具
    toolIndexFun(index) {
      this.toolIndex = index
      this.editIndex = 'tool'
      if (index === 1) {
        // 工具-点
        this.markerTool = new T.MarkTool(this.map, { follow: true })
        this.markerTool.open()
        this.markerTool.addEventListener('mouseup', this.toolDrawn)
      } else if (index === 2) {
        // 工具-线
        this.lineTool = new T.PolylineTool(this.map)
        this.lineTool.open()
        this.lineTool.setTips(`<p style="padding:0px;">单击确认起点, 双击结束绘制</p>`)
        this.lineTool.addEventListener('draw', this.toolDrawn)
      } else if (index === 3) {
        // 工具-面
        this.polygonTool = new T.PolygonTool(this.map)
        this.polygonTool.open()
        this.polygonTool.addEventListener('draw', this.toolDrawn)
      } else if (index === 4) {
        // 工具-测面
        this.polygonToolNum = new T.PolygonTool(this.map, { showLabel: true })
        this.polygonToolNum.open()
      } else if (index === 5) {
        // 工具-测距
        this.lineToolNum = new T.PolylineTool(this.map, { showLabel: true })
        this.lineToolNum.open()
        this.lineToolNum.setTips(`<p style="padding:0px;">单击确认起点, 双击结束绘制</p>`)
      }
    },
    // 绘制保存
    toolCradSave() {
      this.toolCard = false
      var time = this.defaultTime
      var picker = time.split('-')
      console.log(this.isToolEdit)
      if (this.toolIndex === 1) {
        let data = {
          id: '',
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          locationType: 'point',
          point: this.pointList.lng + ',' + this.pointList.lat,
          pointRadius: '0.4',
          drawTypeId: this.drawTypeId
        }
        mapdrawSave(data)
          .then(res => {
            this.$message.success('保存成功')
            this.mapdrawId = res.data.id
            let result = this.toolIndexPointData.findIndex(item => {
              return this.toolIndexId == item.id
            })
            let geocode = new T.Geocoder()
            geocode.getLocation(this.toolIndexPointData[result].latlng, this.searchResult)
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
      } else if (this.toolIndex === 2) {
        // 工具-线
        this.lineTool.clear()
        let result = this.toolIndexLineData.findIndex(item => {
          return this.toolIndexId == item.id
        })
        this.toolIndexLineData[result].borderColor = this.borderColor
        this.toolIndexLineData[result].borderOpacity = this.borderOpacity / 100
        console.log(result)
        console.log(this.toolIndexLineData)
        var polygon = ''
        for (const index of this.polygonList) {
          polygon = polygon + index.lng + ',' + index.lat + '|'
        }
        let data = {
          id: '',
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          locationType: 'line',
          line: polygon,
          frameColor: this.borderColor,
          framePellucidity: this.borderOpacity,
          drawTypeId: this.drawTypeId
        }
        mapdrawSave(data)
          .then(res => {
            this.$message.success('保存成功')
            this.mapdrawId = res.data.id
            let geocode = new T.Geocoder()
            geocode.getLocation(this.toolIndexLineData[result].lineData[0], this.searchResult)
            if (this.isToolEdit) {
              this.watchAllSwitch()
              return
            }
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
        // 获取地理位置

        this.polyline = new T.Polyline(this.toolIndexLineData[result].lineData, {
          id: this.toolIndexId
        })
        this.map.addOverLay(this.polyline)
        this.polyline.setColor(this.borderColor)
        this.polyline.setOpacity(this.borderOpacity / 100)
        this.polyline.addEventListener('click', this.lineClick)
      } else if (this.toolIndex === 3) {
        // 工具-面
        this.polygonTool.clear()
        let result = this.toolIndexPolygonData.findIndex(item => {
          return this.toolIndexId == item.id
        })
        console.log(result)
        // console.log(this.toolIndexPolygonData)
        var polygon = ''
        for (const index of this.polygonList) {
          polygon = polygon + index.lng + ',' + index.lat + '|'
        }
        let data = {
          id: '',
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          locationType: 'polygon',
          polygon: polygon,
          frameColor: this.borderColor,
          shapeColor: this.fullColor,
          shapePellucidity: this.fullOpacity,
          framePellucidity: this.borderOpacity,
          drawTypeId: this.drawTypeId
        }
        mapdrawSave(data)
          .then(res => {
            this.$message.success('保存成功')
            this.mapdrawId = res.data.id
            // 获取地理位置
            let geocode = new T.Geocoder()
            geocode.getLocation(this.toolIndexPolygonData[result].lineData[0], this.searchResult)
            if (this.isToolEdit) {
              this.watchAllSwitch()
              return
            }
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
        this.toolIndexPolygonData[result].borderColor = this.borderColor
        this.toolIndexPolygonData[result].fullColor = this.fullColor
        this.toolIndexPolygonData[result].borderOpacity = this.borderOpacity / 100
        this.toolIndexPolygonData[result].fullOpacity = this.fullOpacity / 100
        this.polygon = new T.Polygon(this.toolIndexPolygonData[result].lineData, {
          id: this.toolIndexId
        })
        this.map.addOverLay(this.polygon)
        this.polygon.setColor(this.borderColor)
        this.polygon.setFillColor(this.fullColor)
        this.polygon.setOpacity(this.borderOpacity / 100)
        this.polygon.setFillOpacity(this.fullOpacity / 100)
        this.polygon.addEventListener('click', this.polygonClick)
      }
      // this.getDrawId()
    },
    //风险源，排口弹窗
    searchResult(result) {
      if (result.status == 0) {
        console.log('1111')
        console.log(result)
      } else {
        this.$message.error('获取地址失败')
      }
      if (this.drawTypeId == '5da8374dea6c157d2d61007c') {
        this.$refs.addRisk.add(this.mapdrawId, this.currentArea, result)
      } else if (this.drawTypeId == '5da8389eea6c157d2d61007f') {
        this.$refs.addOutlet.add(this.mapdrawId, result)
      } else if (this.drawTypeId == '5dafe6c8ea6c159999a0549c') {
        this.$refs.AddFloatage.add(this.mapdrawId, this.currentArea, result)
      }
    },
    // 绘制取消
    toolCradCancel() {
      this.toolCard = false
      if (this.isToolEdit) {
        return
      }
      if (this.toolIndex === 1) {
        // 工具-点
        this.markerTool.clear()
        this.toolIndexPointData.splice(this.toolIndexPointData.findIndex(item => item.id === this.toolIndexId), 1)
      } else if (this.toolIndex === 2) {
        // 工具-线
        this.lineTool.clear()
        this.toolIndexLineData.splice(this.toolIndexLineData.findIndex(item => item.id === this.toolIndexId), 1)
      } else if (this.toolIndex === 3) {
        // 工具-面
        this.polygonTool.clear()
        this.toolIndexPolygonData.splice(this.toolIndexPolygonData.findIndex(item => item.id === this.toolIndexId), 1)
      } else if (this.toolIndex === 4) {
        // 工具-面积
        this.polygonTool.clear()
      } else if (this.toolIndex === 5) {
        // 工具-测距
        this.lineToolNum.clear()
      }
    },
    // 绘制结束
    toolDrawn(e) {
      this.isToolEdit = false
      this.colorAlertShow = false
      let id = new Date().valueOf()
      this.toolIndexId = id
      console.log(e)
      if (this.toolIndex === 1) {
        this.currentArea = 0
        this.toolCard = true
        this.markerTool.close()
        this.pointList = e.currentLnglat
        this.toolIndexPointData.push({
          id: id,
          latlng: e.currentLnglat
        })
      } else if (this.toolIndex === 2) {
        // 工具-线
        this.currentArea = 0
        console.log((e.currentDistance / 1000).toFixed(3)) //获取距离 km
        this.toolCard = true
        this.lineTool.close()
        this.polygonList = e.currentLnglats
        this.toolIndexLineData.push({
          id: id,
          lineData: e.currentLnglats
        })
      } else if (this.toolIndex === 3) {
        // 工具-面
        this.currentArea = (e.currentArea / 1000000).toFixed(3)
        console.log((e.currentArea / 1000000).toFixed(3)) //获取面积 平方公里
        this.toolCard = true
        this.polygonTool.close()
        this.polygonList = e.currentLnglats
        this.toolIndexPolygonData.push({
          id: id,
          lineData: e.currentLnglats
        })
      } else if (this.toolIndex === 4) {
        // 工具-面积
        this.polygonTool.close()
      } else if (this.toolIndex === 5) {
        // 工具-测距
        this.lineToolNum.close()
      }
    },
    // 点击编辑工具线
    lineClick(e) {
      console.log(e)
      this.toolCard = true
      this.colorAlertShow = false
      this.toolIndex = 2
      this.toolIndexId = e.target.options.id
      this.isToolEdit = true
    },
    // 点击编辑工具面
    polygonClick(e) {
      console.log(e)
      this.toolCard = true
      this.colorAlertShow = false
      this.toolIndex = 3
      this.toolIndexId = e.target.options.id
      this.isToolEdit = true
    },
    // 绘制工具画的点
    toolDrawPoint() {
      this.allPointTask(this.toolIndexPointData)
    },
    // 绘制工具画的线
    toolDrawLine() {
      if (this.toolIndexLineData.length !== 0) {
        for (const item of this.toolIndexLineData) {
          this.drawLine(item.lineData, item.borderColor, 3, item.borderOpacity, item.id, '')
        }
      }
    },
    // 绘制工具画的面
    toolDrawPolygon() {
      if (this.toolIndexPolygonData.length !== 0) {
        for (const item of this.toolIndexPolygonData) {
          this.setPolylineFn(
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
    },
    // 设置时间段显隐
    setTimeShow(index) {
      if (!this.historyData) {
        this.$message.warning('请先开启 查看历史数据 后再选择日期')
        this.timeSetShow = false
      }
    },
    // 设置时间段
    setTime(date, dateString) {
      console.log(date, dateString)
      this.startDate = dateString[0]
      this.endDate = dateString[1]
      this.timeQuantum = `${dateString[0]} ~ ${dateString[1]}`
      var start = dateString[0].split('-')
      var end = dateString[1].split('-')
      this.getdaydataList(start[0] + start[1] + start[2], end[0] + end[1] + end[2])
    },
    getTimeQuantum() {
      let myDate = new Date()
      let endy = myDate.getFullYear() //获取完整的年份(4位,1970-????)
      let endm = myDate.getMonth() + 1 //获取当前月份(0-11,0代表1月)
      let endd = myDate.getDate() //获取当前日(1-31)
      let starty, startm, startd
      if (endm <= 3) {
        starty = endy - 1
        startm = endm + 9
      } else {
        starty = endy
        startm = endm - 3
      }
      if (startm < 10) {
        var startm1 = '0' + startm
        var start = starty + '' + startm1 + '' + endd
      } else {
        var start = starty + '' + startm + '' + endd
      }
      if (endm < 10) {
        var endm1 = '0' + endm
        var end = endy + '' + endm1 + '' + endd
      } else {
        var end = endy + '' + endm + '' + endd
      }
      this.startDate = `${starty}-${startm}-${endd}`
      this.endDate = `${endy}-${endm}-${endd}`
      this.timeQuantum = `${this.startDate} ~ ${this.endDate}`
      this.getdaydataList(start, end)
    },
    getdaydataList(start, end) {
      let data = {
        projectId: this.$store.state.id,
        start: start,
        end: end
      }
      daydataList(data).then(res => {
        var arr = res.data.reverse()
        for (let i = 0; i < arr.length; i++) {
          if (
            arr[i].manualData != 0 &&
            arr[i].manualLocus != 0 &&
            arr[i].mapdrawData != 0 &&
            arr[i].panoramaData != 0 &&
            arr[i].uavData != 0
          ) {
            this.defaultTime =
              arr[i].date.substring(0, 4) + '-' + arr[i].date.substring(4, 6) + '-' + arr[i].date.substring(6, 8)
            break
          } else {
            if (i == arr.length - 1) {
              this.defaultTime = this.endDate
            }
          }
        }
        for (const item of res.data) {
          if (item.uavData != 0) {
            item.level = 1
          } else if (item.manualData != 0) {
            item.level = 0
          } else if (item.manualLocus != 0) {
            item.level = 0
          } else if (item.mapdrawData != 0) {
            item.level = 2
          } else if (item.panoramaData != 0) {
            item.level = 2
          } else {
            item.level = 2
          }
          item.title = item.date.substring(item.date.length - 2, item.date.length)
          item.clicked = false
        }
        this.timeData = res.data
        // this.getWeatherList()
      })
    },
    //获取天气
    // getWeatherList(){
    //   var date =  this.defaultTime.split('-')
    //   let data = {
    //     date:date[0]+date[1]+date[2],
    //     coor:'31.15847:121.43429',
    //   }
    //   weatherList(data).then(res=>{
    //     let arr = res.data
    //   })
    // },
    // 时间轴
    timeLineItem(mouth) {
      console.log(mouth.substring(0, 4) + '-' + mouth.substring(4, 6) + '-' + mouth.substring(6, 8))
      for (const item of this.timeData) {
        if (mouth == item.date) {
          if (item.level != 2) {
            if (item.date == mouth) {
              this.defaultTime = mouth.substring(0, 4) + '-' + mouth.substring(4, 6) + '-' + mouth.substring(6, 8)
              this.getMapdrawPage('1')
              this.mapYear = mouth.substring(0, 4)
              this.mapMonth = mouth.substring(4, 6)
              this.mapDay = mouth.substring(6, 8)
              this.map.removeLayer(this.mapLayerImage)
              let mapImage = `http://jleco.jl-shgroup.com/server/data/admin/regulator/uav/data/mbtiles?year=${
                this.mapYear
              }&month=${this.mapMonth}&day=${
                this.mapDay
              }&x={x}&y={y}&z={z}&X-TENANT-ID=jl:jlgis@2019&Authorization=${Vue.ls.get(ACCESS_TOKEN)}`
              this.mapLayerImage = new T.TileLayer(mapImage, { minZoom: 4, maxZoom: 23, zIndex: 12 })
              this.map.addLayer(this.mapLayerImage)
              item.clicked = true
            } else {
              item.clicked = false
            }
          }
        } else {
          item.clicked = false
        }
      }
    },
    //获取天气

    // 时间格式
    moment,
    // 更多
    onSelect(keys) {
      console.log('Trigger Select', keys)
    },
    onExpand() {
      console.log('Trigger Expand')
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
    printImage() {
      let that = this
      if (!this.canDownload) {
        return
      }
      this.canDownload = false
      this.$notification.open({
        message: '提示',
        description: '正在截取地图, 请稍等...'
      })
      var node = document.getElementById('map')
      var mapWidth = document.getElementById('map').offsetWidth
      var mapHeight = document.getElementById('map').offsetHeight
      htmlToImage
        .toPng(node, { width: mapWidth, height: mapHeight })
        .then(dataUrl => {
          var link = document.createElement('a')
          link.download = 'map' + this.getNowTime() + '.png'
          link.href = dataUrl
          link.click()
          link.remove()
          setTimeout(() => {
            this.canDownload = true
          }, 1500)
        })
        .catch(function(error) {
          console.error('oops, something went wrong!', error)
        })
    },
    // 获取当前时间
    getNowTime() {
      let myDate = new Date()
      let y = myDate.getFullYear() //获取完整的年份(4位,1970-????)
      let m = this.setTimeLayout(myDate.getMonth() + 1) //获取当前月份(0-11,0代表1月)
      let d = this.setTimeLayout(myDate.getDate()) //获取当前日(1-31)
      let hh = this.setTimeLayout(myDate.getHours()) //获取当前小时数(0-23)
      let mm = this.setTimeLayout(myDate.getMinutes()) //获取当前分钟数(0-59)
      let ss = this.setTimeLayout(myDate.getSeconds()) //获取当前秒数(0-59)
      let timeStr = y + m + d + hh + mm + ss
      return timeStr
    },
    // 设置时间格式
    setTimeLayout(time) {
      if (Number(time) < 10) {
        time = '0' + time
      }
      return time.toString()
    },
    // 放大
    mapZoomIn() {
      this.map.zoomIn()
    },
    // 缩小
    mapZoomOut() {
      this.map.zoomOut()
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
    getTdLayer(lyr) {
      var url =
        'http://t{0-7}.tianditu.com/DataServer?T=' + lyr + '&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822'
      var layer = new TileLayer({
        source: new XYZ({
          url: url
        })
      })
      return layer
    },
    showMap() {
      // this.map.removeLayer(map1);
      // this.map.removeLayer(map2);
      var vec_c = this.getTdLayer('vec_w')
      var cva_c = this.getTdLayer('cva_w')
      var img_c = this.getTdLayer('img_w')

      let veclayerGroup = new LayerGroup({
        layers: [vec_c, cva_c]
      })
      let imglayerGroup = new LayerGroup({
        layers: [img_c, cva_c]
      })
      var view = new View({
        projection: 'EPSG:4326',
        center: [121.495505, 31.21098],
        zoom: 14
      })
      this.olMap1 = new Map({
        target: 'roadMap',
        layers: [veclayerGroup],
        view: view
      })
      console.log(this.olMap1)
      this.olMap2 = new Map({
        target: 'aerialMap',
        layers: [imglayerGroup],
        view: view
      })
    },
    // 双球
    sharedView() {
      if (this.sharedChecked == true) {
        this.showView = false
        this.swipeChecked = false
        var layerMap = document.getElementById('layerMap')
        layerMap.style.display = 'none'
        var show = document.getElementById('showmap')
        show.style.display = 'block'
        this.showMap()
      } else if (this.sharedChecked == false) {
        var show = document.getElementById('showmap')
        show.style.display = 'none'
        this.showView = true
        this.olMap1.removeLayer(this.veclayerGroup)
        this.olMap2.removeLayer(this.imglayerGroup)
      }
    },
    // 卷帘
    showSwipeMap() {
      var vec_c = this.getTdLayer('vec_w')
      var cva_c = this.getTdLayer('cva_w')
      var img_c = this.getTdLayer('img_w')

      var veclayerGroup = new LayerGroup({
        layers: [vec_c, cva_c]
      })
      var imglayerGroup = new LayerGroup({
        layers: [img_c, cva_c]
      })

      var lmap = new Map({
        target: 'lmap',
        layers: [imglayerGroup, veclayerGroup],
        view: new View({
          projection: 'EPSG:4326',
          center: [121.495505, 31.21098],
          zoom: 14
        })
      })
      var swipe = document.getElementById('swipe')
      vec_c.on('prerender', function(event) {
        var ctx = event.context
        var width = ctx.canvas.width * (swipe.value / 100)

        ctx.save()
        ctx.beginPath()
        ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height)
        ctx.clip()
      })
      vec_c.on('postrender', function(event) {
        var ctx = event.context
        ctx.restore()
      })
      swipe.addEventListener(
        'input',
        function() {
          lmap.render()
        },
        false
      )
    },
    layerSwipe() {
      if (this.swipeChecked == true) {
        this.showView = false
        this.sharedChecked = false
        var show = document.getElementById('showmap')
        show.style.display = 'none'
        var layerMap = document.getElementById('layerMap')
        layerMap.style.display = 'block'
        this.showSwipeMap()
      }
      if (this.swipeChecked == false) {
        var layerMap = document.getElementById('layerMap')
        layerMap.style.display = 'none'

        this.showView = true
      }
    },
    // 更多-历史数据
    onHistoryData() {
      if (this.historyData) {
        this.testarr(this.historyPoints)
      }
    },
    testarr(pointLists) {
      console.log(123123)
      // for (const item of pointLists) {

      // }
      var obj = {
        fenceId: '12',
        name: '围栏3',
        center: '',
        radius: '',
        type: 'polyline',
        points: '113.960623,22.546082;113.958197,22.544029;113.956526,22.543245;113.953562,22.544563'
      }
      this.showFence(obj)
    },
    showFence(obj) {
      if (obj.type == 'polygon') {
        this.showPolygon(obj.fenceId, obj.points, obj.name)
      }
      if (obj.type == 'circle') {
        this.showCircle(obj.fenceId, obj.center, obj.radius, obj.name)
      }
      if (obj.type == 'polyline') {
        this.showPolyline(obj.fenceId, obj.points, obj.name)
      }
    },
    // //转换坐标点（多）
    // transPoints(points) {
    //     let arr = points.split(';');
    //     let point = [];
    //     arr.forEach(item = > {
    //         let newPoint = item.split(',');
    //         point.push(newPoint)
    //     })
    //     let _points = point.map(item = > {
    //         item = [parseFloat(item[0]), parseFloat(item[1])]
    //         item = ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857');
    //         return item;
    //     })
    //     return _points;
    // },
    //转换圆的
    transPoint(point) {
      let item = point.split(',')
      item = [parseFloat(item[0]), parseFloat(item[1])]
      let _point = ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857')
      return _point
    },
    showCircle(fenceId, center, radius, name) {
      let centerPoint = this.transPoint(center)
      radius = parseFloat(radius)
      var circleFeature = new ol.Feature({
        //路线
        geometry: new ol.geom.Circle(centerPoint, radius)
      })
      circleFeature.setId(fenceId)
      //将所有矢量图层添加进去
      this.source.addFeature(circleFeature)
    },
    showPolygon(fenceId, points, name) {
      let _points = this.transPoints(points)
      _points = [_points]
      //多边形的数据格式是[[[lng,lat],[lng,lat]……]]外围两个中括号
      var polygonFeature = new ol.Feature({
        //路线
        geometry: new ol.geom.Polygon(_points)
      })
      polygonFeature.setId(fenceId)
      this.source.addFeature(polygonFeature)
      console.log(this.source.getFeatures())
    },
    showPolyline(fenceId, points, name) {
      let _points = this.transPoints(points)
      var lineFeature = new ol.Feature({
        //路线
        geometry: new ol.geom.LineString(_points, 'XY')
      })
      lineFeature.setId(fenceId)

      //将所有矢量图层添加进去
      this.source.addFeature(lineFeature)
    },
    // 添加标注
    drawAllPoint(latlng, index, id) {
      let markerTool = new T.Marker(latlng, { title: index, id: id })
      this.map.addOverLay(markerTool)
      markerTool.addEventListener('click', this.taskPointClick)
    },
    // 河道显示
    onRiverShow() {
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
        this.removeOverLays(this.riverShowList)
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
    // 街道显示
    onStreetShow() {
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
        this.removeOverLays(this.streetShowList)
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
    // 手机照片
    onPhonePhoto() {
      if (this.phonePhoto) {
        this.allImageTask(this.phonePhotoPoints)
      } else {
        this.removeOverLays(this.phonePhotoPoints)
      }
    },
    // 无人机照片
    onUAVPhoto() {
      if (this.UAVPhoto) {
        this.allPointTask(this.UAVPhotoPoints)
      } else {
        this.removeOverLays(this.UAVPhotoPoints)
      }
    },
    // 360全景图
    onPanorama() {
      if (this.panorama) {
        let markerTool
        for (const item of this.panoramaPoints) {
          markerTool = new T.Marker(item.latlng, { title: item.name, id: item.id })
          this.map.addOverLay(markerTool)
          markerTool.addEventListener('click', this.panoramaPointClick)
        }
      } else {
        this.removeOverLays(this.panoramaPoints)
      }
    },
    // 360点点击事件
    panoramaPointClick(e) {   
      this.$router.push({
        path: '/supervise/Vtour',
        query: {
          id: e.target.options.id
        }
      })
    },
    // 风险地图
    onRiskMap() {
      if (this.riskMap) {
        for (const item of this.riskMapRiver) {
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
        }
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
      } else {
        this.removeOverLays(this.riskMapRiver)
        this.removeOverLays(this.riskPolygonData)
      }
    },
    // 绘制线
    drawLine(points, color, weight, opacity, id, name) {
      let line = new T.Polyline(points, {
        color: color, //线颜色
        weight: weight, //线宽
        opacity: opacity, //透明度
        id: id,
        name: name
      })
      //向地图上添加线
      this.map.addOverLay(line)
      line.addEventListener('click', this.lineClick)
    },
    // 设置绘制的多边形
    setPolylineFn(lineData, color, weight, opacity, fillColor, fillOpacity, title, id) {
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
      polygon.addEventListener('click', this.polygonClick)
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
      polygon.addEventListener('click', this.riskPolygonClick)
    },
    // 绘制风险地图
    drawRiskMap() {
      this.colorAlertShow = false
      //创建标注工具对象
      this.polygonTool = new T.PolygonTool(this.map, {
        // showLabel: true,
        color: this.borderColor,
        weight: 3,
        opacity: this.borderOpacity / 100,
        fillColor: this.fullColor,
        fillOpacity: this.fullOpacity / 100
      })
      this.polygonTool.open()
      this.polygonTool.setTips(`<p style="padding:0px 4px;">单击确认起点, 双击结束绘制</p>`)
      this.polygonTool.addEventListener('draw', this.drawRiskMapEnd)
      // this.polylineHandler.addEventListener('addpoint', this.addDrawRivering)
    },
    // 绘制结束
    drawRiskMapEnd(e) {
      console.log(e.currentLnglats)
      this.isRiskEdit = false
      this.colorAlertShow = false
      let id = new Date().valueOf()
      this.riskIndexId = id
      this.polygonTool.close()
      this.riskPolygonData.push({
        id: id,
        lineData: e.currentLnglats
      })
      this.isRiskSaveShow = true
    },
    // 风险地图绘制保存
    riskCradSave() {
      this.isRiskSaveShow = false
      this.colorAlertShow = false
      console.log(this.isRiskEdit)
      this.polygonTool.clear()
      let result = this.riskPolygonData.findIndex(item => {
        return this.riskIndexId == item.id
      })
      console.log(result)
      console.log(this.riskPolygonData)
      this.riskPolygonData[result].borderColor = this.borderColor
      this.riskPolygonData[result].fullColor = this.fullColor
      this.riskPolygonData[result].borderOpacity = this.borderOpacity / 100
      this.riskPolygonData[result].fullOpacity = this.fullOpacity / 100
      if (this.isRiskEdit) {
        this.watchAllSwitch()
        return
      }
      this.polygon = new T.Polygon(this.riskPolygonData[result].lineData, {
        id: this.riskIndexId
      })
      this.map.addOverLay(this.polygon)
      this.polygon.setColor(this.borderColor)
      this.polygon.setFillColor(this.fullColor)
      this.polygon.setOpacity(this.borderOpacity / 100)
      this.polygon.setFillOpacity(this.fullOpacity / 100)
      this.polygon.addEventListener('click', this.riskPolygonClick)
    },
    // 风险地图绘制取消
    riskCradCancel() {
      this.isRiskSaveShow = false
      this.colorAlertShow = false
      if (this.isRiskEdit) {
        return
      }
      this.polygonTool.clear()
      this.riskPolygonData.splice(this.riskPolygonData.findIndex(item => item.id === this.riskIndexId), 1)
    },
    // 风险地图编辑颜色
    riskPolygonClick(e) {
      this.riskIndexId = e.target.options.id
      this.isRiskEdit = true
      this.isRiskSaveShow = true
    },
    // 点击选择颜色
    chooseColor(index) {
      this.colorAlertShow = true
      if (index == 1) {
        this.colorIndex = 1
      } else {
        this.colorIndex = 2
      }
    },
    // 显示百分比
    formatter(value) {
      return `${value}%`
    },
    // 选择颜色
    changeColor: debounce(function(index) {
      if (this.colorIndex == 1) {
        this.borderColor = index.hex
      } else if (this.colorIndex == 2) {
        this.fullColor = index.hex
      }
    }, 300),
    // 水质
    onWaterQuality() {
      if (this.waterQuality) {
        for (const item of this.waterQualityPoints) {
          let icon = new T.Icon({
            iconUrl: item.imgUrl,
            iconSize: new T.Point(41, 40),
            iconAnchor: new T.Point(21, 40)
          })
          let marker = new T.Marker(item.latlng, { icon: icon, id: item.id, title: item.name })
          this.map.addOverLay(marker)
          marker.addEventListener('click', this.waterQualityClick)
        }
      } else {
        this.removeOverLays(this.waterQualityPoints)
      }
    },
    // 水质监测点点击
    waterQualityClick() {
      this.$refs.waterQualityAlert.add()
    },
    // 水质漂浮物
    onWaterFlotage() {
      if (this.waterFlotage) {
        let point = []
        for (const item of this.drawPage) {
          if (item.drawType.id == '5dafe6c8ea6c159999a0549c') {
            if (item.locationType.code == 'point') {
              item.latlng = {
                lng: item.point[0],
                lat: item.point[1]
              }
              point.push(item)
            }
            if (item.locationType.code == 'line') {
              // line.push(item)
              this.lineDraw(item.line, item.frameColor, 3, item.framePellucidity, item.id, '', item.innerType.code)
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
            }
          }
        }
        this.spotDraw(point)
      } else {
        this.removeOverLays(this.drawPage)
      }
    },
    // 排口
    onOutlet() {
      if (this.outlet) {
        let point = []
        for (const item of this.drawPage) {
          if (item.drawType.id == '5da8389eea6c157d2d61007f') {
            if (item.locationType.code == 'point') {
              item.latlng = {
                lng: item.point[0],
                lat: item.point[1]
              }
              point.push(item)
            }
            if (item.locationType.code == 'line') {
              // line.push(item)
              this.lineDraw(item.line, item.frameColor, 3, item.framePellucidity, item.id, '', item.innerType.code)
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
            }
          }
        }
        this.spotDraw(point)
      } else {
        this.removeOverLays(this.drawPage)
      }
    },
    //绘制点
    spotDraw(pointLists) {
      console.log(pointLists)
      for (const item of pointLists) {
        this.drawAllPoint1(item.latlng, item.innerCode, item.id, item.innerType.code)
      }
    },
    drawAllPoint1(latlng, index, id, code) {
      let markerTool = new T.Marker(latlng, { title: index, id: id, code: code })
      this.map.addOverLay(markerTool)
      if (code == 'risk') {
        markerTool.addEventListener('click', this.sourceRiskClick)
      }
    },
    //绘制线
    lineDraw(points, color, weight, opacity, id, name) {
      let line = new T.Polyline(points, {
        color: color, //线颜色
        weight: weight, //线宽
        opacity: opacity, //透明度
        id: id,
        name: name,
        code: code
      })
      //向地图上添加线
      this.map.addOverLay(line)
      if (code == 'risk') {
        line.addEventListener('click', this.sourceRiskClick)
      }
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
      if (code == 'risk') {
        polygon.addEventListener('click', this.sourceRiskClick)
      }
      
    },
    //排口水面漂浮物风险源弹窗
    sourceRiskClick(row) {
      this.$refs.riskInfo.riskInfo(row)
    },
    // 河岸风险源
    onRiverRisk() {
      if (this.riverRisk) {
        // let point = []
        // for (const item of this.drawPage) {
        //   console.log(item);
          
        //   if (item.drawType.id == '5da8374dea6c157d2d61007c') {
        //     if (item.locationType.code == 'point') {
        //       console.log('1');
              
        //       item.latlng = {
        //         lng: item.point[0],
        //         lat: item.point[1]
        //       }
        //       point.push(item)
        //     }
        //     if (item.locationType.code == 'line') {
        //       // line.push(item)
        //       this.lineDraw(item.line, item.frameColor, 3, item.framePellucidity, item.id, '', item.innerType.code)
        //     }
        //     if (item.locationType.code == 'polygon') {
        //       this.noodlesDraw(
        //         item.polygon,
        //         item.frameColor,
        //         3,
        //         item.framePellucidity,
        //         item.shapeColor,
        //         item.shapePellucidity,
        //         '',
        //         item.id,
        //         item.innerType.code
        //       )
        //     }
        //   }
        // }
        // this.spotDraw(point)
      } else {
        this.removeOverLays(this.drawPage)
      }
    },
    // 河岸风险源
    onDrawType(id,clicked) {
      if (clicked) {
        let point = []
        for (const item of this.drawPage) {
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
              }
          }
        }
        this.spotDraw(point)
        
      } else {
        let data = []
        for (const item of this.drawPage) {
         if (item.drawType.id == id) {
          data.push(item)
          }
        }
        this.removeOverLays(data) 
      }
    },
    // 水土流失
    onWaterLandLoss() {
      if (this.waterLandLoss) {
        this.allPointTask(this.waterLandLossPoints)
      } else {
        this.removeOverLays(this.waterLandLossPoints)
      }
    },
    // 水面率
    onWaterRatio() {
      if (this.waterRatio) {
        this.allPointTask(this.waterRatioPoints)
      } else {
        this.removeOverLays(this.waterRatioPoints)
      }
    },
    // 底泥
    onBottomMud() {
      if (this.bottomMud) {
        this.allPointTask(this.bottomMudPoints)
      } else {
        this.removeOverLays(this.bottomMudPoints)
      }
    },
    // 专项调查点
    onSurveyPoint() {
      if (this.surveyPoint) {
        for (const item of this.surveyPointPoints) {
          let icon = new T.Icon({
            iconUrl: item.imgUrl,
            iconSize: new T.Point(41, 40),
            iconAnchor: new T.Point(21, 40)
          })
          let marker = new T.Marker(item.latlng, { icon: icon, id: item.id, title: item.name })
          this.map.addOverLay(marker)
          marker.addEventListener('click', this.taskPointClick)
        }
      } else {
        this.removeOverLays(this.surveyPointPoints)
      }
    },
    // 河道连通性
    onRiverLink() {
      if (this.riverLink) {
        this.allPointTask(this.riverLinkPoints)
      } else {
        this.removeOverLays(this.riverLinkPoints)
      }
    },
    // 水陆分布
    onLandAndWater() {
      if (this.landAndWater) {
        this.allPointTask(this.landAndWaterPoints)
      } else {
        this.removeOverLays(this.landAndWaterPoints)
      }
    },
    // 监听所有的开关属性
    watchAllSwitch() {
      // this.map.clearOverLays()
      // 绘制工具画的点
      // this.toolDrawPoint()
      // // 绘制工具画的线
      // this.toolDrawLine()
      // // 绘制工具画的面
      // this.toolDrawPolygon()
      // 历史数据
      this.onHistoryData()
      // 街道显示
      this.onStreetShow()
      // 河道显示
      this.onRiverShow()
      // 手机照片
      this.onPhonePhoto()
      // 无人机照片
      this.onUAVPhoto()
      // 360全景图
      this.onPanorama()
      // 风险地图
      this.onRiskMap()
      // 水质
      this.onWaterQuality()
      // 水质漂浮物
      this.onWaterFlotage()
      // 排口
      this.onOutlet()
      // 河岸风险源
      this.onRiverRisk()
      // 水土流失
      this.onWaterLandLoss()
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
    allPointTask(pointLists) {
      for (const item of pointLists) {
        this.drawAllPoint(item.latlng, item.name, item.id)
      }
    },
    // 添加标注
    drawAllPoint(latlng, index, id) {
      let markerTool = new T.Marker(latlng, { title: index, id: id })
      this.map.addOverLay(markerTool)
      markerTool.addEventListener('click', this.taskPointClick)
    },
    // 任务点点击事件
    taskPointClick(index) {
      console.log(index)
      this.$refs.riskInfo.riskInfo()
    },
    // 绘制图片
    allImageTask(pointLists) {
      console.log(pointLists)
      let arrayObj = new Array()
      let styles = new Array()
      for (const item of pointLists) {
        let icon = new T.Icon({
          iconUrl: item.imgUrl,
          iconSize: new T.Point(70, 45),
          iconAnchor: new T.Point(35, 45)
        })
        styles = [
          {
            url: item.imgUrl,
            size: [70, 45], //图片大小
            offset: new T.Point(35, 45), //显示图片的偏移量
            textColor: '#000000', //显示数字的颜色
            textSize: 8, //显示文字的大小
            range: [0, 50]
          }
        ]
        let marker = new T.Marker(item.latlng, { icon: icon, id: item.id, title: item.name })
        arrayObj.push(marker)
        marker.addEventListener('click', this.taskImageClick)
      }
      var markers = new T.MarkerClusterer(this.map, { markers: arrayObj, styles: styles })
    },
    // 任务照片点击
    taskImageClick(index) {
      console.log(index)
      // this.photoAlert = true
      this.$refs.photoEdit.showVisible()
      // for (const item of this.historyPoints) {
      //   if (index.lnglat.lat === item.latlng.lat && index.lnglat.lng === item.latlng.lng) {
      //     console.log(index.lnglat.lat, index.lnglat.lng)
      //     this.$refs.riskInfo.riskInfo()
      //   }
      // }
    },
    // 上传手机照片
    phoneUpload(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    }
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
.vmap {
  width: 100%;
  height: 100%;
}
.showMap {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 555;
  display: none;
}
.main {
  width: 100%;
  height: calc(100vh - 64px);
}
.layerMap {
  display: none;
}
.lmap {
  width: 100%;
  height: 95%;
}
.swipe {
  position: absolute;
  bottom: 10px;
  left: 0;
  z-index: 888;
  width: 100%;
}
@media (min-width: 800px) {
  .half {
    padding: 0 10px;
    width: 50%;
    height: calc(100vh - 64px);
    float: left;
  }
}
#map {
  width: 100%;
  height: 100%;
  position: relative;
}
.weather {
  position: absolute;
  left: 80px;
  top: 10px;
  width: 400px;
  height: 65px;
  z-index: 888;
  background-color: rgba(255, 255, 255, 1);
  opacity: 0.9;
  border-radius: 10px;
  border: 1px solid rgb(204, 204, 204);
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2);
  padding: 13px;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  align-items: center;
  -webkit-align-items: center;
  justify-items: center;
  -webkit-justify-items: center;
  img {
    width: 40px;
    height: 40px;
  }
  h3 {
    font-size: 45px;
    line-height: 45px;
    margin: 0;
  }
  .text {
    width: 225px;
    height: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: column;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    div {
      font-size: 15px;
      line-height: 17px;
      font-weight: 600;
      color: rgba(45, 45, 45, 1);
      margin: 0;
      .weather_detail {
        margin-left: 14px;
      }
      .date {
        margin-left: 16px;
        color: rgba(140, 159, 173, 1);
      }
    }
    p {
      font-weight: 600;
      color: rgba(45, 45, 45, 1);
      line-height: 17px;
      font-size: 15px;
      margin: 0;
    }
  }
  .weather_right {
    position: relative;
    width: 46px;
    height: 100%;
    border-left: 1px solid rgba(216, 216, 216, 0.56);
    display: flex;
    display: -webkit-flex;
    align-items: center;
    -webkit-align-items: center;
    padding-left: 10px;
    .right_icon {
      font-size: 18px;
      padding: 10px;
      transition: 0.5s;
      -moz-transition: 0.5s; /* Firefox 4 */
      -webkit-transition: 0.5s; /* Safari and Chrome */
    }
  }
  .weather_right:hover {
    .weather_alert {
      display: block;
    }
    .right_icon {
      color: #1890ff;
      transform: rotate(180deg);
      -ms-transform: rotate(180deg); /* IE 9 */
      -moz-transform: rotate(180deg); /* Firefox */
      -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
    }
  }
  .weather_alert {
    display: none;
    position: absolute;
    left: 50px;
    top: -13px;
    z-index: 888;
    padding-left: 20px;
    .weather_content {
      width: 320px;
      height: 300px;
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
}
.time_line {
  position: absolute;
  // left: 0;
  top: 0;
  width: 68px;
  height: calc(100% - 40px);
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 888;
  ul {
    width: 100%;
    height: calc(100% - 35px);
    overflow: auto;
    margin: 0;
    padding: 0;
    list-style-type: none;
    li {
      width: 100%;
      position: relative;
      font-size: 0;
      text-align: center;
      .time_item {
        position: relative;
        display: block;
        width: 100%;
        cursor: pointer;
        text-align: center;
        padding: 5px 0;
        .line_style {
          display: block;
          text-align: center;
          width: 20px;
          margin: auto;
          .line {
            width: 20px;
            height: 2px;
          }
          .time_bg_red {
            background-color: rgb(249, 56, 56);
          }
          .time_bg_blue {
            background-color: rgb(116, 196, 73);
          }
          .time_bg_gray {
            background-color: rgb(204, 204, 204);
            width: 4px;
          }
        }
        p {
          display: none;
          margin: 0;
          width: 100%;
          font-size: 12px;
          text-align: center;
          span {
            display: inline-block;
            width: 20px;
            height: 20px;
            color: white;
          }
        }
        .time_bg_red {
          background-color: rgb(249, 56, 56);
        }
        .time_bg_blue {
          background-color: rgb(116, 196, 73);
        }
        .time_bg_gray {
          background-color: rgb(204, 204, 204);
        }
      }
      .time_item:hover {
        p {
          display: block;
        }
        .line_style {
          display: none;
        }
      }
      .time_item_clicked {
        p {
          display: block;
        }
        .line_style {
          display: none;
        }
      }
    }
  }
  .time_set {
    position: absolute;
    bottom: 4px;
    width: 100%;
    height: 30px;
    text-align: center;
  }
}
.time_line_right {
  right: 0;
}
.river_risk_alert {
  position: absolute;
  right: 220px;
  top: 10px;
  width: 180px;
  background-color: white;
  z-index: 889;
  border-radius: 4px;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.5);
}
.accordion_alert {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 200px;
  background-color: white;
  z-index: 889;
  border-radius: 4px;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.5);
}
.tools_card {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 10px;
  margin: auto;
  text-align: center;
  width: 278px;
  background-color: white;
  z-index: 889;
  border-radius: 4px;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.5);
  .tools_card_close {
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 890;
  }
}
.tool_card {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 180px;
  background-color: white;
  z-index: 889;
  border-radius: 4px;
  box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.5);
}

.color_wrap {
  position: absolute;
  right: 190px;
  top: 2px;
}
.time_quantum {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 666;
  color: #333;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.9);
}
.compass_pointer {
  position: absolute;
  right: 10px;
  top: 10px;
  width: 56px;
  height: 56px;
  z-index: 888;
  border-radius: 50%;
  padding: 13px;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
  background: white url('../../assets/img/leftRightArrows.png') no-repeat center center / 80%;
  text-align: center;
  .pointer {
    width: 30px;
    height: 30px;
    transform: rotate(0deg);
  }
}
.menu {
  position: fixed;
  right: 20px;
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
.menu_right {
  right: 80px;
}

.ant-col-6 {
  text-align: right;
}
</style>
