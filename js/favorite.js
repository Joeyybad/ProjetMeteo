function fetchData(city) {
    var apiKey = "1708858d94e946a2b6393534241901";
    var apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    // Effectuer la requête avec fetch
    return fetch(apiUrl)
        .then(response => response.json());
}
// Fonction pour ajouter une ville aux favoris
function addToFavorites(city) {
    // Vous pouvez personnaliser la logique pour stocker les villes en favoris
    console.log(`${city} a été ajouté aux favoris !`);
}
// Fonction pour traiter l'icône météo
function updateWeatherIcon(iconElement, cloud) {
    switch (true) {
        case (cloud >= 0 && cloud <= 25):
            iconElement.src = "./images/2698240sun.png";
            break;
        case (cloud > 25 && cloud <= 50):
            iconElement.src = "./images/2698240.png";
            break;
        case (cloud > 50 && cloud <= 100):
            iconElement.src = "./images/cloud-removebg-preview.png";
            break;
        // Add more cases as needed
        default:
            // Default image if none of the cases match
            iconElement.src = "./images/2698240sun.png";
            break;
    }
}
// Fonction pour effectuer une recherche et ajouter aux favoris
function searchAndAddToFavorites() {
    var cityInput = document.getElementById('cityInput');
    var city = cityInput.value;
    // Vérifier si le nom de la ville est valide (vous pouvez utiliser une liste ou une API de géocodage pour valider)
    if (isValidCity(city)) {
        // Appeler fetchData avec le nom de la ville
        fetchData(city)
            .then(data => {
                var temperature = data.current.temp_c;
                var cloud = data.current.cloud;
                var cityName = data.location.name;
                document.getElementById("city").textContent = cityName;
                document.getElementById("temperature").textContent = temperature + " °C";
                // Mettre à jour l'icône dans le bandeau météo
                var weatherIcon = document.getElementById("weatherIcon");
                updateWeatherIcon(weatherIcon, cloud);
                // Créer un nouveau bloc de ville favorite
                var favoriteCityContainer = document.createElement("div");
                favoriteCityContainer.className = "ville";
                favoriteCityContainer.innerHTML = `
                    <div class="temperature3">
                        <p>${temperature} °C</p>
                    </div>
                    <div class="nomVille">
                        <p class="city">${cityName}</p>
                    </div>
                    <div class="logoTemp">
                        <img src="" class="weatherImg" alt="weatherIcon" srcset=""
                            id="weatherIcon${cityName}">
                    </div>
                `;
                // Ajouter le bloc de ville favorite à la liste des favoris
                var mainContainer = document.querySelector('main');
                mainContainer.appendChild(favoriteCityContainer);
                // Appeler la fonction pour mettre à jour l'icône météo de la ville favorite
                var cityWeatherIcon = document.getElementById(`weatherIcon${cityName}`);
                updateWeatherIcon(cityWeatherIcon, cloud);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    } else {
        console.error('Nom de ville invalide.');
    }
}
// Fonction pour vérifier si le nom de la ville est valide (vous pouvez personnaliser cette fonction)
function isValidCity(city) {
    // Exemple basique de validation
    // Vous pouvez utiliser une liste de villes connues ou une API de géocodage pour une validation plus précise
    return /^[a-zA-Z\s]*$/.test(city);
}
// Gestionnaire d'événements pour la touche "Entrée"
document.getElementById('cityInput').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        // Appeler la fonction pour effectuer la recherche sans ajouter aux favoris
        searchCity();
    }
});
// Fonction pour effectuer la recherche sans ajouter aux favoris
function searchCity() {
    var cityInput = document.getElementById('cityInput');
    var city = cityInput.value;
    // Vérifier si le nom de la ville est valide (vous pouvez utiliser une liste ou une API de géocodage pour valider)
    if (isValidCity(city)) {
        // Appeler fetchData avec le nom de la ville
        fetchData(city)
            .then(data => {
                var temperature = data.current.temp_c;
                var cloud = data.current.cloud;
                var cityName = data.location.name;
                document.getElementById("city").textContent = cityName;
                document.getElementById("temperature").textContent = temperature + " °C";
                // Mettre à jour l'icône dans le bandeau météo
                var weatherIcon = document.getElementById("weatherIcon");
                updateWeatherIcon(weatherIcon, cloud);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
    } else {
        console.error('Nom de ville invalide.');
    }
}