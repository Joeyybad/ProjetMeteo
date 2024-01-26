function updateBodyBackground(temperature) {
    var body = document.body;

    if (temperature >= -50 && temperature < 0) {
        body.style.background = "url('https://papers.co/wallpaper/papers.co-oa50-snow-sky-winter-cold-sun-nature-35-3840x2160-4k-wallpaper.jpg')";
    } else if (temperature >= 0 && temperature < 12) {
        body.style.background = "url('https://www.shutterstock.com/image-photo/aerial-view-on-frozen-seawater-600nw-1924605944.jpg')";
    } else if (temperature >= 12 && temperature < 25) {
        body.style.background = "url('https://t4.ftcdn.net/jpg/03/68/60/21/360_F_368602106_QgaRuFg7Fxa6W0bu5ZWcokXXinxPIxJY.jpg')";
    } else if (temperature >= 25 && temperature <= 50) {
        body.style.background = "url('https://pics.freeartbackgrounds.com/fullhd/Sunset_Sky_Background-364.jpg')";
    }

    // Additional styling
    body.style.backgroundRepeat = "no-repeat";
    body.style.backgroundPosition = "inherit";
    body.style.backgroundSize = "cover";
}
        // Fonction pour effectuer la requête HTTP et traiter la réponse
        function fetchData(city) {

            var apiKey = "1708858d94e946a2b6393534241901";
            var apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;



            // Effectuer la requête avec fetch
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    // Extraire et afficher les données météorologiques
                    var city = data.location.name;
                    var temperature = data.current.temp_c;
                    var cloud = data.current.cloud;
                    var speed = data.current.wind_kph;
                    var direction = data.current.wind_degree;
                    var orientation = data.current.wind_dir;
                    var uv = data.current.uv;
                    var pression = data.current.pressure_mb;

                    document.getElementById("city").textContent = city;
                    document.getElementById("temperature").textContent = temperature + " °C";
                    document.getElementById("cloud").textContent = cloud;
                    document.getElementById("speed").textContent = speed + " Km/h";
                    document.getElementById("direction").textContent = direction + "°";
                    document.getElementById("orientation").textContent = orientation;
                    document.getElementById("UV").textContent = uv;
                    document.getElementById("pression").textContent = pression + "hPa";


                    // Ajouter la récupération de l'heure actuelle
                    var localTime = new Date(data.location.localtime);
            var options = { hour12: false, hour: 'numeric', minute: 'numeric' };
            var formattedTime = localTime.toLocaleTimeString(undefined, options);

            // Mettre à jour l'élément HTML avec l'heure
            document.getElementById("heure").textContent = formattedTime;




                    // Vérifier s'il y a des alertes météo
                    var alerts = data.alerts;
                    if (alerts && alerts.length > 0) {
                        // Mettre à jour le contenu de la classe "paragraphe-intemperies" avec les alertes
                        var alertText = "";
                        alerts.forEach(alert => {
                            alertText += `${alert.event}: ${alert.description}\n`;
                        });
                        document.querySelector("#weatherAlert .paragraphe-intemperies").textContent = alertText;
                    } else {
                        // Aucune alerte météo
                        document.querySelector("#weatherAlert .paragraphe-intemperies").textContent = "Aucune alerte météo.";
                    }

                    // Modifier la fonction fetchData pour appeler fetchWeatherAlerts et mettre à jour les alertes météo
                    function fetchData(city) {
                        // ...

                        // Appeler fetchWeatherAlerts avec le nom de la ville
                        fetchWeatherAlerts(city);

                        // ...
                    }


                    // Changer l'image en fonction du niveau de nuage
                    var weatherIcon = document.getElementById("weatherIcon");

                    switch (true) {
                        case (cloud >= 0 && cloud <= 25):
                            weatherIcon.src = "./images/2698240sun.png";
                            break;
                        case (cloud > 25 && cloud <= 50):
                            weatherIcon.src = "./images/2698240.png";
                            break;
                        case (cloud > 50 && cloud <= 100):
                            weatherIcon.src = "./images/cloud-removebg-preview.png";
                            break;
                        default:
                            weatherIcon.src = "./images/2698240sun.png";
                            break;
                    }


                    updateBodyBackground(temperature)

                    // Call function to get future weather data
                    getFutureWeather(city);

                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des données:', error);
                });
        }


        // Fonction pour obtenir la localisation par défaut
        function getDefaultLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    fetchData(position.coords.latitude + ',' + position.coords.longitude);
                });
            } else {
                fetchData('Le_mans');  // You can change this to any default city
            }
        }

        // Fonction pour obtenir les données météorologiques futures
        function getFutureWeather(city) {
            var apiKey = "1708858d94e946a2b6393534241901";
            var currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set hours to midnight to get accurate results
            var date = currentDate.toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

            var futureApiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;

            fetch(futureApiUrl)
                .then(response => response.json())
                .then(data => {
                    var forecastDays = data.forecast.forecastday;

                    // Loop through the next 5 days and update HTML with max and min temperatures and progress bar class
                    for (let i = 0; i < 5; i++) {
                        var forecast = forecastDays[i].day;
                        var minTempId = `temp${i * 2 + 1}`;
                        var maxTempId = `temp${i * 2 + 2}`;
                        var progressBarId = `progressbar${i + 1}`;

                        // Update HTML with max and min temperatures for each day
                        document.getElementById(minTempId).innerText = `${forecast.mintemp_c}°C`;
                        document.getElementById(maxTempId).innerText = `${forecast.maxtemp_c}°C`;

                        // Determine the class for the progress bar based on the min temperature
                        var progressBarClass = "progressbar";

                        if (forecast.mintemp_c >= -100 && forecast.mintemp_c < 0) {
                            progressBarClass += " progressbar1";
                        } else if (forecast.mintemp_c >= 0 && forecast.mintemp_c < 2) {
                            progressBarClass += " progressbar2";
                        } else if (forecast.mintemp_c >= 2 && forecast.mintemp_c < 4) {
                            progressBarClass += " progressbar3";
                        } else if (forecast.mintemp_c >= 4 && forecast.mintemp_c < 7) {
                            progressBarClass += " progressbar4";
                        } else if (forecast.mintemp_c >= 7 && forecast.mintemp_c < 12) {
                            progressBarClass += " progressbar5";
                        } else if (forecast.mintemp_c >= 12 && forecast.mintemp_c < 20) {
                            progressBarClass += " progressbar6";
                        } else if (forecast.mintemp_c >= 20 && forecast.mintemp_c < 27) {
                            progressBarClass += " progressbar7";
                        } else if (forecast.mintemp_c >= 27 && forecast.mintemp_c < 50) {
                            progressBarClass += " progressbar8";
                        }


                        // Update the class of the progress bar
                        document.getElementById(progressBarId).className = progressBarClass;
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des données futures:', error);
                });
        }


        // Gestionnaire d'événements pour la soumission du formulaire
        document.getElementById('searchForm').addEventListener('submit', function (event) {
            // Empêcher le formulaire de se soumettre normalement
            event.preventDefault();

            // Récupérer la valeur de la ville à partir de l'input
            var cityInput = document.getElementById('cityInput');
            var city = cityInput.value;

            // Appeler fetchData avec le nom de la ville
            fetchData(city);
        });


        // Fonction pour obtenir la localisation par défaut
        function getDefaultLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    // Appeler fetchData avec les coordonnées de la localisation par défaut
                    fetchData(position.coords.latitude + ',' + position.coords.longitude);
                });
            } else {
                // Si la géolocalisation n'est pas prise en charge, appeler fetchData avec une ville par défaut (paris)
                fetchData('Le_mans');
            }
        }


        // Appeler la fonction au chargement de la page pour obtenir la localisation par défaut
        window.onload = getDefaultLocation;