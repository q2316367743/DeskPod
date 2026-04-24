import { app, BrowserWindow, Menu, nativeImage, screen, shell, Tray } from 'electron'
import { APP_NAME, PARTITION } from '@common/global'
import { join } from 'node:path'
import { settingManager } from '$/global/BeanFactory'
import { is } from '@electron-toolkit/utils'
import icon from '../../../../resources/icon.png?asset'

let mainWindow: BrowserWindow | undefined = undefined
export const setMainWindow = (win: BrowserWindow) => (mainWindow = win)
export const getMainWindow = () => mainWindow

export function handleMainWindow() {
  const mainWindow = getMainWindow()
  if (!mainWindow) return
  const displayId = settingManager.get('displayId')
  if (displayId) {
    const displays = screen.getAllDisplays()
    for (const display of displays) {
      if (display.id === displayId) {
        // 如果找到了
        mainWindow.setBounds(display.bounds)
        mainWindow.setFullScreen(true)
        mainWindow.show()
        return
      }
    }
  }
  mainWindow.setFullScreen(true)
  mainWindow.show()
}

export function createMainWindow() {
  // Create the browser window.
  const primaryDisplay = screen.getPrimaryDisplay()
  const mainWindow = new BrowserWindow({
    title: APP_NAME,
    width: primaryDisplay.bounds.width,
    height: primaryDisplay.bounds.height,
    x: primaryDisplay.bounds.x,
    y: primaryDisplay.bounds.y,
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
      webviewTag: true,
      partition: PARTITION.BUILTIN
    }
  })
  setMainWindow(mainWindow)

  mainWindow.on('ready-to-show', () => {
    handleMainWindow()
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
        mainWindow?.destroy()
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)
  return tray
}
