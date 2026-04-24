<template>
  <t-layout class="h-full w-full">
    <t-header>
      <t-head-menu value="/">
        <t-menu-item to="/" value="/">AI</t-menu-item>
        <t-menu-item to="/html" value="/html">html</t-menu-item>
        <t-menu-item to="/zip" value="/zip">zip</t-menu-item>
        <template #operations>
          <div class="pl-8px">
            <t-button theme="primary" shape="square" @click="handleAdd">
              <template #icon>
                <AddIcon />
              </template>
            </t-button>
          </div>
        </template>
      </t-head-menu>
    </t-header>
    <t-content class="h-full w-full">
      <div class="tools-list-container">
        <t-row v-if="apps.length > 0" :gutter="[8, 8]">
          <t-col v-for="tool in apps" :key="tool.id" flex="393px">
            <t-card hover shadow>
              <div class="card-content">
                <!-- 工具图标和标题 -->
                <div class="tool-header">
                  <div class="tool-icon">
                    <!--                  <UtoolsImage :url="`/attachment/${tool.id}`" :alt="tool.title" />-->
                    <quick-icon :app="tool" />
                  </div>
                  <div class="tool-info">
                    <t-link class="tool-name" theme="primary">{{ tool.name }}</t-link>

                    <p class="tool-description">{{ tool.description || '暂无描述' }}</p>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="tool-actions justify-between items-center" @click.stop>
                  <t-space size="small">
                    <t-button size="small" variant="text" theme="primary" @click="handleEdit(tool)">
                      <template #icon>
                        <EditIcon />
                      </template>
                      编辑
                    </t-button>
                    <t-button
                      size="small"
                      variant="text"
                      theme="danger"
                      @click="handleDelete(tool)"
                    >
                      <template #icon>
                        <DeleteIcon />
                      </template>
                      删除
                    </t-button>
                  </t-space>
                </div>
              </div>
            </t-card>
          </t-col>
        </t-row>
        <!-- 工具列表 -->

        <!-- 空状态 -->
        <div v-else-if="apps.length === 0 && keyword" class="empty-state">
          <EmptyResult title="未找到相关工具" :description="`没有找到包含 '${keyword}' 的工具`" />
        </div>
        <div v-else class="empty-state">
          <EmptyResult title="暂无工具" />
        </div>
      </div>
    </t-content>
  </t-layout>
</template>
<script lang="ts" setup>
import { AddIcon, DeleteIcon, EditIcon } from 'tdesign-icons-vue-next'
import { QuickApp } from '@common/types'
import { MessageBoxUtil, MessageUtil } from '@/utils'
import QuickIcon from '@/desktop/icon/QuickIcon.vue'

const router = useRouter()

const keyword = ref('')

const apps = ref<Array<QuickApp>>([])

const handleEdit = (row: QuickApp) => router.push('/edit/' + row.id)
const handleAdd = () => router.push('/edit/0')
const handleDelete = (row: QuickApp) => {
  // 删除
  MessageBoxUtil.confirm(`是否立即删除工具「${row.name}」，删除后无法恢复`, '删除工具').then(() => {
    window.quickAPI
      .uninstall(row.id)
      .then(() => MessageUtil.success('删除成果'))
      .catch((e) => MessageUtil.error('删除失败', e))
  })
}

const fetchList = async () => {
  const res = await window.quickAPI.list()
  apps.value = res.filter((app) => app.from === 'ai')
}

onMounted(() => fetchList())
</script>
<style scoped lang="less">
.tools-list-container {
  padding: 8px;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  position: relative;
}

.search-container {
  display: flex;
  justify-content: space-between;
  padding: 8px 8px 4px;

  .search {
    width: clamp(300px, 50%, 500px);

    .search-select {
      width: 120px;
    }
  }
}

.tool-card {
  cursor: pointer;
}

.tool-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;

  .tool-icon {
    width: 48px;
    height: 48px;
    margin-right: 12px;
  }

  .tool-info {
    flex: 1;
    min-width: 0;

    .tool-name {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tool-description {
      margin: 0;
      font-size: 14px;
      color: var(--td-text-color-secondary);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

.tool-actions {
  display: flex;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--td-border-level-1-color);
  margin-top: 12px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
</style>
