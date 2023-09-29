// NPM Imports
const fs = require('fs');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

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
              tmdb_id INTEGER NOT NULL, 
              location TEXT NOT NULL, 
              title TEXT,
              description TEXT,
              year INTEGER,
              duration TEXT,
              genre TEXT, 
              poster TEXT,
              ratings_tmdb TEXT
            );
          `;

          // Run Query
          await dbClient.run(moviesSql);

          // Setup sql to create tv shows table
          const showsSql = `
            CREATE TABLE shows (
              id TEXT NOT NULL, 
              tmdb_id INTEGER NOT NULL, 
              location TEXT NOT NULL, 
              title TEXT,
              description TEXT,
              year INTEGER,
              genre TEXT, 
              poster TEXT,
              ratings_tmdb TEXT
            );
          `;

          // Run Query
          await dbClient.run(showsSql);

          // Setup sql to create tv shows season table
          const showSeasonsSql = `
            CREATE TABLE show_season (
              id TEXT NOT NULL,
              tmdb_id INTEGER NOT NULL, 
              show_id TEXT NOT NULL,
              location TEXT NOT NULL, 
              season INTEGER NOT NULL,
              title TEXT,
              description TEXT,
              poster TEXT,
              ratings_tmdb TEXT
            );
          `;

          // Run Query
          await dbClient.run(showSeasonsSql);

          // Setup sql to create tv shows episode table
          const showEpisodesSql = `
            CREATE TABLE show_episode (
              id TEXT NOT NULL,
              tmdb_id INTEGER NOT NULL, 
              show_id TEXT NOT NULL,
              season_id TEXT NOT NULL,
              location TEXT NOT NULL, 
              season INTEGER NOT NULL,
              episode INTEGER NOT NULL,
              title TEXT,
              description TEXT,
              duration TEXT,
              poster TEXT,
              ratings_tmdb TEXT
            );
          `;

          // Run Query
          await dbClient.run(showEpisodesSql);

          // Setup sql to create progress table to track watched/in progress items
          const progressSql = `
            CREATE TABLE progress (
              id TEXT NOT NULL,
              user_id NOT NULL,
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

  // Get single movie
  getMovie: (dbClient, title, year) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Strip out characters in title to match lookup
        const strippedTitle = title.replace(/:/g, '').replace(/-/g, '').replace(/'/g, '');

        // Setup Sql statement
        const sql = `SELECT * FROM movies WHERE REPLACE(REPLACE(REPLACE(title, ':', ''), '-', ''), '''', '') LIKE '%${strippedTitle}%' AND year = ${year}`;

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

  // Get single movie
  getMovieById: (dbClient, id) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup Sql statement
        const sql = `SELECT * FROM movies WHERE id = '${id}'`;

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

  // Add a single movie to the database
  addMovie: (dbClient, data, path) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Turn Genres array into string
        const genres = data.genres.map(obj => obj.name).join(', ');

        // Setup sql statement
        const sqlStatement = `INSERT INTO movies (id, tmdb_id, location, title, description, year, duration, genre, poster, ratings_tmdb) 
          VALUES (
            '${uuidv4()}',
            ${data.id},
            '${path.replace(/'/g, "''")}',
            '${data.title.replace(/'/g, "''")}',
            '${data.overview.replace(/'/g, "''")}',
            ${data.release_date.substr(0, 4)},
            '${data.runtime}',
            '${genres}',
            '${process.env.TMDB_IMAGE_URL}/${data.poster_path}',
            '${data.vote_average}'
          )
        `;

        // Run insert statement
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

      } else {

        // Error, database is not setup
        resolve(false);
      }
    });
  },

  // Get list of all movies
  getAllMovies: (dbClient) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup Sql statement
        const sql = `SELECT * FROM movies ORDER BY title ASC`;

        // Run insert statement
        dbClient.all(sql, [], (error, rows) => {

          // Check for error
          if (error) {

            // Send back failure
            resolve(false);

          } else {

            // Return movies
            resolve(rows);
          }
        });
      } else {

        // Error, database is not setup
        resolve(false);
      }
    });
  },

  // Get a single show
  getShow: (dbClient, title, year) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Strip out characters in title to match lookup
        const strippedTitle = title.replace(/:/g, '').replace(/-/g, '').replace(/'/g, '');

        // Setup Sql statement
        const sql = `SELECT * FROM shows WHERE REPLACE(REPLACE(REPLACE(title, ':',''), '-', ''), '''', '') LIKE '%${strippedTitle}%' AND year = ${year}`;

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

  // Get a single show
  getShowById: (dbClient, id) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup Sql statement
        const sql = `SELECT * FROM shows WHERE id = '${id}'`;

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

  // Add a single show to the database
  addShow: (dbClient, data, path) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Turn Genres array into string
        const genres = data.genres.map(obj => obj.name).join(', ');

        // Setup sql statement
        const sqlStatement = `INSERT INTO shows (id, tmdb_id, location, title, description, year, genre, poster, ratings_tmdb) 
          VALUES (
            '${uuidv4()}',
            ${data.id},
            '${path.replace(/'/g, "''")}',
            '${data.name.replace(/'/g, "''")}',
            '${data.overview.replace(/'/g, "''")}',
            ${data.first_air_date.substr(0, 4)},
            '${genres}',
            '${process.env.TMDB_IMAGE_URL}/${data.poster_path}',
            '${data.vote_average}'
          )
        `;

        // Run insert statement
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

      } else {

        // Error, database is not setup
        resolve(false);
      }
    });
  },

  // Get list of all tv shows
  getAllShows: (dbClient) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup Sql statement
        const sql = `SELECT * FROM shows ORDER BY title ASC`;

        // Run insert statement
        dbClient.all(sql, [], (error, rows) => {

          // Check for error
          if (error) {

            // Send back failure
            resolve(false);

          } else {

            // Return shows
            resolve(rows);
          }
        });
      } else {

        // Error, database is not setup
        resolve(false);
      }
    });
  },

  // Get a single show with all details
  getShowDetails: (dbClient, id) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup object for return
        const dataObj = {};

        // Setup Sql statement to get the show details
        const sql = `SELECT * FROM shows WHERE id = '${id}'`;

        // Run insert statement
        dbClient.all(sql, [], async (error, rows) => {

          // Check for error
          if (error) {

            // Send back failure
            resolve(false);

          } else {

            // Check for data
            if (rows.length != 0) {

              // Add show data to data object
              dataObj.show = rows[0];

              // Setup sql statment to get all seasons
              const sqlSeasons = `SELECT * FROM show_season WHERE show_id = '${id}' ORDER BY season ASC`;

              // Run insert statement
              dbClient.all(sqlSeasons, [], async (error, rows) => {

                // Check for error
                if (error) {

                  // Send back failure
                  resolve(false);

                } else {

                  // Add season data to data object
                  dataObj.seasons = rows;

                  // Setup sql statement to get all episodes
                  const sqlEpisodes = `SELECT * FROM show_episode WHERE show_id = '${id}' ORDER BY season ASC, episode ASC`;

                  // Run insert statement
                  dbClient.all(sqlEpisodes, [], async (error, rows) => {

                    // Check for error
                    if (error) {

                      // Send back failure
                      resolve(false);

                    } else {

                      // Add season data to data object
                      dataObj.episodes = rows;

                      // Return data
                      resolve(dataObj);
                    }
                  });
                }
              });
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

  // Get a single show
  getShowSeason: (dbClient, show_id, season) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup Sql statement
        const sql = `SELECT * FROM show_season WHERE show_id = '${show_id}' AND season = ${season}`;

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

  // Get a single show
  getShowSeasonById: (dbClient, id) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup Sql statement
        const sql = `SELECT * FROM show_season WHERE id = '${id}'`;

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

  // Add a single show to the database
  addShowSeason: (dbClient, data, path, show_id) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup sql statement
        const sqlStatement = `INSERT INTO show_season (id, tmdb_id, show_id, location, season, title, description, poster, ratings_tmdb) 
          VALUES (
            '${uuidv4()}',
            ${data.id},
            '${show_id}',
            '${path.replace(/'/g, "''")}',
            ${data.season_number},
            '${data.name.replace(/'/g, "''")}',
            '${data.overview.replace(/'/g, "''")}',
            '${process.env.TMDB_IMAGE_URL}/${data.poster_path}',
            '${data.vote_average}'
          )
        `;

        // Run insert statement
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

      } else {

        // Error, database is not setup
        resolve(false);
      }
    });
  },

  // Get a single show
  getShowEpisode: (dbClient, show_id, season_id, episode) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup Sql statement
        const sql = `SELECT * FROM show_episode WHERE show_id = '${show_id}' AND season_id = '${season_id}' AND episode = ${episode}`;

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

  // Get a single show
  getShowEpisodeById: (dbClient, id) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup Sql statement
        const sql = `SELECT * FROM show_episode WHERE id = '${id}'`;

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

  // Add a single show to the database
  addShowEpisode: (dbClient, data, path, show_id, season_id) => {
    return new Promise(async (resolve, reject) => {

      // Check to make sure db is setup
      const dbCheck = await checkForData(dbClient);
      if (dbCheck == 1) {

        // Setup sql statement
        const sqlStatement = `INSERT INTO show_episode (id, tmdb_id, show_id, season_id, location, season, episode, title, description, duration, poster, ratings_tmdb) 
          VALUES (
            '${uuidv4()}',
            ${data.id},
            '${show_id}',
            '${season_id}',
            '${path.replace(/'/g, "''")}',
            ${data.season_number},
            ${data.episode_number},
            '${data.name.replace(/'/g, "''")}',
            '${data.overview.replace(/'/g, "''")}',
            '${data.runtime}',
            '${process.env.TMDB_IMAGE_URL}/${data.still_path}',
            '${data.vote_average}'
          )
        `;

        // Run insert statement
        dbClient.run(sqlStatement, (error) => {

          // Check for error
          if (error) {

            // Error, something went wrong
            resolve(false);
            console.log(error);

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