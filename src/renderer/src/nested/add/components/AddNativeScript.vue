<template>
  <div class="m-8px">
    <t-card size="small">
      <t-form :data="data">
        <t-form-item label="执行程序" label-align="top">
          <div class="flex gap-8px">
            <t-input v-model="data.openWith" placeholder="脚本解释器路径" />
            <t-button variant="outline" @click="handleSelectShell">选择</t-button>
          </div>
        </t-form-item>
        <t-form-item label="脚本名称" label-align="top">
          <t-input v-model="data.name" placeholder="输入脚本名称" />
        </t-form-item>
        <t-form-item label="脚本内容" label-align="top">
          <MonacoEditor
            v-model="data.script"
            :language="monacoLanguage"
            height="300px"
            placeholder="输入脚本内容..."
          />
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
  script: '',
  openWith: ''
})

const isWindows = computed(() => window.supportAPI.isWindows())
const isMacOS = computed(() => window.supportAPI.isMacOS())

const defaultShell = computed(() => {
  if (isWindows.value) return 'cmd.exe'
  if (isMacOS.value) return '/bin/zsh'
  return '/bin/sh'
})

watch(
  () => defaultShell.value,
  (val) => {
    if (!data.value.openWith) data.value.openWith = val
  },
  { immediate: true }
)

const monacoLanguage = computed(() => {
  if (isWindows.value) return 'bat'
  if (isMacOS.value) return 'bash'
  return 'bash'
})

const handleSelectShell = () => {
  window.supportAPI.dialog
    .showOpenDialogSync({
      properties: ['openFile']
    })
    .then((result) => {
      if (result?.[0]) {
        data.value.openWith = result[0]
      }
    })
}

const handleSubmit = () => {
  const params = new URLSearchParams(location.search)
  if (!data.value.openWith) return

  window.desktopAPI.updateNode({
    id: useSnowflake().nextId(),
    type: 'script',
    name: data.value.name || '本地脚本',
    icon: 'icon:sh',
    parentId: params.get('parentId') || null,
    sortIndex: 0,
    desktopId: params.get('desktopId') || '',
    x: Number(params.get('x')),
    y: Number(params.get('y')),
    column: 1,
    row: 1,
    meta: {
      root: data.value.script,
      openWith: data.value.openWith
    }
  })
}
</script>
<style scoped lang="less"></style>
