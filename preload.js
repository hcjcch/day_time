const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    updateSize: (value) => {
        ipcRenderer.send('updateSize', value)
    }
})
