// electron modules
const electron = require('electron')
const {app, ipcMain, BrowserWindow} = electron
const path = require('path')
const url = require('url')

let win

// when app is ready
app.on('ready', () => {

	win = new BrowserWindow({
		show: false,
		webPreferences: {
	    	nodeIntegration: true
	    },
	    title: 'Main Window'
	})

	win.maximize()
	// win.setMenu(null)

	win.once('ready-to-show', () => {
	  win.show()
	})

	win.loadURL(url.format({
	    pathname: path.join(__dirname, 'html', 'mainWindow.html'),
	    protocol: 'file',
	    slashes: true
	}))  

})