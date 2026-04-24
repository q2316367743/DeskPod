<template>
  <div class="dock-footer">
    <div class="dock-container">
      <div class="dock-inner" @contextmenu.stop="handleDesktopDockCxt($event, 0, 0)">
        <t-tooltip content="我的">
          <div class="disabled-btn" @click="handleClick(builtinHomeNode)">
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
          <div class="disabled-btn" @click="handleClick(b)">
            <div class="disabled-icon-wrapper">
              <AppIcon v-if="b.id === 'plugin'" size="24px" />
              <InternetIcon v-else-if="b.id === 'quick'" size="24px" />
              <SettingIcon v-else-if="b.id === 'setting'" size="24px" />
            </div>
          </div>
        </t-tooltip>
        <div class="dock-divider"></div>
        <t-tooltip content="回收站">
          <div ref="trashRef" class="disabled-btn">
            <div class="disabled-icon-wrapper">
              <delete-icon size="24px" />
            </div>
          </div>
        </t-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppIcon, DeleteIcon, HomeIcon, InternetIcon, SettingIcon } from 'tdesign-icons-vue-next'
import { DesktopNode } from '@common/types'
import { builtinHomeNode, builtinList } from '@/global/BuiltinList'
import { useDesktopNodeStore } from '@/store/DesktopNodeStore'
import ItemNode from '@/desktop/node/ItemNode.vue'
import { GridStack } from 'gridstack'
import { MessageUtil } from '@/utils'
import { handleDesktopDockCxt } from '@/desktop/layout/func/DesktopGridCxt'
import { handleDesktopNodeCxt } from '@/desktop/layout/func/DesktopNodeCxt'

// 回收站
let grid: GridStack | null = null
const trashRef = ref()

const items = computed(() => useDesktopNodeStore().dockNodes)
const list = computed(() => items.value.filter((item) => item.parentId === '0' || !item.parentId))

const handleClick = (node: DesktopNode) => {
  window.desktopAPI.openApp(toRaw(node))
}

onMounted(() => {
  if (!trashRef.value) return

  grid = GridStack.init(
    {
      column: 1,
      row: 1,
      cellHeight: 48,
      acceptWidgets: true
    },
    trashRef.value
  )
  grid.on('dropped', (_event, _previousNode, newNode) => {
    const { el } = newNode
    if (!el) return
    const nodeId = el.dataset['nodeId'] as string
    // 删除
    window.desktopAPI.deleteNode(nodeId)
    const currentNodes = grid?.engine.nodes || []
    for (const gsNode of currentNodes) {
      grid?.removeWidget(gsNode.el!, true)
    }
    MessageUtil.success('删除成功')
  })
})
</script>

<style lang="less" scoped>
.dock-footer {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

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
</style>
