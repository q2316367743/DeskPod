import { DialogPlugin } from 'tdesign-vue-next'
import MonacoEditor from '@/components/MonacoEditor/MonacoEditor.vue'

export function openDbLmdbValue(key: string) {
  const value = ref('{}')
  window.dbAPI.lmdb.main
    .value(key)
    .then((res) => {
      value.value = JSON.stringify(res, null, 2)
    })
    .catch((e) => {
      value.value = `获取「${key}」失败：${e.message || e}`
    })
  DialogPlugin({
    header: key,
    placement: 'center',
    footer: false,
    width: '80vw',
    default: () => (
      <MonacoEditor modelValue={value.value} language={'json'} height={'calc(100vh - 250px)'} />
    )
  })
}
