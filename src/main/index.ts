import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { platform } from 'node:os'
import { appDirInit } from '$/global/Constant'
import { desktopManager, pluginManager, quickManager, settingManager } from '$/global/BeanFactory'
import { useSql } from '$/lib/sql'
import { logDebug, logError } from '$/lib/log'
import { createTray, createMainWindow } from '$/module/desktop'
// 导入事件
import '$/router'

app.whenReady().then(() => {
  // 注册协议
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

  if (platform() === 'darwin') {
    // MacOS
    app.dock?.hide()
  }

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
