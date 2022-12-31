import { SERVER_URL } from "./consts.js";

export const HTTPInterface = {
  SERVER_URL: `${SERVER_URL}/api`,

  GET: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`);
    return await response.json();
  },

  POST: async function (endpoint, data) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });

    return await response.json();
  },

  DELETE: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "DELETE",
    });
    return response.status;
  },

  PATCH: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PATCH",
    });
    return response.status;
  },

  PUT: async function (endpoint, data) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });
    return response.status;
  },
};

export default class HTTPManager {
  constructor () {
    this.songs = {};
    this.playlists = {};
    this.songsBaseURL = "songs";
    this.songFileBaseURL = "player";
    this.playlistBaseURL = "playlists";
    this.songPlayer = "player";
    this.searchBaseURL = "search";
  }

  async fetchAllSongs () {
    const songs = await HTTPInterface.GET(`${this.songsBaseURL}`);
    return songs;
  }

  async fetchAllPlaylists () {
    const playlists = await HTTPInterface.GET(`${this.playlistBaseURL}`);
    return playlists;
  }

  async fetchSong (id) {
    const song = await HTTPInterface.GET(`${this.songsBaseURL}/${id}`);
    return song;
  }

  async getSongURLFromId (id) {
    const songBlob = await fetch(`${HTTPInterface.SERVER_URL}/${this.songsBaseURL}/${this.songFileBaseURL}/${id}`);
    const url = URL.createObjectURL(await songBlob.blob());
    return url;
  }

  async search (query, exact) {
    const searchResults = await HTTPInterface.GET(`${this.searchBaseURL}?search_query=${query}&exact=${exact}`);
    return searchResults;
  }

  async getAllSongs () {
    const songsPromises = new Promise((resolve, reject) => {
      try {
        const songs = this.fetchAllSongs();
        resolve(songs);
      } catch (err) {
        reject("Échec lors de la requête GET /api/songs");
      }
    });

    const songsReceived = Promise.resolve(songsPromises);
    return songsReceived;
  }

  async getAllPlaylists () {
    const playlistsPromises = new Promise((resolve, reject) => {
      try {
        const playlists = this.fetchAllPlaylists();
        resolve(playlists);
      } catch (err) {
        reject("Échec lors de la requête GET /api/playlists");
      }
    });

    const playlistsReceived = Promise.resolve(playlistsPromises);
    return playlistsReceived;
  }

  async getPlaylistById (id) {
    try {
      const playlist = await HTTPInterface.GET(`${this.playlistBaseURL}/${id}`);
      return playlist;
    } catch (err) {
      window.alert(err);
    }
  }

  async addNewPlaylist (playlist) {
    try {
      await Promise.resolve(await HTTPInterface.POST(`${this.playlistBaseURL}`, playlist));
    } catch (err) {
      window.alert("An error has occured while adding a new playlist", err);
    }
  }

  async updatePlaylist (playlist) {
    try {
      await Promise.resolve(await HTTPInterface.PUT(`${this.playlistBaseURL}/${playlist.id}`, playlist));
    } catch (err) {
      window.alert("An error has occured while adding a new playlist", err);
    }
  }

  async deletePlaylist (id) {
    try {
      await Promise.resolve(await HTTPInterface.DELETE(`${this.playlistBaseURL}/${id}`));
    } catch (err) {
      window.alert("An error has occured while deleting a playlist", err);
    }
  }

  async updateSong (id) {
    try {
      await HTTPInterface.PATCH(`${this.songsBaseURL}/${id}/like`);
    } catch (err) {
      window.alert("An error has occured while trying to change a song status", err);
    }
  }
}
