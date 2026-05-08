import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { platform } from 'node:os'
import { appDirInit } from '$/global/Constant'
import { desktopManager, pluginManager, quickManager, settingManager } from '$/global/BeanFactory'
import { logDebug, logError, logInfo } from '$/lib/log'
import { createMainWindow } from '$/module/desktop'
// 导入事件
import '$/router'
import { createBallWindow } from '$/module/desktop/BallWindow'

appDirInit()
  .then(() => logDebug('基础目录初始化成功'))
  .catch((e) => logError('基础目录初始化失败', e))

app.whenReady().then(() => {
  Promise.allSettled([pluginManager.initPlugins(), quickManager.init()])
    .then((res) => logDebug('插件初始化成功', res))
    .catch((e) => logError('插件初始化失败', e))

  Promise.allSettled([desktopManager.init(), settingManager.init()])
    .then((res) => logDebug('基础信息初始化成功', res))
    .catch((e) => logError('基础信息初始化失败', e))
    .finally(() => {
      logInfo('桌面管理、设置管理初始化完成，即可创建窗口')
      // 桌面管理、设置管理初始化完成，即可创建窗口
      createBallWindow()
      createMainWindow()
      app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
      })
    })
  // 初始化基础目录
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
