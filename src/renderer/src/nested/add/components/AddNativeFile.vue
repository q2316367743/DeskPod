<template>
  <div class="m-8px">
    <t-card size="small">
      <t-form :data="data">
        <t-form-item label="文件位置" label-align="top">
          <NFileSelect v-model="data.path" />
        </t-form-item>
        <t-form-item label="文件名" label-align="top">
          <t-input v-model="data.name" />
        </t-form-item>
        <t-form-item label-align="top">
          <t-space size="small">
            <t-button theme="primary" type="submit" @click="handleSubmit">保存</t-button>
            <t-button theme="default" variant="outline" type="reset">清空</t-button>
          </t-space>
        </t-form-item>
      </t-form>
    </t-card>
  </div>
</template>
<script lang="ts" setup>
import { useSnowflake } from '@common/utils'

const data = ref({
  name: '',
  path: ''
})
watchDebounced(
  () => data.value.path,
  (newValue) => {
    data.value.name = window.supportAPI.path.basename(newValue)
  },
  { debounce: 500 }
)

const handleSubmit = () => {
  const params = new URLSearchParams(location.search)
  const ext = window.supportAPI.path.extname(data.value.name)?.substring(1)
  window.desktopAPI.updateNode({
    id: useSnowflake().nextId(),
    type: 'file',
    name: data.value.name,
    icon: `icon:${ext}`,
    parentId: params.get('parentId') || null,
    sortIndex: 0,
    desktopId: params.get('desktopId') || '',
    row: Number(params.get('row')),
    column: Number(params.get('column')),
    meta: {
      root: data.value.path
    }
  })
}
</script>
<style scoped lang="less"></style>
