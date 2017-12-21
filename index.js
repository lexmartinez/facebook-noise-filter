const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let screen;

const renderApp = () => {
 screen = new BrowserWindow()
 screen.loadURL('https://lexmartinez.com')
 screen.on('closed', () => {
   screen = null
 })
}

app.on('ready', renderApp);

app.on('window-all-closed', () => {
 // only quit the application on OS X if the user hits cmd + q
 if (process.platform !== 'darwin') {
  app.quit()
 }
})

app.on('activate', () => {
 if (screen === null) {
  renderApp()
 }
})