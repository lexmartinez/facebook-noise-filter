const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let screen

const renderApp = () => {
 screen = new BrowserWindow({
   titleBarStyle: 'hidden',
   width: 900,
   height: 600,
   maximizable: false,
   resizable:false
 })

 screen.loadURL('http://localhost:8888')

 screen.on('closed', () => {
   screen = null
 })
}

app.on('ready', renderApp);

app.on('window-all-closed', () => {
 if (process.platform !== 'darwin') {
  app.quit()
 }
})

app.on('activate', () => {
 if (screen === null) {
  renderApp()
 }
})