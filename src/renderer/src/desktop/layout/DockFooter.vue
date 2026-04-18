<template>
  <div class="dock-footer">
    <div class="dock-container">
      <div class="dock-inner">
        <!-- 应用图标 -->
        <template v-for="item in list" :key="item.id">
          <FolderNode
            v-if="item.type === 'folder'"
            :node="item"
            :items="folderMap.get(item.id) || []"
            :dock-mode="true"
          />
          <ItemNode v-else :node="item" :dock-mode="true" />
        </template>

        <div class="dock-divider"></div>

        <t-tooltip v-for="b in builtinList" :key="b.id" :content="b.name">
          <div class="disabled-btn" @click="handleClick(b)">
            <div class="disabled-icon-wrapper">
              <AppIcon v-if="b.id === 'plugin'" size="24px" />
              <InternetIcon v-else-if="b.id === 'quick'" size="24px" />
            </div>
          </div>
        </t-tooltip>

        <div class="disabled-btn" title="设置">
          <div class="disabled-icon-wrapper">
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="3" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppIcon, InternetIcon } from 'tdesign-icons-vue-next'
import { DesktopNode } from '@common/types'
import { builtinList } from '@/global/BuiltinList'
import { useDesktopNodeStore } from '@/store/DesktopNodeStore'
import ItemNode from '@/desktop/node/ItemNode.vue'
import FolderNode from '@/desktop/node/FolderNode.vue'

const items = computed(() => useDesktopNodeStore().dockNodes)

const list = computed(() => items.value.filter((item) => item.parentId === '0' || !item.parentId))
const folderMap = computed(() => {
  const l = items.value.filter((item) => item.parentId !== '0' && item.parentId)
  const map = new Map<string, Array<DesktopNode>>()
  for (let desktopNode of l) {
    const t = map.get(desktopNode.parentId!)
    if (t) {
      t.push(desktopNode)
    } else {
      map.set(desktopNode.id, [desktopNode])
    }
  }
  return map
})

const handleClick = (node: DesktopNode) => {
  window.desktopAPI.openApp(toRaw(node))
}
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
  background: var(--fluent-acrylic-bg);
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
</style>
