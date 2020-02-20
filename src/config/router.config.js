// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'
export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页'  },
    redirect: window.localStorage.getItem('DefaultRoutePath'),
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/analysis',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: { title: '立体巡河实况', keepAlive: true, icon: bxAnaalyse, permission: [ 'xh' ]},
        children: [
          // {
          //   path: '/dashboard/home',
          //   name: 'Home',
          //   component: () => import('@/views/dashboard/Home'),
          //   meta: { title: '首页', keepAlive: true, permission: [ 'dashboard' ] }
          // },
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Monitor'),
            meta: { title: '立体巡河实况', keepAlive: true, permission: [ 'xh' ] }
          },
        ]
      },
      // profile 监管
      {
        path: '/supervise',
        name: 'supervise',
        component: RouteView,
        redirect: '/supervise/Supervise',
        hideChildrenInMenu: true,
        meta: { title: '数据统计分析', keepAlive: true, icon: 'eye', permission: [ 'jg' ] },
        children: [
          {
            path: '/supervise/Supervise',
            name: 'Supervise',
            component: () => import('@/views/supervise/Supervise'),
            meta: { title: '数据统计分析', permission: [ 'jg' ] }
          },
          // {
          //   path: '/supervise/Vtour',
          //   name: 'Vtour',
          //   component: () => import('@/views/supervise/Vtour'),
          //   meta: { title: '360全景图', permission: [ 'supervise' ] }
          // },
          // {
          //   path: '/supervise/ImageEditor',
          //   name: 'ImageEditor',
          //   component: () => import('@/views/supervise/ImageEditor'),
          //   meta: { title: '图片编辑', permission: [ 'supervise' ] }
          // }
        ]
      },
      // 设置
      {
        path: '/settings',
        name: 'settings',
        component: RouteView,
        redirect: '/settings/RiverManage',
        meta: { title: '设置', keepAlive: true, icon: 'setting' },
        children: [
          {
            path: '/settings/RiverManage',
            name: 'RiverManage',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/settings/RiverManage'),
            meta: { title: '河道管理', keepAlive: false, permission: [ 'river' ] }
          },
          {
            path: '/settings/StreetManage',
            name: 'StreetManage',
            component: () => import('@/views/settings/StreetManage'),
            meta: { title: '街道管理', keepAlive: false, permission: [ 'street' ] }
          },
          {
            path: '/settings/TaskManage',
            name: 'TaskManage',
            component: () => import('@/views/settings/TaskManage'),
            meta: { title: '任务管理', keepAlive: false, permission: [ 'task' ] }
          },
          {
            path: '/settings/RiverPlanManage',
            name: 'RiverPlanManage',
            // hidden: false,
            component: () => import('@/views/settings/RiverPlanManage'),
            meta: { title: '巡河方案管理', keepAlive: false, permission: [ 'plan' ] }
          },
          {
            path: '/settings/WaterPointManage',
            name: 'WaterPointManage',
            // hidden: false,
            component: () => import('@/views/settings/WaterPointManage'),
            meta: { title: '水质监测点管理', keepAlive: false, permission: [ 'station' ] }
          },
          {
            path: '/settings/SupervisoryUnitsManage',
            name: 'SupervisoryUnitsManage',
            component: () => import('@/views/settings/SupervisoryUnitsManage'),
            meta: { title: '督办单管理', keepAlive: false, permission: [ 'supervision' ] }
          },
          {
            path: '/settings/DeviceManage',
            name: 'DeviceManage',
            component: () => import('@/views/settings/DeviceManage'),
            meta: { title: '设备管理', keepAlive: false, permission: [ 'device' ] }
          },
          {
            path: '/settings/RiskTypeManage',
            name: 'RiskTypeManage',
            component: () => import('@/views/settings/RiskTypeManage'),
            meta: { title: '风险源类型管理', keepAlive: false, permission: [ 'riskSourceType' ] }
          },
          {
            path: '/settings/drawManage',
            name: 'drawManage',
            component: () => import('@/views/settings/drawManage'),
            meta: { title: '绘制类型管理', keepAlive: false, permission: [ 'drawType' ] }
          },
          {
            path: '/settings/ProjectManage',
            name: 'ProjectManage',
            component: () => import('@/views/settings/ProjectManage'),
            meta: { title: '项目管理', keepAlive: false, permission: [ 'project' ] }
          },
          {
            path: '/settings/UserRootManage',
            name: 'UserRootManage',
            component: () => import('@/views/settings/UserRootManage'),
            meta: { title: '角色管理', keepAlive: false, permission: [ 'role' ] }
          },
          {
            path: '/settings/staffManage',
            name: 'staffManage',
            component: () => import('@/views/settings/staffManage'),
            meta: { title: '用户管理', keepAlive: false, permission: [ 'user' ] }
          },
        ]
      },
      {
        path: '/settings/staff',
        name: 'staffAdd',
        hidden: true,
        component: () => import('@/views/settings/modules/staffAdd'),
        meta: { title: '添加', keepAlive: false }
      },
      {
        path: '/settings/role',
        name: 'roleAdd',
        hidden: true,
        component: () => import('@/views/settings/modules/roleAdd'),
        meta: { title: '添加', keepAlive: false }
      },
      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        hidden: true,
        meta: { title: '异常页', icon: 'warning' },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403' }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404' }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500' }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
