import Vue from 'vue'
import {
  login,
  logout,
  getUserCurrent,
  projectMinesTructure
} from '@/api/login'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'
import {
  welcome
} from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, {
      name,
      welcome
    }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({
      commit,
      state,
      rootState
    }, userInfo) {
      console.log(userInfo);

      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response.data
          Vue.ls.set(ACCESS_TOKEN, 'Bearer ' + result.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', 'Bearer ' + result.token)
          let permissionInfo = [
            [{
              id: '5e142f3273e44f2d59d43766',
              name: '巡河',
              flag: 'xh',
              read: false,
              write: false
            }],
            [{
              id: '5e142f8373e44f2d59d43767',
              name: '监管',
              flag: 'jg',
              read: false,
              write: false
            }],
            [{
                id: '5e144bdfa96a47239fbf9d72',
                parentId: '5e142f8e73e44f2d59d43768',
                name: '河道',
                flag: 'river',
                read: false,
                write: false
              },
              {
                id: '5e15857aa96a47239fbf9dc5',
                parentId: '5e142f8e73e44f2d59d43768',
                name: '街道',
                flag: 'street',
                read: false,
                write: false
              },
              {
                id: '5e15858ba96a47239fbf9dc6',
                parentId: '5e142f8e73e44f2d59d43768',
                name: '任务',
                flag: 'task',
                read: false,
                write: false
              },
              {
                id: '5e1585b3a96a47239fbf9dc7',
                parentId: '5e142f8e73e44f2d59d43768',
                name: '巡河方案',
                flag: 'plan',
                read: false,
                write: false
              },
              {
                id: '5e1585d5a96a47239fbf9dc8',
                parentId: '5e142f8e73e44f2d59d43768',
                name: '水质监测点',
                flag: 'station',
                read: false,
                write: false
              },
              {
                id: '5e1587f4a96a47239fbf9dc9',
                parentId: '5e142f8e73e44f2d59d43768',
                name: '督办单',
                flag: 'supervision',
                read: false,
                write: false
              },
              {
                id: '5e158f06a96a47239fbf9dcf',
                parentId: '5e142f8e73e44f2d59d43768',
                name: '设备',
                flag: 'device',
                read: false,
                write: false
              },
              {
                id: '5e158f26a96a47239fbf9dd0',
                parentId: '5e142f8e73e44f2d59d43768',
                name: '风险源类型',
                flag: 'riskSourceType',
                read: false,
                write: false
              },
              {
                id: '5e158f37a96a47239fbf9dd1',
                parentId: '5e142f8e73e44f2d59d43768',
                name: '绘制类型',
                flag: 'drawType',
                read: false,
                write: false
              },
              {
                id: '5e158f4ba96a47239fbf9dd2',
                parentId: '5e142f8e73e44f2d59d43768',
                name: '项目',
                flag: 'project',
                read: false,
                write: false
              },
              {
                id: '5e158f58a96a47239fbf9dd3',
                parentId: '5e142f8e73e44f2d59d43768',
                name: '角色',
                flag: 'role',
                read: false,
                write: false
              },
              {
                id: '5e158f67a96a47239fbf9dd4',
                parentId: '5e142f8e73e44f2d59d43768',
                name: '用户',
                flag: 'user',
                read: false,
                write: false
              }
            ]
          ]
          // getUserCurrent().then(res => {
          //   console.log(res)
          //   console.log(rootState.permissionList)
          //   let data = res.data.permission
          //   for (const item of permissionInfo) {
          //     for (const value of data) {
          //       item.filter(key => {
          //         if (value.id == key.id) {
          //           console.log(key)
          //           if (data[value]) {
          //             key.read = true
          //             key.write = true
          //           } else {
          //             key.read = true
          //             key.write = false
          //           }
          //         }
          //       })
          //     }
          //   }
          //   commit('permissionListsFn', permissionInfo)
          // }).catch(error => {
          //   reject(error)
          // })
          projectMinesTructure().then(res => {
            commit('projectInfoFn', res.data)
            var arr = res.data
            if (rootState.defautProject.length <= 0) {
              if (arr[0].children != null) {
                if (arr[0].children.length > 0) {
                  // 默认项目id
                  commit('show', arr[0].children[0].id)
                  // 默认项目中心点
                  commit('projectCoordinateFn', arr[0].children[0].coordinate)
                  // 默认项目选择第一项
                  let defautProject = []
                  defautProject.push(arr[0].id)
                  defautProject.push(arr[0].children[0].id)
                  commit('SET_DEFAUT_PROJECT', defautProject)
                  // Vue.ls.set('SET_PROJECT_ID', arr[i].children[0].id)
                }
              } else {
                arr[0].children = []
              }
            }
            resolve()
          }).catch(error => {
            console.log(error)
            reject(error)
          })
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        const userInfo = {
          id: "4291d7da9005377ec9aec4a71ea837f",
          name: "admin",
          username: "admin",
          password: "",
          creatorId: "admin",
          roleId: "admin",
          role: {
            'id': 'admin',
            'name': '管理员',
            'describe': '拥有所有权限',
            'status': 1,
            'creatorId': 'system',
            'deleted': 0,
            'permissions': [{
              'roleId': 'admin',
              'permissionId': 'dashboard',
              'permissionName': '巡河',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': true
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'supervise',
              'permissionName': '监管',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'setting',
              'permissionName': '设置',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'profile',
              'permissionName': 'river',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'street',
              'permissionName': '街道管理',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'task',
              'permissionName': '任务管理',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'plan',
              'permissionName': '巡河方案管理',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'station',
              'permissionName': '水质监测点管理',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'supervision',
              'permissionName': '督办单管理',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'device',
              'permissionName': '设备管理',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'riskSourceType',
              'permissionName': '风险源类型管理',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'drawType',
              'permissionName': '绘制类型管理',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'project',
              'permissionName': '项目管理',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'role',
              'permissionName': '角色管理',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }, {
              'roleId': 'admin',
              'permissionId': 'user',
              'permissionName': '用户管理',
              'actions': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionEntitySet': [{
                'action': 'read',
                'describe': '查看',
                'defaultCheck': false
              }, {
                'action': 'write',
                'describe': '写入',
                'defaultCheck': false
              }],
              'actionList': null,
              'dataAccess': null
            }]
          }
        }
        getUserCurrent().then(res => {
          const result = userInfo
          
          if (result.role && result.role.permissions.length > 0) {
            const role = result.role
            role.permissions = result.role.permissions
            role.permissions.map(per => {
              if (per.actionEntitySet != null && per.actionEntitySet.length > 0) {
                const action = per.actionEntitySet.map(action => {
                  return action.action
                })
                per.actionList = action
              }
            })
            role.permissionList = role.permissions.map(permission => {
              return permission.permissionId
            })
            commit('SET_ROLES', result.role)
            commit('SET_INFO', result)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', {
            name: '',
            // name: result.name,
            welcome: welcome()
          })
          commit('SET_AVATAR', result.avatar)
          console.log('66666666666666666666666')
          console.log(response)
          resolve(response)

          // let data = res.data.permission
          // for (const item of permissionInfo) {
          //   for (const value of data) {
          //     item.filter(key => {
          //       if (value.id == key.id) {
          //         console.log(key)
          //         if (data[value]) {
          //           key.read = true
          //           key.write = true
          //         } else {
          //           key.read = true
          //           key.write = false
          //         }
          //       }
          //     })
          //   }
          // }
          // commit('permissionListsFn', permissionInfo)
        }).catch(error => {
          reject(error)
        })
      })
    },

    //登出
    Logout({
      commit,
      state
    }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      Vue.ls.remove(ACCESS_TOKEN)
      // return new Promise((resolve) => {
      //   logout(state.token).then(() => {
      //     resolve()
      //   }).catch(() => {
      //     resolve()
      //   }).finally(() => {
          
      //   })
      // })
    }

  }
}

export default user