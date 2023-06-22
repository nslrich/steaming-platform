// NPM Imports
const fs = require('fs');
const os = require("os");
const cors = require("cors");
const path = require("path");
const express = require('express');
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3').verbose();

// Declare express port
const port = 12501;

// SQL files
const sqlDbPath = `${__dirname}/databases/users.db`;

// SQL Lite databases
var sqlDB = null;

// Setup Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/first_time_check', (req, res) => {

  // Check to see if database is set up
  if (fs.existsSync(sqlDbPath)) {

    // Send back false, do not need to run setup
    res.send(false);
  } else {

    // Send back true, need to run first time setup
    res.send(true);
  }
});

// First time setup
app.post('/first_time_setup', (req, res) => {

  // Check to see if database is set up
  if (fs.existsSync(sqlDbPath)) {

    // Error, already setup.
    res.status(500).send({ code: 400, msg: 'First time setup has already been done.' });

  } else {

    // Get body out of request
    const body = req.body;

    // Create user database file
    fs.writeFileSync(sqlDbPath, '');

    // Seetup sql lite databse
    sqlDB = new sqlite3.Database(sqlDbPath);

    // Create user table
    sqlDB.run('CREATE TABLE user (id INTEGER NOT NULL, user_name TEXT NOT NULL, password TEXT NOT NULL, first_name TEXT, last_name TEXT, role TEXT NOT NULL)');

    // Add admin to table
    db.run(insert, (error) => {

      // Check for error
      if (error) {

        // Send error back to user
        console.log(error);
        res.status(500).send({ code: 400, msg: 'Unable to create user.' });

        // Delete sql lite file (so setup can be re-run)
        fs.rmSync(sqlDbPath);
        sqlDB = null;

      } else {

        // Run other setup stuff here
      }
    });
  }
});

// Route to get folders in a given path
app.get('/api/folders', async (req, res) => {

  // Get requested path
  const { path } = req.query;

  // Default path to get unless in query
  var getLocation = os.homedir();

  // Check to see if a path was sent
  if (path !== undefined) {

    // Use this path instead
    getLocation = path;
  }

  // Get folders with in the given path
  const folders = await getDirectories(getLocation);

  // Send back
  res.send({ path: getLocation, folders: folders });
});

function getDirectories(path) {
  return new Promise((resolve, reject) => {
    const folders = [];
    const all = fs.readdirSync(path);
    for (var item of all) {
      if (fs.lstatSync(path + '\\' + item).isDirectory()) {
        folders.push(item);
      }
    }
    resolve(folders);
  });
}

// Setup express to use the built frontend
app.use(express.static(`${__dirname}/build`));

// All other requests go to built frontend
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});


// Start express server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
