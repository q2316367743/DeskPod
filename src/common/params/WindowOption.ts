enum ScrollBarStyle {
  Default = 'default',
  FluentOverlay = 'fluentOverlay'
}

export type Color =
  | [number, number, number]
  | [number, number, number, number]
  | { red: number; green: number; blue: number; alpha: number }
  | string

export function colorToHex(color: Color): string {
  let r: number, g: number, b: number
  let a: number | undefined = undefined

  if (typeof color === 'string') return color // 已经是字符串，直接返回

  if (Array.isArray(color)) {
    ;[r, g, b, a] = color
  } else {
    ;({ red: r, green: g, blue: b, alpha: a } = color)
  }

  const hex =
    '#' +
    [r, g, b]
      .map((v) => {
        const n = Math.round(v * 255)
        return n.toString(16).padStart(2, '0')
      })
      .join('')

  // 如果有 alpha 且不为 1，追加 alpha 通道
  if (a !== undefined && a < 1) {
    const alphaHex = Math.round(a * 255)
      .toString(16)
      .padStart(2, '0')
    return hex + alphaHex
  }

  return hex
}

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

enum Effect {
  /**
   * A default material appropriate for the view's effectiveAppearance.  **macOS 10.14-**
   *
   * @deprecated since macOS 10.14. You should instead choose an appropriate semantic material.
   */
  AppearanceBased = 'appearanceBased',
  /**
   *  **macOS 10.14-**
   *
   * @deprecated since macOS 10.14. Use a semantic material instead.
   */
  Light = 'light',
  /**
   *  **macOS 10.14-**
   *
   * @deprecated since macOS 10.14. Use a semantic material instead.
   */
  Dark = 'dark',
  /**
   *  **macOS 10.14-**
   *
   * @deprecated since macOS 10.14. Use a semantic material instead.
   */
  MediumLight = 'mediumLight',
  /**
   *  **macOS 10.14-**
   *
   * @deprecated since macOS 10.14. Use a semantic material instead.
   */
  UltraDark = 'ultraDark',
  /**
   *  **macOS 10.10+**
   */
  Titlebar = 'titlebar',
  /**
   *  **macOS 10.10+**
   */
  Selection = 'selection',
  /**
   *  **macOS 10.11+**
   */
  Menu = 'menu',
  /**
   *  **macOS 10.11+**
   */
  Popover = 'popover',
  /**
   *  **macOS 10.11+**
   */
  Sidebar = 'sidebar',
  /**
   *  **macOS 10.14+**
   */
  HeaderView = 'headerView',
  /**
   *  **macOS 10.14+**
   */
  Sheet = 'sheet',
  /**
   *  **macOS 10.14+**
   */
  WindowBackground = 'windowBackground',
  /**
   *  **macOS 10.14+**
   */
  HudWindow = 'hudWindow',
  /**
   *  **macOS 10.14+**
   */
  FullScreenUI = 'fullScreenUI',
  /**
   *  **macOS 10.14+**
   */
  Tooltip = 'tooltip',
  /**
   *  **macOS 10.14+**
   */
  ContentBackground = 'contentBackground',
  /**
   *  **macOS 10.14+**
   */
  UnderWindowBackground = 'underWindowBackground',
  /**
   *  **macOS 10.14+**
   */
  UnderPageBackground = 'underPageBackground',
  /**
   *  **Windows 11 Only**
   */
  Mica = 'mica',
  /**
   * **Windows 7/10/11(22H1) Only**
   *
   * #### Notes
   *
   * This effect has bad performance when resizing/dragging the window on Windows 11 build 22621.
   */
  Blur = 'blur',
  /**
   * **Windows 10/11**
   *
   * #### Notes
   *
   * This effect has bad performance when resizing/dragging the window on Windows 10 v1903+ and Windows 11 build 22000.
   */
  Acrylic = 'acrylic',
  /**
   * Tabbed effect that matches the system dark preference **Windows 11 Only**
   */
  Tabbed = 'tabbed',
  /**
   * Tabbed effect with dark mode but only if dark mode is enabled on the system **Windows 11 Only**
   */
  TabbedDark = 'tabbedDark',
  /**
   * Tabbed effect with light mode **Windows 11 Only**
   */
  TabbedLight = 'tabbedLight'
}

/**
 * Window effect state **macOS only**
 *
 * @see https://developer.apple.com/documentation/appkit/nsvisualeffectview/state
 *
 * @since 2.0.0
 */
enum EffectState {
  /**
   *  Make window effect state follow the window's active state **macOS only**
   */
  FollowsWindowActiveState = 'followsWindowActiveState',
  /**
   *  Make window effect state always active **macOS only**
   */
  Active = 'active',
  /**
   *  Make window effect state always inactive **macOS only**
   */
  Inactive = 'inactive'
}

/** The window effects configuration object
 *
 * @since 2.0.0
 */
interface Effects {
  /**
   *  List of Window effects to apply to the Window.
   * Conflicting effects will apply the first one and ignore the rest.
   */
  effects: Effect[]
  /**
   * Window effect state **macOS Only**
   */
  state?: EffectState
  /**
   * Window effect corner radius **macOS Only**
   */
  radius?: number
  /**
   *  Window effect color. Affects {@link Effect.Blur} and {@link Effect.Acrylic} only
   * on Windows 10 v1903+. Doesn't have any effect on Windows 7 or Windows 11.
   */
  color?: Color
}

/**
 * Minimum margin to work area
 */
interface PreventOverflowMargin {
  width: number
  height: number
}

type Theme = 'light' | 'dark'
type TitleBarStyle = 'visible' | 'transparent' | 'overlay'

interface LogicalPosition {
  x: number
  y: number
  type: 'Logical'
}

interface WindowParent {
  label: string
}

export interface WindowOptions {
  /** Show window in the center of the screen.. */
  center?: boolean
  /** The initial vertical position in logical pixels. Only applies if `y` is also set. */
  x?: number
  /** The initial horizontal position in logical pixels. Only applies if `x` is also set. */
  y?: number
  /** The initial width in logical pixels. */
  width?: number
  /** The initial height in logical pixels. */
  height?: number
  /** The minimum width in logical pixels. Only applies if `minHeight` is also set. */
  minWidth?: number
  /** The minimum height in logical pixels. Only applies if `minWidth` is also set. */
  minHeight?: number
  /** The maximum width in logical pixels. Only applies if `maxHeight` is also set. */
  maxWidth?: number
  /** The maximum height in logical pixels. Only applies if `maxWidth` is also set. */
  maxHeight?: number
  /**
   * Prevent the window from overflowing the working area (e.g. monitor size - taskbar size)
   * on creation, which means the window size will be limited to `monitor size - taskbar size`
   *
   * Can either be set to `true` or to a {@link PreventOverflowMargin} object to set an additional margin
   * that should be considered to determine the working area
   * (in this case the window size will be limited to `monitor size - taskbar size - margin`)
   *
   * **NOTE**: The overflow check is only performed on window creation, resizes can still overflow
   *
   * #### Platform-specific
   *
   * - **iOS / Android:** Unsupported.
   */
  preventOverflow?: boolean | PreventOverflowMargin
  /** Whether the window is resizable or not. */
  resizable?: boolean
  /** Window title. */
  title?: string
  /** Whether the window is in fullscreen mode or not. */
  fullscreen?: boolean
  /** Whether the window will be initially focused or not. */
  focus?: boolean
  /** Whether the window can be focused or not. */
  focusable?: boolean
  /**
   * Whether the window is transparent or not.
   * Note that on `macOS` this requires the `macos-private-api` feature flag, enabled under `tauri.conf.json > app > macOSPrivateApi`.
   * WARNING: Using private APIs on `macOS` prevents your application from being accepted to the `App Store`.
   */
  transparent?: boolean
  /** Whether the window should be maximized upon creation or not. */
  maximized?: boolean
  /** Whether the window should be immediately visible upon creation or not. */
  visible?: boolean
  /** Whether the window should have borders and bars or not. */
  decorations?: boolean
  /** Whether the window should always be on top of other windows or not. */
  alwaysOnTop?: boolean
  /** Whether the window should always be below other windows. */
  alwaysOnBottom?: boolean
  /** Prevents the window contents from being captured by other apps. */
  contentProtected?: boolean
  /** Whether or not the window icon should be added to the taskbar. */
  skipTaskbar?: boolean
  /**
   *  Whether or not the window has shadow.
   *
   * #### Platform-specific
   *
   * - **Windows:**
   *   - `false` has no effect on decorated window, shadows are always ON.
   *   - `true` will make undecorated window have a 1px white border,
   * and on Windows 11, it will have a rounded corners.
   * - **Linux:** Unsupported.
   *
   * @since 2.0.0
   */
  shadow?: boolean
  /**
   * The initial window theme. Defaults to the system theme.
   *
   * Only implemented on Windows and macOS 10.14+.
   */
  theme?: Theme
  /**
   * The style of the macOS title bar.
   */
  titleBarStyle?: TitleBarStyle
  /**
   * The position of the window controls on macOS.
   *
   * Requires `titleBarStyle: 'overlay'` and `decorations: true`.
   *
   * @since 2.4.0
   */
  trafficLightPosition?: LogicalPosition
  /**
   * If `true`, sets the window title to be hidden on macOS.
   */
  hiddenTitle?: boolean
  /**
   * Defines the window [tabbing identifier](https://developer.apple.com/documentation/appkit/nswindow/1644704-tabbingidentifier) on macOS.
   *
   * Windows with the same tabbing identifier will be grouped together.
   * If the tabbing identifier is not set, automatic tabbing will be disabled.
   */
  tabbingIdentifier?: string
  /**
   * Whether the window's native maximize button is enabled or not. Defaults to `true`.
   */
  maximizable?: boolean
  /**
   * Whether the window's native minimize button is enabled or not. Defaults to `true`.
   */
  minimizable?: boolean
  /**
   * Whether the window's native close button is enabled or not. Defaults to `true`.
   */
  closable?: boolean
  /**
   * Sets a parent to the window to be created. Can be either a {@linkcode Window} or a label of the window.
   *
   * #### Platform-specific
   *
   * - **Windows**: This sets the passed parent as an owner window to the window to be created.
   *   From [MSDN owned windows docs](https://docs.microsoft.com/en-us/windows/win32/winmsg/window-features#owned-windows):
   *     - An owned window is always above its owner in the z-order.
   *     - The system automatically destroys an owned window when its owner is destroyed.
   *     - An owned window is hidden when its owner is minimized.
   * - **Linux**: This makes the new window transient for parent, see <https://docs.gtk.org/gtk3/method.Window.set_transient_for.html>
   * - **macOS**: This adds the window as a child of parent, see <https://developer.apple.com/documentation/appkit/nswindow/1419152-addchildwindow?language=objc>
   */
  parent?: WindowParent | string
  /** Whether the window should be visible on all workspaces or virtual desktops.
   *
   * #### Platform-specific
   *
   * - **Windows / iOS / Android:** Unsupported.
   *
   * @since 2.0.0
   */
  visibleOnAllWorkspaces?: boolean
  /**
   * Window effects.
   *
   * Requires the window to be transparent.
   *
   * #### Platform-specific:
   *
   * - **Windows**: If using decorations or shadows, you may want to try this workaround <https://github.com/tauri-apps/tao/issues/72#issuecomment-975607891>
   * - **Linux**: Unsupported
   */
  windowEffects?: Effects
  /**
   * Set the window background color.
   *
   * #### Platform-specific:
   *
   * - **Android / iOS:** Unsupported.
   * - **Windows**: alpha channel is ignored.
   *
   * @since 2.1.0
   */
  backgroundColor?: Color

  /** Change the default background throttling behaviour.
   *
   * ## Platform-specific
   *
   * - **Linux / Windows / Android**: Unsupported. Workarounds like a pending WebLock transaction might suffice.
   * - **iOS**: Supported since version 17.0+.
   * - **macOS**: Supported since version 14.0+.
   *
   * see https://github.com/tauri-apps/tauri/issues/5250#issuecomment-2569380578
   *
   * @since 2.3.0
   */
  backgroundThrottling?: BackgroundThrottlingPolicy
  /**
   * Whether we should disable JavaScript code execution on the webview or not.
   */
  javascriptDisabled?: boolean
  /**
   * on macOS and iOS there is a link preview on long pressing links, this is enabled by default.
   * see https://docs.rs/objc2-web-kit/latest/objc2_web_kit/struct.WKWebView.html#method.allowsLinkPreview
   */
  allowLinkPreview?: boolean
  /**
   * Allows disabling the input accessory view on iOS.
   *
   * The accessory view is the view that appears above the keyboard when a text input element is focused.
   * It usually displays a view with "Done", "Next" buttons.
   */
  disableInputAccessoryView?: boolean
  /**
   * Specifies the native scrollbar style to use with the webview.
   * CSS styles that modify the scrollbar are applied on top of the native appearance configured here.
   *
   * Defaults to `default`, which is the browser default.
   *
   * ## Platform-specific
   *
   * - **Windows**:
   *   - `fluentOverlay` requires WebView2 Runtime version 125.0.2535.41 or higher, and does nothing
   *     on older versions.
   *   - This option must be given the same value for all webviews.
   * - **Linux / Android / iOS / macOS**: Unsupported. Only supports `Default` and performs no operation.
   */
  scrollBarStyle?: ScrollBarStyle
  /**
   * The name of the Android activity to create for this window.
   */
  activityName?: string
  /**
   * The name of the Android activity that is creating this webview window.
   *
   * This is important to determine which stack the activity will belong to.
   */
  createdByActivityName?: string
  /**
   * Sets the identifier of the UIScene that is requesting the creation of this new scene,
   * establishing a relationship between the two scenes.
   *
   * By default the system uses the foreground scene.
   */
  requestedBySceneIdentifier?: string
}

export interface PluginWebviewWindowOptions
  extends Omit<WebviewOptions, 'x' | 'y' | 'width' | 'height'>, WindowOptions {
  label: string
  parent: string
  icon?: string
}

export interface PluginWebviewOptions extends WebviewOptions {
  label: string
}

export interface ViewOptions {
  x: number
  y: number
  width: number
  height: number
}
