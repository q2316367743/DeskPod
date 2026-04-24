<template>
  <div class="m-8px">
    <t-card size="small">
      <div class="quick-dialog-content">
        <div v-if="loading" class="quick-dialog-loading">加载中...</div>
        <div v-else-if="apps.length === 0" class="quick-dialog-empty">暂无已安装的快应用</div>
        <div v-else class="quick-dialog-list">
          <div
            v-for="app in apps"
            :key="app.id"
            class="quick-dialog-item"
            @click="handleAddPlugin(app)"
          >
            <QuickIcon :app="app" class="quick-dialog-icon" />
            <div class="quick-dialog-info">
              <div class="quick-dialog-name">{{ app.name }}</div>
              <div class="quick-dialog-main">{{ app.width }} x {{ app.height }}</div>
            </div>
          </div>
        </div>
      </div>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { quickAppToDesktopNode } from '../func/QuickFunc'
import { QuickApp } from '@common/types'
import { DesktopNode } from '@common/types'
import { MessageUtil, useSnowflake } from '@/utils'
import { useDesktopNodeStore } from '@/store/DesktopNodeStore'
import QuickIcon from '@/desktop/icon/QuickIcon.vue'

const apps = ref<Array<QuickApp>>([])
const loading = ref(false)

onMounted(() => {
  loading.value = true
  window.quickAPI
    .list()
    .then((data) => {
      apps.value = data.filter((app) => app.type === 'window')
    })
    .finally(() => {
      loading.value = false
    })
})

const handleAddPlugin = (app: QuickApp) => {
  const params = new URLSearchParams(location.search)
  const node: DesktopNode = {
    ...quickAppToDesktopNode(app, params.get('desktopId') || ''),
    parentId: params.get('parentId') || null,
    id: useSnowflake().nextId(),
    x: Number(params.get('x')),
    y: Number(params.get('y'))
  }

  window.desktopAPI
    .updateNode(node)
    .then(() => {
      MessageUtil.success('成功添加快应用')
      useDesktopNodeStore().init()
    })
    .catch((e) => {
      MessageUtil.error('添加失败', e)
    })
}
</script>

<style lang="less" scoped>
.quick-dialog-content {
  min-width: 320px;
}

.quick-dialog-loading,
.quick-dialog-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--td-text-color-placeholder);
  font-size: 14px;
}

.quick-dialog-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.quick-dialog-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--fluent-radius-smooth);
  cursor: pointer;
  transition: all var(--fluent-transition-fast);
  border: 1px solid transparent;

  &:hover {
    background: var(--fluent-item-hover);
    border-color: var(--fluent-border-subtle);
  }
}

.quick-dialog-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--fluent-radius-smooth);
  object-fit: cover;
  flex-shrink: 0;
}

.quick-dialog-info {
  flex: 1;
  min-width: 0;
}

.quick-dialog-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--td-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.quick-dialog-version {
  font-size: 12px;
  color: var(--td-text-color-placeholder);
  margin-top: 2px;
}

.quick-dialog-main {
  font-size: 12px;
  color: var(--td-text-color-secondary);
  margin-top: 2px;
}
</style>
