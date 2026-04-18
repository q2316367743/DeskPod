import { DialogPlugin } from 'tdesign-vue-next'
import AddQuickDialogContent from '@/desktop/add/AddQuickDialog.vue'

export const openQuickAppDialog = (desktopId: string, column: number, row: number) => {
  const dp = DialogPlugin({
    header: '新增插件',
    closeOnEscKeydown: false,
    placement: 'center',
    footer: false,
    default: () => (
      <AddQuickDialogContent
        desktopId={desktopId}
        column={column}
        row={row}
        onDestroy={() => {
          dp.destroy()
        }}
      />
    )
  })
}
