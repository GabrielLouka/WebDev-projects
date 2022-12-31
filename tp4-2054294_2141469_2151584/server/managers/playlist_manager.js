const { FileSystemManager } = require("./file_system_manager");
const path = require("path");
const { randomUUID } = require("crypto");
const fs = require("fs");

class PlaylistManager {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/playlists.json");
    this.fileSystemManager = new FileSystemManager();
  }

  async getAllPlaylists () {
    const fileBuffer = await this.fileSystemManager.readFile(this.JSON_PATH);
    return JSON.parse(fileBuffer).playlists;
  }

  async getPlaylistById (id) {
    const playlists = await this.getAllPlaylists();
    const playlistById = playlists.find((playlist) => playlist.id === id);
    return playlistById;
  }

  async addPlaylist (playlist) {
    const playlists = await this.getAllPlaylists();
    playlist.id = randomUUID();
    await this.savePlaylistThumbnail(playlist);
    playlists.push(playlist);
    await this.fileSystemManager.writeToJsonFile(this.JSON_PATH, JSON.stringify({ playlists }));
    return playlist;
  }

  async updatePlaylist (playlist) {
    let playlists = await this.getAllPlaylists();
    playlists = playlists.map((item) => { return item.id === playlist.id ? playlist : item });
    const indexOfThePlaylist = playlists.findIndex((item) => { return item.id === playlist.id; });
    if (indexOfThePlaylist !== -1) {
      await this.savePlaylistThumbnail(playlist);
      playlists[indexOfThePlaylist].name = playlist.name;
      playlists[indexOfThePlaylist].description = playlist.description;
      playlists[indexOfThePlaylist].songs = playlist.songs;
      await this.fileSystemManager.writeToJsonFile(this.JSON_PATH, JSON.stringify({ playlists }));
    } else {
      throw new Error("No playlist matches");
    }
  }

  async chooseProperEncoding (picture) {
    if (picture.startsWith("data:image/jpeg;base64,")) {
      return "jpeg";
    } else if (picture.startsWith("data:image/png;base64,")) {
      return "png";
    } else if (picture.startsWith("data:image/bmp;base64,")) {
      return "bmp";
    } else if (picture.startsWith("data:image/jpg;base64,")) {
      return "jpg";
    } else {
      throw new Error("Invalid image format");
    }
  }

  async deletePlaylist (id) {
    const allPlaylists = await this.getAllPlaylists();
    const playlistToDelete = allPlaylists.find((playlist) => playlist.id === id);
    if (playlistToDelete) {
      const playlists = allPlaylists.filter((playlist) => playlist.id !== id);
      const playlistToSave = JSON.stringify({ playlists }, null, 2);
      await this.fileSystemManager.writeToJsonFile(this.JSON_PATH, playlistToSave);
      await this.deletePlaylistThumbnail(playlistToDelete.thumbnail);
      return true;
    } else {
      return false;
    }
  }

  async deletePlaylistThumbnail (filePath) {
    return fs.promises.unlink(filePath);
  }

  async savePlaylistThumbnail (playlist) {
    const fileFormat = await this.chooseProperEncoding(playlist.thumbnail);
    const thumbnailData = playlist.thumbnail.replace(`data:image/${fileFormat};base64,`, "");
    const thumbnailFileName = `assets/img/${playlist.id}.${fileFormat}`;
    const filePath = path.join(__dirname + `../../assets/img/${playlist.id}.${fileFormat}`);
    await fs.promises.writeFile(filePath, thumbnailData, { encoding: "base64" });
    playlist.thumbnail = thumbnailFileName;
  }
}
module.exports = { PlaylistManager };
