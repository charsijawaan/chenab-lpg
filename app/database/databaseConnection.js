let app = require('electron').remote.app
let sqlite3 = require('sqlite3').verbose();
let path = require('path')

let dbPath = path.join(app.getAppPath(), 'app', 'database', 'mydatabase.sqlite')

let db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log('Connected to database');
    }
    
});

module.exports = db