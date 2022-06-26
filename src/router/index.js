import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/user',
    component: Layout,
    name: '用户管理',
    meta: { title: '用户管理', icon: 'el-icon-user-solid' },
    children: [
      {
        path: 'list',
        name: '用户列表',
        component: () => import('@/views/user/users'),
        meta: { title: '用户列表', icon: 'el-icon-user' }
      },
      {
        path: 'online',
        name: '在线用户',
        component: () => import('@/views/user/online'),
        meta: { title: '在线用户', icon: 'el-icon-user' }
      }
    ]
  },

  // 文章管理路由
  {
    path: '/article',
    component: Layout,
    name: '文章管理',
    meta: { title: '文章管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'publish',
        name: '发布文章',
        component: () => import('@/views/article/publish'),
        meta: { title: '发布文章', icon: 'table' }
      },
      {
        path: 'edit/:id',
        name: '编辑文章',
        component: () => import('@/views/article/publish')
      },
      {
        path: '',
        name: '文章列表',
        component: () => import('@/views/article/list'),
        meta: { title: '文章列表', icon: 'table' }
      },
      {
        path: 'tag',
        name: '标签管理',
        component: () => import('@/views/article/tag'),
        meta: { title: '标签管理', icon: 'tree' }
      },
      {
        path: 'category',
        name: '分类列表',
        component: () => import('@/views/article/category'),
        meta: { title: '分类列表', icon: 'tree' }
      }
    ]
  },

  // 相册管理路由
  {
    path: '/wallpaper',
    component: Layout,
    name: '壁纸管理',
    meta: { title: '壁纸管理', icon: 'el-icon-picture' },
    children: [
      {
        path: 'album',
        name: '相册列表',
        component: () => import('@/views/wallpaper/album'),
        meta: { title: '壁纸列表', icon: 'el-icon-picture-outline' }
      },
      {
        path: 'album/:id',
        name: '图片管理',
        component: () => import('@/views/wallpaper/photo')
      },
      {
        path: 'delete',
        name: '回收站',
        component: () => import('@/views/wallpaper/delete')
      }
    ]
  },

  // 说说管理
  {
    path: '/talk',
    component: Layout,
    name: '说说管理',
    meta: { title: '说说管理', icon: 'el-icon-picture' },
    children: [
      {
        path: 'edit',
        name: '发布说说',
        component: () => import('@/views/talk/edit.vue'),
        meta: { title: '发布说说', icon: 'el-icon-s-promotion' }
      },
      {
        path: 'edit/:id',
        name: '编辑说说',
        component: () => import('@/views/talk/edit.vue')
      },
      {
        path: 'list',
        name: '说说列表',
        component: () => import('@/views/talk/talkList.vue'),
        meta: { title: '说说列表', icon: 'el-icon-chat-square' }
      }
    ]
  },

  // 消息管理：
  {
    path: '/',
    component: Layout,
    name: '消息管理',
    meta: { title: '消息管理', icon: 'el-icon-bell' },
    children: [
      {
        path: '/comment',
        name: '评论管理',
        component: () => import('@/views/comment/comment.vue'),
        meta: { title: '评论管理', icon: 'el-icon-s-comment' }
      },
      {
        path: '/message',
        name: '留言管理',
        component: () => import('@/views/system/background'),
        meta: { title: '留言管理', icon: 'el-icon-bell' }
      }
    ]
  },
  // 系统管理：
  {
    path: '/system',
    component: Layout,
    name: '系统管理',
    meta: { title: '系统管理', icon: 'el-icon-setting' },
    children: [
      {
        path: '/webConfig',
        name: '网站管理',
        component: () => import('@/views/system/webConfig.vue'),
        meta: { title: '网站管理', icon: 'el-icon-setting' }
      },
      {
        path: '/background',
        name: '背景管理',
        component: () => import('@/views/system/background'),
        meta: { title: '背景管理', icon: 'el-icon-picture-outline-round' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
