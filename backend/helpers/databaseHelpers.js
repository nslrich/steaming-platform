// NPM Imports
const fs = require('fs');

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

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == -1) {

        // Setup sql statement
        const userTable = `CREATE TABLE users (
          id TEXT NOT NULL, 
          user_name TEXT NOT NULL, 
          password TEXT NOT NULL, 
          first_name TEXT, 
          last_name TEXT, 
          role TEXT NOT NULL
        )`;

        // Run Statement
        dbClient.run(userTable, (error) => {

          // Check for error
          if (error) {

            // Error, something went wrong
            resolve(false);

          } else {

            // Setup sql statement
            const settingsTable = `CREATE TABLE settings (
              id INTEGER NOT NULL, 
              movie_locaction TEXT NOT NULL, 
              show_location TEXT NOT NULL
            )`;

            // Run Statement
            dbClient.run(settingsTable, (error) => {

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
  },

  // Add a new user
  newUser: (dbClient, user) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck != -1) {

        // Setup Sql statement
        const insert = `INSERT INTO 
          users (id, user_name, password, first_name, last_name, role)
          VALUES ('${user.id}', '${user.user_name}', '${user.password}', '${user.first_name}', '${user.last_name}', '${user.role}');
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

            // Send back -1, table has not been setup
            resolve(false);

          } else {

            // Setup sql statement
            var sqlStatement = '';

            // Check to make sure there is data
            if (rows.length !== 0) {

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
      resolve(false);
    }
  });
}