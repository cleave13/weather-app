//VARIABLES

//Select all DOM elements and store as variables.
const searchBtnEl = document.getElementById('search');
const cityButtonsEl = document.getElementById('city-buttons');
const currentCityEl = document.getElementById('current-city');
const currentTempEl = document.getElementById('current-temp');
const currentWindEl = document.getElementById('current-wind');
const currentHumEl = document.getElementById('current-hum');
const currentUviEl = document.getElementById('current-uvi');
const cardContainerEl = document.getElementById('card-container');

//declare application variables and default city.
let savedCities = [];
let cityName = 'Denver';

//FUNCTIONS

//Retrieve saved cities from local storage and create a button element for each.
function getSavedCities() {
    const cityList = localStorage.getItem('cities');
    if (cityList) {
        savedCities = JSON.parse(cityList);
        savedCities.forEach(savedCity => {
            const cityButtonEl = document.createElement('button');
            cityButtonEl.setAttribute('class', 'btn');
            cityButtonEl.setAttribute('class', 'btn-secondary');
            cityButtonEl.setAttribute('class', 'btn-block');
            cityButtonEl.setAttribute('data-city', savedCity);
            cityButtonEl.textContent = savedCity;
            cityButtonsEl.appendChild(cityButtonEl);
        });
    }
    return;
}

//Adds a city to the saved city list as long as it hasn't been previously searched.
function addCity(city) {
    if (JSON.stringify(savedCities).includes(city)) {
        return;
    }

    const cityButtonEl = document.createElement('button');
    savedCities.push(city);
    cityButtonEl.setAttribute('class', 'btn');
    cityButtonEl.setAttribute('class', 'btn-secondary');
    cityButtonEl.setAttribute('class', 'btn-block');
    cityButtonEl.setAttribute('data-city', city);
    cityButtonEl.textContent = city;
    cityButtonsEl.appendChild(cityButtonEl);
    localStorage.setItem('cities', JSON.stringify(savedCities));
};

//Allows the user to click a button with the city name and populate the weather data for that city.
function setCityNameFromButton(event) {
    const target = event.target;
    cityName = target.getAttribute('data-city');
    getGeolocation(cityName);
}

//Sends callout to the geolocation API passing in the city name. Will alert the user that the selected city was not found if callout results in an error.
function getGeolocation(requestedCity) {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${requestedCity}&limit=1&appid=71efd4d442f298b303ca2c7c46cd4032`

    fetch(geoUrl)
        .then(function (geoResponse) {
            console.log(geoResponse.status)
            if (geoResponse.status !== 200) {
                alert('Something went wrong. Please retry your search.')
            }
            return geoResponse.json();
        })
        .then(function (geoData) {
            if (geoData.length > 0) {
                getWeather(geoData[0].lat, geoData[0].lon)
            } else {
                alert('The city name you entered could not be found. Please try a different name.');
                return;
            }

        });
}

//Retrieves the weather data from the geolocation coordinates.
function getWeather(lat, long) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly,alerts&units=imperial&appid=71efd4d442f298b303ca2c7c46cd4032`

    fetch(weatherUrl)
        .then(function (weatherResponse) {
            console.log(weatherResponse.status)
            if (weatherResponse.status !== 200) {
                alert('We could not connect to the weather provider. Please retry your search later.')
            }
            return weatherResponse.json();
        })
        .then(function (weatherData) {
            if (weatherData) {
                console.log(weatherData)
                displayCurrent(weatherData);
                displayForecast(weatherData);
            } else {
                alert('We could not find weather data for that location. Please try again later.');
                return;
            }

        });
}

// Takes the weather data returned from the API calls and populates the DOM elements for the current day's weather.
function displayCurrent(cityWeather) {
    today = new Date();
    const weatherIcon = document.createElement('img');
    const iconUrl = 'https://openweathermap.org/img/wn/' + cityWeather.current.weather[0].icon + '@2x.png'
    weatherIcon.setAttribute('src', iconUrl);

    currentCityEl.textContent = `${cityName} (${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()})`;
    currentCityEl.appendChild(weatherIcon);

    currentTempEl.textContent = `${cityWeather.current.temp} ℉`;
    currentWindEl.textContent = cityWeather.current.wind_speed;
    currentHumEl.textContent = `${cityWeather.current.humidity}%`;
    currentUviEl.textContent = cityWeather.current.uvi;
}

// Takes the weather data returned from the API calls and populates the DOM elements for the forecast.
function displayForecast(cityForecasts) {
    for (let i = 0; i < cardContainerEl.children.length; i++) {
        day = new Date();
        day.setDate(day.getDate() + i + 1);
        const cardBody = cardContainerEl.children[i].children[0].children[0];
        const forecastIcon = document.createElement('img');
        const forecastIconUrl = 'https://openweathermap.org/img/wn/' + cityForecasts.daily[i].weather[0].icon + '.png';
        console.log(forecastIcon);
        forecastIcon.setAttribute('src', forecastIconUrl);
        const forecastTemp = cityForecasts.daily[i].temp.max;
        const forecastWind = cityForecasts.daily[i].wind_speed;
        const forecastHum = cityForecasts.daily[i].humidity;
        const forecastUvi = cityForecasts.daily[i].uvi;

        cardBody.children[0].textContent = `${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()}`;

        cardBody.children[1].textContent = `Temp: ${forecastTemp} ℉`;
        cardBody.children[1].appendChild(forecastIcon);
        cardBody.children[2].textContent = `Wind: ${forecastWind} MPH`;
        cardBody.children[3].textContent = `Humidity: ${forecastHum}%`;
        cardBody.children[4].textContent = `UVI: ${forecastUvi}`;
        if (forecastUvi < 3) {
            cardBody.children[4].setAttribute('class', 'uvi-low');
        } else if (forecastUvi < 6) {
            cardBody.children[4].setAttribute('class', 'uvi-mod');
        } else if (forecastUvi < 8) {
            cardBody.children[4].setAttribute('class', 'uvi-high');
        } else {
            cardBody.children[4].setAttribute('class', 'uvi-high');
        }
    }

}

//EVENT LISTENERS

//Listens for the search button to be clicked and calls the related functions.
searchBtnEl.addEventListener('click', function () {
    cityName = document.getElementById('search-bar').value;
    addCity(cityName);
    getGeolocation(cityName);
});

//Listens for the city buttons to be clicked, then passes in the city name from the button.
cityButtonsEl.addEventListener('click', setCityNameFromButton);

//LOGIC

//Initializes the application
getSavedCities();
getGeolocation('Denver');