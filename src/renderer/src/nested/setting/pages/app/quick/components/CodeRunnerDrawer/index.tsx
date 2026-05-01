import { DrawerPlugin, Loading } from 'tdesign-vue-next'
import './CodeRunner.less'

interface DrawerOptions {
  width?: string
  title?: string
  closable?: boolean
  maskClosable?: boolean
  footer?: boolean
}

// 使用TDesign的DrawerPlugin打开抽屉
export const openCodeRunnerDrawer = async (html: string, options: DrawerOptions = {}) => {
  const url = ref('')
  const blob = new Blob([html], { type: 'text/html' })
  url.value = URL.createObjectURL(blob)

  const dp = DrawerPlugin({
    header: options.title || '抽屉',
    size: options.width || '50vw',
    closeOnOverlayClick: false,
    footer: options.footer ?? true,
    confirmBtn: '添加到工具',
    closeBtn: true,
    onCancel() {
      dp.destroy?.()
    },
    default: () => (
      <>
        <div class="iframe-container">
          {url.value ? (
            <webview
              src={url.value}
              class="preview-iframe w-full"
              style={{
                height: (options.footer ?? true) ? 'calc(100vh - 121px)' : 'calc(100vh - 94px)',
                marginTop: '-6px'
              }}
            ></webview>
          ) : (
            <Loading loading={true} text={'正在缓存远程资源'} class={'w-full h-full'} />
          )}
        </div>
      </>
    ),
    onClose() {
      URL.revokeObjectURL(url.value)
      dp.destroy?.()
    }
  })
}
