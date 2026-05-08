import { BrowserWindow } from 'electron'
import { APP_NAME, PARTITION } from '@common/global'
import { join } from 'node:path'
import icon from '../../../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import ews from 'electron-window-state'
import { APP_DATA_DB_STATE_PATH } from '$/global/Constant'

let ballWindow: BrowserWindow | undefined = undefined

export function getBallWindow(): BrowserWindow | undefined {
  return ballWindow
}

export function createBallWindow() {
  // Create the browser window.
  const ballEws = ews({
    defaultWidth: 48,
    defaultHeight: 48,
    path: APP_DATA_DB_STATE_PATH,
    file: 'ball.json'
  })
  ballWindow = new BrowserWindow({
    title: APP_NAME,
    width: ballEws.width,
    height: ballEws.height,
    x: ballEws.x,
    y: ballEws.y,
    minWidth: 48,
    minHeight: 48,
    maxWidth: 48,
    maxHeight: 48,
    maximizable: false,
    minimizable: false,
    fullscreenable: false,
    show: true,
    skipTaskbar: true,
    autoHideMenuBar: true,
    icon,
    frame: false,
    transparent: true,
    hasShadow: false,
    backgroundColor: '#00000000',
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
  ballEws.manage(ballWindow)

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    ballWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/ball.html')
  } else {
    ballWindow.loadFile(join(__dirname, '../renderer/ball.html'))
  }

  return ballWindow
}
