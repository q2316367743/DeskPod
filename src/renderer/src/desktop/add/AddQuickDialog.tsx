import { DialogPlugin } from 'tdesign-vue-next'
import AddQuickDialogContent from '@/desktop/add/AddQuickDialog.vue'

export const openQuickAppDialog = (desktopId: string) => {
  const dp = DialogPlugin({
    header: '新增插件',
    closeOnEscKeydown: false,
    placement: 'center',
    footer: false,
    default: () => (
      <AddQuickDialogContent
        desktopId={desktopId}
        onDestroy={() => {
          dp.destroy()
        }}
      />
    )
  })
}
