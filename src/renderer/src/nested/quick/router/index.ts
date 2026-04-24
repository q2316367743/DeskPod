import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// 引入路由

export const routes: Array<RouteRecordRaw> = [
  {
    name: '主页',
    path: '/home',
    alias: ['/'],
    component: () => import('@/nested/quick/pages/home/index.vue')
  },
  {
    name: 'html文件',
    path: '/html',
    component: () => import('@/nested/quick/pages/html/index.vue')
  },
  {
    name: 'zip文件',
    path: '/zip',
    component: () => import('@/nested/quick/pages/zip/index.vue')
  },
  {
    name: '编辑工具',
    path: '/edit/:id',
    component: () => import('@/nested/quick/pages/edit/index.vue')
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
