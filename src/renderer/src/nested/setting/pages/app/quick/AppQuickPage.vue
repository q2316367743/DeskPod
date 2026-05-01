<template>
  <div class="app-quick-page">
    <t-tabs v-model="activeTab">
      <t-tab-panel value="ai" label="AI" />
      <t-tab-panel value="html" label="html" />
      <t-tab-panel value="zip" label="zip" />
      <template #action>
        <div class="pt-8px mr-8px">
          <t-button theme="primary" @click="handleAdd">
            <template #icon><AddIcon /></template>
            安装快应用
          </t-button>
        </div>
      </template>
    </t-tabs>
    <div class="app-quick-page">
      <t-row v-if="list.length > 0" :gutter="[8, 8]">
        <t-col v-for="app in list" :key="app.id" flex="300px">
          <quick-app-card :app="app" @upgrade="handleUpgrade(app)" />
        </t-col>
      </t-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AddIcon } from 'tdesign-icons-vue-next'
import { openInstallQuickApp } from '@/nested/setting/pages/app/quick/func/InstallQuickApp'
import { QuickApp, QuickAppFrom } from '@common/types'
import QuickAppCard from '@/nested/setting/pages/app/quick/components/QuickAppCard.vue'
import { openUpgradeQuickApp } from '@/nested/setting/pages/app/quick/func/UpgradeQuickApp'

const router = useRouter()

const activeTab = ref<QuickAppFrom>('ai')

const apps = ref<Array<QuickApp>>([])
const list = computed(() => apps.value.filter((a) => a.from === activeTab.value))

const handleAdd = () => {
  if (activeTab.value === 'ai') {
    router.push('/app/quick/edit/0')
  } else {
    openInstallQuickApp(activeTab.value, () => {})
  }
}

const handleUpgrade = (app: QuickApp) => {
  if (activeTab.value === 'ai') {
    router.push('/app/quick/edit/' + app.id)
  } else {
    openUpgradeQuickApp(app.id, app, fetchList)
  }
}

const fetchList = async () => {
  apps.value = await window.quickAPI.list()
}

onMounted(() => fetchList())
</script>
<style lang="less" scoped>
.app-quick-page {
  height: 100vh;
  width: 100%;
  :deep(.t-tabs__operations--right) {
    border-bottom: unset;
  }
  .app-quick-page {
    height: calc(100vh - 65px);
    width: calc(100% - 16px);
    overflow: auto;
    padding: 8px;
  }
}
</style>
