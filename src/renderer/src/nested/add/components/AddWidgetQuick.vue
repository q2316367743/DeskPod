<template>
  <div class="m-8px">
    <t-card size="small">
      <div class="widget-grid">
        <div
          v-for="node in nodes"
          :key="node.id"
          class="widget-card"
          :style="{
            gridColumn: `span ${node.meta?.width ?? 1}`,
            gridRow: `span ${node.meta?.width ?? 1}`
          }"
          @click="() => handleChoose(node)"
        >
          <div v-if="!!node.icon" class="widget-preview">
            <t-image :src="node.icon" class="w-48px h-48px" style="border-radius: 8px" />
          </div>
          <div v-else class="widget-placeholder">
            <span :style="{ fontSize: '24px', color: 'var(--td-brand-color)' }">+</span>
          </div>
          <div class="widget-name">{{ node.name }}</div>
          <div class="widget-size">{{ node.meta?.width }}×{{ node.meta?.height }}</div>
        </div>
      </div>
    </t-card>
  </div>
</template>
<script lang="ts" setup>
import { quickAppToWidgetNode } from '../func/QuickFunc'
import { DesktopNode } from '@common/types'
import { useSnowflake } from '@common/utils'
import { MessageUtil } from '@/utils'

const params = new URLSearchParams(location.search)

const desktopId = params.get('desktopId') || ''

const nodes = ref(new Array<DesktopNode>())

const handleChoose = (node: DesktopNode) => {
  window.desktopAPI
    .updateNode({
      ...toRaw(node),
      id: useSnowflake().nextId(),
      x: Number(params.get('x')),
      y: Number(params.get('y'))
    })
    .then(() => {
      MessageUtil.success('成功添加小部件')
    })
    .catch((e) => {
      MessageUtil.error('添加失败', e)
    })
}

onMounted(() => {
  window.quickAPI.list().then((q) => {
    nodes.value = q
      .filter((app) => app.type === 'widget')
      .map((app) => quickAppToWidgetNode(app, desktopId))
  })
})
</script>
<style scoped lang="less">
.widget-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 12px;
  padding: 8px;
}

.widget-card {
  background: var(--td-bg-color-container);
  border: 1px solid var(--td-border-level-1-color);
  border-radius: var(--fluent-radius-smooth);
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:hover {
    border-color: var(--td-brand-color);
    box-shadow: 0 2px 8px rgba(0, 120, 212, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

.widget-preview {
  width: 100%;
  flex: 1;
  min-height: 60px;
  border-radius: 4px;
  background-color: var(--td-bg-color-page);
  display: flex;
  align-items: center;
  justify-content: center;
}

.widget-placeholder {
  width: 100%;
  flex: 1;
  min-height: 60px;
  border-radius: 4px;
  background-color: var(--td-bg-color-page);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed var(--td-gray-color-5);
}

.widget-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--td-text-color-primary);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.widget-size {
  font-size: 11px;
  color: var(--td-text-color-secondary);
  text-align: center;
}

.widget-empty {
  font-size: 14px;
  padding: 48px;
  text-align: center;
  color: var(--td-text-color-secondary);
}
</style>
