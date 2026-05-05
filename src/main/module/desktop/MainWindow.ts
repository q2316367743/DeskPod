import { app, BrowserWindow, ipcMain, Menu, nativeImage, shell, Tray } from 'electron'
import ews from 'electron-window-state'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import { APP_NAME, PARTITION } from '@common/global'
import { APP_DATA_DB_STATE_PATH } from '$/global/Constant'
import icon from '../../../../resources/icon.png?asset'

let mainWindow: BrowserWindow | undefined = undefined
export const setMainWindow = (win: BrowserWindow) => (mainWindow = win)
export const getMainWindow = () => mainWindow

export function createMainWindow() {
  // Create the browser window.
  const e = ews({
    defaultWidth: 1168,
    defaultHeight: 850,
    path: APP_DATA_DB_STATE_PATH,
    file: 'main.json',
    maximize: false
  })
  const mainWindow = new BrowserWindow({
    title: APP_NAME,
    width: e.width,
    height: e.height,
    x: e.x,
    y: e.y,
    minWidth: 1168,
    minHeight: 850,
    resizable: false,
    show: true,
    skipTaskbar: true,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    frame: false,
    titleBarStyle: 'hidden',
    alwaysOnTop: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      webSecurity: false,
      webviewTag: true,
      partition: PARTITION.BUILTIN
    }
  })
  e.manage(mainWindow)
  setMainWindow(mainWindow)

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

  mainWindow.on('close', (e) => {
    e.preventDefault()
    mainWindow.hide()
  })

  return mainWindow
}

export function createTray() {
  const iconImg = nativeImage.createFromPath(icon)
  const tray = new Tray(iconImg.resize({ height: 16 }))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示 / 隐藏',
      click: () => {
        if (mainWindow?.isVisible()) {
          mainWindow?.hide()
        } else {
          mainWindow?.show()
          mainWindow?.focus()
        }
      }
    },
    {
      label: '退出',
      click: () => {
        // 先关闭全部窗口
        BrowserWindow.getAllWindows().forEach((window) => {
          window.destroy()
        })
        // 再退出
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
  return tray
}

let isMaximized = true
ipcMain.handle('/app/main/toggle-size', () => {
  mainWindow?.setResizable(true)
  try {
    if (isMaximized) {
      // 框高变为 48
      mainWindow?.setSize(48, 48)
    } else {
      mainWindow?.setSize(1168, 850)
    }
  } finally {
    mainWindow?.setResizable(false)
  }
  isMaximized = !isMaximized
  return isMaximized
})
