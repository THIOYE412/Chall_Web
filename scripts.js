/* Cette fonction permettre d'envoyer une requête(de recuperation de donnée sur le lien flickr), si les données
sont recuperer avec succès alors nous modifions le format de cette donnée en JSON (en utilisant la méthode .json())
puis envoyons cette donnée(en format JSON bien-sûr) à la fonction afficherImages qui se chargera d'afficher ces données.
Par contre si la recuperation de donnée echoue nous afficherons une erreur de recuperation sur la page web.
*/

const cle = 'f7ebe7ad9e559666a1209b893f22e98d';

function R_images(){
  const element = document.getElementById('search').value;
  const lien = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${cle}&text=${element}&format=json&nojsoncallback=1`;

  const messageErreur = document.getElementById('messageErreur');
  messageErreur.textContent = '';

  // Vérifie si l'entrée est vide
  if (!element.trim()) {

    // Affiche un message d'erreur
    const messageErreur = document.getElementById('messageErreur');
    messageErreur.textContent = 'Veuillez entrer un mot clé pour une rechercher';
    return;
  }

  fetch(lien)
    .then(reponse => reponse.json())
    .then(donnee => {
      afficherImages(donnee.photos.photo);
    })
    .catch(erreur => console.error('Erreur lors de la recuperation d\'image !', erreur));
}

var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


/* Cette fonction affiche les photos sur la page web, determine les informations géographique des images et renvoie ces informations
 à la fonction Imageselectionne() qui se chargera de rendre cliquable les images pour les afficher dans le 2ème cadre */
 
function afficherImages(photos){
  const affichage = document.getElementById('affichageImages');
  affichage.textContent = '';

  photos.forEach(image => {
    //console.log('Structure de l\'objet image :', image);

    const lienImage = `https://live.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`;
    const geoInfoURL = `https://api.flickr.com/services/rest/?method=flickr.photos.geo.getLocation&api_key=${cle}&photo_id=${image.id}&format=json&nojsoncallback=1`;

    let latitude, longitude;

    fetch(geoInfoURL)
    .then(response => response.json())
    .then(geoInfo => {
    if (geoInfo.photo && geoInfo.photo.location) {
      latitude = geoInfo.photo.location.latitude;
      longitude = geoInfo.photo.location.longitude;

      console.log("InfoGeo: ", latitude, longitude);
    } else {
      console.warn('Les informations géographiques ne sont pas disponibles pour cette photo.');
    }
    })
    .catch(error => console.error('Erreur lors de la récupération des informations géographiques !', error));

    const creationImages = document.createElement('img');
    creationImages.src = lienImage;
    creationImages.alt = image.title;

    creationImages.className = 'imageCadre';
    creationImages.addEventListener('click', function() {
      ImageSelectionne(lienImage, latitude, longitude);
    });

    affichage.appendChild(creationImages);

  })

  /* Cette nouvelle fonction affiche l'image sélectionnée dans le deuxième cadre et créer un marqueur sur la carte si les informations
  geographique de l'image sont disponibles puis lui ajoute un popup juste au-dessus du marqueur */

  function ImageSelectionne(lienImage, latitude, longitude) {
    const cadreDeLimage = document.getElementById('cadreSelectionne');
    cadreDeLimage.textContent = '';

    const imageSelectionne = document.createElement('img');
    imageSelectionne.src = lienImage;
    imageSelectionne.className = 'imageCadre';

    // Affiche l'image et ajuste la hauteur du cadre
    imageSelectionne.style.display = 'block';
    cadreDeLimage.style.height = '450px'; /* Hauteur après sélection */ 

    cadreDeLimage.appendChild(imageSelectionne);

    // Crée le marqueur une fois que les coordonnées sont définies, puis ajoute un popup contenant l'image et les coordonnées au-dessus du marqueur
    if (latitude !== undefined && longitude !== undefined) {
      var marker = L.marker([latitude, longitude]).addTo(map);

      marker.bindPopup(`<img src="${lienImage}" alt="Image sélectionnée" style="max-width: 100px; max-height: 100px;"><br>Latitude: ${latitude}<br>Longitude: ${longitude}`).openPopup();    }

  }
}
