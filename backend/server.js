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
const { checkForData, setupDatabase, checkForDbFile, newUser, updateSaveLocations, getUser, getMovie } = require('./helpers/databaseHelpers');
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
    console.log(result);

    // Send back user data + token
    res.send({ code: 0, msg: 'OK' });

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
setTimeout(scanLibraries, 5000);

// Function to scan the movies and show folders to find if new content has been added
async function scanLibraries() {

  // Try Catch around everything to prevent crashing
  try {

    // Check to make sure setup has been done
    const setupCheck = await checkForData(sqlDB);
    if (setupCheck == 1) {

      // Get settings
      const settingsSql = `SELECT * FROM settings WHERE id = 1`;

      // Run query
      sqlDB.all(settingsSql, async (error, rows) => {

        // Check for errors
        if (error) {

          // Do nothing if error

        } else {

          // Make sure there is data
          if (rows.length != 0) {

            // Get data
            const settings = rows[0];

            // Check for new movies
            await checkForMovies(settings.movie_locaction);

            // Check for new shows
            await checkForShows(settings.show_location);
          }
        }
      });
    }
  } catch (error) {

    // Something went wrong
    console.log(error);
  }
}

// Function to check to see if new movies have been added to folders and get info
function checkForMovies(path) {
  return new Promise(async (resolve, reject) => {

    // Check to see if path is real
    if (fs.existsSync(path)) {

      // Scan folder
      const scan = scanFolder(path);

      // Loop through found items
      for (var file of scan) {

        // Get rid of location
        const shortenFile = file.substr(path.length + 1);

        // Split into array
        const fileArray = shortenFile.split('\\');

        // Get the file name
        const folderName = fileArray[0];
        const folderNameArray = folderName.split('(');

        // Break out title and year
        const title = folderNameArray[0].trim();
        const year = parseInt(folderNameArray[1]);

        // Split file name up
        const fileName = fileArray[1];

        console.log(title, '-', year);

        // Check database to see if this movie has already been added
        const movieData = await getMovie(sqlDB, title, year);

        // Check to see if there is a match
        if (movieData == false) {
          
          // No match get new data
          const movieInfo = await lookupInfo(title, year, 'movie');
          console.log(movieInfo);

        }
      }

      // All done.
      resolve(true);

    } else {

      // Do nothing if error
      resolve(false);
    }
  });
}

// Function to check to see if new tv shows have been added to folders and get info
function checkForShows(path) {
  return new Promise(async (resolve, reject) => {

    // Get movie data from database
    const showSql = `SELECT * FROM shows`;

    // Run query
    sqlDB.all(showSql, (error, rows) => {

      // Check for errors
      if (error) {

        // Do nothing if error
        resolve(false);

      } else {

        // Check to see if path is real
        if (fs.existsSync(path)) {

          // Scan folder
          const scan = scanFolder(path);

          // Loop through found items
          for (var file of scan) {

            // Get rid of location
            const shortenFile = file.substr(path.length + 1);

            // Split into array
            const fileArray = shortenFile.split('\\');

            // Get the file name
            const folderName = fileArray[0];
            const folderNameArray = folderName.split('(');

            // Break out title and year
            const title = folderNameArray[0].trim();
            const year = parseInt(folderNameArray[1]);

            // Get season out
            const season = fileArray[1];

            // Split file name up
            const fileName = fileArray[2];

            console.log(title, '-', year, '-', season, '-', fileName);
          }

          // All done.
          resolve(true);

        } else {

          // Do nothing if error
          resolve(false);
        }
      }
    });
  });
}


// Function to recursely scan down through folders to get all files
function scanFolder(folder) {

  // Array to hold all files
  var results = [];

  // Read directory
  var list = fs.readdirSync(folder);

  // Loop through results
  list.forEach(function (file) {

    // Found file
    const filepath = folder + '\\' + file;

    // Check to see if files is a folder
    if (fs.lstatSync(filepath).isDirectory()) {

      // Recurse into a folder
      results = results.concat(scanFolder(filepath));

    } else {

      // Get mime type
      const mimeType = mime.getType(filepath);

      // Check to see if its a video
      if (mimeType.includes('video')) {

        // Add file to array
        results.push(filepath);
      }
    }
  });

  // Return data
  return results;
}

// Function to look up movie or show using API
function lookupInfo(title, year, type) {
  return new Promise((resolve, reject) => {

    // Setup request params
    const params = {
      t: title,
      y: year,
      type: type,
      plot: 'full',
      apikey: process.env.OMDB_API_KEY,
    }

    // Run get request
    axios.get(process.env.OMDB_API_URL, { params: params }).then((res) => {

      // Return data
      resolve(res.data);

    }).catch((error) => {

      // Something went wrong.
      resolve(false);
    });
  });
}