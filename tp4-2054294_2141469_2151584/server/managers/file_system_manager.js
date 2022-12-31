const fs = require("fs");

class FileSystemManager {
  async writeToJsonFile (path, data) {
    return await fs.promises.writeFile(path, data);
  }

  async readFile (path) {
    return await fs.promises.readFile(path);
  }
}

module.exports = { FileSystemManager };
