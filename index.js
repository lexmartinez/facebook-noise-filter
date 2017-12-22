const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const server = require('./app/server')
const openAboutWindow = require('about-window').default;
const join = require('path').join;

let screen
let core

const renderMenu = () => {
 const menu = Menu.buildFromTemplate([
   {
    label: 'About',
    submenu: [
      {
        label: 'About This App',
        click: () => openAboutWindow({
         icon_path: join(__dirname, '/icons/app.png'),
         copyright: 'Copyright (c) 2017 lexmartinez',
         open_devtools: false,
         description: 'A Facebook content filter desktop app',
         win_options : {resizable: false, maximizable: false}
        })
     },
     {
       type:'separator'
     },
     {
       label: 'Keywords...',
       click: () => {

       },
       accelerator: 'CommandOrControl+.'
     },{
       type:'separator'
     },
     {
       label: 'Hide App',
       click: app.hide,
       accelerator: 'CommandOrControl+H'
     },
     {
       label: 'Quit App',
       role: 'quit',
       accelerator: 'CommandOrControl+Q'
     }
    ]
   }
 ])
 Menu.setApplicationMenu(menu)
}

const renderApp = () => {
 screen = new BrowserWindow({
   titleBarStyle: 'hidden',
   width: 900,
   height: 600,
   maximizable: false,
   resizable:false
 })

 renderMenu()
 core = server()
 screen.loadURL('http://localhost:8888');
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
 if(core){
  core.close()
 }
 if (screen === null) {
  renderApp()
 }
})