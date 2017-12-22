const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow
const server = require('./app/server')
const openAboutWindow = require('about-window').default
const join = require('path').join;
const prompt = require('electron-prompt')
const _ = require('lodash')
const datastore = require('nedb')

let screen
let core

const keywords = () => {

 const db = new datastore({ filename: join(__dirname, '/data.db'), autoload: true })

 db.findOne({}, (err, doc) => {
  if (!doc) {
   db.insert({keywords:[]}, (err, newDocs) => {})
  }
  const keywords = (doc) ? doc.keywords : []
  prompt({
   title: 'Filter Keywords',
   label: 'Keywords:',
   value: _.join(keywords, ','),
   inputAttrs: {
    type: 'url'
   },
   type: 'input'
  })
   .then((r) => {
    if(r){
     const values = _.split(r, ',')
     db.update({}, {$set: { keywords: values }}, {}, () => { });
    }
   })
   .catch(console.error);
 })

}

const renderMenu = () => {
 const menu = Menu.buildFromTemplate([
   {
    label: 'About',
    submenu: [
      {
        label: 'About This App',
        click: () => openAboutWindow({
         icon_path: join(__dirname, '/icons/app.png'),
         copyright: 'Copyright (c) 2017 Lex Martinez',
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
       click: keywords,
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