import { defineApi } from '$/global/DefineApi'
import { Color, colorToHex, PluginWindowOptions } from '@common/params'
import {
  checkBasePermission,
  createPluginWindow,
  getPluginWindowByLabel,
  getPluginWindowMap
} from '$/module/plugin'

interface BaseArgs {
  label: string
}

interface ValueArgs<T> extends BaseArgs {
  value: T
}

// 此处有问题，window 和 webview 不一样
export default [
  defineApi('plugin:window|get_all_windows', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'get-all-windows')
    return Array.from(getPluginWindowMap(p.pluginId)?.keys() || [])
  }),
  defineApi<{ options: PluginWindowOptions }>('plugin:window|create', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'create')
    await createPluginWindow(a.options, p.pluginId)
  }),
  defineApi<BaseArgs>('plugin:window|is_fullscreen', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'is-fullscreen')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.isFullScreen() || false
  }),
  defineApi<BaseArgs>('plugin:window|is_minimized', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'is-minimized')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.isMinimized() || false
  }),
  defineApi<BaseArgs>('plugin:window|is_maximized', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'is-maximized')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.isMaximized() || false
  }),
  defineApi<BaseArgs>('plugin:window|is_focused', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'is-focused')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.isFocused() || false
  }),
  defineApi<BaseArgs>('plugin:window|is_resizable', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'is-resizable')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.isResizable() || false
  }),
  defineApi<BaseArgs>('plugin:window|is_maximizable', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'is-maximizable')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.isMaximizable() || false
  }),
  defineApi<BaseArgs>('plugin:window|is_minimizable', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'is-minimizable')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.isMinimizable() || false
  }),
  defineApi<BaseArgs>('plugin:window|is_closable', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'is-closable')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.isClosable() || false
  }),
  defineApi<BaseArgs>('plugin:window|is_visible', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'is-visible')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.isVisible() || false
  }),
  defineApi<BaseArgs>('plugin:window|title', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'title')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.title || ''
  }),
  defineApi<BaseArgs>('plugin:window|theme', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'theme')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<BaseArgs>('plugin:window|is_always_on_top', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'is-always-on-top')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.isAlwaysOnTop() || false
  }),
  defineApi<BaseArgs>('plugin:window|activity_name', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'activity-name')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<BaseArgs>('plugin:window|scene_identifier', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'scene-identifier')
    return Promise.reject(new Error('Not implemented'))
  }),

  // Setters
  defineApi<BaseArgs>('plugin:window|center', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'center')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.center()
  }),
  defineApi<BaseArgs>('plugin:window|request_user_attention', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'request-user-attention')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_resizable', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-resizable')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setResizable(a.value)
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_enabled', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-enabled')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setEnabled(a.value)
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|is_enabled', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'is-enabled')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.isEnabled() || false
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_maximizable', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-maximizable')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setMaximizable(a.value)
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_minimizable', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-minimizable')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setMinimizable(a.value)
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_closable', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-closable')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setClosable(a.value)
  }),
  defineApi<ValueArgs<string>>('plugin:window|set_title', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-title')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setTitle(a.value)
  }),
  defineApi<BaseArgs>('plugin:window|maximize', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'maximize')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.maximize()
  }),
  defineApi<BaseArgs>('plugin:window|unmaximize', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'unmaximize')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.unmaximize()
  }),
  defineApi<BaseArgs>('plugin:window|toggle_maximize', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'toggle_maximize')
    const w = getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window
    if (!w) return
    if (w.isMaximized()) {
      w.unmaximize()
    } else {
      w.maximize()
    }
  }),
  defineApi<BaseArgs>('plugin:window|minimize', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'minimize')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.minimize()
  }),
  defineApi<BaseArgs>('plugin:window|unminimize', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'unminimize')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.restore()
  }),
  defineApi<BaseArgs>('plugin:window|show', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'show')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.show()
  }),
  defineApi<BaseArgs>('plugin:window|hide', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'hide')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.hide()
  }),
  defineApi<BaseArgs>('plugin:window|close', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'close')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.close()
  }),
  defineApi<BaseArgs>('plugin:window|destroy', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'destroy')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.destroy()
  }),
  defineApi<BaseArgs>('plugin:window|set_decorations', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-decorations')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_shadow', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-shadow')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setHasShadow(a.value)
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_effects', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-effects')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_always_on_top', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-always-on-top')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setAlwaysOnTop(a.value)
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_always_on_bottom', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-always-on-bottom')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_content_protected', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-content-protected')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setContentProtection(
      a.value
    )
  }),
  defineApi<ValueArgs<{ size: { width: number; height: number } }>>(
    'plugin:window|set_size',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:window', 'set-size')
      return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setSize(
        a.value.size.width,
        a.value.size.height
      )
    }
  ),
  defineApi<ValueArgs<{ size: { width: number; height: number } } | null>>(
    'plugin:window|set_min_size',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:window', 'set-size')
      const w = getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window
      if (!w) return
      return w.setMinimumSize(a.value?.size.width || 0, a.value?.size.height || 0)
    }
  ),
  defineApi<ValueArgs<{ size: { width: number; height: number } } | null>>(
    'plugin:window|set_min_size',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:window', 'set-size')
      const w = getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window
      if (!w) return
      return w.setMaximumSize(a.value?.size.width || 10000, a.value?.size.height || 10000)
    }
  ),
  defineApi<ValueArgs<boolean>>('plugin:window|set_size_constraints', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-size-constraints')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<{ position: { x: number; y: number } }>>(
    'plugin:window|set_position',
    async (a, _o, p) => {
      await checkBasePermission(p, 'core:window', 'set-position')
      return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setPosition(
        a.value.position.x,
        a.value.position.y
      )
    }
  ),
  defineApi<ValueArgs<boolean>>('plugin:window|set_fullscreen', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-fullscreen')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setFullScreen(a.value)
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_simple_fullscreen', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-simple-fullscreen')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setSimpleFullScreen(
      a.value
    )
  }),
  defineApi<BaseArgs>('plugin:window|set_focus', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-focus')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.focus()
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_focusable', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-focusable')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setFocusable(a.value)
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_icon', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-icon')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_skip_taskbar', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-skip-taskbar')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setSkipTaskbar(a.value)
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_cursor_grab', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-cursor-grab')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_cursor_visible', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-cursor-visible')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_cursor_icon', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-cursor-icon')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<Color>>('plugin:window|set_background_color', async (a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-background-color')
    return getPluginWindowByLabel(p.pluginId, a.label || p.label)?.window.setBackgroundColor(
      colorToHex(a.value)
    )
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_cursor_position', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-cursor-position')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_ignore_cursor_events', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-ignore-cursor-events')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<BaseArgs>('plugin:window|start_dragging', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'start-dragging')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<BaseArgs>('plugin:window|start_resize_dragging', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'start-resize-dragging')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<number>>('plugin:window|set_badge_count', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-badge-count')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<string>>('plugin:window|set_badge_label', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-badge-label')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<string>>('plugin:window|set_overlay_icon', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-overlay-icon')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<string>>('plugin:window|set_progress_bar', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-progress-bar')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<boolean>>(
    'plugin:window|set_visible_on_all_workspaces',
    async (_a, _o, p) => {
      await checkBasePermission(p, 'core:window', 'set-visible-on-all-workspaces')
      return Promise.reject(new Error('Not implemented'))
    }
  ),
  defineApi<ValueArgs<boolean>>('plugin:window|set_title_bar_style', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-title-bar-style')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|set_theme', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'set-theme')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|available_monitors', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'available-monitors')
    return Promise.reject(new Error('Not implemented'))
  }),
  defineApi<ValueArgs<boolean>>('plugin:window|cursor_position', async (_a, _o, p) => {
    await checkBasePermission(p, 'core:window', 'cursor-position')
    return Promise.reject(new Error('Not implemented'))
  })
]
