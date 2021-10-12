
const fetchButton = document.getElementById('fetch-button');
const forecastContainerEl = $('#forecast-container');

function getAPI() {
    const apiKey = "a1c1d7b47658fe7dae2174e70fccbcd7";
    const cityName = "Adelaide";
    const units = "metric";

    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${units}&appid=${apiKey}`;

    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
        console.log('temp ' + data.main.temp)
        console.log('humidity ' + data.main.humidity)
        console.log('wind speed ' + data.wind.speed)
        console.log('UV index ' + data.main.humidity)
        displayForecastEl()
      });

      

};

function displayForecastEl(){
  $('#forecast-container').removeClass('is-hidden');
  $('#long-range-forecast-container').removeClass('is-hidden');
};

fetchButton.addEventListener('click', getAPI);