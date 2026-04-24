<template>
  <t-layout class="h-100vh w-100vw">
    <t-aside :width="collapsed ? '64px' : '232px'">
      <t-menu class="h-full" :collapsed>
        <t-menu-item value="1" to="/base">
          <template #icon>
            <setting1-icon />
          </template>
          基础设置
        </t-menu-item>
        <t-menu-item value="2" to="/bg">
          <template #icon>
            <image-icon />
          </template>
          背景设置
        </t-menu-item>
        <t-menu-item value="3" to="/ai">
          <template #icon>
            <robot-icon />
          </template>
          AI 模型设置
        </t-menu-item>
        <t-menu-item value="4" to="/develop">
          <template #icon>
            <code-icon />
          </template>
          开发者工具
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
import { CodeIcon, ImageIcon, RobotIcon, Setting1Icon, ViewListIcon } from 'tdesign-icons-vue-next'

const [collapsed, toggleCollapsed] = useBoolState(false, '/page/setting/collapsed')

useThemeMode()
</script>
<style scoped lang="less"></style>
