enum ScrollBarStyle {
  Default = 'default',
  FluentOverlay = 'fluentOverlay'
}

type Color =
  | [number, number, number]
  | [number, number, number, number]
  | { red: number; green: number; blue: number; alpha: number }
  | string

enum BackgroundThrottlingPolicy {
  Disabled = 'disabled',
  Throttle = 'throttle',
  Suspend = 'suspend'
}

export interface WebviewOptions {
  url?: string
  x: number
  y: number
  width: number
  height: number
  transparent?: boolean
  focus?: boolean
  dragDropEnabled?: boolean
  acceptFirstMouse?: boolean
  userAgent?: string
  incognito?: boolean
  proxyUrl?: string
  zoomHotkeysEnabled?: boolean
  useHttpsScheme?: boolean
  devtools?: boolean
  backgroundColor?: Color
  backgroundThrottling?: BackgroundThrottlingPolicy
  javascriptDisabled?: boolean
  allowLinkPreview?: boolean
  disableInputAccessoryView?: boolean
  dataDirectory?: string
  dataStoreIdentifier?: number[]
  scrollBarStyle?: ScrollBarStyle
  generalAutofillEnabled?: boolean
}

export interface WindowOptions extends WebviewOptions {
  label: string
  icon?: string
}

export interface ViewOptions {
  x: number
  y: number
  width: number
  height: number
}
