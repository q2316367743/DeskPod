<template>
  <t-card hover shadow>
    <div class="card-content">
      <div class="app-header">
        <div class="app-icon">
          <quick-icon :app="app" />
        </div>
        <div class="app-info">
          <t-link class="app-name" theme="primary">{{ app.name }}</t-link>
          <div class="app-description">
            <t-tag theme="primary" variant="light">{{ app.from }}</t-tag>
            <t-tag theme="warning" variant="light">
              <span v-if="app.type === 'window'">窗口</span>
              <span v-else-if="app.type === 'widget'">小部件</span>
            </t-tag>
            <t-tag theme="primary" variant="outline">{{ app.width }} x {{ app.height }}</t-tag>
          </div>
        </div>
      </div>
      <div class="app-actions justify-between items-center" @click.stop>
        <t-space size="small">
          <t-button size="small" variant="text" theme="primary" @click="handleUpgrade">
            <template #icon>
              <CloudUploadIcon />
            </template>
            升级
          </t-button>
          <t-button size="small" variant="text" theme="danger" @click="handleUninstall">
            <template #icon><DeleteIcon /></template>
            卸载
          </t-button>
        </t-space>
      </div>
    </div>
  </t-card>
</template>

<script lang="ts" setup>
import { DeleteIcon, CloudUploadIcon } from 'tdesign-icons-vue-next'
import type { QuickApp } from '@common/types'
import QuickIcon from '@/desktop/icon/QuickIcon.vue'

defineProps<{
  app: QuickApp
}>()

const emit = defineEmits(['upgrade', 'uninstall'])

const handleUpgrade = () => emit('upgrade')
const handleUninstall = () => emit('uninstall')
</script>

<style lang="less" scoped>
.app-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;

  .app-icon {
    width: 48px;
    height: 48px;
    margin-right: 12px;
  }

  .app-info {
    flex: 1;
    min-width: 0;

    .app-name {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .app-description {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }
}

.app-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--td-border-level-1-color);
  margin-top: 12px;
}
</style>
