const { FileSystemManager } = require("./file_system_manager");
const { dbService } = require("./database.service");
const DB_CONSTS = require("../utils/env");

const path = require("path");

class SongService {
  constructor () {
    this.JSON_PATH = path.join(__dirname + "../../data/songs.json");
    this.fileSystemManager = new FileSystemManager();
    this.dbService = dbService;
  }

  get collection () {
    return this.dbService.db.collection(DB_CONSTS.DB_COLLECTION_SONGS);
  }

  /**
   * TODO : Implémenter la récupération de toutes les chansons
   *
   * Retourne la liste de toutes les chansons
   * @returns {Promise<Array>}
   */
  async getAllSongs () {
    const playlists = await this.collection.find({}).toArray();
    return playlists;
  }

  /**
   * TODO : Implémenter la récupération d'une chanson en fonction de son id
   *
   * Retourne une chanson en fonction de son id
   * @param {number} id identifiant de la chanson
   * @returns chanson correspondant à l'id
   */
  async getSongById (id) {
    const queryId = {id : parseInt(id)};
    const songsById = await this.collection.find(queryId).toArray();
    if(songsById.length){
      return songsById[0];
    }
    return null;  }

  /**
   * TODO : Implémenter l'inversement de l'état aimé d'une chanson
   *
   * Modifie l'état aimé d'une chanson par l'état inverse
   * @param {number} id identifiant de la chanson
   * @returns {boolean} le nouveau état aimé de la chanson
   */
  async updateSongLike (id) {
    const songsById = await this.getSongById(id);
    if(songsById){
      const setQuery = {$set:{liked:!songsById.liked}}
      const filter = {id:id}
      this.collection.updateOne(filter,setQuery )
    }
    return songsById.liked;
  }

  /**
   * TODO : Implémenter la recherche pour les 3 champs des chansons. Astuce : utilisez l'opérateur '$or' de MongoDB
   *
   * Cherche et retourne les chansons qui ont un mot clé spécifique dans leur description (name, artist, genre)
   * Si le paramètre 'exact' est TRUE, la recherche est sensible à la case
   * en utilisant l'option "i" dans la recherche par expression régulière
   * @param {string} substring mot clé à chercher
   * @param {boolean} exact si la recherche est sensible à la case
   * @returns toutes les chansons qui ont le mot clé cherché dans leur contenu (name, artist, genre)
   */
  async search (substring, exact) {
    const filterName = { name: { $regex: `${substring}`, $options: "i" } };
    const filterArtist = { artist: { $regex: `${substring}`, $options: "i" } };
    const filterGenre = { genre: { $regex: `${substring}`, $options: "i" } };
    const filterNameSensitiveCase = { name: { $regex: `${substring}` }};
    const filterArtistSensitiveCase = { artist: { $regex: `${substring}`}};
    const filterGenreSensitiveCase = { genre: { $regex: `${substring}`}};

    if(exact){
      const songs = await this.collection.find({$or:[filterNameSensitiveCase,filterArtistSensitiveCase,
      filterGenreSensitiveCase]}).toArray();
      return songs
    }
    const songs = await this.collection.find({$or:[filterName,filterArtist,filterGenre ]}).toArray();
    return songs;
  }

  async populateDb () {
    const songs = JSON.parse(await this.fileSystemManager.readFile(this.JSON_PATH)).songs;
    await this.dbService.populateDb(DB_CONSTS.DB_COLLECTION_SONGS, songs);
  }
}

module.exports = { SongService };
