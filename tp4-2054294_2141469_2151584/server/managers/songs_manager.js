const { FileSystemManager } = require("./file_system_manager");
const path = require("path");

class SongsManager {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/songs.json");
    this.fileSystemManager = new FileSystemManager();
  }

  async getAllSongs () {
    const fileBuffer = await this.fileSystemManager.readFile(this.JSON_PATH);
    return JSON.parse(fileBuffer).songs;
  }

  async getSongById (id) {
    const songs = await this.getAllSongs();
    const song = songs.find((song) => song.id === parseInt(id));
    if (song === undefined) {
      throw new "Ne contient pas la chanson en question"();
    }
    return song;
  }

  async updateSongLike (id) {
    const songs = await this.getAllSongs();
    let liked = true;
    songs.forEach((song) => {
      if (song.id === id) {
        song.liked = !song.liked;
        liked = song.liked;
      }
    });
    await this.fileSystemManager.writeToJsonFile(this.JSON_PATH, JSON.stringify({ songs }));
    return liked;
  }
}

module.exports = { SongsManager };
