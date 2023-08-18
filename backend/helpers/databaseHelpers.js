// NPM Imports
const fs = require('fs');
const bcrypt = require('bcrypt');

// Bcrypt salt rounds
const saltRounds = 10;

// SQL files
const sqlDbPath = `${process.cwd()}/databases/data.db`;

// Functions to export
module.exports = {

  // Function to check to see if the database file exists
  checkForDbFile: checkForDbFile,

  // Check to check if there is data in the database
  checkForData: checkForData,

  // Setup empty tables
  setupDatabase: (dbClient) => {
    return new Promise(async (resolve, reject) => {
      try {

        // Check to make sure db is setup
        const dbCheck = await checkForData(dbClient);
        if (dbCheck == -1) {

          // Setup sql to create user table
          const usersSql = `
            CREATE TABLE users (
              id TEXT NOT NULL, 
              user_name TEXT NOT NULL, 
              password TEXT NOT NULL, 
              first_name TEXT, 
              last_name TEXT, 
              role TEXT NOT NULL
            );
          `;

          // Run Query
          await dbClient.run(usersSql);

          // Setup sql to create settings table
          const settingsSql = `
            CREATE TABLE settings (
              id INTEGER NOT NULL, 
              movie_locaction TEXT NOT NULL, 
              show_location TEXT NOT NULL
            );
          `;

          // Run Query
          await dbClient.run(settingsSql);

          // Setup sql to create movies table
          const moviesSql = `
            CREATE TABLE movies (
              id TEXT NOT NULL, 
              location TEXT NOT NULL, 
              title TEXT,
              description TEXT,
              year INTEGER,
              duration TEXT
            );
          `;

          // Run Query
          await dbClient.run(moviesSql);

          // Setup sql to create tv shows table
          const showsSql = `
            CREATE TABLE shows (
              id TEXT NOT NULL, 
              location TEXT NOT NULL, 
              title TEXT,
              description TEXT,
              year INTEGER,
              seasons INTEGER,
              episodes INTEGER
            );
          `;

          // Run Query
          await dbClient.run(showsSql);

          // Setup sql to create tv shows table
          const showEpisodesSql = `
            CREATE TABLE show_episode (
              id TEXT NOT NULL,
              show_id TEXT NOT NULL,
              location TEXT NOT NULL, 
              season INTEGER NOT NULL,
              episode INTEGER NOT NULL,
              title TEXT,
              description TEXT,
              duration TEXT
            );
          `;

          // Run Query
          await dbClient.run(showEpisodesSql);

          // Setup sql to create tv shows table
          const progressSql = `
            CREATE TABLE progress (
              id TEXT NOT NULL,
              item_id TEXT NOT NULL,
              watched INTEGER NOT NULL,
              progress INTEGER NOT NULL
            );
          `;

          // Run Query
          await dbClient.run(progressSql);

          // Successful
          resolve(true);

        } else {

          // Error, database is not setup
          resolve(false);
        }
      } catch (error) {

        // Error, database is not setup
        resolve(false);
      }
    });
  },

  // Add a new user
  newUser: (dbClient, user) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck != -1) {

        // Setup password hash
        const hash = await bcrypt.hash(user.password, saltRounds);

        // Setup Sql statement
        const insert = `INSERT INTO 
          users (id, user_name, password, first_name, last_name, role)
          VALUES ('${user.id}', '${user.user_name}', '${hash}', '${user.first_name}', '${user.last_name}', '${user.role}');
        `;

        // Run insert statement
        dbClient.run(insert, (error) => {

          // Check for error
          if (error) {

            // Error, something went wrong
            resolve(false);

          } else {

            // Successful
            resolve(true);
          }
        });
      } else {

        // Error, database is not setup
        resolve(false);
      }
    });
  },

  // Get User
  getUser: (dbClient, user) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup Sql statement
        const sql = `SELECT * FROM users WHERE user_name = '${user}'`;

        // Run insert statement
        dbClient.all(sql, [], (error, rows) => {

          // Check for error
          if (error) {

            // Send back failure
            reject(false);

          } else {

            // Check for data
            if (rows.length != 0) {

              // Return user
              resolve(rows[0]);

            } else {

              // Error, no users are in database
              reject(false);
            }
          }
        });
      } else {

        // Error, database is not setup
        reject(false);
      }
    });
  },

  // Get movie
  getMovie: (dbClient, title, year) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup Sql statement
        const sql = `SELECT * FROM movies WHERE title = '${title}' AND year = ${year}`;

        // Run insert statement
        dbClient.all(sql, [], (error, rows) => {

          // Check for error
          if (error) {

            // Send back failure
            resolve(false);

          } else {

            // Check for data
            if (rows.length != 0) {

              // Return movie
              resolve(rows[0]);

            } else {

              // Error, no users are in database
              resolve(false);
            }
          }
        });
      } else {

        // Error, database is not setup
        resolve(false);
      }
    });
  },

  // Update save locations
  updateSaveLocations: (dbClient, locations) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup sql statement
        const sql = `SELECT * FROM settings WHERE id = 1`;

        // Run SQL Statement
        dbClient.all(sql, [], (error, rows) => {

          // Check for error
          if (error) {

            // Send back failure
            resolve(false);

          } else {

            // Setup sql statement
            var sqlStatement = '';

            // Check to make sure there is data
            if (rows.length == 0) {

              // No data, setup insert
              sqlStatement = `INSERT INTO settings (id, movie_locaction, show_location) 
                VALUES (1, '${locations.movies}', '${locations.shows}');
              `;

            } else {

              // Found a match, update it instead
              sqlStatement = `UPDATE settings SET movie_locaction = '${locations.movies}', show_location = '${locations.shows}' WHERE id = 1;`;
            }

            // Run SQL Statement
            dbClient.run(sqlStatement, (error) => {

              // Check for error
              if (error) {

                // Error, something went wrong
                resolve(false);

              } else {

                // Successful
                resolve(true);
              }
            });
          }
        });
      } else {

        // Error, database is not setup
        resolve(false);
      }
    });
  }
};

// Function to check to see if the database file exists
function checkForDbFile() {
  return new Promise(async (resolve, reject) => {
    resolve(fs.existsSync(sqlDbPath));
  });
}

// Check to check if there is data in the database
function checkForData(dbClient) {
  return new Promise(async (resolve, reject) => {

    // Check to see if the file exists
    const fileCheck = await checkForDbFile();
    if (fileCheck) {

      // Setup sql statement
      const sql = `SELECT id FROM users LIMIT 1`;

      // Run SQL Statement
      dbClient.all(sql, [], (error, rows) => {

        // Check for error
        if (error) {

          // Send back -1, table has not been setup
          resolve(-1);

        } else {

          // Check to make sure there is data
          if (rows.length !== 0) {

            // Send back 1, table has been setup and users have been added
            resolve(1);

          } else {

            // Send back 0, table has been setup
            resolve(0);
          }
        }
      });
    } else {

      // Send back false, file has not been setup
      resolve(-1);
    }
  });
}