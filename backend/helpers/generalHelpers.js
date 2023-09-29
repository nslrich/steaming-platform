// NPM Imports
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');

// Exports
module.exports = {

  // Get folders with in a given path
  getDirectories: (path) => {
    return new Promise((resolve, reject) => {
      const folders = [];
      const all = fs.readdirSync(path);
      for (var item of all) {
        try {
          if (fs.lstatSync(path + '\\' + item).isDirectory()) {
            folders.push(item);
          }
        } catch (error) {}
      }
      resolve(folders);
    });
  },

  // List all drives
  getDrives: () => {
    return new Promise((resolve, reject) => {

      // Holder for drives
      const drives = [];

      // Get os
      const osType = os.type();

      // Check which os we are using
      if (osType.includes('Win')) {

        // Execute cmd line to get all attached drives
        exec('wmic logicaldisk get deviceid, volumename, description', (error, stdout, stderr) => {

          // Check for error
          if (error) {

            // send back no drives
            resolve(drives);

          } else {

            // Parse results
            const data = stdout.replace(/\r/g, '').trim().split('\n').slice(1);

            // Loop through results adding drive letters to list
            for (var item of data) {
              if (item.includes('Local Fixed Disk') || item.includes('Network Connection')) {
                drives.push(item.substring(item.indexOf(':') - 1, item.indexOf(':') + 1));
              }
            }

            // Send back results
            resolve(drives);
          }
        });
      }
    });
  }
};