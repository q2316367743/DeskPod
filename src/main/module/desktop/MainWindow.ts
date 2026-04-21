import { BrowserWindow, screen, shell } from 'electron'
import { APP_NAME } from '@common/global'
import { join } from 'node:path'
import { getMainWindow, setMainWindow, settingManager } from '$/global/BeanFactory'
import { is } from '@electron-toolkit/utils'
import icon from '../../../../resources/icon.png?asset'

export function handleMainWindow() {
  const mainWindow = getMainWindow()
  if (!mainWindow) return
  const mode = settingManager.get('mode')
  const displayId = settingManager.get('displayId')
  if (mode === 'screen' && displayId) {
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
      partition: 'partition:main'
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
