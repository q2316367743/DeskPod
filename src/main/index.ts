import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { appDirInit } from '$/global/Constant'
import {
  desktopManager,
  getMainWindow,
  pluginManager,
  quickManager,
  settingManager
} from '$/global/BeanFactory'
import { useSql } from '$/lib/sql'
import { logDebug, logError } from '$/lib/log'
// 导入事件
import '$/router'
import { createMainWindow } from '$/module/desktop'

function createTray() {
  const iconImg = nativeImage.createFromPath(icon)
  const tray = new Tray(iconImg.resize({ height: 16 }))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示 / 隐藏',
      click: () => {
        if (getMainWindow()?.isVisible()) {
          getMainWindow()?.hide()
        } else {
          getMainWindow()?.show()
          getMainWindow()?.focus()
        }
      }
    },
    {
      label: '退出',
      click: () => {
        getMainWindow()?.destroy()
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
  return tray
}

app.whenReady().then(() => {
  appDirInit()
    .then(() => logDebug('基础目录初始化成功'))
    .catch((e) => logError('基础目录初始化失败', e))
    .finally(() => {
      Promise.allSettled([
        useSql().migrate(),
        desktopManager.init(),
        pluginManager.initPlugins(),
        settingManager.init()
      ])
        .then((res) => logDebug('初始化结果：', res))
        .finally(() => {
          quickManager
            .init()
            .then(() => logDebug('快应用初始化成功'))
            .catch((e) => logError('快应用初始化失败', e))

          // 初始化完设置，再创建窗口

          createMainWindow()
          createTray()

          app.on('activate', function () {
            if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
          })
        })
    })
  electronApp.setAppUserModelId('xyz.esion')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
