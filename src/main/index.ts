import { app, shell, BrowserWindow, Tray, Menu, nativeImage } from 'electron'
import { join } from 'node:path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { APP_NAME, appDirInit } from '$/global/Constant'
import {
  desktopManager,
  getMainWindow,
  pluginManager,
  quickManager,
  setMainWindow,
  settingManager
} from '$/global/BeanFactory'
import { useSql } from '$/lib/sql'
import { logDebug, logError } from '$/lib/log'
// 导入事件
import '$/router'

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
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
  return tray
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: APP_NAME,
    width: 900,
    height: 670,
    minWidth: 900,
    minHeight: 670,
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

  mainWindow.on('close', (e) => {
    e.preventDefault()
    mainWindow.hide()
  })

  return mainWindow
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
        })
    })

  electronApp.setAppUserModelId('xyz.esion')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  createTray()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  app.quit()
})

