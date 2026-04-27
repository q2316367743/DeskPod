<template>
  <div class="dock-footer">
    <div class="dock-container">
      <div class="dock-inner" @contextmenu.stop="handleDesktopDockCxt($event, 0, 0)">
        <t-tooltip content="我的">
          <div class="disabled-btn" @click="handleItemClick(builtinHomeNode)">
            <div class="disabled-icon-wrapper">
              <HomeIcon size="24px" />
            </div>
          </div>
        </t-tooltip>
        <!-- 应用图标 -->
        <t-tooltip v-for="item in list" :key="item.id" :content="item.name">
          <div class="disabled-btn">
            <div class="disabled-icon-wrapper">
              <ItemNode
                :node="item"
                :dock-mode="true"
                @contextmenu.stop="handleDesktopNodeCxt($event, item)"
              />
            </div>
          </div>
        </t-tooltip>
        <div class="dock-divider"></div>

        <t-tooltip v-for="b in builtinList" :key="b.id" :content="b.name">
          <div class="disabled-btn" @click="handleItemClick(b)">
            <div class="disabled-icon-wrapper">
              <AppIcon v-if="b.id === 'plugin'" size="24px" />
              <InternetIcon v-else-if="b.id === 'quick'" size="24px" />
              <SettingIcon v-else-if="b.id === 'setting'" size="24px" />
            </div>
          </div>
        </t-tooltip>
        <div class="dock-divider"></div>
        <t-tooltip v-for="t in taskbars" :key="t.id" :content="t.name">
          <div class="disabled-btn" @click="handleTaskbarClick(t)">
            <div class="disabled-icon-wrapper">
              <item-icon :icon="t.icon" :name="t.name" :size="36" />
            </div>
          </div>
        </t-tooltip>
        <dock-delete-icon />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppIcon, HomeIcon, InternetIcon, SettingIcon } from 'tdesign-icons-vue-next'
import { DesktopNode } from '@common/types'
import { builtinHomeNode, builtinList } from '@/global/BuiltinList'
import { useDesktopNodeStore } from '@/store/DesktopNodeStore'
import ItemNode from '@/desktop/node/ItemNode.vue'
import { handleDesktopDockCxt } from '@/desktop/layout/func/DesktopGridCxt'
import { handleDesktopNodeCxt } from '@/desktop/layout/func/DesktopNodeCxt'
import DockDeleteIcon from '@/desktop/layout/components/DockDeleteIcon.vue'
import ItemIcon from '@/desktop/icon/ItemIcon.vue'

interface TaskbarView {
  id: string
  name: string
  icon: string
  type: 'link' | 'quick' | 'plugin' | 'builtin'
  visible: boolean
}

let removeOnChange: null | (() => void) = null
const taskbars = ref(new Array<TaskbarView>())
const items = computed(() => useDesktopNodeStore().dockNodes)
const list = computed(() => items.value.filter((item) => item.parentId === '0' || !item.parentId))

const handleItemClick = (node: DesktopNode) => {
  window.desktopAPI.openApp(toRaw(node))
}
const handleTaskbarClick = (taskbar: TaskbarView) => {
  window.taskbarAPI.toggle(taskbar.id)
}

onMounted(() => {
  window.taskbarAPI.list().then((list) => {
    taskbars.value = list
  })
  removeOnChange = window.taskbarAPI.onChange(() => {
    window.taskbarAPI.list().then((list) => {
      taskbars.value = list
    })
  })
})
onUnmounted(() => {
  removeOnChange?.()
})
</script>

<style lang="less">
.dock-footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;

  .dock-container {
    backdrop-filter: var(--fluent-acrylic-blur);
    -webkit-backdrop-filter: var(--fluent-acrylic-blur);
    border: 1px solid var(--fluent-border-subtle);
    border-radius: var(--fluent-radius-dock);
    box-shadow: var(--fluent-elevation-3);
    transition: all var(--fluent-transition-normal);
  }

  .dock-inner {
    display: flex;
    align-items: flex-end;
    gap: var(--dock-gap);
  }

  .dock-divider {
    width: 1px;
    height: 40px;
    background: var(--fluent-border-subtle);
    margin: 0 4px;
    align-self: center;
  }

  .disabled-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 48px;
    padding: 8px;
    border-radius: var(--fluent-radius-card);
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    &:hover {
      transform: scale(1.1);
    }

    .disabled-icon-wrapper {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--fluent-radius-smooth);
      background: var(--td-bg-color-component);
      color: var(--td-text-color-primary);
    }

    .disabled-label {
      font-size: 12px;
      color: var(--td-text-color-disabled);
    }
  }
}
</style>
