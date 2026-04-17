import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { APP_NAME, appDirInit } from '$/global/Constant'
import { pluginManager, quickManager } from '$/global/BeanFactory'

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
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // 初始化目录
  appDirInit()
    .then(() => {
      console.log('App Dir Init')
    })
    .catch((e) => {
      console.error('App Dir Init Fail', e)
    })
    .finally(() => {
      // 初始化数据库
      useSql()
        .migrate()
        .then(() => logDebug('数据库初始化成功'))
        .catch((e) => logError('数据库初始化失败', e))
        .finally(() => {
          // 数据库初始化完成后，进行快应用初始化
          quickManager
            .init()
            .then(() => logDebug('快应用初始化成功'))
            .catch((e) => logError('快应用初始化失败', e))
        })
    })
  // 初始化插件列表
  pluginManager
    .initPlugins()
    .then(() => {
      console.log('PluginManager initialized')
    })
    .catch((e) => {
      console.error('PluginManager initialize fail', e)
    })

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

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
