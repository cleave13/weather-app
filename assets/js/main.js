//VARIABLES

const searchBtnEl = document.getElementById('search');
const cityButtons = document.getElementById('city-buttons');
let savedCities = [];

//FUNCTIONS

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
            cityButtons.appendChild(cityButtonEl);
        });
    }
    return;
}

function addCity(city) {

    const cityButtonEl = document.createElement('button');
    
    savedCities.push(city);

    cityButtonEl.setAttribute('class', 'btn');
    cityButtonEl.setAttribute('class', 'btn-secondary');
    cityButtonEl.setAttribute('class', 'btn-block');
    cityButtonEl.setAttribute('data-city', city);
    cityButtonEl.textContent = city;
    cityButtons.appendChild(cityButtonEl);

    localStorage.setItem('cities', JSON.stringify(savedCities));
};

function triggerCallout(requestedCity) {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${requestedCity}&limit=1&appid=71efd4d442f298b303ca2c7c46cd4032`

    console.log(geoUrl);
    fetch(geoUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

function getWeather() {

}

//EVENT LISTENERS

searchBtnEl.addEventListener('click', function () {
    const cityName = document.getElementById('search-bar');
    addCity(cityName.value);
    triggerCallout(cityName.value);
});

//LOGIC

getSavedCities();