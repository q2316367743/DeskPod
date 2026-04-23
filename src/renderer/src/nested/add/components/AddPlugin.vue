<template>
  <div class="m-8px">
    <t-card size="small">
      <div class="plugin-dialog-content">
        <div v-if="loading" class="plugin-dialog-loading">加载中...</div>
        <div v-else-if="plugins.length === 0" class="plugin-dialog-empty">暂无已安装的插件</div>
        <div v-else class="plugin-dialog-list">
          <div
            v-for="plugin in plugins"
            :key="plugin.identifier"
            class="plugin-dialog-item"
            @click="handleAddPlugin(plugin)"
          >
            <PluginIcon :plugin="plugin" />
            <div class="plugin-dialog-info">
              <div class="plugin-dialog-name flex gap-8px items-center">
                <div>{{ plugin.productName }}</div>
                <t-tag variant="outline" theme="primary" size="small">v{{ plugin.version }}</t-tag>
              </div>
              <div v-if="plugin.main" class="plugin-dialog-main">
                {{ plugin.description || plugin.main.title }}
              </div>
            </div>
          </div>
        </div>
      </div></t-card
    >
  </div>
</template>

<script lang="ts" setup>
import { pluginEntityToDesktopNode } from '../func/PluginFunc'
import { DesktopNode, PluginEntityWrap } from '@common/types'
import { MessageUtil, useSnowflake } from '@/utils'
import PluginIcon from '@/desktop/icon/PluginIcon.vue'

const plugins = ref<Array<PluginEntityWrap>>([])
const loading = ref(false)

onMounted(() => {
  loading.value = true
  window.pluginAPI
    .list()
    .then((data) => {
      // 过滤掉没有主窗口的插件
      plugins.value = data.filter((app) => Boolean(app.main))
    })
    .finally(() => {
      loading.value = false
    })
})

const handleAddPlugin = (plugin: PluginEntityWrap) => {
  if (!plugin.main) {
    MessageUtil.warning('该插件没有主窗口，无法添加到桌面')
    return
  }
  const params = new URLSearchParams(location.search)

  const node: DesktopNode = {
    ...pluginEntityToDesktopNode(plugin, params.get('desktopId') || ''),
    parentId: params.get('parentId') || null,
    id: useSnowflake().nextId(),
    row: Number(params.get('row')),
    column: Number(params.get('column'))
  }

  window.desktopAPI
    .updateNode(node)
    .then(() => {
      MessageUtil.success('成功添加插件')
    })
    .catch((e) => {
      MessageUtil.error('添加失败', e)
    })
}
</script>

<style lang="less" scoped>
.plugin-dialog-content {
  min-width: 320px;
}

.plugin-dialog-loading,
.plugin-dialog-empty {
  padding: 40px 20px;
  text-align: center;
  color: var(--td-text-color-placeholder);
  font-size: 14px;
}

.plugin-dialog-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.plugin-dialog-item {
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

.plugin-dialog-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--fluent-radius-smooth);
  object-fit: cover;
  flex-shrink: 0;
}

.plugin-dialog-info {
  flex: 1;
  min-width: 0;
}

.plugin-dialog-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--td-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plugin-dialog-version {
  font-size: 12px;
  color: var(--td-text-color-placeholder);
  margin-top: 2px;
}

.plugin-dialog-main {
  font-size: 12px;
  color: var(--td-text-color-secondary);
  margin-top: 2px;
}
</style>
