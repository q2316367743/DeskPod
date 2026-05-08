<template>
  <t-layout class="h-100vh w-100vw">
    <t-aside :width="collapsed ? '64px' : '232px'">
      <t-menu default-value="0" class="h-full" :collapsed>
        <t-menu-item value="0" to="/">
          <template #icon>
            <home-icon />
          </template>
          主页
        </t-menu-item>
        <t-submenu value="1" to="/system" title="系统设置">
          <template #icon>
            <setting1-icon />
          </template>
          <t-menu-item value="1-1" to="/system/base"> 基础设置 </t-menu-item>
          <t-menu-item value="1-3" to="/system/ai"> AI 模型设置 </t-menu-item>
        </t-submenu>
        <t-submenu value="2" to="/personalization" title="个性化">
          <template #icon>
            <brush-icon />
          </template>
          <t-menu-item value="2-1" to="/personalization/bg"> 背景设置 </t-menu-item>
        </t-submenu>
        <t-submenu value="3" to="/app" title="应用">
          <template #icon>
            <app-icon />
          </template>
          <t-menu-item value="3-1" to="/app/quick"> 快应用 </t-menu-item>
          <t-menu-item value="3-2" to="/app/plugin"> 插件 </t-menu-item>
          <t-menu-item value="3-3" to="/app/default"> 默认应用 </t-menu-item>
        </t-submenu>
        <t-submenu value="4" to="/db" title="数据存储">
          <template #icon>
            <data-base-icon />
          </template>
          <t-menu-item value="3-1" to="/db/lmdb"> lmdb </t-menu-item>
        </t-submenu>

        <t-menu-item value="99" to="/update">
          <template #icon>
            <cloud-upload-icon />
          </template>
          更新
        </t-menu-item>
        <template #operations>
          <t-button theme="primary" variant="text" shape="square" @click="toggleCollapsed()">
            <template #icon>
              <view-list-icon />
            </template>
          </t-button>
        </template>
      </t-menu>
    </t-aside>
    <t-content class="h-full overflow-auto">
      <router-view />
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import { useBoolState, useThemeMode } from '@/hooks'
import {
  AppIcon,
  BrushIcon,
  CloudUploadIcon,
  DataBaseIcon,
  HomeIcon,
  Setting1Icon,
  ViewListIcon
} from 'tdesign-icons-vue-next'

const [collapsed, toggleCollapsed] = useBoolState(false, '/page/setting/collapsed')

useThemeMode()
</script>
<style scoped lang="less"></style>
