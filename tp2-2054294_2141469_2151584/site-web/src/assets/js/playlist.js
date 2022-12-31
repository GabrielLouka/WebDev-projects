import StorageManager from "./storageManager.js";
import { formatTime } from "./utils.js";
import { SKIP_TIME, SHORTCUTS } from "./consts.js";
import Player from "./player.js";

export class PlayListManager {
  constructor (player) {
    /**
     * @type {Player}
     */
    this.player = player;
    this.shortcuts = new Map();
  }

  /**
   * TODO
   * Charge les chansons de la playlist choisie et construit dynamiquement le HTML pour les éléments de chansons
   * @param {StorageManager} storageManager gestionnaire d'accès au LocalStorage
   * @param {string} playlistId identifiant de la playlist choisie
   */
   loadSongs (storageManager, playlistId) {
    const playlist = storageManager.getItemById(
      storageManager.STORAGE_KEY_PLAYLISTS,
      playlistId
    );
    if (!playlist) return;



    // TODO : Changer l'image et le titre de la page en fonction de la playlist choisie
    document.getElementById("playlist-title").appendChild(document.createTextNode(playlist.name));
    document.getElementById("playlist-img").setAttribute("src",playlist.thumbnail);

    const songContainer = document.getElementById("song-container");
    songContainer.innerHTML="";

    // TODO : Récupérer les chansons de la playlist et construire le HTML pour leur représentation
    let index = 0;
    const songs = [];
    for (const song of playlist.songs){
      
      const songItem = this.buildSongItem(storageManager.getItemById(
        storageManager.STORAGE_KEY_SONGS,
        song.id), index);
      index++; 
      songContainer.appendChild(songItem);
      songs.push(storageManager.getItemById(
        storageManager.STORAGE_KEY_SONGS,
        song.id));
      
    }
    this.player.loadSongs(songs);

  }

  /**
   * TODO
   * Construit le code HTML pour représenter une chanson
   * @param {Object} song la chansons à représenter
   * @param {number} index index de la chanson
   * @returns {HTMLDivElement} le code HTML dans un élément <div>
   */
  buildSongItem (song, index) {
    const songItem = document.createElement("div");
    songItem.classList.add("song-item", "flex-row");

    const span = document.createElement("span");
    const spanText = document.createTextNode(index+1);
    span.appendChild(spanText);

    const songP1 = document.createElement("p");
    const songP1Text = document.createTextNode(song.name);
    songP1.appendChild(songP1Text);

    const songP2 = document.createElement("p");
    const songP2Text = document.createTextNode(song.genre);
    songP2.appendChild(songP2Text);

    const songP3 = document.createElement("p");
    const songP3Text = document.createTextNode(song.artist);
    songP3.appendChild(songP3Text);

    const songIcon = document.createElement("i");
    if(song.liked) {
      songIcon.setAttribute("class","fa fa-2x fa-heart");
    } else {
      songIcon.setAttribute("class","fa-regular fa-2x fa-heart");
    }

    // TODO : gérer l'événement "click" et jouer la chanson après un click
    songItem.addEventListener("click", () => {
        this.playAudio(index);
    });

    songItem.appendChild(span);
    songItem.appendChild(songP1);
    songItem.appendChild(songP2);
    songItem.appendChild(songP3);
    songItem.appendChild(songIcon);
    
    return songItem;
  }

  /**
   * TODO
   * Joue une chanson en fonction de l'index et met à jour le titre de la chanson jouée
   * @param {number} index index de la chanson
   */
  playAudio (index) {
    this.player.playAudio(index);
    this.setCurrentSongName();

    // TODO : modifier l'icône du bouton. Ajoute la classe 'fa-pause' si la chanson joue, 'fa-play' sinon
    this.changePlayButton();
  }

  /**
   * TODO
   * Joue la prochaine chanson et met à jour le titre de la chanson jouée
   */
  playPreviousSong () {
    this.player.playPreviousSong();
    this.setCurrentSongName();
    this.changePlayButton();
  }
  //fonction pour remplacer le bouton play
  changePlayButton(){
    const playButton = document.getElementById("play");
    if(this.player.audio.paused){
      playButton.classList.replace("fa-pause","fa-play");
    } else {
      playButton.classList.replace("fa-play","fa-pause");
    }
  }
  /**
   * TODO
   * Joue la chanson précédente et met à jour le titre de la chanson jouée
   */
  playNextSong () { 
    this.player.playNextSong();
    this.setCurrentSongName();
    this.changePlayButton();
  }

  /**
   * TODO
   * Met à jour le titre de la chanson jouée dans l'interface
   */
  setCurrentSongName () { 
    const currentSongHTML = document.getElementById("now-playing");
    currentSongHTML.innerHTML = "";
    let songNameFromPlayer = this.player.getSongFromIndex(this.player.currentIndex);
    const currentSongName = document.createTextNode(songNameFromPlayer.name);
    currentSongHTML.appendChild(currentSongName);
  }

  /**
   * Met à jour la barre de progrès de la musique
   * @param {HTMLSpanElement} currentTimeElement élément <span> du temps de la chanson
   * @param {HTMLInputElement} timelineElement élément <input> de la barre de progrès
   * @param {HTMLSpanElement} durationElement élément <span> de la durée de la chanson
   */
  timelineUpdate (currentTimeElement, timelineElement, durationElement) {
    const position =
      (100 * this.player.audio.currentTime) / this.player.audio.duration;
    timelineElement.value = position;
    currentTimeElement.textContent = formatTime(this.player.audio.currentTime);
    if (!isNaN(this.player.audio.duration)) {
      durationElement.textContent = formatTime(this.player.audio.duration);
    }
  }

  /**
   * TODO
   * Déplacement le progrès de la chansons en fonction de l'attribut 'value' de timeLineEvent
   * @param {HTMLInputElement} timelineElement élément <input> de la barre de progrès
   */
  audioSeek (timelineElement) { 
    this.player.audioSeek(timelineElement.value);
  }

  /**
   * TODO
   * Active ou désactive le son
   * Met à jour l'icône du bouton et ajoute la classe 'fa-volume-mute' si le son ferme ou 'fa-volume-high' si le son est ouvert
   */
  muteToggle () { 
    const muteButton = document.getElementById("mute");
    let muted = this.player.muteToggle();

    if(muted){
      muteButton.classList.replace("fa-volume-high","fa-volume-mute");
    } else {
      muteButton.classList.replace("fa-volume-mute","fa-volume-high");
    }
  }

  /**
   * TODO
   * Active ou désactive l'attribut 'shuffle' de l'attribut 'player'
   * Met à jour l'icône du bouton et ajoute la classe 'control-btn-toggled' si shuffle est activé, retire la classe sinon
   * @param {HTMLButtonElement} shuffleButton élément <button> de la fonctionnalité shuffle
   */
  shuffleToggle (shuffleButton) { 
    let shuffled = this.player.shuffleToggle();
    if(shuffled){
      shuffleButton.classList.add("control-btn-toggled");
    } else {
      shuffleButton.classList.remove("control-btn-toggled");
    }
  }

  /**
   * Ajoute delta secondes au progrès de la chanson en cours
   * @param {number} delta temps en secondes
   */
  scrubTime (delta) {
    this.player.scrubTime(delta);
  }

  /**
   * TODO
   * Configure la gestion des événements
   */
  bindEvents () {
    const currentTime = document.getElementById("timeline-current");
    const duration = document.getElementById("timeline-end");
    const timeline = document.getElementById("timeline");
    this.player.audio.addEventListener("timeupdate", () => {
      this.timelineUpdate(currentTime, timeline, duration);
    });

    timeline.addEventListener("input", () => {
      this.audioSeek(timeline);
    });

    // TODO : gérer l'événement 'ended' sur l'attribut 'audio' du 'player' et jouer la prochaine chanson automatiquement
    this.player.audio.addEventListener("ended", () => {
      this.playNextSong();
    });
    // TODO : gérer l'événement 'click' sur le bon bouton et mettre la chanson en pause/enlever la pause
    document.getElementById("play").addEventListener("click", () => {
      this.playAudio();
    });
    // TODO : gérer l'événement 'click' sur le bon bouton et fermer/ouvrir le son
    document.getElementById("mute").addEventListener("click", () => {
      this.muteToggle();
    });
    // TODO : gérer l'événement 'click' sur le bon bouton et jouer la chanson précédente
    document.getElementById("previous").addEventListener("click", () => {
      this.playPreviousSong();
    });
    // TODO : gérer l'événement 'click' sur le bon bouton et jouer la chanson suivante
    document.getElementById("next").addEventListener("click", () => {
      this.playNextSong();
      
    });
    // TODO : gérer l'événement 'click' sur le bon bouton et activer/désactiver le mode 'shuffle'
    document.getElementById("shuffle").addEventListener("click", () => {
      this.shuffleToggle(document.getElementById("shuffle"));
    });
  }

  /**
   * Configure les raccourcis et la gestion de l'événement 'keydown'
   */
  bindShortcuts () {
    this.shortcuts.set(SHORTCUTS.GO_FORWARD, () => this.scrubTime(SKIP_TIME));
    this.shortcuts.set(SHORTCUTS.GO_BACK, () => this.scrubTime(-SKIP_TIME));
    this.shortcuts.set(SHORTCUTS.PLAY_PAUSE, () => this.playAudio());
    this.shortcuts.set(SHORTCUTS.NEXT_SONG, () => this.playNextSong());
    this.shortcuts.set(SHORTCUTS.PREVIOUS_SONG, () => this.playPreviousSong());
    this.shortcuts.set(SHORTCUTS.MUTE, () => this.muteToggle());

    document.addEventListener("keydown", (event) => {
      if (this.shortcuts.has(event.key)) {
        const command = this.shortcuts.get(event.key);
        command();
      }
    });
  }
}

window.onload = () => {
  const storageManager = new StorageManager();
  storageManager.loadAllData();

  // TODO : récupérer l'identifiant à partir de l'URL
  let param = new URLSearchParams(document.location.search);
  let playlistId = param.get("id");

  const player = new Player();
  const playlistManager = new PlayListManager(player);

  // TODO : configurer la gestion des événements et des raccourcis
  playlistManager.bindEvents();
  playlistManager.bindShortcuts();

  // TODO : charger la playlist
  playlistManager.loadSongs(storageManager, playlistId);

};
