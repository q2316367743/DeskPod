import { app, BrowserWindow, ipcMain, Menu, nativeImage, shell, Tray } from 'electron'
import { APP_NAME, PARTITION } from '@common/global'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../../resources/icon.png?asset'
import ews from 'electron-window-state'
import { APP_DATA_DB_STATE_PATH } from '$/global/Constant'

let mainWindow: BrowserWindow | undefined = undefined
export const setMainWindow = (win: BrowserWindow) => (mainWindow = win)
export const getMainWindow = () => mainWindow

export function createMainWindow() {
  const mainEws = ews({
    defaultWidth: 1201,
    defaultHeight: 816,
    path: APP_DATA_DB_STATE_PATH,
    file: 'main.json'
  })
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: APP_NAME,
    width: mainEws.width,
    height: mainEws.height,
    x: mainEws.x,
    y: mainEws.y,
    minWidth: 1201,
    minHeight: 816,
    resizable: false,
    maximizable: false,
    minimizable: false,
    show: false,
    skipTaskbar: true,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      webSecurity: false,
      webviewTag: true,
      partition: PARTITION.BUILTIN
    }
  })
  setMainWindow(mainWindow)
  mainEws.manage(mainWindow)

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
      click: () => toggleMainVisible()
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

export function toggleMainVisible() {
  if (!mainWindow) return false
  if (mainWindow.isVisible()) {
    mainWindow.hide()
    return false
  } else {
    mainWindow.show()
    return true
  }
}

export function hideMainWindow() {
  mainWindow?.hide()
}

ipcMain.handle('/app/main/toggle-visible', toggleMainVisible)
