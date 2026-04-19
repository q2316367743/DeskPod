import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { APP_NAME, appDirInit } from '$/global/Constant'
import {
  desktopManager,
  pluginManager,
  quickManager,
  setMainWindow,
  settingManager
} from '$/global/BeanFactory'

// 导入插件事件
import '$/module/plugin/PluginEvent'

// 导入桌面管理
import '$/router'
import { useSql } from '$/lib/sql'
import { logDebug, logError } from '$/lib/log'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: APP_NAME,
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      webSecurity: false,
      webviewTag: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  setMainWindow(mainWindow)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
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
        })
    })

  // Set app user model id for windows
  electronApp.setAppUserModelId('xyz.esion')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
