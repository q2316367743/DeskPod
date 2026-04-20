export interface WindowOptions {
  // 窗口标签，必填
  label: string
  // 启动的文件，必填
  url: string

  icon?: string
  center?: boolean
  x?: number
  y?: number
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  // preventOverflow?: boolean | PreventOverflowMargin
  resizable?: boolean
  title?: string
  fullscreen?: boolean
  focus?: boolean
  focusable?: boolean
  transparent?: boolean
  maximized?: boolean
  visible?: boolean
  decorations?: boolean
  alwaysOnTop?: boolean
  alwaysOnBottom?: boolean
  contentProtected?: boolean
  skipTaskbar?: boolean
  shadow?: boolean
  // theme?: Theme
  // titleBarStyle?: TitleBarStyle
  // trafficLightPosition?: LogicalPosition
  hiddenTitle?: boolean
  tabbingIdentifier?: string
  maximizable?: boolean
  minimizable?: boolean
  closable?: boolean
  // parent?: Window | WebviewWindow | string
  visibleOnAllWorkspaces?: boolean
  // windowEffects?: Effects
  // backgroundColor?: Color
  // backgroundThrottling?: BackgroundThrottlingPolicy
  javascriptDisabled?: boolean
  allowLinkPreview?: boolean
  disableInputAccessoryView?: boolean
  // scrollBarStyle?: ScrollBarStyle
}

export interface ViewOptions {
  x: number
  y: number
  width: number
  height: number
}

export enum TauriEvent {
  WINDOW_RESIZED = 'tauri://resize',
  WINDOW_MOVED = 'tauri://move',
  WINDOW_CLOSE_REQUESTED = 'tauri://close-requested',
  WINDOW_DESTROYED = 'tauri://destroyed',
  WINDOW_FOCUS = 'tauri://focus',
  WINDOW_BLUR = 'tauri://blur',
  WINDOW_SCALE_FACTOR_CHANGED = 'tauri://scale-change',
  WINDOW_THEME_CHANGED = 'tauri://theme-changed',
  WINDOW_CREATED = 'tauri://window-created',
  WEBVIEW_CREATED = 'tauri://webview-created',
  DRAG_ENTER = 'tauri://drag-enter',
  DRAG_OVER = 'tauri://drag-over',
  DRAG_DROP = 'tauri://drag-drop',
  DRAG_LEAVE = 'tauri://drag-leave'
}
