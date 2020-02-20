import api from './index'
import {
  axios
} from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
//登录
export function login(parameter) {
  return axios({
    url: '/server/sso/auth/login',
    method: 'post',
    data: parameter
  })
}
//用户保存
export function userPreservation(parameter) {
  return axios({
    url: '/server/data/admin/user/save',
    method: 'post',
    data: parameter
  })
}
//用户列表
export function userList(parameter) {
  return axios({
    url: '/server/data/admin/user/page',
    method: 'get',
    data: parameter
  })
}
//用户详情
export function userDetails(parameter) {
  return axios({
    url: '/server/data/admin/user/detail/' + parameter.id,
    method: 'get',
  })
}
//用户启用
export function userEnable(parameter) {
  return axios({
    url: '/server/data/admin/user/actived/' + parameter.id,
    method: 'post',
  })
}
//用户禁用
export function userProhibit(parameter) {
  return axios({
    url: '/server/data/admin/user/inactived/' + parameter.id,
    method: 'post',
  })
}
//用户删除
export function userDel(parameter) {
  return axios({
    url: '/server/data/admin/user/remove/' + parameter.id,
    method: 'post',
  })
}
//角色保存
export function rolePreservation(parameter) {
  return axios({
    url: '/server/data/admin/auth/role/save',
    method: 'post',
    data: parameter
  })
}
//角色列表
export function roleList(parameter) {
  return axios({
    url: '/server/data/admin/auth/role/page?type=' + parameter,
    method: 'get',
  })
}
//角色清单
export function roleListDetail(parameter) {
  return axios({
    url: '/server/data/admin/auth/role/list',
    method: 'get',
    params: parameter
  })
}
//角色详情
export function roleDetails(id) {
  return axios({
    url: '/server/data/admin/auth/role/detail/' + id,
    method: 'get',
  })
}
//角色启用
export function roleEnable(parameter) {
  return axios({
    url: '/server/data/admin/auth/role/actived/' + parameter.id,
    method: 'post',
  })
}
//角色禁用
export function roleProhibit(parameter) {
  return axios({
    url: '/server/data/admin/auth/role/inactived/' + parameter.id,
    method: 'post',
  })
}
//角色删除
export function roleDel(parameter) {
  return axios({
    url: '/server/data/admin/auth/role/remove/' + parameter.id,
    method: 'post',
  })
}
//风险源，绘制类型列表
export function paramList(parameter) {
  return axios({
    url: '/server/data/admin/param/list?type=' + parameter.type,
    method: 'get',
  })
}
//风险源，绘制类型保存
export function paramSave(parameter) {
  return axios({
    url: '/server/data/admin/param/save',
    method: 'post',
    data: parameter
  })
}
//风险源，绘制类型删除
export function paramDel(parameter) {
  return axios({
    url: '/server/data/admin/param/remove/' + parameter.id,
    method: 'post',
  })
}
//设备管理结构列表
export function structureEquipment() {
  return axios({
    url: '/server/data/admin/device/type/tree',
    method: 'get',
  })
}
//设备类型列表
export function equipmentTypeList(parameter) {
  return axios({
    url: '/server/data/admin/device/type/list?parentId=' + parameter.id,
    method: 'get',
  })
}
//设备类型保存
export function equipmentTypeSave(parameter) {
  return axios({
    url: '/server/data/admin/device/type/save',
    method: 'post',
    data: parameter
  })
}

//设备类型删除
export function equipmentTypeDel(parameter) {
  return axios({
    url: '/server/data/admin/device/type/remove/' + parameter.id,
    method: 'post',
  })
}
//设备信息列表
export function equipmentNewsList(parameter) {
  return axios({
    url: '/server/data/admin/device/info/page?typeId=' + parameter.id,
    method: 'get',
  })
}
//设备信息保存
export function equipmentNewsSave(parameter) {
  return axios({
    url: '/server/data/admin/device/info/save',
    method: 'post',
    data: parameter
  })
}
//设备信息删除
export function equipmentNewsDel(parameter) {
  return axios({
    url: '/server/data/admin/device/info/remove/' + parameter.id,
    method: 'post',
  })
}
//设备状态
export function equipmentTypetatus(parameter) {
  return axios({
    url: '/server/data/admin/device/info/status',
    method: 'post',
    data: parameter
  })
}
//关联设备分页
export function relatedList(parameter) {
  return axios({
    url: '/server/data/admin/device/related/' + parameter.id,
    method: 'get',

  })
}

//设备三层结构
export function structDeviceList(key) {
  return axios({
    url: '/server/data/admin/device/struct',
    method: 'get',
    params: {
      level: key
    }
  })
}
//项目类型列表
export function projectTypeList(parameter) {
  return axios({
    url: '/server/data/admin/project/type/list?parentId=' + parameter.id,
    method: 'get',
  })
}
//项目类型保存
export function projectTypeSave(parameter) {
  return axios({
    url: '/server/data/admin/project/type/save',
    method: 'post',
    data: parameter
  })
}
//项目类型删除
export function projectTypeDel(parameter) {
  return axios({
    url: '/server/data/admin/project/type/remove/' + parameter.id,
    method: 'post',
  })
}
//项目信息列表
export function projectNewsList(parameter) {
  return axios({
    url: '/server/data/admin/project/info/page?typeId=' + parameter.id,
    method: 'get',
  })
}
//项目信息保存
export function projectNewsSave(parameter) {
  return axios({
    url: '/server/data/admin/project/info/save',
    method: 'post',
    data: parameter
  })
}
//项目信息删除
export function projectNewsDel(parameter) {
  return axios({
    url: '/server/data/admin/project/info/remove/' + parameter.id,
    method: 'post',
  })
}
//设备类型树列表
// export function typeTreeList (parameter) {
//   return axios({
//     url: '/server/data/admin/project/info/remove/'+parameter.id,
//     method: 'post',
//   })
// }
//区域列表
export function regionList(id) {
  return axios({
    url: '/server/data/admin/area/list?parentId=' + id,
    method: 'get',
  })
}
//河道列表
export function getRiverList(id) {
  return axios({
    url: '/server/data/admin/river/page?projectId=' + id,
    method: 'get',
  })
}
//河道详细信息
export function informationRiver(id) {
  return axios({
    url: '/server/data/admin/river/detail/' + id,
    method: 'get',
  })
}
//河道删除
export function delRiver(id) {
  return axios({
    url: '/server/data/admin/river/remove/' + id,
    method: 'post',
  })
}
//河道保存
export function getSaveRiver(parameter) {
  return axios({
    url: '/server/data/admin/river/save',
    method: 'post',
    data: parameter
  })
}
//街道列表
export function getStreetList(id) {
  return axios({
    url: '/server/data/admin/street/page?projectId=' + id,
    method: 'get',
  })
}
//街道详细信息
export function informationStreet(id) {
  return axios({
    url: '/server/data/admin/street/detail/' + id,
    method: 'get',
  })
}
//街道删除
export function delStreet(id) {
  return axios({
    url: '/server/data/admin/street/remove/' + id,
    method: 'post',
  })
}
//街道保存
export function getSaveStreet(parameter) {
  return axios({
    url: '/server/data/admin/street/save',
    method: 'post',
    data: parameter
  })
}
// 获取水质数据分页
export function getWaterQualityList(parameter) {
  return axios({
    url: '/server/data/admin/regulator/water/page',
    method: 'get',
    params: parameter
  })
}
// 水质监测站（有数据的）
export function getWaterStation(parameter) {
  return axios({
    url: '/server/data/admin/regulator/water/station',
    method: 'get',
    params: parameter
  })
}
//任务列表
export function taskList(data) {
  return axios({
    url: '/server/data/admin/task/page?projectId=' + data.id + '&type=' + data.type,
    method: 'get',
  })
}
//任务保存
export function getTaskSave(parameter) {
  return axios({
    url: '/server/data/admin/task/save',
    method: 'post',
    data: parameter
  })
}
//任务详情
export function getTaskDetail(id) {
  return axios({
    url: '/server/data/admin/task/detail/' + id,
    method: 'get',
  })
}
//任务删除
export function taskRemove(id) {
  return axios({
    url: '/server/data/admin/task/remove/' + id,
    method: 'post',
  })
}
//任务点分页
export function taskSpotPage(id) {
  return axios({
    url: '/server/data/admin/task/point/page?taskId=' + id,
    method: 'get',
  })
}
//任务点列表
export function taskSpotList(data) {
  return axios({
    url: '/server/data/admin/task/point/list',
    method: 'get',
    params: {
      riverId: data.id,
      coordinate: data.coordinate,
      radius: data.radius,
    }
  })
}
//任务线列表
export function taskLineList(id) {
  return axios({
    url: '/server/data/admin/task/line/list?riverId=' + id,
    method: 'get',
  })
}
//任务点详情
export function taskPointDetail(id) {
  return axios({
    url: '/server/data/admin/task/point/detail/' + id,
    method: 'get',
  })
}
//任务点保存
export function taskPointSave(parameter) {
  return axios({
    url: '/server/data/admin/task/point/save',
    method: 'post',
    data: parameter
  })
}
//任务点保存
export function taskPointDel(id) {
  return axios({
    url: '/server/data/admin/task/point/remove/' + id,
    method: 'post',
  })
}
//方案分页
export function programmeList(data) {
  return axios({
    url: '/server/data/admin/scheme/page?projectId=' + data.prid + '&riverId=' + data.id,
    method: 'get',
  })
}
//方案保存
export function programmeSave(parameter) {
  return axios({
    url: '/server/data/admin/scheme/save',
    method: 'post',
    data: parameter
  })
}
//方案详情
export function programmeDetail(id) {
  return axios({
    url: '/server/data/admin/scheme/detail/' + id,
    method: 'get',
  })
}
//方案删除
export function programmeRemove(id) {
  return axios({
    url: '/server/data/admin/scheme/remove/' + id,
    method: 'post',
  })
}
//方案设默认
export function programmePrimary(parameter) {
  return axios({
    url: '/server/data/admin/scheme/set/primary/',
    method: 'post',
    data: parameter
  })
}
//水质监测分页
export function testingPage(data) {
  return axios({
    url: '/server/data/admin/monitor/page?projectId=' + data.prid + '&type=' + data.id,
    method: 'get',
  })
}
//水质保存
export function testingSave(parameter) {
  return axios({
    url: '/server/data/admin/monitor/save',
    method: 'post',
    data: parameter
  })
}
//水质详情
export function testingDetail(id) {
  return axios({
    url: '/server/data/admin/monitor/detail/' + id,
    method: 'get'
  })
}
//水质删除
export function testingDel(id) {
  return axios({
    url: '/server/data/admin/monitor/remove/' + id,
    method: 'post',
  })
}
//督办单分页
export function SupervisePage(id) {
  return axios({
    url: '/server/data/admin/supervision/page?projectId=' + id,
    method: 'get',
  })
}
//督办单保存
export function SuperviseSave(parameter) {
  return axios({
    url: '/server/data/admin/supervision/save',
    method: 'post',
    data: parameter
  })
}
//督办单删除
export function SuperviseDel(id) {
  return axios({
    url: '/server/data/admin/supervision/remove/' + id,
    method: 'post',
  })
}
//督办单详情
export function SuperviseDetail(id) {
  return axios({
    url: '/server/data/admin/supervision/detail/' + id,
    method: 'get',
  })
}
//巡河
//巡河计划列表
export function planPage(data) {
  return axios({
    url: '/server/data/admin/inspect/plan/day/task',
    method: 'get',
    params: {
      projectId: data.projectId,
      status: data.status,
      year: data.year,
      month: data.month,
      day: data.day
    }
  })
}
export function planPageList(data) {
  return axios({
    url: '/server/data/admin/inspect/plan/list',
    method: 'get',
    params: {
      projectId: data.projectId,
      status: data.status,
      year: data.year,
      month: data.month,
      day: data.day
    }
  })
}
//巡河计划详情
export function planDetail(id) {
  return axios({
    url: '/server/data/admin/inspect/plan/detail/' + id,
    method: 'get',
  })
}
//巡河计划保存
export function planSave(data) {
  return axios({
    url: '/server/data/admin/inspect/plan/save',
    method: 'post',
    data: data
  })
}
//巡河计划发布
export function planPublish(id) {
  return axios({
    url: '/server/data/admin/inspect/plan/publish/' + id,
    method: 'post',
  })
}
//调查点列表
export function inspectPointPage(id) {
  return axios({
    url: '/server/data/admin/inspect/point/page?planId=' + id,
    method: 'get',
  })
}
//巡河调查点列表
export function inspectPointPageRiver(data) {
  return axios({
    url: '/server/data/admin/inspect/point/page',
    method: 'get',
    params: data
  })
}
//调查点保存
export function inspectPointSave(data) {
  return axios({
    url: '/server/data/admin/inspect/point/save',
    method: 'post',
    data: data
  })
}
//调查点删除
export function inspectPointDel(id) {
  return axios({
    url: '/server/data/admin/inspect/point/remove/' + id,
    method: 'post',
  })
}
//目标列表
export function targetPage(data) {
  return axios({
    url: '/server/data/admin/inspect/target/page',
    method: 'get',
    params: {
      projectId: data.projectId,
      planId: data.id,
      teamId: data.teamId
    }
  })
}
//任务保存
export function inspectTaskSave(data) {
  return axios({
    url: '/server/data/admin/inspect/task/save',
    method: 'post',
    data: data
  })
}
//任务详情
export function inspectTaskDetail(id) {
  return axios({
    url: '/server/data/admin/inspect/task/detail/' + id,
    method: 'get',
  })
}
//任务批量选定
export function taskChoose(ids) {
  return axios({
    url: '/server/data/admin/inspect/task/choose',
    method: 'post',
    data: {
      ids: ids
    }
  })
}
//任务加入已有计划
export function joinPlanTask(data) {
  return axios({
    url: '/server/data/admin/inspect/task/join/plan',
    method: 'post',
    data: data
  })
}
//目标保存
export function targetSave(data) {
  return axios({
    url: '/server/data/admin/inspect/target/save',
    method: 'post',
    data: data
  })
}
//目标删除
export function targetDel(id) {
  return axios({
    url: '/server/data/admin/inspect/target/remove/' + id,
    method: 'post',
  })
}
//目标设置分组
export function targetSetTeam(data) {
  return axios({
    url: '/server/data/admin/inspect/target/set/team',
    method: 'post',
    data: data
  })
}
//分组列表
export function groupingPage(data) {
  return axios({
    url: '/server/data/admin/inspect/team/list',
    method: 'get',
    params: {
      projectId: data.projectId,
      planId: data.id
    }
  })
}
//分组保存
export function groupingSave(data) {
  return axios({
    url: '/server/data/admin/inspect/team/save',
    method: 'post',
    data: data
  })
}
//分组删除
export function groupingDel(id) {
  return axios({
    url: '/server/data/admin/inspect/team/remove/' + id,
    method: 'post',
  })
}
//巡河任务分页
export function taskInspectPage(data) {
  return axios({
    url: '/server/data/admin/inspect/task/page',
    method: 'get',
    params: {
      projectId: data.projectId,
      planId: data.id,
      Object: data.Object,
      objectId: data.objectId
    }
  })
}
//巡河分组人员分页
export function staffInspectPage(id) {
  return axios({
    url: '/server/data/admin/inspect/task/roles?teamId=' + id,
    method: 'get',
  })
}
//巡河分组设备分页
export function deviceInspectPage(id) {
  return axios({
    url: '/server/data/admin/inspect/task/devices?teamId=' + id,
    method: 'get',
  })
}
//成员分页
export function staffPage(id) {
  return axios({
    url: '/server/data/admin/inspect/staff/page?teamId=' + id,
    method: 'get',
  })
}
//设备分页
export function devicePage(id) {
  return axios({
    url: '/server/data/admin/inspect/device/page?teamId=' + id,
    method: 'get',
  })
}
//巡河设备保存
export function equipmentRiverSave(data) {
  return axios({
    url: '/server/data/admin/inspect/device/save',
    method: 'post',
    data: data
  })
}
//巡河成员保存
export function memberRiverSave(data) {
  return axios({
    url: '/server/data/admin/inspect/staff/save',
    method: 'post',
    data: data
  })
}
//监管
//人工数据分页
export function dataManual(data) {
  return axios({
    url: '/server/data/admin/regulator/manual/data/page',
    method: 'get',
    params: data
  })
}
//人工数据详情
export function dataDetails(id) {
  return axios({
    url: '/server/data/admin/regulator/manual/data/detail/' + id,
    method: 'get',
  })
}
//人工轨迹分页
export function locusManual(data) {
  return axios({
    url: '/server/data/admin/inspect/plan/day/locus',
    method: 'get',
    params: {
      // projectId:this.$store.state.id,
      status: data.status,
      year: data.year,
      month: data.month,
      day: data.day
    }
  })
}
//基础绘制数据列表
export function mapdrawPage(data) {
  return axios({
    url: '/server/data/admin/mapdraw/data/list',
    method: 'get',
    params: data
  })
}
//基础绘制数据保存
export function mapdrawSave(data) {
  return axios({
    url: '/server/data/admin/mapdraw/data/save',
    method: 'post',
    params: data
  })
}
//基础绘制数据详情
export function mapdrawDetail(id) {
  return axios({
    url: '/server/data/admin/mapdraw/data/detail/' + id,
    method: 'get',
  })
}
//基础绘制数据删除
export function mapdrawDelete(id) {
  return axios({
    url: '/server/data/admin/mapdraw/data/remove/' + id,
    method: 'post',
  })
}
//风险源内部编码
export function riskInner(data) {
  return axios({
    url: '/server/data/admin/mapdraw/detail/risk/inner',
    method: 'get',
    params: data
  })
}
//风险源数据保存
export function mapdrawRiskSave(data) {
  return axios({
    url: '/server/data/admin/mapdraw/detail/risk/save',
    method: 'post',
    data: data
  })
}
//排口内部编码
export function dischargeInner(data) {
  return axios({
    url: '/server/data/admin/mapdraw/detail/discharge/inner',
    method: 'get',
    params: data
  })
}
//排口数据保存
export function mapdrawDischargeSave(data) {
  return axios({
    url: '/server/data/admin/mapdraw/detail/discharge/save',
    method: 'post',
    data: data
  })
}
//漂浮物数据保存
export function floatageSave(data) {
  return axios({
    url: '/server/data/admin/mapdraw/detail/floatage/save',
    method: 'post',
    data: data
  })
}
//绘制数据图片清单
export function mediaList(id) {
  return axios({
    url: '/server/data/admin/mapdraw/media/list?drawId=' + id,
    method: 'get',
  })
}
//绘制数据图片删除
export function mediaRemove(id) {
  return axios({
    url: '/server/data/admin/mapdraw/media/remove/' + id,
    method: 'post',
  })
}
//风险源  排口   漂浮物详情
export function riskDetails(id) {
  return axios({
    url: '/server/data/admin/mapdraw/detail/risk/info4draw/' + id,
    method: 'get',
  })
}
export function dischargeDetails(id) {
  return axios({
    url: '/server/data/admin/mapdraw/detail/discharge/info4draw/' + id,
    method: 'get',
  })
}
export function floatageDetails(id) {
  return axios({
    url: '/server/data/admin/mapdraw/detail/floatage/info4draw/' + id,
    method: 'get',
  })
}
// 手机照片经纬度上传
export function phoneLatlngList(data) {
  return axios({
    url: '/server/data/admin/regulator/manual/data/save',
    method: 'post',
    params: data
  })
}
// 手机照片编辑保存
export function phoneMediaEdit(data) {
  return axios({
    url: '/server/data/admin/regulator/manual/data/media/edit',
    method: 'post',
    data
  })
}
// 手机照片编辑删除
export function phoneMediaRemove(id) {
  return axios({
    url: '/server/data/admin/regulator/manual/data/remove/' + id,
    method: 'post'
  })
}
//360数据
export function panoramaList(data) {
  return axios({
    url: '/server/data/admin/regulator/panorama/data/points',
    method: 'get',
    params: data
  })
}
//360数据
export function panoramaImgList(id) {
  return axios({
    url: '/server/data/admin/regulator/panorama/data/detail/' + id,
    method: 'get',
  })
}
//我的项目列表
export function projectMineList() {
  return axios({
    url: '/server/data/admin/project/mine/list',
    method: 'get',
  })
}
//我的项目列表
export function projectMinesTructure() {
  return axios({
    url: '/server/data/admin/project/structure',
    method: 'get',
  })
}
//
//时间轴
export function daydataList(data) {
  return axios({
    url: '/server/data/admin/calendar/daydata/',
    method: 'get',
    params: {
      projectId: data.projectId,
      start: data.start,
      end: data.end
    }
  })
}
//日天气
export function weatherList(data) {
  return axios({
    url: '/server/data/admin/weather/daydata',
    method: 'get',
    params: {
      date: data.date,
      coor: data.coor,
    }
  })
}
//当日巡河推荐
export function recommendFangan(data) {
  return axios({
    url: '/server/data/admin/inspect/recommend/list',
    method: 'get',
    params: {
      projectId: data.projectId,
      year: data.year,
      month: data.month,
      day: data.day
    }
  })
}
//绘制评论
export function commentMapdraw(id) {
  return axios({
    url: '/server/data/admin/mapdraw/comment/page',
    method: 'get',
    params: {
      drawId: id,
    }
  })
}
//绘制评论保存
export function commentMapdrawSave(data) {
  return axios({
    url: '/server/data/admin/mapdraw/comment/save',
    method: 'post',
    params: data
  })
}
//绘制评论保存
export function waterPage(data) {
  return axios({
    url: '/server/data/admin/regulator/water/page',
    method: 'get',
    params: data
  })
}

//绘制评论删除
export function commentRemove(id) {
  return axios({
    url: '/server/data/admin/mapdraw/comment/remove/' + id,
    method: 'post',
  })
}

//资源树
export function getPermissionTree(data) {
  return axios({
    url: '/server/data/admin/auth/permission/tree',
    method: 'get',
    params: data
  })
}

//当前登录管理的用户&账户信息
export function getUserCurrent() {
  return axios({
    url: '/server/data/admin/current/permission',
    method: 'get'
  })
}

export function getSmsCaptcha(parameter) {
  return axios({
    url: api.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo() {
  return axios({
    url: '/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav(token) {
  return axios({
    url: '/user/nav',
    method: 'get'
  })
}

export function logout() {
  return axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*} 
 */
export function get2step(parameter) {
  return axios({
    url: api.twoStepCode,
    method: 'post',
    data: parameter
  })
}