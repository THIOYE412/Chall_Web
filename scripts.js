/* Cette fonction permettre d'envoyer une requête(de recuperation de donnée sur le lien flickr), si les données
sont recuperer avec succès alors nous modifions le format de cette donnée en JSON (en utilisant la méthode .json())
puis envoyons cette donnée(en format JSON bien-sûr) à la fonction afficherImages qui se chargera d'afficher ces données.
Par contre si la recuperation de donnée echoue nous afficherons une erreur de recuperation sur la page web.
*/

function R_images(){
  const element = document.getElementById('search').value;
  const cle = 'f7ebe7ad9e559666a1209b893f22e98d';
  const lien = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${cle}&text=${element}&format=json&nojsoncallback=1`;

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

/*Cette fonction permet principalement de récuperer l'ID de la balise <div>
 */
function afficherImages(photos){
  const affichage = document.getElementById('affichageImages');
  affichage.innerHTML = '';

  photos.forEach(image => {
    const lienImage = `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`;

    const creationImages = document.createElement('img');
    creationImages.src = lienImage;
    creationImages.alt = image.title;

    creationImages.className = 'imageCadre';
    creationImages.addEventListener('click', function() {
      ImageSelectionne(lienImage);
    });


    affichage.appendChild(creationImages);
  })
  // Cette nouvelle fonction affiche l'image sélectionnée dans le deuxième cadre
function ImageSelectionne(lienImage) {
  const cadreDeLimage = document.getElementById('cadreSelectionne');
  cadreDeLimage.innerHTML = '';

  const imageSelectionne = document.createElement('img');
  imageSelectionne.src = lienImage;
  imageSelectionne.className = 'imageCadre';

  cadreDeLimage.appendChild(imageSelectionne);
  }
}