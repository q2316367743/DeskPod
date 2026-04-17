<template>
  <div class="flex gap-8px w-full">
    <t-input v-model="data" class="w-full" :placeholder />
    <t-button variant="outline" theme="primary" @click="handleSelect">{{ btn }}</t-button>
  </div>
</template>
<script lang="ts" setup>
interface DialogFilter {
  /** Filter name. */
  name: string
  /**
   * Extensions to filter, without a `.` prefix.
   * @example
   * ```typescript
   * extensions: ['svg', 'png']
   * ```
   */
  extensions: string[]
}

const data = defineModel({
  type: String,
  default: ''
})

const props = defineProps({
  title: String,
  defaultPath: String,
  buttonLabel: String,
  filters: {
    type: Object as PropType<Array<DialogFilter>>
  },
  placeholder: String,
  btn: String,
  properties: {
    type: Object as PropType<
      Array<
        | 'openFile'
        | 'openDirectory'
        | 'multiSelections'
        | 'showHiddenFiles'
        | 'createDirectory'
        | 'promptToCreate'
        | 'noResolveAliases'
        | 'treatPackageAsDirectory'
        | 'dontAddToRecent'
      >
    >
  },
  message: String,
  securityScopedBookmarks: String,
  label: String,
  directory: String
})

const btn = computed(() => {
  if (props.label) return props.label
  if (props.directory) return '选择文件夹'
  return '选择文件'
})

const handleSelect = () => {
  window.supportAPI.shellOpenDialog(toRaw(props) as never).then((result) => {
    data.value = result?.[0] || ''
  })
}
</script>
<style scoped lang="less"></style>
