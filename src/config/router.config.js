// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/analysis',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/analysis',
        component: RouteView,
        hideChildrenInMenu: true,
        meta: { title: '立体巡河实况', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
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
            meta: { title: '立体巡河实况', keepAlive: true, permission: [ 'dashboard' ] }
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
        meta: { title: '数据统计分析', keepAlive: true, icon: 'eye', permission: [ 'dashboard' ] },
        children: [
          {
            path: '/supervise/Supervise',
            name: 'Supervise',
            component: () => import('@/views/supervise/Supervise'),
            meta: { title: '数据统计分析', permission: [ 'dashboard' ] }
          },
          {
            path: '/supervise/Vtour',
            name: 'Vtour',
            component: () => import('@/views/supervise/Vtour'),
            meta: { title: '360全景图', permission: [ 'dashboard' ] }
          }
        ]
      },
      // 设置
      {
        path: '/settings',
        name: 'settings',
        component: RouteView,
        redirect: '/settings/RiverManage',
        meta: { title: '设置', keepAlive: true, icon: 'setting', permission: [ 'dashboard' ] },
        children: [
          {
            path: '/settings/RiverManage',
            name: 'RiverManage',
            // hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
            component: () => import('@/views/settings/RiverManage'),
            meta: { title: '河道管理', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/settings/StreetManage',
            name: 'StreetManage',
            component: () => import('@/views/settings/StreetManage'),
            meta: { title: '街道管理', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/settings/TaskManage',
            name: 'TaskManage',
            component: () => import('@/views/settings/TaskManage'),
            meta: { title: '任务管理', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/settings/RiverPlanManage',
            name: 'RiverPlanManage',
            // hidden: true,
            component: () => import('@/views/settings/RiverPlanManage'),
            meta: { title: '巡河方案管理', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/settings/WaterPointManage',
            name: 'WaterPointManage',
            // hidden: true,
            component: () => import('@/views/settings/WaterPointManage'),
            meta: { title: '水质监测点管理', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/settings/DeviceManage',
            name: 'DeviceManage',
            component: () => import('@/views/settings/DeviceManage'),
            meta: { title: '设备管理', keepAlive: false, permission: [ 'table' ] }
          },
          {
            path: '/settings/RiskTypeManage',
            name: 'RiskTypeManage',
            component: () => import('@/views/settings/RiskTypeManage'),
            meta: { title: '风险源类型管理', keepAlive: false, permission: [ 'table' ] }
          },
          {
            path: '/settings/drawManage',
            name: 'drawManage',
            component: () => import('@/views/settings/drawManage'),
            meta: { title: '绘制类型管理', keepAlive: false, permission: [ 'table' ] }
          },
          {
            path: '/settings/ProjectManage',
            name: 'ProjectManage',
            component: () => import('@/views/settings/ProjectManage'),
            meta: { title: '项目管理', keepAlive: false, permission: [ 'table' ] }
          },
          {
            path: '/settings/SupervisoryUnitsManage',
            name: 'SupervisoryUnitsManage',
            component: () => import('@/views/settings/SupervisoryUnitsManage'),
            meta: { title: '督办单管理', keepAlive: true, permission: [ 'table' ] }
          },
          {
            path: '/settings/UserRootManage',
            name: 'UserRootManage',
            component: () => import('@/views/settings/UserRootManage'),
            meta: { title: '角色管理', keepAlive: false, permission: [ 'table' ] }
          },
          {
            path: '/settings/staffManage',
            name: 'staffManage',
            component: () => import('@/views/settings/staffManage'),
            meta: { title: '用户管理', keepAlive: false, permission: [ 'table' ] }
          },
        ]
      },
      {
        path: '/settings/staff',
        name: 'staffAdd',
        hidden: true,
        component: () => import('@/views/settings/modules/staffAdd'),
        meta: { title: '添加', keepAlive: false, permission: [ 'table' ] }
      },
      {
        path: '/settings/role',
        name: 'roleAdd',
        hidden: true,
        component: () => import('@/views/settings/modules/roleAdd'),
        meta: { title: '添加', keepAlive: false, permission: [ 'table' ] }
      },
      // result
      {
        path: '/result',
        name: 'result',
        component: PageView,
        redirect: '/result/success',
        hidden: true,
        meta: { title: '结果页', icon: 'check-circle-o', permission: [ 'result' ] },
        children: [
          {
            path: '/result/success',
            name: 'ResultSuccess',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Success'),
            meta: { title: '成功', keepAlive: false, hiddenHeaderContent: false, permission: [ 'result' ] }
          },
          {
            path: '/result/fail',
            name: 'ResultFail',
            component: () => import(/* webpackChunkName: "result" */ '@/views/result/Error'),
            meta: { title: '失败', keepAlive: false, hiddenHeaderContent: true, permission: [ 'result' ] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        hidden: true,
        meta: { title: '异常页', icon: 'warning', permission: [ 'exception' ] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: [ 'exception' ] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: [ 'exception' ] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: [ 'exception' ] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        redirect: '/account/center',
        name: 'account',
        hidden: true,
        meta: { title: '个人页', icon: 'user', keepAlive: true, permission: [ 'user' ] },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center/Index'),
            meta: { title: '个人中心', keepAlive: true, permission: [ 'user' ] }
          },
          {
            path: '/account/settings',
            name: 'settings1',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, permission: [ 'user' ] },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: '账户绑定', hidden: true, keepAlive: true, permission: [ 'user' ] }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: '新消息通知', hidden: true, keepAlive: true, permission: [ 'user' ] }
              }
            ]
          }
        ]
      },

      // other
      {
        path: '/other',
        name: 'otherPage',
        component: PageView,
        meta: { title: '其他组件', icon: 'slack', permission: [ 'dashboard' ] },
        redirect: '/other/icon-selector',
        hidden: true,
        children: [
          {
            path: '/other/icon-selector',
            name: 'TestIconSelect',
            component: () => import('@/views/other/IconSelectorView'),
            meta: { title: 'IconSelector', icon: 'tool', keepAlive: true, permission: [ 'dashboard' ] }
          },
          {
            path: '/other/list',
            component: RouteView,
            meta: { title: '业务布局', icon: 'layout', permission: [ 'support' ] },
            redirect: '/other/list/tree-list',
            children: [
              {
                path: '/other/list/tree-list',
                name: 'TreeList',
                component: () => import('@/views/other/TreeList'),
                meta: { title: '树目录表格', keepAlive: true }
              },
              {
                path: '/other/list/edit-table',
                name: 'EditList',
                component: () => import('@/views/other/TableInnerEditList'),
                meta: { title: '内联编辑表格', keepAlive: true }
              },
              {
                path: '/other/list/user-list',
                name: 'UserList',
                component: () => import('@/views/other/UserList'),
                meta: { title: '用户列表', keepAlive: true }
              },
              {
                path: '/other/list/role-list',
                name: 'RoleList',
                component: () => import('@/views/other/RoleList'),
                meta: { title: '角色列表', keepAlive: true }
              },
              {
                path: '/other/list/system-role',
                name: 'SystemRole',
                component: () => import('@/views/role/RoleList'),
                meta: { title: '角色列表2', keepAlive: true }
              },
              {
                path: '/other/list/permission-list',
                name: 'PermissionList',
                component: () => import('@/views/other/PermissionList'),
                meta: { title: '权限列表', keepAlive: true }
              }
            ]
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
