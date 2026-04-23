<template>
  <div class="m-8px">
    <t-card size="small">
      <t-row :gutter="[16, 16]">
        <t-col v-for="app in apps" :key="app.id" flex="96px">
          <div class="app" :title="app.path" @click="handleAddApp(app)">
            <div class="app-icon">
              <img :src="app.icon" :alt="app.name" />
            </div>
            <div class="app-name">{{ app.name }}</div>
          </div>
        </t-col>
      </t-row>
    </t-card>
  </div>
</template>
<script lang="ts" setup>
import { useSnowflake } from '@common/utils'

interface App {
  id: string
  name: string
  path: string
  icon: string
}
const apps = ref(new Array<App>())

onMounted(async () => {
  apps.value = await window.desktopAPI.nodeAppList()
})

const handleAddApp = (app: App) => {
  const params = new URLSearchParams(location.search)
  window.desktopAPI.updateNode({
    id: useSnowflake().nextId(),
    type: 'app',
    name: app.name,
    icon: app.icon,
    parentId: params.get('parentId') || null,
    sortIndex: 0,
    desktopId: params.get('desktopId') || '',
    row: Number(params.get('row')),
    column: Number(params.get('column')),
    meta: {
      root: app.path
    }
  })
}
</script>
<style scoped lang="less">
.app {
  width: 80px;
  height: 80px;
  padding: 8px;
  border-radius: var(--td-radius-medium);
  border: 1px solid var(--td-border-level-1-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease-in-out;
  .app-icon {
    height: 60px;
    width: 60px;
  }
  .app-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    text-align: center;
  }
  &:hover {
    background-color: var(--td-bg-color-container-hover);
    border-color: var(--td-border-level-2-color);
  }
}
</style>
