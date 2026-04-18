import { DialogPlugin } from 'tdesign-vue-next'
import AddPluginDialogContent from './AddPluginDialog.vue'

export const openPluginAppDialog = (desktopId: string) => {
  const dp = DialogPlugin({
    header: '新增插件',
    closeOnEscKeydown: false,
    placement: 'center',
    footer: false,
    default: () => (
      <AddPluginDialogContent
        desktopId={desktopId}
        onDestroy={() => {
          dp.destroy()
        }}
      />
    )
  })
}
