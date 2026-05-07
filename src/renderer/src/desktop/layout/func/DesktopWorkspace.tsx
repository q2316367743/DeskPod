import { DialogPlugin, Form, FormItem, Input } from 'tdesign-vue-next'
import { useDesktopNodeStore } from '@/store'
import { MessageUtil } from '@/utils'

export function openDesktopWorkspaceAdd() {
  const data = ref({
    name: '',
    icon: ''
  })
  const dp = DialogPlugin({
    header: '新增工作空间',
    confirmBtn: '新增',
    onConfirm: () => {
      useDesktopNodeStore()
        .addWorkspace(data.value)
        .then(() => {
          MessageUtil.success('新增成功')
          dp.destroy()
        })
        .catch((e) => {
          MessageUtil.error('新增失败', e)
        })
    },
    default: () => (
      <Form data={data.value}>
        <FormItem label={'工作空间名称'} labelAlign={'top'}>
          <Input v-model={data.value.name} />
        </FormItem>
      </Form>
    )
  })
}
