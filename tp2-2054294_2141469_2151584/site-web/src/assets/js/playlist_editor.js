import playlists from "./playlists.js";
import songs from "./songs.js";
import StorageManager from "./storageManager.js";
import { generateRandomID } from "./utils.js";

/**
 * TODO
 * Popule l'élément 'dataList' avec des éléments <option> en fonction des noms des chansons en paramètre
 * @param {HTMLDataListElement} dataList élément HTML à qui ajouter des options 
 * @param {Object} songs liste de chansons dont l'attribut 'name' est utilisé pour générer les éléments <option>
 */

function buildDataList (dataList, songs) {
  dataList.innerHTML = "";
  // TODO : extraire le nom des chansons et populer l'élément dataList avec des éléments <option>
  for (let i = 0; i < songs.length; i++){ 
    let option = document.createElement("option");
    option.value = songs[i].name;
    dataList.appendChild(option);
    
  }
  
  
}

/**
 * Permet de mettre à jour la prévisualisation de l'image pour la playlist
 */
function updateImageDisplay () {
  const imagePreview = document.getElementById("image-preview");
  imagePreview.src = URL.createObjectURL(this.files[0]);
}

/**
 * TODO
 * Ajoute le code HTML pour pouvoir ajouter une chanson à la playlist
 * Le code contient les éléments <label>, <input> et <button> dans un parent <div>
 * Le bouton gère l'événement "click" et retire le <div> généré de son parent
 * @param {Event} e événement de clic
 */
function addItemSelect (e) {
  // TODO : prévenir le comportement par défaut du bouton pour empêcher la soumission du formulaire
  
  e.preventDefault()
  
  // TODO : construire les éléments HTML nécessaires pour l'ajout d'une nouvelle chanson
  const songContainer = document.getElementById("song-list");
  
  let size = songContainer.getElementsByTagName('div').length;
  let label = document.createElement("label");
  label.setAttribute("for", `song-${size + 1}`);
  label.textContent = `#${size + 1}`; 
  let input = document.createElement("input");
  input.setAttribute("class", "song-input");
  input.setAttribute("id", `song-${size + 1}`);
  input.setAttribute("type", "select");
  input.setAttribute("list", "song-dataList");
  input.setAttribute("required", "");
  input.style.position = "relative";
  input.style.left = "4px";
  let childDiv = document.createElement("div");
  let removeButton = document.createElement("button");
  removeButton.setAttribute("class", "fa fa-minus");
  removeButton.style.position = "relative";
  removeButton.style.left = "10px";
  childDiv.appendChild(label);
  childDiv.appendChild(input);
  childDiv.appendChild(removeButton);
  // TODO : gérér l'événement "click" qui retire l'élément <div> généré de son parent
  removeButton.addEventListener("click", () => {   
    for (let i = parseInt((label.textContent).replace("#", "")); i < songContainer.children.length; i++){
      songContainer.children[i].children[0].textContent = `#${i}`;
    }     
    childDiv.remove();
  });
  songContainer.appendChild(childDiv);

  
}

function extractSongsFromForm(theForm){
  let res = [];
  let indexForFirstSong = 6
  let indexStartingFromSecondSong = indexForFirstSong + 1
  let lastSongPosition = theForm.length - 3
  let jumpFactor = 2 
  res.push(theForm[indexForFirstSong].value)
  for(let i = indexStartingFromSecondSong; i <= lastSongPosition; i += jumpFactor) {
    res.push(theForm[i].value);
  }
  return res;
}

function addAllChosenSongs(extractedSongs){
  const storage = new StorageManager();
  const songIDs = [];
  for(let i = 0; i < songs.length; i++){
    if(extractedSongs.includes(songs[i].name)){
      songIDs.push({id: storage.getIdFromName("songs", songs[i].name)});
    }
  }
  return songIDs;
}

function redirectToPage(pageString){
  location.href = pageString
}

/**
 * TODO
 * Génère un objet Playlist avec les informations du formulaire et le sauvegarde dans le LocalStorage
 * @param {HTMLFormElement} form élément <form> à traiter pour obtenir les données
 * @param {StorageManager} storageManager permet la sauvegarde dans LocalStorage
 */
async function createPlaylist (form, storageManager) {
  // TODO : récupérer les informations du formulaire
  const elements = form.elements;
  
  // TODO : créer un nouveau objet playlist et le sauvegarder dans LocalStorage 
  const chosenName = elements[1].value;
  const chosenDescription = elements[2].value;
  const chosenPhoto = await getImageInput(elements.image);
  let onlyTheSongs = extractSongsFromForm(elements);
  const chosenSongs = addAllChosenSongs(onlyTheSongs);
  
  let newPlaylist = { 
    id: generateRandomID(10),
    name: chosenName,
    description: chosenDescription,
    thumbnail: chosenPhoto,
    songs: chosenSongs
  };
  storageManager.addItem("playlist", newPlaylist);

}

/**
 * Fonction qui permet d'extraire une image à partir d'un file input
 * @param {HTMLInputElement} input champ de saisie pour l'image
 * @returns image récupérée de la saisie
 */
async function getImageInput (input) {
  if (input && input.files && input.files[0]) {
    const image = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(reader.result);
      reader.readAsDataURL(input.files[0]);
    });
    return image;
  }
}

window.onload = () => {
  // TODO : récupérer les éléments du DOM
  const imageInput = document.getElementById("image");
  const form = document.getElementById("playlist-form");
  const dataListFromForm = document.getElementById("song-dataList");
  const plusButton = document.getElementById("add-song-btn");

  const storageManager = new StorageManager();
  storageManager.loadAllData();
  const songs = storageManager.getData(storageManager.STORAGE_KEY_SONGS);

  // TODO : construire l'objet dataList
  buildDataList(dataListFromForm, songs);
  
  imageInput.addEventListener("change", updateImageDisplay);
  
  plusButton.addEventListener("click", (plusButton) => {
    addItemSelect(plusButton);
  });
  
  // TODO : gérer l'événement "submit" du formulaire
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    createPlaylist(form, storageManager);
    redirectToPage("./index.html"); 
  });

};
