<template>
  <div
    class="plugin-card"
    @mouseenter="$emit('hover', plugin.identifier)"
    @mouseleave="$emit('hover', '')"
  >
    <div class="plugin-icon">
      <img
        v-if="plugin.icon"
        :src="iconSrc"
        :alt="plugin.productName"
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
      <div v-else class="plugin-icon-placeholder">
        {{ plugin.productName.charAt(0).toUpperCase() }}
      </div>
    </div>

    <div class="plugin-info">
      <div class="plugin-name">{{ plugin.productName }}</div>
      <div class="plugin-meta">
        <span class="plugin-id">{{ plugin.identifier }}</span>
        <span class="plugin-version">v{{ plugin.version }}</span>
      </div>
      <div class="plugin-description">
        <span v-if="plugin.main" class="plugin-capability">
          <WindowIcon size="12px" />
          主窗口
        </span>
        <span v-if="plugin.weight && plugin.weight.length > 0" class="plugin-capability">
          <GridViewIcon size="12px" />
          {{ plugin.weight.length }} 个小部件
        </span>
      </div>
    </div>

    <div class="plugin-actions">
      <button class="action-btn" title="查看详情" @click="$emit('detail', plugin)">
        <InfoCircleIcon size="16px" />
      </button>
      <button class="action-btn" title="升级插件" @click="$emit('upgrade', plugin)">
        <cloud-upload-icon size="16px" />
      </button>
      <button
        class="action-btn action-btn-danger"
        title="卸载插件"
        @click="$emit('uninstall', plugin)"
      >
        <DeleteIcon size="16px" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  DeleteIcon,
  InfoCircleIcon,
  WindowIcon,
  GridViewIcon,
  CloudUploadIcon
} from 'tdesign-icons-vue-next'
import type { PluginEntityWrap } from '@common/types'

const props = defineProps<{
  plugin: PluginEntityWrap
}>()

defineEmits<{
  hover: [id: string]
  detail: [plugin: PluginEntityWrap]
  upgrade: [plugin: PluginEntityWrap]
  uninstall: [plugin: PluginEntityWrap]
}>()

const iconSrc = computed(() => {
  if (!props.plugin.icon) return ''
  return `file://${props.plugin.root}/runtime/${props.plugin.icon}`
})
</script>

<style lang="less" scoped>
.plugin-card {
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

.plugin-icon {
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

.plugin-icon-placeholder {
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

.plugin-info {
  flex: 1;
  min-width: 0;
}

.plugin-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin-bottom: 4px;
}

.plugin-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.plugin-id {
  font-size: 12px;
  color: var(--td-text-color-placeholder);
  font-family: 'Cascadia Code', 'Fira Code', monospace;
}

.plugin-version {
  font-size: 12px;
  color: var(--td-text-color-secondary);
  background: var(--td-bg-color-secondarycontainer);
  padding: 2px 8px;
  border-radius: var(--fluent-radius-round);
}

.plugin-description {
  display: flex;
  align-items: center;
  gap: 12px;
}

.plugin-capability {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--td-text-color-brand);
  background: var(--fluent-accent-light);
  padding: 2px 8px;
  border-radius: var(--fluent-radius-smooth);
}

.plugin-actions {
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
