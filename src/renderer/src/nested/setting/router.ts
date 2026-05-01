import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// 引入路由

export const routes: Array<RouteRecordRaw> = [
  {
    name: '主页',
    path: '/',
    component: () => import('@/nested/setting/pages/home/HomePage.vue')
  },
  {
    name: '系统设置-基础设置',
    path: '/system/base',
    component: () => import('./pages/system/BaseSetting.vue')
  },
  {
    name: '系统设置-AI 设置',
    path: '/system/ai',
    component: () => import('./pages/system/AiSetting.vue')
  },
  {
    name: '个性化-背景设置',
    path: '/personalization/bg',
    component: () => import('./pages/personalization/BgSetting.vue')
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
