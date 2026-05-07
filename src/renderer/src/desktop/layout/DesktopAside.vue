<template>
  <div class="desktop-aside">
    <div class="container">
      <t-button
        theme="primary"
        shape="square"
        :variant="desktopId === 'default' ? undefined : 'text'"
        @click="handleClick('default')"
      >
        <template #icon>
          <home-icon />
        </template>
      </t-button>

      <t-button
        v-for="w in workspaces"
        :key="w.id"
        theme="primary"
        :variant="desktopId === w.id ? undefined : 'text'"
        shape="square"
        @click="handleClick(w.id)"
      >
        <template #icon>
          <dashboard1-icon />
        </template>
      </t-button>

      <t-button theme="primary" shape="square" variant="text" @click="openDesktopWorkspaceAdd()">
        <template #icon>
          <add-icon />
        </template>
      </t-button>
    </div>
    <div class="setting">
      <t-button shape="square" @click="openSettingWindow()">
        <template #icon>
          <setting-icon />
        </template>
      </t-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { AddIcon, Dashboard1Icon, HomeIcon, SettingIcon } from 'tdesign-icons-vue-next'
import { openSettingWindow } from '@/global/BuiltinList'
import { openDesktopWorkspaceAdd } from '@/desktop/layout/func/DesktopWorkspace'
import { useDesktopNodeStore } from '@/store'

const workspaces = computed(() => useDesktopNodeStore().workspaces)
const { desktopId } = toRefs(useDesktopNodeStore())

const handleClick = (id: string) => {
  desktopId.value = id
}
</script>
<style scoped lang="less">
.desktop-aside {
  position: absolute;
  left: 0;
  top: 32px;
  bottom: 0;
  width: 48px;
  border-right: 1px solid var(--td-border-level-1-color);

  .container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 48px;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .setting {
    position: absolute;
    left: 8px;
    bottom: 8px;
    right: 8px;
    width: 32px;
    height: 32px;
  }
}
</style>
