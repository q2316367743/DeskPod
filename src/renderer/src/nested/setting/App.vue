<template>
  <t-layout class="h-100vh w-100vw">
    <t-aside :width="collapsed ? '64px' : '232px'">
      <t-menu v-model="page" class="h-full" :collapsed>
        <t-menu-item value="1">
          <template #icon>
            <setting1-icon />
          </template>
          基础设置
        </t-menu-item>
        <t-menu-item value="2">
          <template #icon>
            <robot-icon />
          </template>
          AI 模型设置
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
    <t-content class="h-full">
      <BaseSetting v-if="page === '1'" />
      <AiSetting v-if="page === '2'" />
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import { useBoolState } from '@/hooks'
import { RobotIcon, Setting1Icon, ViewListIcon } from 'tdesign-icons-vue-next'
import BaseSetting from '@/nested/setting/components/BaseSetting.vue'
import AiSetting from '@/nested/setting/components/AiSetting.vue'

const [collapsed, toggleCollapsed] = useBoolState(false, '/page/setting/collapsed')
const page = ref('1')
</script>
<style scoped lang="less"></style>
