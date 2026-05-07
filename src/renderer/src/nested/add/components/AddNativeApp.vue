<template>
  <div class="m-8px add-native-app">
    <t-card size="small">
      <!-- 方式二：使用插槽自定义下拉选项内容 -->
      <t-form :data="data">
        <t-form-item label="选择应用" label-align="top">
          <t-select
            v-model="data.appId"
            placeholder="请选择应用"
            :popup-props="{ overlayClassName: 'ana-select__overlay-option' }"
            filterable
          >
            <t-option v-for="app in apps" :key="app.id" :value="app.id" :label="app.name">
              <div class="add-native-app-item">
                <div class="app-icon">
                  <img :src="app.icon" :alt="app.name" />
                </div>
                <div class="app-name">{{ app.name }}</div>
              </div>
            </t-option>
            <template #valueDisplay>
              <div v-if="selectApp" class="add-native-app-item">
                <div class="app-icon">
                  <img :src="selectApp.icon" :alt="selectApp.name" />
                </div>
                <div class="app-name">{{ selectApp.name }}</div>
              </div>
            </template>
          </t-select>
        </t-form-item>
        <t-form-item label="启动参数" label-align="top" help="回车新增参数">
          <t-tag-input v-model="data.args" />
        </t-form-item>
        <t-form-item label-align="top">
          <t-space size="small">
            <t-button theme="primary" @click="handleSubmit()">新增</t-button>
            <t-button theme="default" variant="outline" type="reset">重置</t-button>
          </t-space>
        </t-form-item>
      </t-form>
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

const data = ref({
  appId: '',
  args: new Array<string>()
})

const selectApp = computed(() => apps.value.find((e) => e.id === data.value.appId))

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
    x: Number(params.get('x')),
    y: Number(params.get('y')),
    column: 1,
    row: 1,
    meta: {
      root: app.path,
      args: toRaw(data.value.args)
    }
  })
}

const handleSubmit = () => {
  if (selectApp.value) {
    handleAddApp(selectApp.value)
  }
}

onMounted(async () => {
  apps.value = await window.desktopAPI.nodeAppList()
})
</script>
<style lang="less">
.ana-select__overlay-option {
  .t-select-option {
    height: 48px !important;
  }
}
.add-native-app-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  .app-icon {
    height: 32px;
    width: 32px;
    img {
      height: 32px;
      width: 32px;
    }
  }
  .app-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    text-align: center;
  }
}
</style>
