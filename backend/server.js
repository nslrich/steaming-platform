// NPM Imports
const fs = require('fs');
const os = require("os");
const cors = require("cors");
const mime = require('mime');
const path = require("path");
const axios = require('axios');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3').verbose();

// Read env file
require('dotenv').config()

// Helpers
const { scanLibraries } = require('./helpers/backendHelpers');
const { checkForData, setupDatabase, newUser, updateSaveLocations, getUser, getAllMovies, getAllShows, getShow, getShowDetails } = require('./helpers/databaseHelpers');
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

// Setup crypto key
const cryptoKey = crypto.randomBytes(64).toString('hex');

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

          // Setup jwt token
          const token = jwt.sign({ data: user.user_name }, cryptoKey, { expiresIn: '7d' });

          // All done
          res.send({
            code: 0,
            token: token,
            user: {
              id: user.id,
              first_name: user.first_name,
              last_name: user.last_name,
              role: user.role
            }
          });

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

// Route to check users credintails 
app.post('/api/signin', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

    // Get username and password out of body
    const { username, password } = req.body;

    // Get user details based on username
    const user = await getUser(sqlDB, username);

    // Compare passwords
    const result = await bcrypt.compare(password, user.password);

    // Check to see if password matches
    if (result) {

      // Setup jwt token
      const token = jwt.sign({ data: username }, cryptoKey, { expiresIn: '7d' });

      // Send back user data + token
      res.send({
        token: token,
        user: {
          user_name: user.user_name,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role,
        }
      });
    } else {

      // Send back error
      res.status(500).send({ code: 400, msg: 'Incorrect username or password.' });
    }
  } catch (error) {

    // Send back error
    res.status(500).send({ code: 400, msg: 'Incorrect username or password.' });
  }
});

// Route to verify auth token
app.get('/api/verify', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

    // Get username and password out of body
    const { token } = req.query;

    // Verify / Decode token
    const result = jwt.verify(token, cryptoKey);

    // Send back user data + token
    res.send({ code: 0, msg: 'OK' });

  } catch (error) {

    // Send back error
    res.status(500).send({ code: 400, msg: 'Invalid token.' });
  }
});

// Route to get movies
app.get('/api/movies', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

    // Get username and password out of body
    const { token } = req.query;

    // Verify / Decode token
    const result = jwt.verify(token, cryptoKey);

    // Get a list of all movies
    const movies = await getAllMovies(sqlDB);

    // Check for errors
    if (movies == false) {

      // Something went wrong
      res.status(500).send({ code: 400, msg: 'Unable to get movies.' });

    } else {

      // Send back user data + token
      res.send({ code: 0, msg: 'OK', data: movies });
    }
  } catch (error) {

    // Send back error
    res.status(500).send({ code: 400, msg: 'Invalid token.' });
  }
});

// Route to get shows
app.get('/api/shows', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

    // Get username and password out of body
    const { token } = req.query;

    // Verify / Decode token
    const result = jwt.verify(token, cryptoKey);

    // Get a list of all movies
    const shows = await getAllShows(sqlDB);

    // Check for errors
    if (shows == false) {

      // Something went wrong
      res.status(500).send({ code: 400, msg: 'Unable to get shows.' });

    } else {

      // Send back user data + token
      res.send({ code: 0, msg: 'OK', data: shows });
    }
  } catch (error) {

    // Send back error
    res.status(500).send({ code: 400, msg: 'Invalid token.' });
  }
});

// Route to get shows
app.get('/api/show', async (req, res) => {

  // Try Catch around everything to prevent crashing
  try {

    // Get username and password out of body
    const { token, show_id } = req.query;

    // Verify / Decode token
    const result = jwt.verify(token, cryptoKey);

    // Get a list of all movies
    const show = await getShowDetails(sqlDB, show_id);

    // Check for errors
    if (show == false) {

      // Something went wrong
      res.status(500).send({ code: 400, msg: 'Unable to get show.' });

    } else {

      // Send back user data + token
      res.send({ code: 0, msg: 'OK', data: show });
    }
  } catch (error) {

    // Send back error
    res.status(500).send({ code: 400, msg: 'Invalid token.' });
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


// Setup scan libraries interval
setTimeout(() => {
  scanLibraries(sqlDB);
}, 5000);