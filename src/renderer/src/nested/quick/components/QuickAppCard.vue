<template>
  <div class="quick-app-card">
    <div class="app-icon">
      <QuickIcon :app="app" />
    </div>

    <div class="app-info">
      <div class="app-name">{{ app.name }}</div>
      <div class="app-meta">
        <span class="app-type">
          <WindowIcon v-if="app.type === 'window'" size="12px" />
          <GridViewIcon v-else size="12px" />
          {{ app.type === 'window' ? '独立窗口' : '小部件' }}
        </span>
        <span class="app-from">
          {{ fromLabel }}
        </span>
        <span v-if="app.width && app.height" class="app-size">
          {{ app.width }} × {{ app.height }}
        </span>
      </div>
    </div>

    <div class="app-actions">
      <button class="action-btn" title="升级" @click="$emit('upgrade', app)">
        <CloudUploadIcon size="16px" />
      </button>
      <button class="action-btn action-btn-danger" title="卸载" @click="$emit('uninstall', app)">
        <DeleteIcon size="16px" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DeleteIcon, WindowIcon, GridViewIcon, CloudUploadIcon } from 'tdesign-icons-vue-next'
import type { QuickApp } from '@common/types'
import QuickIcon from '@/desktop/icon/QuickIcon.vue'

const props = defineProps<{
  app: QuickApp
}>()

defineEmits<{
  upgrade: [app: QuickApp]
  uninstall: [app: QuickApp]
}>()

const fromLabelMap: Record<string, string> = {
  ai: 'AI 生成',
  html: 'HTML 文件',
  zip: 'ZIP 压缩包'
}

const fromLabel = computed(() => fromLabelMap[props.app.from] || props.app.from)
</script>

<style lang="less" scoped>
.quick-app-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--fluent-card-bg);
  backdrop-filter: var(--fluent-acrylic-blur);
  border: 1px solid var(--fluent-border-subtle);
  border-radius: var(--fluent-radius-card);
  box-shadow: var(--fluent-card-shadow);
  transition: all var(--fluent-transition-fast);

  &:hover {
    background: var(--fluent-card-bg-hover);
    box-shadow: var(--fluent-card-shadow-hover);
  }
}

.app-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--fluent-radius-smooth);
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.app-icon-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--fluent-gradient-primary);
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
}

.app-info {
  flex: 1;
  min-width: 0;
}

.app-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin-bottom: 4px;
}

.app-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-type,
.app-from,
.app-size {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: var(--fluent-radius-smooth);
}

.app-type {
  color: var(--td-text-color-brand);
  background: var(--fluent-accent-light);
}

.app-from {
  color: var(--td-text-color-secondary);
  background: var(--td-bg-color-secondarycontainer);
}

.app-size {
  color: var(--td-text-color-placeholder);
  background: var(--td-bg-color-component);
}

.app-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: var(--fluent-radius-smooth);
  color: var(--td-text-color-secondary);
  cursor: pointer;
  transition: all var(--fluent-transition-fast);

  &:hover {
    background: var(--fluent-item-hover);
    color: var(--td-text-color-primary);
  }
}

.action-btn-danger {
  &:hover {
    background: var(--td-error-color-1);
    color: var(--td-error-color-3);
  }
}
</style>
