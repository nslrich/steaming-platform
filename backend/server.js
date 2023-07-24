// NPM Imports
const fs = require('fs');
const os = require("os");
const cors = require("cors");
const path = require("path");
const bcrypt = require('bcrypt');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3').verbose();

// Bcrypt salt rounds
const saltRounds = 10;

// Helpers
const { checkForData, setupDatabase, checkForDbFile, newUser, updateSaveLocations } = require('./helpers/databaseHelpers');
const { getDirectories } = require('./helpers/generalHelpers');

// Declare express port
const port = 12501;

// SQL files
const sqlDbPath = `${process.cwd()}/databases/data.db`;

// Check for db file
if (!fs.existsSync(sqlDbPath)) {

  // Send back false, do not need to run setup
  fs.writeFileSync(sqlDbPath, '');
}

// Setup SQLite client
const sqlDB = new sqlite3.Database(sqlDbPath);

// Make sure the database is ready
setupDatabase(sqlDB);

// Setup Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/api/setup', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

    // Check to see if database is set up
    const setupCheck = await checkForData(sqlDB);
    if (setupCheck == 1) {

      // Send back false, do not need to run setup
      res.send({ code: 0, status: false });
    } else {

      // Send back true, need to run first time setup
      res.send({ code: 0, status: true });
    }
  } catch (error) {

    // Error
    console.log(error);
    res.status(500).send({ code: 400, msg: 'Unknown Error occured' });
  }
});

// First time setup
app.post('/api/setup', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

    // Check to see if setup has been done
    const setupCheck = await checkForData(sqlDB);
    if (setupCheck == 0) {

      // Get body out of request
      const body = req.body;

      // Setup admin
      const user = {
        id: uuidv4(),
        user_name: body.username,
        password: body.password,
        first_name: body.first_name,
        last_name: body.last_name,
        role: 'admin'
      }

      // Add new user to databse (admin)
      const checkNewUser = await newUser(sqlDB, user);
      if (checkNewUser) {

        // Update save locations
        const saveCheck = await updateSaveLocations(sqlDB, { movies: body.movie_location, shows: body.show_location });
        if (saveCheck) {

          // All done
          res.send({ code: 0 });

        } else {

          // Unable to create user
          res.status(500).send({ code: 400, msg: 'Unable to setup save locations' });
        }
      } else {

        // Unable to create user
        res.status(500).send({ code: 400, msg: 'Unable to create user' });
      }
    } else {

      // Setup has already been done.
      res.status(500).send({ code: 400, msg: 'First time setup has already been done' });
    }
  } catch (error) {

    // Error
    console.log(error);
    res.status(500).send({ code: 400, msg: 'Unknown Error occured' });
  }
});

// Route to get folders in a given path
app.get('/api/folders', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

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

  } catch (error) {

    // Send back error
    res.status(500).send({ code: 400, msg: 'Unable to read directory' });
  }
});

// Route to get folders in a given path
app.post('/api/folder', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

    // Get requested path
    const { path, folder_name } = req.body;

    // Default path to get unless in query
    var getLocation = os.homedir();

    // Check to see if a path was sent
    if (fs.existsSync(path)) {

      // Create file in path
      fs.mkdirSync(`${path}/${folder_name}`);

      // Get folders with in the given path
      const folders = await getDirectories(path);

      // Send back
      res.send({ path: path, folders: folders });

    } else {

      // Send back error
      res.status(500).send({ code: 400, msg: 'Path is not a valid path.' });
    }
  } catch (error) {

    // Send back error
    res.status(500).send({ code: 400, msg: 'Unable to read directory' });
  }
});

app.get('/api/users', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

    // Query data
    sqlDB.all('SELECT * FROM users', [], (error, rows) => {

      // Check for errors
      if (error) {

        // Something went wrong
        res.status(500).send({ code: 400, msg: 'Unable to get users' });

      } else {

        // Send back data
        res.send(rows);
      }
    });
  } catch (error) {

    // Send back error
    res.status(500).send({ code: 400, msg: 'Unable to get users' });
  }
});

app.get('/api/settings', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

    // Query data
    sqlDB.all('SELECT * FROM settings', [], (error, rows) => {

      // Check for errors
      if (error) {

        // Something went wrong
        res.status(500).send({ code: 400, msg: 'Unable to get settings' });

      } else {

        // Send back data
        res.send(rows);
      }
    });
  } catch (error) {

    // Send back error
    res.status(500).send({ code: 400, msg: 'Unable to get settings' });
  }
});

app.get('/api/password', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

    const pass = req.query.pass;

    const hash = await bcrypt.hash(pass, saltRounds);
    
    // Send back data
    res.send(hash);
    
  } catch (error) {

    // Send back error
    res.status(500).send({ code: 400, msg: 'Unable to get settings' });
  }
});

app.get('/api/compare', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

    const compareHash = '$2b$10$HACui4luRsf1yr55OjsQOuIs5SoWgH/vssAIIhABSzKWRyHAJaWNG';

    const pass = req.query.pass;

    const result = await bcrypt.compare(pass, compareHash);

    // Send back data
    res.send(result);
    
  } catch (error) {

    // Send back error
    res.status(500).send({ code: 400, msg: 'Unable to get settings' });
  }
});

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
