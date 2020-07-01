// electron modules
const electron = require('electron')
const {app, ipcMain, BrowserWindow} = electron
const path = require('path')
const url = require('url')
let nodemailer = require('nodemailer')

let dbPath = path.join(app.getAppPath(), 'app', 'database', 'mydatabase.sqlite')

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'charsijawaan1@gmail.com',
	  pass: 'Createyour1'
	}
})

let mailOptions = {
	from: 'charsijawaan1@gmail.com',
	to: 'faheemchaudary@gmail.com',
	subject: 'Data',
	text: 'File',
	attachments: [{
		filename: 'mydatabase.sqlite',
		path: dbPath
	}]
}

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

	ipcMain.on('upload-data', (event, arg) => {
		console.log('starting')
		transporter.sendMail(mailOptions, (error, info) => {
			console.log('In transporter')
			if (error) {
			  	console.log(error);
			}
			else {
				win.webContents.send('file-uploaded-successfully', 'success')
				console.log('Email sent: ' + info.response);
			}
		  }); 
	})

})