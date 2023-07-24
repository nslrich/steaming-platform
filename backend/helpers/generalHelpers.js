// NPM Imports
const fs = require('fs');

// Exports
module.exports = {

  // Get folders with in a given path
  getDirectories: (path) => {
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
};