import StorageManager from "./storageManager.js";

class Library {
  constructor (storageManager) {
    this.storageManager = storageManager;
  }

  /**
   * TODO
   * Génère le code HTML pour l'affichage des playlists et chansons disponibles
   * @param {Object[]} playlists liste de playlists à afficher
   * @param {Object[]} songs liste de chansons à afficher
   */
  generateLists (playlists, songs) {
    // TODO : générer le HTML pour les playlists
    const playlistContainer = document.getElementById("playlist-container");
    playlistContainer.innerHTML = ""; // vider la liste
    for(let i=0; i < playlists.length;i++){
      playlistContainer.appendChild(this.buildPlaylistItem(playlists[i]));
    }
    // TODO : générer le HTML pour les chansons
    const songContainer = document.getElementById("song-container");
    songContainer.innerHTML="";
    for(let i=0; i < songs.length;i++){
      songContainer.appendChild(this.buildSongItem(songs[i]));    
    }
  }

  /**
   * TODO
   * Construit le code HTML qui représente l'affichage d'une playlist
   * @param {Object} playlist playlist à utiliser pour la génération du HTML
   * @returns {HTMLAnchorElement} élément <a> qui contient le HTML de l'affichage pour une playlist
   */
  buildPlaylistItem (playlist) {

    const playlistItem = document.createElement("a");
    let htmlLinkCustom="./playlist.html?id="+ playlist.id;
    playlistItem.setAttribute("href", htmlLinkCustom);
    playlistItem.classList.add("flex-column", "playlist-item");
    const preview = document.createElement("div");
    preview.classList.add("playlist-preview")
    const imageSrc = document.createElement("img");
    imageSrc.setAttribute("src", playlist.thumbnail);
    imageSrc.classList.add("image");
    preview.appendChild(imageSrc);
    const iBalise = document.createElement("i");
    iBalise.setAttribute("class", "fa fa-2x fa-play-circle hidden playlist-play-icon");
    preview.appendChild(iBalise);
    playlistItem.appendChild(preview);
    const p1=document.createElement("p");
    let name=document.createTextNode(playlist.name);
    p1.appendChild(name);
    playlistItem.appendChild(p1);

    const p2=document.createElement("p");
    let description=document.createTextNode(playlist.description);
    p2.appendChild(description);
    playlistItem.appendChild(p2);
    return playlistItem;
  }

  /**
   * TODO
   * Construit le code HTML qui représente l'affichage d'une chansons
   * @param {Object} song chanson à utiliser pour la génération du HTML
   * @returns {HTMLDivElement} élément <div> qui contient le HTML de l'affichage pour une chanson
   */
  buildSongItem = function (song) {

    const songItem = document.createElement("div");
    songItem.classList.add("song-item", "flex-row");
    let p1=document.createElement("p");
    let myname=document.createTextNode(song.name);
    p1.appendChild(myname);
    songItem.appendChild(p1);
    let p2=document.createElement("p");
    let mygenre=document.createTextNode(song.genre);
    p2.appendChild(mygenre);
    songItem.appendChild(p2);
    let p3=document.createElement("p");
    let myartist=document.createTextNode(song.artist);
    p3.appendChild(myartist);
    songItem.appendChild(p3);
    let buttonHeart=document.createElement("button");
    buttonHeart.classList.add("fa-2x", "fa-heart");
    if(song.liked){
      buttonHeart.classList.add("fa");
    } else {
      buttonHeart.classList.add("fa-regular");
    }
    songItem.appendChild(buttonHeart);

    // TODO : gérer l'événement "click". Modifier l'image du bouton et mettre à jour l'information dans LocalStorage
    songItem.addEventListener("click",()=>{
      if(song.liked){
        songItem.lastChild.classList.replace("fa","fa-regular");
        song.liked=false;
        this.storageManager.replaceItem("songs", song);
      } else {
        songItem.lastChild.classList.replace("fa-regular","fa");
        song.liked=true;
        this.storageManager.replaceItem("songs", song);

      }
    });

    return songItem;
  }
};

window.onload = () => {
  const storageManager = new StorageManager();
  const library = new Library(storageManager);

  storageManager.loadAllData();
  // TODO : Récupérer les playlists et les chansons de LocalStorage et bâtir le HTML de la page
  const playlists=storageManager.getData("playlist");
  const songs=storageManager.getData("songs");

  library.generateLists(playlists,songs)
};
