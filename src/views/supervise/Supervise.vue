<template>
  <div class="supervise">
    <div id="map" ref="worldMap" v-show="!sharedChecked && !swipeChecked">
      <div class="time_quantum" v-show="!canDownload">{{historyData?timeQuantum:defaultTime}}</div>
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
        <li>
          <a-tooltip
            placement="left"
            class="time_item"
            trigger="hover"
            v-for="day in timeDataRight"
            :key="day.date"
            @click="timeLineItemRight(day.date)"
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
      <img :src="weatherData.img" alt="天气" />
      <h3>{{weatherData.temperature}}</h3>
      <div class="text">
        <div class="top">
          <span class="degree_logo">℃</span>
          <span class="weather_detail">{{weatherData.text}}(实时)</span>
          <span class="date">{{defaultTime}}</span>
        </div>
        <div style="display:flex;justify-content:space-between">
          <div class="weather_basic_content">
            <img src="./img/wind.png" alt style="margin-right:5px;height:12px;width:12px" />
            <span>{{weatherData.wind_direction}}风 {{weatherData.wind_scale}}级</span>
          </div>
          <div class="weather_basic_content">
            <img src="./img/cloudiness.png" alt style="margin-right:5px;height:12px;width:12px" />
            <span>{{weatherData.clouds}}%</span>
          </div>
        </div>
      </div>
      <div class="weather_right">
        <!-- <a-icon class="right_icon" type="caret-left" /> -->
        <!-- 天气弹窗 -->
        <div class="weather_alert" v-show="false">
          <div class="weather_content">
            <div class="weather_basic">
              <div class="weather_basic_content">
                <img src="./img/water.png" alt style="margin-right:5px;height:12px;width:12px" />
                <span></span>
              </div>
              <div class="weather_basic_content">
                <img src="./img/wind.png" alt style="margin-right:5px;height:12px;width:12px" />
                <span>{{weatherData.wind_direction}}风 {{weatherData.wind_scale}}级</span>
              </div>
              <div class="weather_basic_content">
                <img src="./img/cloudiness.png" alt style="margin-right:5px;height:12px;width:12px" />
                <span>{{weatherData.clouds}}</span>
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
      <a-collapse accordion class="custom_collapse" v-model="accordionAlertKey">
        <a-collapse-panel
          header="手机照片"
          :style="customStyle"
          v-show="phonePhoto"
          class="custom_list"
          key="phonePhoto"
        >
          <el-upload
            class="upload-demo"
            ref="upload"
            :data="phonePhotoData"
            name="media"
            :headers="headers"
            action="/server/data/admin/regulator/manual/data/save"
            :on-error="phonePhotoError"
            :on-success="phonePhotoSuccess"
            :file-list="fileList"
            :limit="1"
          >
            <a-button style="width:198px;" block>
              <a-icon type="upload" />上传照片
            </a-button>
          </el-upload>
          <!-- <a-upload
            name="media"
            :data="phonePhotoData"
            action="/server/data/admin/regulator/manual/data/save"
            :headers="headers"
            @change="phonePhotoChange"
          >
            <a-button style="width:198px;" block>
              <a-icon type="upload" />上传照片
            </a-button>
          </a-upload>-->
          <p
            style="margin:5px 0;text-align:center;font-size:14px;"
            v-show="phonePhotoPointsList.length > 0"
          >无法定位的照片</p>
          <a-list size="small" class="phone_wrap" v-show="phonePhotoPointsList.length > 0">
            <a-list-item class="phone_list" v-for="item in phonePhotoPointsList" :key="item.id">
              <img :src="item.imgUrl" alt />
              <a-row style="width:100%" type="flex" justify="space-between" align="middle">
                <!-- <a-col :span="6">坐标点</a-col> -->
                <a-col :span="24">
                  <a-input placeholder="选择坐标点" read-only v-model="item.latlng"></a-input>
                </a-col>
                <a-col :span="12">
                  <a-button block style="padding: 0" @click="phoneChooseCoordinate(item.id)">
                    <a-icon type="environment" />选择坐标
                  </a-button>
                </a-col>
                <a-col :span="12">
                  <a-button block @click="phoneConfirm(item.id)">确定</a-button>
                </a-col>
              </a-row>
            </a-list-item>
          </a-list>
        </a-collapse-panel>
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
          header="风险地图"
          :style="customStyle"
          v-show="riskMap"
          class="custom_list"
          key="riskMap"
        >
          <a-card size="small" class="custom_card" style="width: 198px">
            <a-row style="width:100%">
              <a-col :span="12">边框颜色</a-col>
              <a-col :span="12" @click="chooseColor(1)">
                <p
                  style="height:20px;margin:0;border: 2px solid rgba(198, 198, 198, 0.8); background-clip: padding-box;"
                  :style="{background: borderColor, Opacity: borderOpacity / 100}"
                ></p>
              </a-col>
            </a-row>
            <a-row style="width:100%">
              <a-col :span="12">填充颜色</a-col>
              <a-col :span="12" @click="chooseColor(2)">
                <p
                  style="height:20px;margin:0;border: 2px solid rgba(198, 198, 198, 0.8); background-clip: padding-box;"
                  :style="{background: fullColor, Opacity: fullOpacity / 100}"
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
              <a-button
                v-show="isRiskEdit"
                style="margin-top:10px;"
                @click="riskCradDelete"
                block
              >删除</a-button>
            </a-row>
          </a-card>
          <div class="color_wrap" v-show="colorAlertShow">
            <compact-picker style="width:125px" v-model="riskMapColor" @input="changeColor(riskMapColor)"></compact-picker>
          </div>
        </a-collapse-panel>
        <a-collapse-panel
          header="水质数据"
          :style="customStyle"
          v-show="waterQuality"
          class="custom_list"
          key="waterQuality"
        >
          <el-upload
            class="upload-demo"
            action="/server/data/admin/regulator/water/save"
            multiple
            name="file"
            :headers="headers"
            :on-success="waterQualitySuccess"
            :on-error="waterQualityError"
            :data="waterQualityData"
            :limit="1"
            :file-list="fileList"
          >
            <a-button style="width:198px;">导入最新水质数据</a-button>
          </el-upload>
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
    <!-- 河岸风险源 -->
    <div class="river_risk_alert" v-show="riverRisk">
      <a-list size="small" style="padding:0 10px; max-height:240px; overflow: auto;">
        <a-list-item v-for="item in riskSourceList" :key="item.id">
          <a-row style="width:100%" type="flex" justify="space-between" align="middle">
            <a-col :span="18">
              <p style="margin:0;">{{item.name}}</p>
            </a-col>
            <a-col :span="6">
              <a-switch
                size="small"
                v-model="item.clicked"
                @click="onDrawType(item.id,item.clicked)"
              />
            </a-col>
          </a-row>
        </a-list-item>
      </a-list>
    </div>
    <!-- 双球 -->
    <div class="showMap" id="showmap" v-show="sharedChecked">
      <div class="half">
        <div id="roadMap" class="vmap"></div>
      </div>
      <div class="half">
        <div id="aerialMap" class="vmap"></div>
      </div>
    </div>
    <!-- 卷帘 -->
    <div id="layerMap" class="layerMap" v-show="swipeChecked">
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
                <a-switch size="small" v-model="roadWordChange" @click="onRoadChangeSwitch" />
              </a-col>
            </a-row>
            <a-row style="width: 100%; margin-top: 8px;">
              <a-col :span="16">
                <span>正射开关</span>
              </a-col>
              <a-col :span="8" style="text-align: right;">
                <a-switch size="small" v-model="layerImageChange" @click="onLayerImageSwitch" />
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
                    <a-switch size="small" v-model="historyData" @click="onHistoryData" />
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
              <a-list-item v-show="listItemLeftRight==true">
                <a-row style="width:160px" type="flex" justify="space-between" align="middle">
                  <a-col :span="18">
                    <p style="margin:0;">左右岸</p>
                  </a-col>
                  <a-col :span="6">
                    <a-switch size="small" v-model="leftRight" @click="leftRightSwitch" />
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
                          <a-switch size="small" v-model="surveyPoint" />
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
                            v-model="item.clicked"
                            @click="onWaterLandLoss(item.id,item.clicked)"
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
          <img src="../../assets/img/more.png" alt="更多" title="更多" @click="getMapPageData()" />
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
          <a-select style="width:100%;" v-model="drawTypeId" @change="choiceDrawChange">
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
        <compact-picker style="width:125px" v-model="riskMapColor" @input="changeColor(riskMapColor)"></compact-picker>
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
    <!-- <div id="popup" style="color:write; background: red;">
      1234564564
      <br/>
      12333333
    </div>-->
    <!-- 风险源信息 -->
    <risk-source-info ref="riskInfo"></risk-source-info>
    <!-- 添加风险源 -->
    <add-risk-source ref="addRisk" @cancel="riskSourceCancel" @confirm="riskSourceComfirm"></add-risk-source>
    <!-- 水质监测点 -->
    <water-quality ref="waterQualityAlert"></water-quality>
    <!-- 照片编辑 -->
    <image-editor
      ref="photoEdit"
      v-if="photoAlertShow"
      :msg="imageEditorData"
      @exitImage="closeImageEditor"
      @saveImage="confirmImageEditor"
    ></image-editor>
    <!-- 排口 -->
    <add-outlet ref="addOutlet" @cancel="outletCancel" @confirm="outletComfirm"></add-outlet>
    <!-- 水面漂浮物 -->
    <add-floatage ref="AddFloatage" @cancel="floatageCancel" @confirm="floatageComfirm"></add-floatage>
    <!-- 其他 -->
    <add-floatage ref="AddFloatage" @cancel="otherCancel" @confirm="otherComfirm"></add-floatage>
    <!-- 360全景图 -->
    <look-panorama
      ref="panorama"
      v-if="panoramaAlertShow"
      :msg="panoramaData"
      @exitPanorama="closePanorma"
    ></look-panorama>
    <a-modal title="无人机照片" :visible="UAVPhotosModal" @ok="UAVPhotosOk" @cancel="UAVPhotosOk">
      <div>点击坐标: {{UAVPhotosCoordinate}}</div>
      <div style="margin-top:10px;max-height: 600px;overflow-y: scroll;">
        <viewer v-for="item in uavPhotoList" :key="item.id" style="margin:5px">
          <div>名称:{{item.name}}</div>
          <img :src="item.pic" alt style="width:100%;margin:0 4px 4px 0;" />
        </viewer>
      </div>
    </a-modal>
    <a-modal :title="otherModalList.title+'绘制数据'" :visible="otherModal" :footer="null">
      <a-form class="from">
        <a-form-item label="名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-input placeholder v-model="otherModalList.innerName" style="width:200px" />
        </a-form-item>
      </a-form>
      <a-row style="width:100%; margin-top:10px;" type="flex" justify="space-around">
        <a-col :span="3">
          <a-button block @click="otherCancel">取消</a-button>
        </a-col>
        <a-col :span="3">
          <a-button block @click="otherDel">删除</a-button>
        </a-col>
        <a-col :span="3">
          <a-button block @click="otherOk">保存</a-button>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import {
  getRiverList,
  getStreetList,
  getWaterQualityList,
  getWaterStation,
  paramList,
  mapdrawSave,
  mapdrawDelete,
  mapdrawPage,
  daydataList,
  weatherList,
  phoneLatlngList,
  panoramaList,
  panoramaImgList,
  dataManual,
  inspectPointPageRiver,
  mapdrawPageRiskSource,
  uavPhoto
} from '@/api/login'
import RiskSourceInfo from './modules/RiskSourceInfo'
import AddRiskSource from './modules/AddRiskSource'
import AddFloatage from './modules/AddFloatage'
import ImageEditor from './ImageEditor'
import AddOutlet from './modules/AddOutlet'
import LookPanorama from './modules/LookPanorama'
import WaterQuality from './modules/waterQualityData'
import Vtour from './Vtour'
import qs from 'qs'
import moment from 'moment' // 时间格式

import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import Feature from 'ol/Feature'
import Overlay from 'ol/Overlay' // 覆盖物
import OSM from 'ol/source/OSM'
import LayerGroup from 'ol/layer/Group'
import XYZ from 'ol/source/XYZ'
import { Icon, Style } from 'ol/style'
import { toSize } from 'ol/size'
import Text from 'ol/style/Text'

import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'

import Layer from 'ol/layer/Layer'

import Point from 'ol/geom/Point' //点
import Circle from 'ol/geom/Circle' //圆
import Polygon from 'ol/geom/Polygon' //面
import { fromLonLat } from 'ol/proj'
import TileJSON from 'ol/source/TileJSON'
import VectorSource from 'ol/source/Vector'

import GeoJSON from 'ol/format/GeoJSON'
import MultiPoint from 'ol/geom/MultiPoint'
import { Circle as CircleStyle, Fill, Stroke } from 'ol/style'

// 拖拽缩放
// import { defaults as defaultInteractions, DragRotateAndZoom } from 'ol/interaction'

import Vue from 'vue'
// token
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 截图
import htmlToImage from 'html-to-image'
// 颜色拾取器
import { Compact } from 'vue-color'
// import { Chrome } from 'vue-color'

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
    'image-editor': ImageEditor,
    'add-outlet': AddOutlet,
    'look-panorama': LookPanorama,
    'compact-picker': Compact,
    'add-floatage': AddFloatage,
    'v-tour': Vtour
  },
  data() {
    return {
      otherModal: false, //其他绘制弹窗
      otherModalList: {
        title:'',
        id: '',
        innerName: ''
      },
      otherPoints: [], //其他绘制数据
      riskSourceLevel: [], //风险源风险等级
      UAVPhotosModal: false, //无人机照片弹窗
      uavPhotoList: [], //无人机照片
      UAVPhotosCoordinate: '', //无人机照片点击坐标
      drawName: '',
      accordionAlertKey: ['phonePhoto'], // 手风琴
      //水质数据上传参数
      waterQualityData: {
        projectId: this.$store.state.id
      },
      headers: {
        Authorization: Vue.ls.get(ACCESS_TOKEN),
        'X-TENANT-ID': this.$store.state.tenantId
      },
      phonePhotoData: {
        projectId: '',
        year: '',
        month: '',
        day: ''
      },
      weatherData: {
        text: '',
        img: '',
        temperature: '',
        wind_direction: '',
        wind_scale: '',
        clouds: ''
      }, //天气
      fileList: [], //手机照片
      defaultTime: '', //默认日期
      defaultRightTime: '', //右侧默认日期

      otherList: [
        {
          id: 0,
          name: '测试',
          clicked: false
        }
      ], //其他
      riskSourceList: [], //河岸风险源
      currentArea: '', //面积
      drawTypeId: '', //绘制类型
      mapdrawId: '5dde340a9ff8c45790c6b938', //基础绘制id
      paramPage: [], //绘制类型列表
      polygonList: [], //绘制面坐标
      pointList: {}, //绘制点坐标
      timeSetShow: false, // 时间弹窗显隐
      timeSetShowRight: false, // 右侧时间弹窗显隐
      timeData: [],

      timeQuantum: '', // 时间段
      dateFormat: 'YYYY-MM-DD',
      startDate: '', // 开始日期
      endDate: '', // 结束日期
      timeDataRight: [], // 右侧时间轴
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

      riskPolygonData: [], // 风险地图数据
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
      layerImageChange: true, // 正射影像显隐
      sharedChecked: false, // 双球
      sharedOnce: 1, // 加载一次
      swipeChecked: false, // 卷帘
      swipeOnce: 1, // 加载一次

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
      photoAlertShow: false, // 照片弹窗显隐
      imageEditorData: {
        id: '',
        url: ''
      }, // 照片编辑传值数据
      phonePhotoTool: '', // 手机照片工具
      UAVPhoto: false, // 无人机照片
      UAVPhotoTool: '', // 无人机照片工具
      panorama: false, // 360照片
      panoramaAlertShow: false,
      panoramaPoints: [
        { id: 0, name: '监测点1', clicked: false, latlng: { lat: 31.21493, lng: 121.49566 } },
        { id: 1, name: '监测点2', clicked: false, latlng: { lat: 31.22344, lng: 121.47892 } },
        { id: 2, name: '监测点3', clicked: false, latlng: { lat: 31.20649, lng: 121.47712 } }
      ],
      labelCol: {
        xs: { span: 18 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 18 },
        sm: { span: 16 }
      },
      panoramaData: {
        id: '',
        panoramaPoints: []
      }, // 360页面传值数据
      alertLeft: -1000,
      alertTop: -1000,
      alertShow: false, // 名字弹窗
      defaultRiver: '', // 河道街道名字
      once: 0, // 移入次数
      riverShowList: [
        {
          id: 'fdsfdsfdsfdsa',
          name: '河道测试111',
          clicked: false,
          lineData: [
            [121.38777, 31.17433],
            [121.37678, 31.14686],
            [121.42262, 31.16743],
            [121.40373, 31.19606]
          ]
        }
      ], // 河道
      streetShowList: [], //街道
      phonePhotoPoints: [
        // {
        //   id: '111111111',
        //   name: '手机照片2',
        //   clicked: false,
        //   imgUrl: require('./img/phonePhoto2.jpg'),
        //   latlng: { lat: 31.24344, lng: 121.49892 }
        // }
      ],
      phonePhotoPointsList: [], //没有经纬度的手机照片
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
            { lat: 31.19915, lng: 121.49197 }
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
      rightWaterQualityPoints: [],
      waterFlotage: false, // 水面漂浮物
      waterFlotagePoints: [],
      waterFlotagePointsRight: [],
      outlet: false, // 排口
      dischargeLevel: [], //排口绘制等级
      outletPoints: [], //排口数据
      outletPointsRight: [], //右侧排口数据
      drawType: false,
      riverRisk: false, // 河岸风险源
      riverRiskPoints: [], // 河岸风险源数据
      riverRiskPointsRight: [], // 右侧河岸风险源数据
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
        // {
        //   id: 0,
        //   name: '专项调查点1',
        //   clicked: false,
        //   imgUrl: require('./img/surveyPointIcon.png'),
        //   latlng: { lat: 31.22041, lng: 121.50384 }
        // }
      ],
      rightSurveyPointPoints: [], // 右侧时间轴数据
      moreLoadOnce: '1', // 加载次数
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
      drawPage: [],
      listItemLeftRight: false,
      leftRight: false,
      screenshotdataUrl: ''
    }
  },
  watch: {
    $route(row) {
      if (row.hash == '#111') {
      } else {
        this.getTimeQuantum() // 获取时间段
        this.getRiverStreeList()
        this.map.panTo(this.$store.state.projectCoordinate, 14)
      }
    },
    accordionAlertKey(key) {
      console.log(key)
    },
    // 历史数据
    historyData() {
      // this.watchAllSwitch()
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
    // 水质数据
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
    drawType() {
      this.watchAllSwitch()
    },
    // 水土流失
    // waterLandLoss() {
    //   this.watchAllSwitch()
    // },
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
    let token = Vue.ls.get(ACCESS_TOKEN)
    // 初始化地图控件
    let zoom = 14
    let twoDimensionURL = `http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822`
    this.mapLayer2d = new T.TileLayer(twoDimensionURL, { minZoom: 4, maxZoom: 18, zIndex: 10 })
    let satelliteURL = `http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822`
    this.mapLayerSatellite = new T.TileLayer(satelliteURL, { minZoom: 4, maxZoom: 18, zIndex: 10 })
    // 创建自定义图层对象
    let wordLabel = `http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=a659a60049b130a5d1fececfd5a6b822`
    this.mapLayerWord = new T.TileLayer(wordLabel, { minZoom: 4, maxZoom: 18, zIndex: 15 })
    // 正射影像
    this.mapImage = `${this.$store.state.serverUrl}/server/data/admin/regulator/uav/data/mbtiles?year=${this.mapYear}&month=${this.mapMonth}&day=${this.mapDay}&x={x}&y={y}&z={z}&X-TENANT-ID=${this.$store.state.tenantId}&projectId=${this.$store.state.id}&Authorization=${token}`
    this.mapLayerImage = new T.TileLayer(this.mapImage, { minZoom: 4, maxZoom: 23, zIndex: 12 })
    this.map = new T.Map('map', {
      minZoom: 4,
      maxZoom: 23,
      layers: [this.mapLayerSatellite, this.mapLayerWord]
    })
    this.map.addEventListener('zoomend', this.mapZoomChange)
    console.log(this.$store.state.projectCoordinate)
    this.map.centerAndZoom(this.$store.state.projectCoordinate, zoom)
    //添加比例尺控件
    this.map.addControl(new T.Control.Scale())
    this.getTimeQuantum() // 获取时间段
    this.getRiverStreeList()

    this.getParamList()

    // this.showMap() //双球init
    // this.showSwipeMap() //卷帘init
  },
  methods: {
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
              arr.push(item)
            }
          }
          this.otherList = arr
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
      })
    },
    // 获取当前页面数据
    getMapPageData() {
      if (this.moreLoadOnce == '1') {
        // 获取手机照片
        this.removeOverLays(this.phonePhotoPoints)
        this.getPhonePhotoPoints()
        // 360点
        this.removeOverLays(this.panoramaPoints)
        this.getPanoramaPoints()
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
        // this.getUavPhoto()//无人机照片
        this.moreLoadOnce = '2'
      }
    },
    // 右侧 双球 获取当前页面数据
    getMapPageDataRight() {
      if (this.moreLoadOnce == '1') {
        // 右侧获取水面漂浮物
        this.getFloatageMapDrawPageRight()
        // 右侧获取水质数据
        this.getWaterQualityPointsRight()
        // 右侧获取风险源
        this.getRiskSourceMapDrawPageRight(false)
        //右侧获取排口绘制数据
        this.getDischargeMapDrawPageRight()
        // 右侧获取专项调查点
        this.getSurveyPointPointsRight()
        this.moreLoadOnce = '2'
      }
    },
    mapZoomChange() {
      // console.log(this.map.getZoom())
      if (this.map.getZoom() > 18) {
      }
    },
    getUavPhoto() {},
    // 获取手机照片
    getPhonePhotoPoints() {
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          endDate: this.endDate,
          mediaType: 'image',
          from: 'admin'
        }
      } else {
        var time = this.defaultTime
        var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          mediaType: 'image',
          from: 'admin'
        }
      }
      dataManual(data).then(res => {
        let arr = res.data.data
        arr.forEach(v => {
          v.latlng = v.coordinate
          v.name = v.title
          v.clicked = false
          v.imgUrl = v.media
          v.id = v.id
        })
        this.phonePhotoPoints = []
        this.phonePhotoPointsList = []
        for (const item of arr) {
          if (item.coordinate) {
            this.phonePhotoPoints.push(item)
          } else {
            this.phonePhotoPointsList.push(item)
          }
        }
        console.log(this.phonePhotoPoints)
        console.log(this.phonePhotoPointsList)
        this.onPhonePhoto()
      })
    },
    // 获取360点
    getPanoramaPoints() {
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          endDate: this.endDate,
          mediaType: 'image'
        }
      } else {
        var time = this.defaultTime
        var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          mediaType: 'image'
        }
      }
      panoramaList(data).then(res => {
        let hh = res.data.data
        hh.forEach(v => {
          v.name = v.title
          v.latlng = v.coordinate
        })
        this.panoramaPoints = hh
        this.onPanorama()
      })
    },
    // 获取专项调查点
    getSurveyPointPoints() {
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          endDate: this.endDate,
          mediaType: 'image'
        }
      } else {
        var picker = this.defaultTime.split('-')
        var data = {
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          mediaType: 'image'
        }
      }
      inspectPointPageRiver(data).then(res => {
        let arr = res.data.data
        arr.forEach(v => {
          v.clicked = false
        })
        this.surveyPointPoints = arr
        console.log(this.surveyPointPoints)
        this.onSurveyPoint()
      })
    },
    // 右侧获取专项调查点
    getSurveyPointPointsRight() {
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          endDate: this.endDate,
          mediaType: 'image'
        }
      } else {
        var picker = this.defaultRightTime.split('-')
        var data = {
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          mediaType: 'image'
        }
      }
      inspectPointPageRiver(data).then(res => {
        let arr = res.data.data
        arr.forEach(v => {
          v.clicked = false
        })
        this.rightSurveyPointPoints = arr
        console.log(this.surveyPointPoints)
        this.onSurveyPoint()
      })
    },
    // 获取风险地图
    getRiskMapList() {
      // this.removeOverLays(this.riskPolygonData)
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          endDate: this.endDate,
          innerType: 'riskMap'
        }
      } else {
        var time = this.defaultTime
        var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          innerType: 'riskMap'
        }
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
    // 获取河流街道列表
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
          // console.log(this.streetShowList)
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
            let points = []
            for (const point of v.leftBankRegion) {
              points.push(new T.LngLat(point[0], point[1]))
            }
            v.leftBankRegion = points
            let points1 = []
            for (const point of v.rightBankRegion) {
              points1.push(new T.LngLat(point[0], point[1]))
            }
            v.rightBankRegion = points1
            v.clicked = false
          })
          this.riverShowList = arr
          // console.log(this.riverShowList)
        })
        .catch(err => {})
      // // 二维数据转换
      // for (const item of this.riverShowList) {
      //   let points = []
      //   for (const point of item.lineData) {
      //     points.push(new T.LngLat(point[0], point[1]))
      //   }
      //   item.lineData = points
      // }
    },
    // 获取水质数据
    getWaterQualityPoints() {
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          endDate: this.endDate
        }
      } else {
        // var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          date: this.defaultTime
          // year: picker[0],
          // month: picker[1],
          // day: picker[2]
          // year: '2019',
          // month: '12',
          // day: '25',
        }
      }
      getWaterStation(data)
        .then(res => {
          let arr = res.data
          this.waterQualityPoints = arr
          this.onWaterQuality()
        })
        .catch(err => {})
    },
    // 右侧获取水质数据
    getWaterQualityPointsRight() {
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          endDate: this.endDate
        }
      } else {
        // var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          date: this.defaultRightTime
          // year: picker[0],
          // month: picker[1],
          // day: picker[2]
          // year: '2019',
          // month: '12',
          // day: '25',
        }
      }
      getWaterStation(data)
        .then(res => {
          let arr = res.data
          this.rightWaterQualityPoints = JSON.parse(JSON.stringify(arr))
          this.onWaterQuality()
        })
        .catch(err => {})
    },
    //其他绘制数据
    getOtherMapDrawPage() {
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          endDate: this.endDate,
          innerType: 'other'
        }
      } else {
        var time = this.defaultTime
        var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          innerType: 'other'
        }
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
        // if (riskSourceType == true) {
        //   for (const risk of this.riskSourceList) {
        //     if (risk.clicked == true) {
        //       let point = []
        //       for (const item of this.riverRiskPoints) {
        //         if (item.drawType.id == risk.id) {
        //           if (item.locationType.code == 'point') {
        //             item.latlng = {
        //               lng: item.point[0],
        //               lat: item.point[1]
        //             }
        //             point.push(item)
        //           }
        //           if (item.locationType.code == 'line') {
        //             this.lineDraw(
        //               item.line,
        //               item.frameColor,
        //               3,
        //               item.framePellucidity,
        //               item.id,
        //               '',
        //               item.innerType.code
        //             )
        //             let markerTool
        //             if (item.drawType.icon) {
        //               let icon = new T.Icon({
        //                 iconUrl: item.drawType.icon,
        //                 iconSize: new T.Point(41, 40),
        //                 iconAnchor: new T.Point(21, 40)
        //               })
        //               markerTool = new T.Marker(item.line[0], {
        //                 icon: icon,
        //                 id: item.id,
        //                 title: item.innerName,
        //                 code: item.innerType.code
        //               })
        //               this.map.addOverLay(markerTool)
        //             } else {
        //               markerTool = new T.Marker(item.line[0], { title: item.innerName, id: item.id })
        //               this.map.addOverLay(markerTool)
        //             }
        //             // markerTool.addEventListener('click', this.panoramaPointClick)
        //           }
        //           if (item.locationType.code == 'polygon') {
        //             this.noodlesDraw(
        //               item.polygon,
        //               item.frameColor,
        //               3,
        //               item.framePellucidity,
        //               item.shapeColor,
        //               item.shapePellucidity,
        //               '',
        //               item.id,
        //               item.innerType.code
        //             )
        //             let markerTool
        //             if (item.drawType.icon) {
        //               let icon = new T.Icon({
        //                 iconUrl: item.drawType.icon,
        //                 iconSize: new T.Point(41, 40),
        //                 iconAnchor: new T.Point(21, 40)
        //               })
        //               markerTool = new T.Marker(item.polygon[0], {
        //                 icon: icon,
        //                 id: item.id,
        //                 title: item.innerName,
        //                 code: item.innerType.code
        //               })
        //               this.map.addOverLay(markerTool)
        //             } else {
        //               // markerTool = new T.Marker(item.latlng, { title: item.innerName, id: item.id, code: item.innerType.code })
        //               // this.map.addOverLay(markerTool)
        //               markerTool = new T.Marker(item.polygon[0], { title: item.innerName, id: item.id })
        //               this.map.addOverLay(markerTool)
        //             }
        //           }
        //         }
        //       }
        //       this.spotDraw(point)
        //     }
        //   }
        // }
      })
    },
    //风险源绘制数据
    getRiskSourceMapDrawPage(riskSourceType) {
      this.removeOverLays(this.riverRiskPoints)
      var riskSourceLevel = qs.stringify({ riskSourceLevel: this.riskSourceLevel }, { indices: false })
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          endDate: this.endDate,
          innerType: 'riskSource'
        }
      } else {
        var time = this.defaultTime
        var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          innerType: 'riskSource'
        }
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
                      markerTool = new T.Marker(item.line[0], { title: item.innerName, id: item.id })
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
                      markerTool = new T.Marker(item.polygon[0], { title: item.innerName, id: item.id })
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
    //右侧风险源绘制数据
    getRiskSourceMapDrawPageRight(riskSourceType) {
      var riskSourceLevel = qs.stringify({ riskSourceLevel: this.riskSourceLevel }, { indices: false })
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          endDate: this.endDate,
          innerType: 'riskSource'
        }
      } else {
        var time = this.defaultRightTime
        var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          innerType: 'riskSource'
        }
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
        this.riverRiskPointsRight = ar
        // 点击切换重新绘制触发
        for (const item of this.riskSourceList) {
          if (item.clicked) {
            this.onDrawType(item.id, true)
          }
        }
      })
    },
    //获取排口绘制数据
    getDischargeMapDrawPage() {
      console.log(this.dischargeLevel)
      this.removeOverLays(this.outletPoints)
      if (this.dischargeLevel.length > 0) {
        var dischargeLevel = this.dischargeLevel.join(',')
      } else {
        var dischargeLevel = ''
      }
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          dischargeType: dischargeLevel,
          endDate: this.endDate,
          innerType: 'discharge'
        }
      } else {
        var time = this.defaultTime
        var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          dischargeType: dischargeLevel,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          innerType: 'discharge'
        }
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
    //右侧获取排口绘制数据
    getDischargeMapDrawPageRight() {
      if (this.dischargeLevel.length > 0) {
        var dischargeLevel = this.dischargeLevel.join(',')
      } else {
        var dischargeLevel = ''
      }
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          dischargeType: dischargeLevel,
          endDate: this.endDate,
          innerType: 'discharge'
        }
      } else {
        var time = this.defaultRightTime
        var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          dischargeType: dischargeLevel,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          innerType: 'discharge'
        }
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
        this.outletPointsRight = ar
        this.onOutlet()
      })
    },
    //水面漂浮物绘制数据
    getFloatageMapDrawPage() {
      this.removeOverLays(this.waterFlotagePoints)
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          endDate: this.endDate,
          innerType: 'floatage'
        }
      } else {
        var time = this.defaultTime
        var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          innerType: 'floatage'
        }
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
        console.log(this.waterFlotagePoints)
        this.onWaterFlotage()
      })
    },
    //右侧获取水面漂浮物数据
    getFloatageMapDrawPageRight() {
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          startDate: this.startDate,
          endDate: this.endDate,
          innerType: 'floatage'
        }
      } else {
        var time = this.defaultRightTime
        var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          innerType: 'floatage'
        }
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
        this.waterFlotagePointsRight = ar
        console.log(this.waterFlotagePointsRight)
        this.onWaterFlotage()
      })
    },
    //基础绘制保存刷新基础绘制列表
    drawSaveRefresh(type) {
      // this.removeOverLays(this.drawPage)
      if (type == 'riskSource') {
        this.getRiskSourceMapDrawPage(true)
      }
      if (type == 'discharge') {
        this.getDischargeMapDrawPage()
      }
      if (type == 'floatage') {
        this.getFloatageMapDrawPage()
      }
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
      this.removeOverLays(this.riverRiskPoints)
      this.getRiskSourceMapDrawPage(true)
    },
    // 河岸风险源过滤
    riverRiskFilterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 水质监测点
    waterQualityChange(value) {
      this.removeOverLays(this.outletPoints)
      this.getDischargeMapDrawPage()
    },
    // 水质监测点过滤
    waterQualityFilterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 指北针
    compass() {},
    // 复位
    setCenter() {
      console.log(this.$store.state.projectCoordinate)
      this.map.panTo(this.$store.state.projectCoordinate, 14)
    },
    // 工具
    toolsShowFun() {
      if (this.toolsCard) {
        if (this.markerTool) {
          this.markerTool.clear()
        }
        if (this.lineTool) {
          this.lineTool.clear()
        }
        if (this.polygonTool) {
          this.polygonTool.clear()
        }
      }
      this.toolsCard = !this.toolsCard
      this.toolCard = false
    },
    // 工具
    toolIndexFun(index) {
      // 切换工具清除上一次的本地绘制
      if (this.toolsCard) {
        if (this.markerTool) {
          this.markerTool.clear()
          this.markerTool.close()
        }
        if (this.lineTool) {
          this.lineTool.clear()
          this.lineTool.close()
        }
        if (this.polygonTool) {
          this.polygonTool.clear()
          this.polygonTool.close()
        }
        if (this.polygonToolNum) {
          this.polygonToolNum.close()
        }
        if (this.lineToolNum) {
          this.lineToolNum.close()
        }
      }
      this.toolIndex = index
      this.editIndex = 'tool'
      if (index === 1) {
        // 工具-点
        if (this.markerTool) {
          this.markerTool.clear()
        }
        this.markerTool = new T.MarkTool(this.map, { follow: true })
        this.markerTool.open()
        this.markerTool.addEventListener('mouseup', this.toolDrawn)
      } else if (index === 2) {
        // 工具-线
        if (this.lineTool) {
          this.lineTool.clear()
        }
        this.lineTool = new T.PolylineTool(this.map)
        this.lineTool.open()
        this.lineTool.setTips(`<p style="padding:0px;">单击确认起点, 双击结束绘制</p>`)
        this.lineTool.addEventListener('draw', this.toolDrawn)
      } else if (index === 3) {
        // 工具-面
        if (this.polygonTool) {
          this.polygonTool.clear()
        }
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
      // 保存之前先清除地图本地绘制
      if (this.toolsCard) {
        if (this.markerTool) {
          this.markerTool.clear()
        }
        if (this.lineTool) {
          this.lineTool.clear()
        }
        if (this.polygonTool) {
          this.polygonTool.clear()
        }
      }
      this.toolCard = false
      var time = this.defaultTime
      var picker = time.split('-')
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
        if (
          this.drawTypeId != '5da8374dea6c157d2d61007c' &&
          this.drawTypeId != '5da8389eea6c157d2d61007f' &&
          this.drawTypeId != '5dafe6c8ea6c159999a0549c'
        ) {
          data.innerType = 'other'
        }
        mapdrawSave(data)
          .then(res => {
            
            this.mapdrawId = res.data.id
            if (data.innerType=='other') {
              this.$message.success('保存成功,请打开'+res.data.drawType.name+'查看')
              this.otherModalList.id = res.data.id
              this.otherModalList.title = res.data.drawType.name
              this.otherModal  = true 
            }else{
              this.$message.success('保存成功')
            }
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
        if (
          this.drawTypeId != '5da8374dea6c157d2d61007c' &&
          this.drawTypeId != '5da8389eea6c157d2d61007f' &&
          this.drawTypeId != '5dafe6c8ea6c159999a0549c'
        ) {
          data.innerType = 'other'
        }
        mapdrawSave(data)
          .then(res => {
            
            this.mapdrawId = res.data.id
            if (data.innerType=='other') {
              this.$message.success('保存成功,请打开'+res.data.drawType.name+'查看')
              this.otherModalList.id = res.data.id
              this.otherModalList.title = res.data.drawType.name
              this.otherModal  = true 
            }else{
              this.$message.success('保存成功')
            }
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
        // this.map.addOverLay(this.polyline)
        // this.polyline.setColor(this.borderColor)
        // this.polyline.setOpacity(this.borderOpacity / 100)
        // this.polyline.addEventListener('click', this.lineClick)
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
        if (
          this.drawTypeId != '5da8374dea6c157d2d61007c' &&
          this.drawTypeId != '5da8389eea6c157d2d61007f' &&
          this.drawTypeId != '5dafe6c8ea6c159999a0549c'
        ) {
          data.innerType = 'other'
        }
        mapdrawSave(data)
          .then(res => {
            this.mapdrawId = res.data.id
            if (data.innerType=='other') {
              this.$message.success('保存成功,请打开'+res.data.drawType.name+'查看')
              this.otherModalList.id = res.data.id
              this.otherModalList.title = res.data.drawType.name
              this.otherModal  = true 
            }else{
              this.$message.success('保存成功')
            }
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
        // this.map.addOverLay(this.polygon)
        // this.polygon.setColor(this.borderColor)
        // this.polygon.setFillColor(this.fullColor)
        // this.polygon.setOpacity(this.borderOpacity / 100)
        // this.polygon.setFillOpacity(this.fullOpacity / 100)
        // this.polygon.addEventListener('click', this.polygonClick)
      }
      // this.getDrawId()
    },
    //风险源，排口弹窗
    searchResult(result) {
      // this.removeOverLays(this.toolIndexPointData)
      // this.removeOverLays(this.toolIndexLineData)
      // this.removeOverLays(this.toolIndexPolygonData)
      if (result.status == 0) {
        if (this.drawTypeId == '5da8374dea6c157d2d61007c') {
          this.$refs.addRisk.add(this.mapdrawId, this.currentArea, result)
        } else if (this.drawTypeId == '5da8389eea6c157d2d61007f') {
          this.$refs.addOutlet.add(this.mapdrawId, result)
        } else if (this.drawTypeId == '5dafe6c8ea6c159999a0549c') {
          this.$refs.AddFloatage.add(this.mapdrawId, this.currentArea, result, this.defaultTime)
        }
        this.drawTypeId = ''
      } else {
        this.$message.error('获取地址失败')
      }
    },
    // 绘制取消
    toolCradCancel() {
      this.toolCard = false
      this.drawTypeId = ''
      if (this.isToolEdit) {
        return
      }
      if (this.toolIndex === 1) {
        // 工具-点
        this.markerTool.clear()
        this.toolIndexPointData.splice(
          this.toolIndexPointData.findIndex(item => item.id === this.toolIndexId),
          1
        )
      } else if (this.toolIndex === 2) {
        // 工具-线
        this.lineTool.clear()
        this.toolIndexLineData.splice(
          this.toolIndexLineData.findIndex(item => item.id === this.toolIndexId),
          1
        )
      } else if (this.toolIndex === 3) {
        // 工具-面
        this.polygonTool.clear()
        this.toolIndexPolygonData.splice(
          this.toolIndexPolygonData.findIndex(item => item.id === this.toolIndexId),
          1
        )
      } else if (this.toolIndex === 4) {
        // 工具-面积
        this.polygonTool.clear()
      } else if (this.toolIndex === 5) {
        // 工具-测距
        this.lineToolNum.clear()
      }
    },
    toolRemoveDraw() {
      // 工具-点
      this.markerTool.clear()
      this.toolIndexPointData.splice(
        this.toolIndexPointData.findIndex(item => item.id === this.toolIndexId),
        1
      )
      // 工具-线
      this.lineTool.clear()
      this.toolIndexLineData.splice(
        this.toolIndexLineData.findIndex(item => item.id === this.toolIndexId),
        1
      )
      // 工具-面
      this.polygonTool.clear()
      this.toolIndexPolygonData.splice(
        this.toolIndexPolygonData.findIndex(item => item.id === this.toolIndexId),
        1
      )
    },
    // 添加风险源回调
    riskSourceCancel() {
      if (this.toolIndex === 1) {
        // 工具-点
        this.markerTool.clear()
      } else if (this.toolIndex === 2) {
        // 工具-线
      } else if (this.toolIndex === 3) {
        // 工具-面
      }
    },
    // 添加风险源回调
    riskSourceComfirm() {},
    // 添加排口回调
    outletCancel() {
      this.toolCradCancel()
    },
    // 添加排口回调
    outletComfirm() {},
    // 添加水面漂浮物回调
    floatageCancel() {
      this.toolCradCancel()
    },
    // 添加水面漂浮物回调
    floatageComfirm() {},
    // 添加其他回调
    otherCancel() {
      this.toolCradCancel()
    },
    // 添加其他回调
    otherComfirm() {},
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
        //console.log(e.currentDistance.toFixed(3)) //获取距离 m
        this.toolCard = true
        this.lineTool.close()
        this.polygonList = e.currentLnglats
        this.toolIndexLineData.push({
          id: id,
          lineData: e.currentLnglats
        })
      } else if (this.toolIndex === 3) {
        // 工具-面
        this.currentArea = e.currentArea.toFixed(3)
        console.log(e.currentArea.toFixed(3)) //获取面积 平方米
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
      // if (!this.historyData) {
      //   this.$message.warning('请先开启 查看历史数据 后再选择日期')
      //   this.timeSetShow = false
      // }
    },
    // 设置时间段
    setTime(date, dateString) {
      this.startDate = dateString[0]
      this.endDate = dateString[1]
      this.timeQuantum = `${dateString[0]} ~ ${dateString[1]}`
      var start = dateString[0].split('-')
      var end = dateString[1].split('-')
      this.getdaydataList(this.startDate, this.endDate)
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
      startd = endd
      if ((starty % 4 == 0 && starty % 100 != 0) || starty % 400 == 0) {
        if (startm == 2 && startd >= 29) {
          startd = 29
        }
      } else {
        if (startm == 2 && startd >= 28) {
          startd = 28
        }
      }
      if (startm == 4 || startm == 6 || startm == 9 || startm == 11) {
        if (startd >= 30) {
          startd = 30
        }
      }
      if (startm < 10) {
        startm = '0' + startm
      }
      if (startd < 10) {
        startd = '0' + startd
      }
      if (endm < 10) {
        endm = '0' + endm
      }
      if (endd < 10) {
        endd = '0' + endd
      }
      this.startDate = `${starty}-${startm}-${startd}`
      this.endDate = `${endy}-${endm}-${endd}`
      this.timeQuantum = `${this.startDate} ~ ${this.endDate}`
      this.getdaydataList(this.startDate, this.endDate)
    },
    getdaydataList(start, end) {
      let data = {
        projectId: this.$store.state.id,
        start: start,
        end: end
      }
      daydataList(data).then(res => {
        var arr = res.data.reverse()
        for (const item of res.data) {
          if (item.uavTask != 0) {
            item.level = 1
          } else if (item.manualTask != 0) {
            item.level = 0
          } else {
            item.level = 2
          }
          item.title = item.date.substring(item.date.length - 2, item.date.length)
          item.clicked = false
        }
        for (const item of res.data) {
          if (item.uavTask != 0) {
            item.clicked = true
            this.defaultTime =
              item.date.substring(0, 4) + '-' + item.date.substring(4, 6) + '-' + item.date.substring(6, 8)
            this.defaultRightTime = this.defaultTime
            break
          } else if (item.manualTask != 0) {
            item.clicked = true
            this.defaultTime =
              item.date.substring(0, 4) + '-' + item.date.substring(4, 6) + '-' + item.date.substring(6, 8)
            this.defaultRightTime = this.defaultTime
            break
          } else {
            item.clicked = false
            this.defaultTime = this.endDate
            this.defaultRightTime = this.endDate
          }
        }
        this.timeData = res.data
        this.timeDataRight = JSON.parse(JSON.stringify(this.timeData))
        this.getWeatherList()
        // 手机照片上传参数
        this.moreLoadOnce = 1
        this.getMapPageData()
        let picker = this.defaultTime.split('-')
        this.phonePhotoData = {
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2]
        }
        let mapImage = `${this.$store.state.serverUrl}/server/data/admin/regulator/uav/data/mbtiles?year=${
          picker[0]
        }&month=${picker[1]}&day=${picker[2]}&x={x}&y={y}&z={z}&X-TENANT-ID=${this.$store.state.tenantId}&projectId=${
          this.$store.state.id
        }&Authorization=${Vue.ls.get(ACCESS_TOKEN)}`
        this.mapLayerImage = new T.TileLayer(mapImage, { minZoom: 4, maxZoom: 23, zIndex: 12 })
        this.map.addLayer(this.mapLayerImage)
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
      var date = this.defaultTime.split('-')
      let data = {
        date: date[0] + date[1] + date[2],
        locationId: this.$store.state.weatherId
      }
      weatherList(data)
        .then(res => {
          let arr = res.data
          console.log(arr)
          if (arr.code == 0) {
            this.weatherData.img = require('./img/weather/0.png')
          } else if (arr.code == 1) {
            this.weatherData.img = require('./img/weather/1.png')
          } else if (arr.code == 2) {
            this.weatherData.img = require('./img/weather/0.png')
          } else if (arr.code == 3) {
            this.weatherData.img = require('./img/weather/1.png')
          } else if (arr.code == 4) {
            this.weatherData.img = require('./img/weather/4.png')
          } else if (arr.code == 5) {
            this.weatherData.img = require('./img/weather/5.png')
          } else if (arr.code == 6) {
            this.weatherData.img = require('./img/weather/6.png')
          } else if (arr.code == 7) {
            this.weatherData.img = require('./img/weather/5.png')
          } else if (arr.code == 8) {
            this.weatherData.img = require('./img/weather/6.png')
          } else if (arr.code == 9) {
            this.weatherData.img = require('./img/weather/9.png')
          } else if (arr.code == 10) {
            this.weatherData.img = require('./img/weather/10.png')
          } else if (arr.code == 11) {
            this.weatherData.img = require('./img/weather/11.png')
          } else if (arr.code == 12) {
            this.weatherData.img = require('./img/weather/12.png')
          } else if (arr.code == 13) {
            this.weatherData.img = require('./img/weather/13.png')
          } else if (arr.code == 14) {
            this.weatherData.img = require('./img/weather/14.png')
          } else if (arr.code == 15) {
            this.weatherData.img = require('./img/weather/15.png')
          } else if (arr.code == 16) {
            this.weatherData.img = require('./img/weather/16.png')
          } else if (arr.code == 17) {
            this.weatherData.img = require('./img/weather/17.png')
          } else if (arr.code == 18) {
            this.weatherData.img = require('./img/weather/17.png')
          } else if (arr.code == 19) {
            this.weatherData.img = require('./img/weather/19.png')
          } else if (arr.code == 20) {
            this.weatherData.img = require('./img/weather/20.png')
          } else if (arr.code == 21) {
            this.weatherData.img = require('./img/weather/21.png')
          } else if (arr.code == 22) {
            this.weatherData.img = require('./img/weather/22.png')
          } else if (arr.code == 23) {
            this.weatherData.img = require('./img/weather/23.png')
          } else if (arr.code == 24) {
            this.weatherData.img = require('./img/weather/24.png')
          } else if (arr.code == 25) {
            this.weatherData.img = require('./img/weather/25.png')
          } else if (arr.code == 26) {
            this.weatherData.img = require('./img/weather/26.png')
          } else if (arr.code == 27) {
            this.weatherData.img = require('./img/weather/26.png')
          } else if (arr.code == 28) {
            this.weatherData.img = require('./img/weather/28.png')
          } else if (arr.code == 29) {
            this.weatherData.img = require('./img/weather/28.png')
          } else if (arr.code == 30) {
            this.weatherData.img = require('./img/weather/30.png')
          } else if (arr.code == 31) {
            this.weatherData.img = require('./img/weather/31.png')
          } else if (arr.code == 32) {
            this.weatherData.img = require('./img/weather/32.png')
          } else if (arr.code == 33) {
            this.weatherData.img = require('./img/weather/32.png')
          } else if (arr.code == 34) {
            this.weatherData.img = require('./img/weather/34.png')
          } else if (arr.code == 35) {
            this.weatherData.img = require('./img/weather/34.png')
          } else if (arr.code == 36) {
            this.weatherData.img = require('./img/weather/36.png')
          } else if (arr.code == 37) {
            this.weatherData.img = require('./img/weather/37.png')
          } else if (arr.code == 38) {
            this.weatherData.img = require('./img/weather/38.png')
          } else {
            this.weatherData.img = require('./img/weather/99.png')
          }
          this.weatherData.text = arr.text
          this.weatherData.temperature = arr.temperature
          this.weatherData.wind_direction = arr.wind_direction
          this.weatherData.wind_scale = arr.wind_scale
          this.weatherData.clouds = arr.clouds
        })
        .catch(err => {
          this.$message.error('天气数据不存在')
        })
    },
    // 时间轴
    timeLineItem(mouth) {
      console.log(mouth.substring(0, 4) + '-' + mouth.substring(4, 6) + '-' + mouth.substring(6, 8))
      for (const item of this.timeData) {
        if (mouth == item.date) {
          // if (item.level != 2) {
          if (item.date == mouth) {
            this.defaultTime = mouth.substring(0, 4) + '-' + mouth.substring(4, 6) + '-' + mouth.substring(6, 8)
            this.mapYear = mouth.substring(0, 4)
            this.mapMonth = mouth.substring(4, 6)
            this.mapDay = mouth.substring(6, 8)
            this.map.removeLayer(this.mapLayerImage)
            let mapImage = `${this.$store.state.serverUrl}/server/data/admin/regulator/uav/data/mbtiles?year=${
              this.mapYear
            }&month=${this.mapMonth}&day=${this.mapDay}&x={x}&y={y}&z={z}&X-TENANT-ID=${
              this.$store.state.tenantId
            }&projectId=${this.$store.state.id}&Authorization=${Vue.ls.get(ACCESS_TOKEN)}`
            this.mapLayerImage = new T.TileLayer(mapImage, { minZoom: 4, maxZoom: 23, zIndex: 12 })
            this.map.addLayer(this.mapLayerImage)
            item.clicked = true
            this.timeLineChange() //时间轴切换
          } else {
            item.clicked = false
          }
          // }
        } else {
          item.clicked = false
        }
      }
    },
    // 右侧时间轴
    timeLineItemRight(mouth) {
      console.log(mouth.substring(0, 4) + '-' + mouth.substring(4, 6) + '-' + mouth.substring(6, 8))
      for (const item of this.timeDataRight) {
        if (mouth == item.date) {
          // if (item.level != 2) {
          if (item.date == mouth) {
            this.defaultRightTime = mouth.substring(0, 4) + '-' + mouth.substring(4, 6) + '-' + mouth.substring(6, 8)
            item.clicked = true
            this.rightTimeLineChange() //右侧时间轴切换
          } else {
            item.clicked = false
          }
          // }
        } else {
          item.clicked = false
        }
      }
    },
    // 时间轴切换操作
    timeLineChange() {
      // 双球开关 卷帘开关
      if (this.sharedChecked || this.swipeChecked) {
        console.log('时间轴切换')
        // 河道显示
        if (this.riverShow) {
        }
        // 街道显示
        if (this.streetShow) {
        }
        // 手机照片
        if (this.phonePhoto) {
        }
        // 无人机照片
        if (this.UAVPhoto) {
        }
        // 360全景图
        if (this.panorama) {
        }
        // 风险地图
        if (this.riskMap) {
        }
        // 水质数据
        if (this.waterQuality) {
        }
        // 水质漂浮物
        if (this.waterFlotage) {
          this.olRemoveLayer(this.waterFlotagePoints, 'olMap1')
          this.olRemoveLayer(this.waterFlotagePointsRight, 'olMap2')
        }
        // 排口
        if (this.outlet) {
          this.olRemoveLayer(this.outletPoints, 'olMap1')
          this.olRemoveLayer(this.outletPointsRight, 'olMap2')
        }
        // 河岸风险源
        if (this.riverRisk) {
          let data1 = []
          let data2 = []
          for (const listItem of this.riskSourceList) {
            console.log(listItem.clicked)
            if (listItem.clicked) {
              for (const item of this.riverRiskPoints) {
                if (item.drawType.id == listItem.id) {
                  data1.push(item)
                }
              }
              for (const item of this.riverRiskPointsRight) {
                if (item.drawType.id == listItem.id) {
                  data2.push(item)
                }
              }
            }
          }
          this.olRemoveLayer(data1, 'olMap1')
          // this.olRemoveLayer(data2, 'olMap2')
        }
        if (this.drawType) {
        }
        // 水土流失
        if (this.waterLandLoss) {
        }
        // 水面率
        if (this.waterRatio) {
        }
        // 底泥
        if (this.bottomMud) {
        }
        // 专项调查点
        if (this.surveyPoint) {
          this.olRemoveLayer(this.surveyPointPoints, 'olMap1')
          this.olRemoveLayer(this.rightSurveyPointPoints, 'olMap2')
        }
        // 河道连通性
        if (this.riverLink) {
        }
        // 水陆分布
        if (this.landAndWater) {
        }
      }

      this.getWeatherList()
      this.map.clearOverLays()
      this.moreLoadOnce = 1
      this.getMapPageData()
    },
    // 右侧时间轴切换操作
    rightTimeLineChange() {
      // 双球开关 卷帘开关
      if (this.sharedChecked || this.swipeChecked) {
        console.log('时间轴切换')
      }
      // 河道显示
      if (this.riverShow) {
      }
      // 街道显示
      if (this.streetShow) {
      }
      // 手机照片
      if (this.phonePhoto) {
      }
      // 无人机照片
      if (this.UAVPhoto) {
      }
      // 360全景图
      if (this.panorama) {
      }
      // 风险地图
      if (this.riskMap) {
      }
      // 水质数据
      if (this.waterQuality) {
      }
      // 水质漂浮物
      if (this.waterFlotage) {
        this.olRemoveLayer(this.waterFlotagePoints, 'olMap1')
        this.olRemoveLayer(this.waterFlotagePointsRight, 'olMap2')
      }
      // 排口
      if (this.outlet) {
        this.olRemoveLayer(this.outletPoints, 'olMap1')
        this.olRemoveLayer(this.outletPointsRight, 'olMap2')
      }
      // 河岸风险源
      if (this.riverRisk) {
        let data1 = []
        let data2 = []
        for (const listItem of this.riskSourceList) {
          console.log(listItem.clicked)
          if (listItem.clicked) {
            for (const item of this.riverRiskPoints) {
              if (item.drawType.id == listItem.id) {
                data1.push(item)
              }
            }
            for (const item of this.riverRiskPointsRight) {
              if (item.drawType.id == listItem.id) {
                data2.push(item)
              }
            }
          }
        }
        // this.olRemoveLayer(data1, 'olMap1')
        this.olRemoveLayer(data2, 'olMap2')
      }
      if (this.drawType) {
      }
      // 水土流失
      if (this.waterLandLoss) {
      }
      // 水面率
      if (this.waterRatio) {
      }
      // 底泥
      if (this.bottomMud) {
      }
      // 专项调查点
      if (this.surveyPoint) {
        this.olRemoveLayer(this.surveyPointPoints, 'olMap1')
        this.olRemoveLayer(this.rightSurveyPointPoints, 'olMap2')
      }
      // 河道连通性
      if (this.riverLink) {
      }
      // 水陆分布
      if (this.landAndWater) {
      }
      this.moreLoadOnce = 1
      this.getMapPageDataRight()
    },
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
          this.downloadFile('map' + this.getNowTime() + '.png', dataUrl)
          setTimeout(() => {
            this.canDownload = true
          }, 1500)
        })
        .catch(function(error) {
          console.error('oops, something went wrong!', error)
        })
    },
    downloadFile(fileName, content) {
      let aLink = document.createElement('a')
      let blob = this.base64ToBlob(content) //new Blob([content]);
      let evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true) //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)
      aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })) //兼容火狐
    },
    //base64转blob
    base64ToBlob(code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length
      let uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], { type: contentType })
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
    // 双球
    showMap() {
      // this.map.removeLayer(map1);
      // this.map.removeLayer(map2);
      var vec_c = this.getTdLayer('vec_w') //2d图
      var cva_c = this.getTdLayer('cva_w') //道路标注
      var img_c = this.getTdLayer('img_w') //卫星图
      let veclayerGroup = new LayerGroup({
        layers: [img_c]
        // layers: [vec_c]
        // layers: [img_c, cva_c]
      })
      let imglayerGroup = new LayerGroup({
        layers: [img_c]
        // layers: [img_c, cva_c]
      })

      var view = new View({
        projection: 'EPSG:4326',
        center: [this.$store.state.projectCoordinate.lng, this.$store.state.projectCoordinate.lat],
        zoom: 14
      })
      this.olMap1 = new Map({
        target: 'roadMap',
        layers: [veclayerGroup],
        view: view
      })
      console.log(this.olMap1)
      //以Dom渲染方式初始化地图
      this.olMap2 = new Map({
        target: 'aerialMap',
        layers: [imglayerGroup],
        renderer:'dom',
        view: view
      })
    },
    // 双球开关
    sharedView() {
      console.log(!this.sharedChecked && !this.swipeChecked)
      if (this.sharedChecked) {
        this.swipeChecked = false
        if (this.sharedOnce == 1) {
          this.$nextTick(() => {
            this.showMap() //双球init
            this.moreLoadOnce = 1
            this.getMapPageDataRight()
          })
        }
        this.sharedOnce = 2
      } else {
      }
    },
    // 卷帘
    showSwipeMap() {
      var vec_c = this.getTdLayer('vec_w')
      var cva_c = this.getTdLayer('cva_w')
      var img_c = this.getTdLayer('img_w')
      var veclayerGroup = new LayerGroup({
        layers: [vec_c]
        // layers: [vec_c, cva_c]
      })
      var imglayerGroup = new LayerGroup({
        layers: [img_c]
        // layers: [img_c, cva_c]
      })
      this.lmap = new Map({
        target: 'lmap',
        layers: [imglayerGroup, veclayerGroup],
        view: new View({
          projection: 'EPSG:4326',
          center: [this.$store.state.projectCoordinate.lng, this.$store.state.projectCoordinate.lat],
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
      let that = this
      swipe.addEventListener(
        'input',
        function() {
          that.lmap.render()
        },
        false
      )
    },
    // 卷帘开关
    layerSwipe() {
      if (this.swipeChecked) {
        this.sharedChecked = false
        if (this.swipeOnce == 1) {
          this.$nextTick(() => {
            this.showSwipeMap() //卷帘init
          })
        }
        this.swipeOnce = 2
      } else {
      }
    },
    // 更多-历史数据
    onHistoryData() {
      this.moreLoadOnce = 1
      this.getMapPageData()
      if (this.historyData) {
        return
        var vectorSource = new VectorSource({
          features: [iconFeature]
        })

        var vectorLayer = new VectorLayer({
          source: vectorSource
        })

        this.olMap1.addOverlay(vectorSource)
        // var view = new View({
        //   projection: 'EPSG:4326',
        //   center: [this.$store.state.projectCoordinate.lng, this.$store.state.projectCoordinate.lat],
        //   zoom: 14
        // })
        // this.olMap1 = new Map({
        //   target: 'roadMap',
        //   layers: [veclayerGroup, vectorLayer],
        //   view: view
        // })
        return

        var vectorSource = new VectorSource({})
        //创建图标特性
        var iconFeature = new Feature({
          geometry: new Point([121.42025, 31.26963], 'XY'),
          name: 'my Icon',
          id: '123456'
        })
        //将图标特性添加进矢量中
        vectorSource.addFeature(iconFeature)

        //创建图标样式
        var iconStyle = new Style({
          image: new Icon({
            opacity: 0.75,
            src: 'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png'
          })
        })
        //创建矢量层
        var vectorLayer = new VectorSource({
          source: vectorSource,
          style: iconStyle
        })
        //添加进map层
        this.olMap1.addLayer(vectorLayer)
        return
        var iconFeature = new Feature({
          geometry: new Point([121.42025, 31.26963]),
          name: 'Null Island',
          population: 4000,
          rainfall: 500
        })
        var iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 46],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png'
          })
        })
        iconFeature.setStyle(iconStyle)
        var vectorSource = new VectorSource({
          features: [iconFeature]
        })
      }
    },
    // openlayers 绘制点
    olRiverRiskPoint(lnglat, imgUrl, id) {
      console.log(lnglat, imgUrl)
      let iconFeature = new Feature({
        geometry: new Point([lnglat.lng, lnglat.lat]),
        name: '',
        population: 4000,
        rainfall: 500
      })
      let iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          // anchorXUnits: 'fraction',
          // anchorYUnits: 'pixels',
          src: imgUrl
        })
      })
      iconFeature.setStyle(iconStyle)
      let vectorSource = new VectorSource({
        features: [iconFeature]
      })
      let vectorLayer = new VectorLayer({
        source: vectorSource
      })
      vectorLayer.set('id', id)
      this.olMap1.addLayer(vectorLayer)
      this.olMap2.addLayer(vectorLayer)
    },
    init() {
      var iconFeature = new Feature({
        geometry: new Point([121.43025, 31.16963]),
        name: 'Null Island',
        population: 4000,
        rainfall: 500
      })
      var iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          src: 'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png'
        })
      })
      iconFeature.setStyle(iconStyle)
      var vectorSource = new VectorSource({
        features: [iconFeature]
      })
      var vectorLayer = new VectorLayer({
        source: vectorSource
      })
      // var rasterLayer = new TileLayer({
      //   source: new TileJSON({
      //     url: 'https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json',
      //     crossOrigin: ''
      //   })
      // });
      this.olMap1 = new Map({
        layers: [vectorLayer],
        target: document.getElementById('roadMap'),
        view: new View({
          projection: 'EPSG:4326',
          center: [121.43025, 31.16963],
          zoom: 3
        })
      })
    },

    // 添加标注
    drawAllPoint(latlng, index, id) {
      let markerTool = new T.Marker(latlng, { title: index, id: id })
      this.map.addOverLay(markerTool)
      markerTool.addEventListener('click', this.taskPointClick)
    },
    // 河道显示
    onRiverShow() {
      this.removeOverLays(this.riverShowList)
      for (const overlay of this.map.getOverlays()) {
        for (const item of this.riverShowList) {
          if (item.id + '1' == overlay.options.id) {
            this.map.removeOverLay(overlay)
          }
          if (item.id + '2' == overlay.options.id) {
            this.map.removeOverLay(overlay)
          }
        }
      }
      if (this.riverShow) {
        this.listItemLeftRight = true
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
        this.leftRight = false
        this.listItemLeftRight = false
      }
      this.leftRightSwitch()
    },
    // 左右岸
    leftRightSwitch() {
      if (this.leftRight) {
        for (const item of this.riverShowList) {
          if (item.leftBankRegion.length > 0) {
            let polygonStreet = new T.Polygon(item.leftBankRegion, {
              color: 'yellow', //线颜色
              weight: 3, //线宽
              opacity: 0.5, //透明度
              fillColor: '#FFFFFF', //填充颜色
              fillOpacity: 0, // 填充透明度
              title: item.name, // 名字
              id: item.id + '1' // id
            })
            //向地图上添加线
            this.map.addOverLay(polygonStreet)
          }
          if (item.rightBankRegion.length > 0) {
            let polygonStreet1 = new T.Polygon(item.rightBankRegion, {
              color: 'yellow', //线颜色
              weight: 3, //线宽
              opacity: 0.5, //透明度
              fillColor: '#FFFFFF', //填充颜色
              fillOpacity: 0, // 填充透明度
              title: item.name, // 名字
              id: item.id + '2' // id
            })
            //向地图上添加线
            this.map.addOverLay(polygonStreet1)
          }
        }
      } else {
        for (const overlay of this.map.getOverlays()) {
          for (const item of this.riverShowList) {
            if (item.id + '1' == overlay.options.id) {
              this.map.removeOverLay(overlay)
            }
            if (item.id + '2' == overlay.options.id) {
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
    // 街道显示
    onStreetShow() {
      this.removeOverLays(this.streetShowList)
      if (this.streetShow) {
        for (const item of this.streetShowList) {
          let polygon = new T.Polygon(item.lineData, {
            color: 'red', //线颜色
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
      if (this.MarkerClusterer) {
        this.MarkerClusterer.removeMarkers(this.MarkerClusterer.options.markers)
      }
      if (this.phonePhoto) {
        this.allImageTask(this.phonePhotoPoints)
      } else {
        // for (const overlay of this.map.getOverlays()) {
        //   for (const item of this.phonePhotoPoints) {
        //     if (item.id == overlay.options.id) {
        //       this.map.removeOverLay(overlay)
        //     }
        //   }
        // }
      }
    },
    // 无人机照片
    onUAVPhoto() {
      if (this.UAVPhoto) {
        this.map.addEventListener('click', this.UAVPhotoClick)
      } else {
        this.map.removeEventListener('click', this.UAVPhotoClick)
      }
    },
    //无人机照片地图点击事件
    UAVPhotoClick(e) {
      console.log(e)
      if (this.historyData) {
        var data = {
          projectId: this.$store.state.id,
          point: e.lnglat.lng + ',' + e.lnglat.lat,
          startDate: this.startDate,
          endDate: this.endDate
        }
      } else {
        var time = this.defaultTime
        var picker = time.split('-')
        var data = {
          projectId: this.$store.state.id,
          point: e.lnglat.lng + ',' + e.lnglat.lat,
          year: picker[0],
          month: picker[1],
          day: picker[2]
        }
      }
      uavPhoto(data).then(res => {
        var arr = res.data
        console.log(res.data)
        if (arr.length > 0) {
          this.UAVPhotosCoordinate = e.lnglat.lng + ',' + e.lnglat.lat
          this.uavPhotoList = arr
          this.UAVPhotosModal = true
        } else {
          this.$message.success('坐标' + e.lnglat.lng + ',' + e.lnglat.lat + '处没有无人机照片')
        }
      })
      // alert(e.lnglat.lng+","+e.lnglat.lat);
    },
    // 360全景图
    onPanorama() {
      this.removeOverLays(this.panoramaPoints)
      if (this.panorama) {
        let markerTool
        for (const item of this.panoramaPoints) {
          let icon = new T.Icon({
            iconUrl: require('./img/360.png'),
            iconSize: new T.Point(41, 40),
            iconAnchor: new T.Point(21, 40)
          })
          markerTool = new T.Marker(item.latlng, { icon:icon,title: item.name, id: item.id })
          this.map.addOverLay(markerTool)
          markerTool.addEventListener('click', this.panoramaPointClick)
        }
      }
    },
    // 360点点击事件
    panoramaPointClick(e) {
      this.panoramaAlertShow = true
      this.panoramaData.id = e.target.options.id
      this.panoramaData.panoramaPoints = this.panoramaPoints
      // this.$router.push({
      //   path: '/supervise/Vtour',
      //   query: {
      //     id: e.target.options.id,
      //     panoramaPoints: this.panoramaPoints
      //   }
      // })
    },
    // 关闭360弹窗
    closePanorma() {
      this.panoramaAlertShow = false
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
      this.removeOverLays(this.riskPolygonData)
      this.isRiskSaveShow = false
      this.colorAlertShow = false
      console.log(this.isRiskEdit)
      console.log(this.riskIndexId)
      if (this.polygonTool) {
        this.polygonTool.clear()
      }
      let result = this.riskPolygonData.findIndex(item => {
        return this.riskIndexId == item.id
      })
      console.log(result)
      console.log(this.riskPolygonData)
      this.riskPolygonData[result].borderColor = this.borderColor
      this.riskPolygonData[result].fullColor = this.fullColor
      this.riskPolygonData[result].borderOpacity = this.borderOpacity / 100
      this.riskPolygonData[result].fullOpacity = this.fullOpacity / 100

      let picker = this.defaultTime.split('-')
      let polygon = ''
      for (const index of this.riskPolygonData[result].lineData) {
        polygon = polygon + index.lng + ',' + index.lat + '|'
      }
      polygon = polygon.substring(0, polygon.length - 1)
      // 上面是编辑, 下面是保存
      if (this.isRiskEdit) {
        let riskEditData = {
          id: this.riskPolygonData[result].id,
          projectId: this.$store.state.id,
          year: picker[0],
          month: picker[1],
          day: picker[2],
          locationType: 'polygon',
          polygon: polygon,
          frameColor: this.borderColor,
          framePellucidity: this.borderOpacity,
          shapeColor: this.fullColor,
          shapePellucidity: this.fullOpacity,
          innerType: 'riskMap'
        }
        console.log(riskEditData)
        mapdrawSave(riskEditData)
          .then(res => {
            this.$message.success('保存成功')
            console.log(res.data)
            console.log(res.data.id)
            this.getRiskMapList()
          })
          .catch(err => {
            this.$message.error(err.response.data.message)
          })
        return
      }
      let riskSaveData = {
        id: '',
        projectId: this.$store.state.id,
        year: picker[0],
        month: picker[1],
        day: picker[2],
        locationType: 'polygon',
        polygon: polygon,
        frameColor: this.borderColor,
        framePellucidity: this.borderOpacity,
        shapeColor: this.fullColor,
        shapePellucidity: this.fullOpacity,
        innerType: 'riskMap'
      }
      console.log(riskSaveData)
      mapdrawSave(riskSaveData)
        .then(res => {
          this.$message.success('保存成功')
          console.log(res.data)
          console.log(res.data.id)
          this.getRiskMapList()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    // 风险地图绘制取消
    riskCradCancel() {
      this.isRiskSaveShow = false
      this.colorAlertShow = false
      if (this.isRiskEdit) {
        return
      }
      this.polygonTool.clear()
      this.riskPolygonData.splice(
        this.riskPolygonData.findIndex(item => item.id === this.riskIndexId),
        1
      )
    },
    // 风险地图绘制删除
    riskCradDelete() {
      this.isRiskSaveShow = false
      this.colorAlertShow = false
      mapdrawDelete(this.riskIndexId)
        .then(res => {
          this.$message.success('删除成功')
          this.removeOverLays(this.riskPolygonData)
          this.getRiskMapList()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    // 风险地图编辑颜色
    riskPolygonClick(e) {
      this.riskIndexId = e.target.options.id
      this.isRiskEdit = true
      this.isRiskSaveShow = true
      for (const item of this.riskPolygonData) {
        if (this.riskIndexId == item.id) {
          this.borderColor = item.borderColor
          this.fullColor = item.fullColor
          this.borderOpacity = item.framePellucidity
          this.fullOpacity = item.shapePellucidity
        }
      }
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
    // 水质数据
    onWaterQuality() {
      this.removeOverLays(this.waterQualityPoints)
      if (this.waterQuality) {
        console.log(this.waterQualityPoints)
        if (this.waterQualityPoints.length > 0) {
          for (const item of this.waterQualityPoints) {
            var icon = new T.Icon({
            iconUrl: require('./img/onWaterQuality.png'),
            iconSize: new T.Point(41, 40),
            iconAnchor: new T.Point(21, 40)
          })
            this.waterQualityMarker = new T.Marker(item.coordinate, { icon: icon,item: item, id: item.id, title: item.name })
            this.map.addOverLay(this.waterQualityMarker)
            if (this.historyData) {
              this.waterQualityMarker.addEventListener('click', this.waterQualityHistoryClick)
            } else {
              this.waterQualityMarker.addEventListener('click', this.waterQualityClick)
              // this.waterQualityMarker.addEventListener("click",function(e){
              //   let point = item.coordinate;
              //   that.waterQualityMarker = new T.Marker(point);// 创建标注
              //   let markerInfoWin = new T.InfoWindow(item.name,{offset:new T.Point(0,-30)}); // 创建信息窗口对象
              //   that.map.openInfoWindow(markerInfoWin,point); //开启信息窗口
              // });
            }
          }
          // 双球开关
          if (this.sharedChecked) {
            for (const item of this.waterQualityPoints) {
              this.olSharedSurveyPoint(
                item.coordinate,
                'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png',
                item.id,
                'olMap1'
              )
            }
            for (const item of this.rightWaterQualityPoints) {
              this.olSharedSurveyPoint(
                item.coordinate,
                'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png',
                item.id,
                'olMap2'
              )
            }
          }
          // 卷帘开关
          if (this.swipeChecked) {
            for (const item of this.waterQualityPoints) {
              this.olSwipeSurveyPoint(item.coordinate, 'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png', item.id)
            }
          }
        }
      } else {
        // 双球开关水质数据关闭
        if (this.sharedChecked) {
          this.olRemoveLayer(this.waterQualityPoints, 'olMap1')
          this.olRemoveLayer(this.rightWaterQualityPoints, 'olMap2')
        }
        // 卷帘开关水质数据关闭
        if (this.swipeChecked) {
          for (const item of this.waterQualityPoints) {
            for (const layer of this.lmap.getLayers().array_) {
              if (layer.values_.id == item.id) {
                this.lmap.removeLayer(layer)
              }
            }
          }
        }
      }
    },
    // 水质监测点点击
    waterQualityHistoryClick(item) {
      console.log(item)
      this.$refs.waterQualityAlert.add(item)
    },
    waterQualityClick(e) {
      console.log(e)
      var time = this.defaultTime
      var picker = time.split('-')
      var data = {
        projectId: this.$store.state.id,
        year: picker[0],
        month: picker[1],
        day: picker[2],
        sectionCode: e.target.options.item.code
      }
      getWaterQualityList(data)
        .then(res => {
          let item = res.data.data[0]
          var html = `
            <div style='margin:0px;height: 300px;overflow-y: scroll;'>
              <div style='line-height:30px;font-size:14px;margin-bottom:5px; '>
                <span style='font-weight:400'>水体名称: ${item.name}</span>
                <span style='margin-left:50px'>${item.date}</span>
                <div style='border-bottom:1px #c3c3c3 solid'>断面名称: ${item.sectionName}</div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>PH值: ${item.ph}</span>
                  <span style='width:150px'>溶解氧: ${item.do}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>氨氮: ${item.nh3N}mg/L</span>
                  <span style='width:150px'>总磷: ${item.tp}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>高锰酸盐指数: ${item.kmnO}mg/L</span>
                  <span style='width:150px'>透明度: ${item.opacity}cm</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>氧化还原电位: ${item.orp}mv</span>
                  <span style='width:150px'>铜: ${item.cu}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>化学需氧量: ${item.cod}mg/L</span>
                  <span style='width:150px'>锌: ${item.zn}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>五日生化需氧量: ${item.bod}mg/L</span>
                  <span style='width:150px'>硒: ${item.se}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>总氮: ${item.tn}mg/L</span>
                  <span style='width:150px'>氟化物: ${item.pmsf}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>砷: ${item.as}mg/L</span>
                  <span style='width:150px'>汞: ${item.hg}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>镉: ${item.cd}mg/L</span>
                  <span style='width:150px'>六价铬: ${item.cr}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>铅: ${item.pb}mg/L</span>
                  <span style='width:150px'>总氰化物: ${item.cyanide}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>挥发酚: ${item.phenol}mg/L</span>
                  <span style='width:150px'>石油类: ${item.petroleum}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>阴离子表面活性剂: ${item.las}mg/L</span>
                  <span style='width:150px'>铁: ${item.fe}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>硫化物: ${item.sox}mg/L</span>
                  <span style='width:150px'>硫酸盐: ${item.sulfate}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>粪大肠菌群: ${item.coliform}个/L</span>
                  <span style='width:150px'>锰: ${item.mn}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>氯化物: ${item.ci}mg/L</span>
                  <span style='width:150px'>硝酸盐氮: ${item.nitrate}mg/L</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>亚硝酸盐氮: ${item.nitrite}mg/L</span>
                  <span style='width:150px'>浊度: ${item.turbidity}NTO</span>
                </div>
                <div style='display: flex;justify-content:space-around'>
                  <span style='width:180px'>盐度: ${item.salinity}%</span>
                  <span style='width:150px'>水温: ${item.temperature}℃</span>
                </div>
                <div>
                  <span style='width:180px'>流速: ${item.velocity}m/s</span>
                </div>
                <div>
                  <span style='width:300px'>水质评价: ${item.quality}</span>
                </div>
                <div>
                  <span style='width:300px'>黑臭评价: ${item.suncus}</span>
                </div>
                <div>
                  <span style='width:300px'>备注: ${item.remark}</span>
                </div>
              </div>
            </div>
          `
          let point = e.target.options.item.coordinate
          let markerInfoWin = new T.InfoWindow(html, { offset: new T.Point(0, -30) }) // 创建信息窗口对象
          this.map.openInfoWindow(markerInfoWin, point) //开启信息窗口
        })
        .catch(err => {})
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
          }
        }
        if (point.length > 0) {
          this.spotDraw(point)
          console.log(this.waterFlotagePoints)
          console.log(this.waterFlotagePointsRight)
        }
        // 双球开关
        if (this.sharedChecked || this.swipeChecked) {
          for (const item of this.waterFlotagePointsRight) {
            if (item.locationType.code == 'point') {
              item.latlng = {
                lat: item.point[1],
                lng: item.point[0]
              }
              point2.push(item)
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
                item.innerName,
                item.id,
                item.innerType.code
              )
            }
          }
          if (point.length > 0) {
            for (const item of point) {
              this.olSharedSurveyPoint(
                item.latlng,
                'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png',
                item.id,
                'olMap1'
              )
            }
          }
          if (point2.length > 0) {
            for (const item of point2) {
              this.olSharedSurveyPoint(
                item.latlng,
                'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png',
                item.id,
                'olMap2'
              )
            }
          }
        }
        // 卷帘开关
        if (this.swipeChecked) {
          for (const item of point) {
            this.olSwipeSurveyPoint(item.latlng, 'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png', item.id)
          }
        }
      } else {
        this.removeOverLays(this.waterFlotagePoints)
        // 双球开关水面漂浮物关闭
        if (this.sharedChecked) {
          this.olRemoveLayer(this.waterFlotagePoints, 'olMap1')
          this.olRemoveLayer(this.waterFlotagePointsRight, 'olMap2')
        }
        // 卷帘开关水面漂浮物闭
        if (this.swipeChecked) {
          for (const item of this.waterFlotagePoints) {
            for (const layer of this.lmap.getLayers().array_) {
              if (layer.values_.id == item.id) {
                this.lmap.removeLayer(layer)
              }
            }
          }
        }
      }
    },
    // 排口
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
          }
        }
        if (point1.length > 0) {
          this.spotDraw(point1)
        }
        // 双球开关
        if (this.sharedChecked || this.swipeChecked) {
          for (const item of this.outletPointsRight) {
            if (item.locationType.code == 'point') {
              item.latlng = {
                lng: item.point[0],
                lat: item.point[1]
              }
              point2.push(item)
            }
            if (item.locationType.code == 'line') {
            }
            if (item.locationType.code == 'polygon') {
            }
          }
          for (const item of point1) {
            this.olSharedSurveyPoint(
              item.latlng,
              'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png',
              item.id,
              'olMap1'
            )
          }
          for (const item of point2) {
            this.olSharedSurveyPoint(
              item.latlng,
              'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png',
              item.id,
              'olMap2'
            )
          }
        }
        // 卷帘开关
        if (this.swipeChecked) {
          for (const item of point1) {
            this.olSwipeSurveyPoint(item.latlng, 'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png', item.id)
          }
        }
      } else {
        this.removeOverLays(this.outletPoints)
        // 双球开关排口关闭
        if (this.sharedChecked) {
          this.olRemoveLayer(this.outletPoints, 'olMap1')
          this.olRemoveLayer(this.outletPointsRight, 'olMap2')
        }
        // 卷帘开关排口关闭
        if (this.swipeChecked) {
          for (const item of this.outletPoints) {
            for (const layer of this.lmap.getLayers().array_) {
              if (layer.values_.id == item.id) {
                this.lmap.removeLayer(layer)
              }
            }
          }
        }
      }
    },
    //绘制点
    spotDraw(pointLists) {
      let markerTool
      console.log(pointLists)
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
            code: item.innerType.code,
            drawType:item.drawType.name
          })
          this.map.addOverLay(markerTool)
        } else {
          markerTool = new T.Marker(item.latlng, { title: item.innerName, id: item.id, code: item.innerType.code })
          this.map.addOverLay(markerTool)
        }
        if (item.innerType.code == 'riskSource') {
          markerTool.addEventListener('click', this.sourceRiskClick)
        } else if (item.innerType.code == 'discharge') {
          markerTool.addEventListener('click', this.sourceRiskClick)
        } else if (item.innerType.code == 'floatage') {
          markerTool.addEventListener('click', this.floatageClick)
        } else if (item.innerType.code == 'other') {
          markerTool.addEventListener('click', this.otherClick)
        }
      }
    },
    //绘制线
    lineDraw(points, color, weight, opacity, id, name, code,drawType) {
      let line = new T.Polyline(points, {
        color: color, //线颜色
        weight: weight, //线宽
        opacity: opacity, //透明度
        id: id,
        title: name,
        code: code,
        drawType:drawType
      })
      //向地图上添加线
      this.map.addOverLay(line)
      if (code == 'riskSource') {
        line.addEventListener('click', this.sourceRiskClick)
      }
      if (code == 'discharge') {
        line.addEventListener('click', this.sourceRiskClick)
      }
      if (code == 'floatage') {
        line.addEventListener('click', this.floatageClick)
      }
      if (code == 'other') {
        line.addEventListener('click', this.otherClick)
      }
    },
    // 绘制面
    noodlesDraw(lineData, color, weight, opacity, fillColor, fillOpacity, title, id, code,drawType) {
      let polygon = new T.Polygon(lineData, {
        color: color, //线颜色
        weight: weight, //线宽
        opacity: opacity, //透明度
        fillColor: fillColor, //填充颜色
        fillOpacity: fillOpacity, // 填充透明度
        title: title, // 名字
        id: id, // id
        code: code,
        drawType:drawType
      })
      //向地图上添加面
      this.map.addOverLay(polygon)
      if (code == 'riskSource') {
        polygon.addEventListener('click', this.sourceRiskClick)
      }
      if (code == 'discharge') {
        polygon.addEventListener('click', this.sourceRiskClick)
      }
      if (code == 'floatage') {
        polygon.addEventListener('click', this.floatageClick)
      }
      if (code == 'other') {
        polygon.addEventListener('click', this.otherClick)
      }
    },
    //排口水面漂浮物风险源弹窗
    sourceRiskClick(row) {
      this.$refs.riskInfo.riskInfo(row)
    },
    dischargeClick(row) {
      this.$refs.addOutlet.detailList(row)
    },
    floatageClick(row) {
      this.$refs.AddFloatage.detailList(row)
    },
    otherClick(row) {
      console.log(row)
      this.otherModalList.id = row.target.options.id
      this.otherModalList.innerName = row.target.options.title
      this.otherModalList.title=row.target.options.drawType
      this.otherModal = true
    },
    // 河岸风险源
    onRiverRisk() {
      if (this.riverRisk) {
      } else {
        this.riskSourceList.forEach(v => {
          v.clicked = false
        })
        this.removeOverLays(this.riverRiskPoints)
        // 双球开关
        if (this.sharedChecked) {
          // 双球开关风险源关闭
          if (this.sharedChecked) {
            this.olRemoveLayer(this.riverRiskPoints, 'olMap1')
            this.olRemoveLayer(this.riverRiskPointsRight, 'olMap2')
          }
        }
      }
    },
    // 河岸风险源子栏
    onDrawType(id, clicked) {
      console.log(id, clicked)
      console.log(this.riverRiskPoints)
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
        this.olRemoveLayer(data1, 'olMap1')
        this.olRemoveLayer(data2, 'olMap2')
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
              console.log(item)
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
                markerTool = new T.Marker(item.line[0], { title: item.innerName, id: item.id })
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
                markerTool = new T.Marker(item.polygon[0], { title: item.innerName, id: item.id })
                this.map.addOverLay(markerTool)
              }
            }
          }
        }
        this.spotDraw(point)
        // 双球开关
        if (this.sharedChecked) {
          console.log(this.riverRiskPointsRight)
          for (const item of this.riverRiskPointsRight) {
            if (item.drawType.id == id) {
              if (item.locationType.code == 'point') {
                item.latlng = {
                  lng: item.point[0],
                  lat: item.point[1]
                }
                point2.push(item)
              }
              if (item.locationType.code == 'line') {
              }
              if (item.locationType.code == 'polygon') {
              }
            }
          }
          for (const item of point) {
            this.olSharedSurveyPoint(
              item.latlng,
              'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png',
              item.id,
              'olMap1'
            )
          }
          for (const item of point2) {
            this.olSharedSurveyPoint(
              item.latlng,
              'http://api.tianditu.gov.cn/v4.0/image/marker-icon.png',
              item.id,
              'olMap2'
            )
          }
        }
      } else {
        let data1 = []
        let data2 = []
        for (const item of this.riverRiskPoints) {
          if (item.drawType.id == id) {
            data1.push(item)
          }
        }
        this.removeOverLays(data1)
        // 双球开关风险源关闭
        if (this.sharedChecked) {
          this.olRemoveLayer(data1, 'olMap1')
          for (const item of this.riverRiskPointsRight) {
            if (item.drawType.id == id) {
              data2.push(item)
            }
          }
          this.olRemoveLayer(data2, 'olMap2')
        }
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
                item.innerType.code,
                item.drawType.name
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
                item.innerType.code,
                item.drawType.name
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
      this.removeOverLays(this.surveyPointPoints)
      if (this.surveyPoint) {
        for (const item of this.surveyPointPoints) {
          let icon = new T.Icon({
            iconUrl: require('./img/surveyPointIcon.png'),
            iconSize: new T.Point(41, 40),
            iconAnchor: new T.Point(21, 40)
          })
          let marker = new T.Marker(item.coordinate, { icon: icon, id: item.id, title: item.name })
          this.map.addOverLay(marker)
          marker.addEventListener('click', this.taskPointClick)
        }
        // 双球开关
        if (this.sharedChecked || this.swipeChecked) {
          console.log('双球')
          for (const item of this.surveyPointPoints) {
            this.olSharedSurveyPoint(item.coordinate, require('./img/surveyPointIcon.png'), item.id, 'olMap1')
          }
          for (const item of this.rightSurveyPointPoints) {
            this.olSharedSurveyPoint(item.coordinate, require('./img/surveyPointIcon.png'), item.id, 'olMap2')
          }
        }
      } else {
        console.log('关闭专项调查')
        if (this.sharedChecked) {
          this.olRemoveLayer(this.surveyPointPoints, 'olMap1')
          this.olRemoveLayer(this.rightSurveyPointPoints, 'olMap2')
        }
      }
    },
    olSharedSurveyPoint(lnglat, imgUrl, id, map) {
      let iconFeature = new Feature({
        geometry: new Point([lnglat.lng, lnglat.lat]),
        name: '',
        population: 4000,
        rainfall: 500
      })
      let iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          // anchorXUnits: 'fraction',
          // anchorYUnits: 'pixels',
          src: imgUrl
        })
      })
      iconFeature.setStyle(iconStyle)
      let vectorSource = new VectorSource({
        features: [iconFeature]
      })
      let surveyPointLayer = new VectorLayer({
        source: vectorSource
      })
      surveyPointLayer.set('id', id)
      if (map == 'olMap1') {
        this.olMap1.addLayer(surveyPointLayer)
      } else if (map == 'olMap2') {
        this.olMap2.addLayer(surveyPointLayer)
      }
    },
    olSwipeSurveyPoint(lnglat, imgUrl, id) {
      let iconFeature = new Feature({
        geometry: new Point([lnglat.lng, lnglat.lat]),
        name: '',
        population: 4000,
        rainfall: 500
      })
      let iconStyle = new Style({
        image: new Icon({
          anchor: [0.5, 1],
          // anchorXUnits: 'fraction',
          // anchorYUnits: 'pixels',
          src: imgUrl
        })
      })
      iconFeature.setStyle(iconStyle)
      let vectorSource = new VectorSource({
        features: [iconFeature]
      })
      let surveyPointLayer = new VectorLayer({
        source: vectorSource
      })
      surveyPointLayer.set('id', id)
      this.lmap.addLayer(surveyPointLayer)
      // this.olMap2.addLayer(surveyPointLayer)
    },
    olRemoveLayer(data, map) {
      if (map == 'olMap1') {
        for (const item of data) {
          for (const layer of this.olMap1.getLayers().array_) {
            if (layer.values_.id == item.id) {
              this.olMap1.removeLayer(layer)
            }
          }
        }
      } else if (map == 'olMap2') {
        for (const item of data) {
          for (const layer of this.olMap2.getLayers().array_) {
            if (layer.values_.id == item.id) {
              this.olMap2.removeLayer(layer)
            }
          }
        }
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
      // this.onHistoryData()
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
            range: [0, 2]
          },
          {
            url: item.imgUrl,
            size: [70, 45], //图片大小
            offset: new T.Point(35, 45), //显示图片的偏移量
            textColor: '#ffffff', //显示数字的颜色
            textSize: 8, //显示文字的大小
            range: [2, 400]
          }
        ]
        let marker = new T.Marker(item.latlng, { icon: icon, id: item.id, title: item.name })
        arrayObj.push(marker)
        marker.addEventListener('click', this.taskImageClick)
      }
      this.MarkerClusterer = new T.MarkerClusterer(this.map, { markers: arrayObj, styles: styles })
    },
    // 任务照片点击
    taskImageClick(e) {
      console.log(e.target.options.id)
      this.photoAlertShow = true
      console.log(this.phonePhotoPoints)
      for (const item of this.phonePhotoPoints) {
        if (e.target.options.id == item.id) {
          this.imageEditorData.id = item.id
          this.imageEditorData.url = item.imgUrl
        }
      }
      // this.$router.push({
      //   path: '/supervise/ImageEditor',
      //   // query: {
      //   //   id: e.target.options.id,
      //   //   panoramaPoints: this.panoramaPoints
      //   // }
      // })
      // for (const item of this.historyPoints) {
      //   if (index.lnglat.lat === item.latlng.lat && index.lnglat.lng === item.latlng.lng) {
      //     console.log(index.lnglat.lat, index.lnglat.lng)
      //     this.$refs.riskInfo.riskInfo()
      //   }
      // }
    },
    // 照片编辑关闭
    closeImageEditor() {
      this.photoAlertShow = false
    },
    // 照片确定
    confirmImageEditor() {
      this.photoAlertShow = false
      // 获取手机照片
      this.removeOverLays(this.phonePhotoPoints)
      this.getPhonePhotoPoints()
    },
    // 上传手机照片
    phonePhotoSuccess(response, file, fileList) {
      console.log(response)
      this.fileList = []
      this.$message.success('上传成功')
      // 刷新手机照片
      let picker = this.defaultTime.split('-')
      let phoneArr = {
        projectId: this.$store.state.id,
        year: picker[0],
        month: picker[1],
        day: picker[2],
        mediaType: 'image',
        from: 'admin'
      }
      dataManual(phoneArr).then(res => {
        console.log(res.data.data)
        let arr = res.data.data
        arr.forEach(v => {
          v.latlng = v.coordinate
          v.name = v.title
          v.clicked = false
          v.imgUrl = v.media
          v.id = v.id
        })
        this.phonePhotoPoints = []
        this.phonePhotoPointsList = []
        for (const item of arr) {
          if (item.coordinate) {
            this.phonePhotoPoints.push(item)
          } else {
            this.phonePhotoPointsList.push(item)
          }
        }
        console.log(this.phonePhotoPoints)
        console.log(this.phonePhotoPointsList)
        // 获取后重新绘制
        if (this.MarkerClusterer) {
          this.MarkerClusterer.removeMarkers(this.MarkerClusterer.options.markers)
        }
        this.allImageTask(this.phonePhotoPoints)
      })
    },
    phonePhotoError(err, file, fileList) {
      console.log(err)
    },
    phonePhotoChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        // this.fileList = []
        this.$message.success('上传成功')
      } else if (info.file.status === 'error') {
        this.$message.success('上传失败')
      }
    },
    // 手机照片选择经纬度
    phoneChooseCoordinate(id) {
      console.log(id)
      this.phonePhoneId = id
      if (this.cp) {
        this.cp.removeEvent()
      }
      this.cp = new T.CoordinatePickup(this.map, { callback: this.getLngLat })
      this.cp.addEvent()
    },
    getLngLat(lnglat) {
      console.log(lnglat.lng + ', ' + lnglat.lat)
      for (const item of this.phonePhotoPointsList) {
        if (this.phonePhoneId == item.id) {
          item.latlng = `${lnglat.lng}, ${lnglat.lat}`
        }
      }
    },
    // 手机照片没经纬度保存
    phoneConfirm(id) {
      for (const item of this.phonePhotoPointsList) {
        if (id == item.id) {
          let picker = this.defaultTime.split('-')
          let data = {
            projectId: this.$store.state.id,
            year: picker[0],
            month: picker[1],
            day: picker[2],
            id: id,
            coordinate: item.latlng
          }
          if (!item.latlng) {
            this.$message.error('坐标不能为空')
          } else {
            phoneLatlngList(data).then(res => {
              this.phonePhoneId = ''
              this.cp.removeEvent()
              // 刷新手机照片
              let phoneArr = {
                projectId: this.$store.state.id,
                year: picker[0],
                month: picker[1],
                day: picker[2],
                mediaType: 'image',
                from: 'admin'
              }
              dataManual(phoneArr).then(res => {
                let arr = res.data.data
                arr.forEach(v => {
                  v.latlng = v.coordinate
                  v.name = v.title
                  v.clicked = false
                  v.imgUrl = v.media
                  v.id = v.id
                })
                this.phonePhotoPoints = []
                this.phonePhotoPointsList = []
                for (const item of arr) {
                  if (item.coordinate) {
                    this.phonePhotoPoints.push(item)
                  } else {
                    this.phonePhotoPointsList.push(item)
                  }
                }
                // 获取后重新绘制
                if (this.MarkerClusterer) {
                  this.MarkerClusterer.removeMarkers(this.MarkerClusterer.options.markers)
                }
                this.allImageTask(this.phonePhotoPoints)
              })
            })
          }
        }
      }
    },
    sourceRiskView(id, code) {
      console.log(id, code)
      if (code == 'riskSource') {
        console.log('1')
        this.$refs.addRisk.addSource(id)
      }
      if (code == 'discharge') {
        console.log('2')
        this.$refs.addOutlet.detailList(id)
      }
    },
    //水质数据上传成功
    waterQualitySuccess(response, file, fileList) {
      this.$message.success('导入成功,' + response.data)
      this.getWaterQualityPoints()
      this.fileList = []
    },
    //水质数据上传失败
    waterQualityError(err, file, fileList) {
      this.$message.error(JSON.parse(err.message).message)
    },
    //选择绘制类型
    choiceDrawChange(value) {

    },
    //关闭无人机照片弹窗
    UAVPhotosOk() {
      this.UAVPhotosModal = false
      this.UAVPhotosCoordinate = ''
      this.uavPhotoList = []
    },
    //其他名称编辑
    otherOk() {
      mapdrawSave(this.otherModalList)
        .then(res => {
          this.$message.success('保存成功,请打开'+res.data.drawType.name+'查看')
          this.otherModal = false
          this.removeOverLays(this.otherPoints)
          this.getOtherMapDrawPage()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    //其他绘制删除
    otherDel() {
      mapdrawDelete(this.otherModalList.id)
        .then(res => {
          this.$message.success('删除成功')
          this.otherModal = false
          this.removeOverLays(this.otherPoints)
          this.getOtherMapDrawPage()
        })
        .catch(err => {
          this.$message.error(err.response.data.message)
        })
    },
    otherCancel() {
      this.otherModal = false
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
  // display: none;
}
.main {
  width: 100%;
  height: calc(100vh - 64px);
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
  max-height: calc(100vh - 85px);
  // overflow: auto;
  background-color: white;
  z-index: 887;
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
  right: 200px;
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

.phone_wrap {
  overflow: auto;
  max-height: calc(100vh - 180px);
  margin: 0;
  padding: 0;
  list-style-type: none;
  .phone_list {
    padding: 0;
    img {
      width: 100%;
    }
  }
}

.ant-col-6 {
  text-align: right;
}
</style>
