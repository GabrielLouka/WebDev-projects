const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { PlaylistManager } = require("../managers/playlist_manager");

const playlistManager = new PlaylistManager();

router.get("/", async (request, response) => {
  try {
    const playlists = await playlistManager.getAllPlaylists();
    response.status(HTTP_STATUS.SUCCESS).json(playlists);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

router.get("/:id", async (request, response) => {
  try {
    const playlistById = await playlistManager.getPlaylistById(request.params.id)
    if (playlistById) {
      response.status(HTTP_STATUS.SUCCESS).json(playlistById);
    } else {
      response.status(HTTP_STATUS.NOT_FOUND).send();
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

router.post("/", async (request, response) => {
  try {
    if (!Object.keys(request.body).length) {
      response.status(HTTP_STATUS.BAD_REQUEST).send();
      return;
    }
    const playlist = await playlistManager.addPlaylist(request.body);
    response.status(HTTP_STATUS.CREATED).json(playlist);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

router.put("/:id", async (request, response) => {
  try {
    if (!Object.keys(request.body).length) {
      response.status(HTTP_STATUS.BAD_REQUEST).send();
      return;
    }
    await playlistManager.updatePlaylist(request.body);
    response.status(HTTP_STATUS.SUCCESS).json({ id: request.body.id });
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const playlistdeleted = await playlistManager.deletePlaylist(request.params.id);
    if (playlistdeleted) {
      response.status(HTTP_STATUS.SUCCESS).json(playlistdeleted);
    } else {
      response.status(HTTP_STATUS.NOT_FOUND).send();
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

module.exports = { router, playlistManager };
