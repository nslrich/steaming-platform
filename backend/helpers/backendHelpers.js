// NPM Imports
const fs = require('fs');
const mime = require('mime');
const axios = require('axios');

// Helpers
const { checkForData, getMovie, addMovie, getShow, addShow, getShowSeason, addShowSeason, getShowEpisode, addShowEpisode } = require('./databaseHelpers');

// Functions to export
module.exports = {

  // Function to scan the movies and show folders to find if new content has been added
  scanLibraries: (dbClient) => {
    return new Promise(async (resolve, reject) => {

      // Try Catch around everything to prevent crashing
      try {

        // Check to make sure setup has been done
        const setupCheck = await checkForData(dbClient);
        if (setupCheck == 1) {

          // Get settings
          const settingsSql = `SELECT * FROM settings WHERE id = 1`;

          // Run query
          dbClient.all(settingsSql, async (error, rows) => {

            // Check for errors
            if (error) {

              // Do nothing if error

            } else {

              // Make sure there is data
              if (rows.length != 0) {

                // Get data
                const settings = rows[0];

                // Check for new movies
                await checkForMovies(dbClient, settings.movie_locaction);

                // Check for new shows
                await checkForShows(dbClient, settings.show_location);
              }
            }
          });
        }
      } catch (error) {

        // Something went wrong
        console.log(error);
      }
    });
  }
};


// Function to check to see if new movies have been added to folders and get info
function checkForMovies(dbClient, path) {
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

        // Check database to see if this movie has already been added
        const movieData = await getMovie(dbClient, title, year);

        // Check to see if there is a match
        if (movieData == false) {

          // No match get new data
          const movieInfo = await lookupMovieTMDB(title, year);

          // Check result
          if (movieInfo !== false) {

            // Get tmdb id out
            const tmdbID = movieInfo.results[0].id;

            // Look up details on show
            const movieDetails = await lookupMovieDetailsTMDB(tmdbID);

            // Check result
            if (movieDetails !== false) {

              // Add movie to database
              addMovie(dbClient, movieDetails, file);
            }
          }
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
function checkForShows(dbClient, path) {
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

        // Get the first folder (show name)
        const folderName = fileArray[0];
        const folderNameArray = folderName.split('(');

        // Break out title and year
        const title = folderNameArray[0].trim();
        const year = parseInt(folderNameArray[1]);

        // Get the second folder (season)
        const seasonFolder = fileArray[1];
        const seasonFolderArr = seasonFolder.split(' ');
        const seasonString = seasonFolderArr[1];
        const seasonNumber = parseInt(seasonFolderArr[1]);

        // Split file name up
        const fileName = fileArray[2];
        const index = fileName.indexOf('S' + seasonString);
        const fileNameSub = fileName.substr(index);
        const index2 = fileNameSub.indexOf('.');
        const seasonAndEpisode = fileNameSub.substring(0, index2);
        const seasonAndEpisodeArr = seasonAndEpisode.split('E');
        const episodeString = seasonAndEpisodeArr[1];
        const episodeNumber = parseInt(seasonAndEpisodeArr[1]);

        // Check database to see if this movie has already been added
        var showData = await getShow(dbClient, title, year);

        // Check to see if there is a match
        if (showData == false) {

          // No match get new data
          const showInfo = await lookupShowTMDB(title, year);

          // Check result
          if (showInfo !== false) {

            // Get tmdb id out
            const tmdbID = showInfo.results[0].id;

            // Look up details on show
            const showDetails = await lookupShowDetailsTMDB(tmdbID);

            // Check result
            if (showDetails !== false) {

              // Add show to database
              await addShow(dbClient, showDetails, path + '\\' + folderName);

              // Refresh show data
              showData = await getShow(dbClient, title, year);
            }
          }
        }

        // Check database to see if this movie has already been added
        var seasonData = await getShowSeason(dbClient, showData.id, seasonNumber);

        // Check to see if there is a match
        if (showData != false && seasonData == false) {

          // No match get new data
          const seasonInfo = await lookupShowSeasonDetailsTMDB(showData.tmdb_id, seasonNumber);

          // Check result
          if (seasonInfo !== false) {

            // Add show to database
            await addShowSeason(dbClient, seasonInfo, path + '\\' + folderName + '\\' + seasonFolder, showData.id);

            // Refresh season data
            seasonData = await getShowSeason(dbClient, showData.id, seasonNumber);
          }
        }

        // Check database to see if this movie has already been added
        var episdoeData = await getShowEpisode(dbClient, showData.id, seasonData.id, episodeNumber);

        // Check to see if there is a match
        if (showData != false && seasonData != false && episdoeData == false) {

          // No match get new data
          const episodeInfo = await lookupShowSeasonEpisodeDetailsTMDB(showData.tmdb_id, seasonNumber, episodeNumber);

          // Check result
          if (episodeInfo !== false) {

            // Add show to database
            await addShowEpisode(dbClient, episodeInfo, path + '\\' + folderName + '\\' + seasonFolder + '\\' + fileName, showData.id, seasonData.id);
          }
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
function lookupMovieTMDB(title, year) {
  return new Promise((resolve, reject) => {

    // Setup request params
    const params = {
      query: title,
      year: year,
      include_adult: true,
      language: 'en-US'
    }

    // Setup Headers
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`
    }

    // Run get request
    axios.get(`${process.env.TMDB_API_URL}/search/movie`, { headers: headers, params: params }).then((res) => {

      // Check to make sure there is data
      if (res.data.results.length != 0) {

        // Return data
        resolve(res.data);

      } else {

        // Something went wrong.
        resolve(false);
      }
    }).catch((error) => {

      // Something went wrong.
      resolve(false);
    });
  });
}

// Function to look up movie or show using API
function lookupMovieDetailsTMDB(tmdbID) {
  return new Promise((resolve, reject) => {

    // Setup request params
    const params = {
      language: 'en-US'
    }

    // Setup Headers
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`
    }

    // Run get request
    axios.get(`${process.env.TMDB_API_URL}/movie/${tmdbID}`, { headers: headers, params: params }).then((res) => {

      // Return data
      resolve(res.data);

    }).catch((error) => {

      // Something went wrong.
      resolve(false);
    });
  });
}

// Function to look up movie or show using API
function lookupShowTMDB(title, year) {
  return new Promise((resolve, reject) => {

    // Setup request params
    const params = {
      query: title,
      year: year,
      include_adult: true,
      language: 'en-US'
    }

    // Setup Headers
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`
    }

    // Run get request
    axios.get(`${process.env.TMDB_API_URL}/search/tv`, { headers: headers, params: params }).then((res) => {

      // Check to make sure there is data
      if (res.data.results.length != 0) {

        // Return data
        resolve(res.data);

      } else {

        // Something went wrong.
        resolve(false);
      }
    }).catch((error) => {

      // Something went wrong.
      resolve(false);
    });
  });
}

// Function to look up movie or show using API
function lookupShowDetailsTMDB(tmdbID) {
  return new Promise((resolve, reject) => {

    // Setup request params
    const params = {
      language: 'en-US'
    }

    // Setup Headers
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`
    }

    // Run get request
    axios.get(`${process.env.TMDB_API_URL}/tv/${tmdbID}`, { headers: headers, params: params }).then((res) => {

      // Return data
      resolve(res.data);

    }).catch((error) => {

      // Something went wrong.
      resolve(false);
    });
  });
}

// Function to look up movie or show using API
function lookupShowSeasonDetailsTMDB(tmdbID, seasonNumber) {
  return new Promise((resolve, reject) => {

    // Setup request params
    const params = {
      language: 'en-US'
    }

    // Setup Headers
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`
    }

    // Run get request
    axios.get(`${process.env.TMDB_API_URL}/tv/${tmdbID}/season/${seasonNumber}`, { headers: headers, params: params }).then((res) => {

      // Return data
      resolve(res.data);

    }).catch((error) => {

      // Something went wrong.
      resolve(false);
    });
  });
}

// Function to look up movie or show using API
function lookupShowSeasonEpisodeDetailsTMDB(tmdbID, seasonNumber, episodeNumber) {
  return new Promise((resolve, reject) => {

    // Setup request params
    const params = {
      language: 'en-US'
    }

    // Setup Headers
    const headers = {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_KEY}`
    }

    // Run get request
    axios.get(`${process.env.TMDB_API_URL}/tv/${tmdbID}/season/${seasonNumber}/episode/${episodeNumber}`, { headers: headers, params: params }).then((res) => {

      // Return data
      resolve(res.data);

    }).catch((error) => {

      // Something went wrong.
      resolve(false);
    });
  });
}