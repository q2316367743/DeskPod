import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// 引入路由

export const routes: Array<RouteRecordRaw> = [
  {
    name: '基础设置',
    path: '/base',
    alias: ['/'],
    component: () => import('@/nested/setting/pages/BaseSetting.vue')
  },
  {
    name: '背景设置',
    path: '/bg',
    component: () => import('@/nested/setting/pages/BgSetting.vue')
  },
  {
    name: 'AI 设置',
    path: '/ai',
    component: () => import('@/nested/setting/pages/AiSetting.vue')
  },
  {
    name: '开发者',
    path: '/develop',
    component: () => import('@/nested/setting/pages/develop/DevelopSetting.vue')
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
