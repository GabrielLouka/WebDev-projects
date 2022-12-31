const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { SongsManager } = require("../managers/songs_manager");
const fs = require("fs");
const path = require("path");
const songsManager = new SongsManager();

router.get("/", async (request, response) => {
  try {
    const songs = await songsManager.getAllSongs();
    response.status(HTTP_STATUS.SUCCESS).json(songs);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

router.get("/:id", async (request, response) => {
  try {
    const song = await songsManager.getSongById(request.params.id);
    response.status(HTTP_STATUS.SUCCESS).json(song);
  } catch (error) {
    if (error instanceof TypeError) {
      response.status(HTTP_STATUS.NOT_FOUND).json(error);
    } else {
      response.status(HTTP_STATUS.SERVER_ERROR).json(error);
    }
  }
});

router.get("/player/:id", async (request, response) => {
  try {
    const song = await songsManager.getSongById(parseInt(request.params.id));
    const filePath = path.join(__dirname + "../../" + song.src);
    const stat = await fs.promises.stat(filePath);
    const fileSize = stat.size;
    const readStream = fs.createReadStream(path.join(__dirname + "../../" + song.src));
    const headers = {
      "Content-Type": ":audio/mpeg",
      "Content-Length": fileSize,
    };
    response.status(HTTP_STATUS.SUCCESS);
    response.set(headers);
    readStream.pipe(response);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

router.patch("/:id/like", async (request, response) => {
  try {
    const liked = await songsManager.updateSongLike(parseInt(request.params.id));
    response.status(HTTP_STATUS.SUCCESS).json({ liked });
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json({ liked: false });
  }
});

module.exports = { router, songsManager };
