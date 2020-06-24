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
//1.巡河汇总
export function onExport1(parameter) {
  return axios({
    url: '/server/data/admin/stat/inspect/summary',
    method: 'post',
    data: parameter
  })
}
//2.河道调查统计
export function onExport2(parameter) {
  return axios({
    url: '/server/data/admin/stat/inspect/river',
    method: 'post',
    data: parameter
  })
}
//3.排口数量汇总
export function onExport3(parameter) {
  return axios({
    url: '/server/data/admin/stat/discharge/summary',
    method: 'post',
    data: parameter
  })
}
//4.风险源数量汇总
export function onExport4(parameter) {
  return axios({
    url: '/server/data/admin/stat/risksource/summary',
    method: 'post',
    data: parameter
  })
}
//5.风险源变化统计
export function onExport5(parameter) {
  return axios({
    url: '/server/data/admin/stat/risksource/compare',
    method: 'post',
    data: parameter
  })
}
//6.排口变化统计
export function onExport6(parameter) {
  return axios({
    url: '/server/data/admin/stat/discharge/compare',
    method: 'post',
    data: parameter
  })
}
//7.风险源明细
export function onExport7(parameter) {
  return axios({
    url: '/server/data/admin/stat/risksource/list',
    method: 'post',
    data: parameter
  })
}
//8.排口明细
export function onExport8(parameter) {
  return axios({
    url: '/server/data/admin/stat/discharge/list',
    method: 'post',
    data: parameter
  })
}
//9.水面漂浮物明细
export function onExport9(parameter) {
  return axios({
    url: '/server/data/admin/stat/floatage/list',
    method: 'post',
    data: parameter
  })
}
//10.督办单明细
export function onExport10(parameter) {
  return axios({
    url: '/server/data/admin/stat/supervision/details',
    method: 'post',
    data: parameter
  })
}
//11.水质数据统计
export function onExport11(parameter) {
  return axios({
    url: '/server/data/admin/stat/risksource/summary',
    method: 'post',
    data: parameter
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