<template>
  <div class="plugin-manager">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <h1 class="page-title">插件管理</h1>
      <div class="toolbar-actions">
        <button class="btn btn-primary" @click="openInstallDialog">
          <PlusIcon size="16px" />
          安装插件
        </button>
      </div>
    </div>

    <!-- 插件列表 -->
    <div class="plugin-list">
      <div v-if="plugins.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📦</div>
        <p class="empty-text">暂无已安装的插件</p>
        <p class="empty-hint">点击"安装插件"开始使用插件</p>
      </div>

      <PluginCard v-for="plugin in plugins" :key="plugin.identifier" :plugin="plugin" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PlusIcon } from 'tdesign-icons-vue-next'
import type { PluginEntityWrap } from '@common/types'
import { MessageUtil } from '@/utils'
import PluginCard from '@/nested/plugin/components/PluginCard.vue'

const plugins = ref(new Array<PluginEntityWrap>())
const loading = ref(false)

// 加载插件列表
const loadPlugins = async () => {
  loading.value = true
  try {
    plugins.value = await window.pluginAPI.list()
  } catch (e) {
    MessageUtil.error('加载插件列表失败')
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPlugins()
})

// 安装插件
const openInstallDialog = () => {
  window.pluginAPI.toggleInstall()
}
</script>

<style lang="less" scoped>
.plugin-manager {
  min-height: calc(100vh - 48px);
  background: var(--td-bg-color-page);
  padding: 24px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  margin: 0;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border: none;
  border-radius: var(--fluent-radius-smooth);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--fluent-transition-fast);

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.btn-primary {
  background: var(--fluent-accent-color);
  color: #ffffff;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
}

// 插件列表
.plugin-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  color: var(--td-text-color-primary);
  margin: 0 0 8px;
}

.empty-hint {
  font-size: 13px;
  color: var(--td-text-color-placeholder);
  margin: 0;
}

[v-loading] {
  position: relative;
}

[v-loading]::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
