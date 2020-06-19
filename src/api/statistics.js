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
//巡河汇总
export function onExport1(parameter) {
  return axios({
    url: 'server/data/admin/stat/inspect/summary',
    method: 'post',
    data: parameter
  })
}
//河道调查统计
export function onExport2(parameter) {
  return axios({
    url: 'server/data/admin/stat/inspect/river',
    method: 'post',
    data: parameter
  })
}
//风险源数量数量汇总
export function onExport3(parameter) {
  return axios({
    url: 'server/data/admin/stat/risksource/summary',
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