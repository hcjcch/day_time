const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1316,
    height: 188,
    frame: false,
    transparent: true,
    resizable: false,
    draggable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // win.webContents.openDevTools()
  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  ipcMain.on('updateSize', (event, value) => {
    console.log(value)
  })
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
