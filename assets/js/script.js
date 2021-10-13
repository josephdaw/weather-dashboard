
const fetchButton = $('#fetch-button');
const forecastContainerEl = $('#forecast-container');
const longRngForecastContainerEl = $('#long-range-forecast-container');

const units = 
  {
    temperature: 
      {
        metric: "C",
        imperial: "F",
        standard: "K"
    },
    windSpeed: 
      {
        metric: "m/s",
        imperial: "mi/h",
        standard: "m/s"
    },
  };


function getAPI() {
  const apiKey = "a1c1d7b47658fe7dae2174e70fccbcd7";
  const cityName = "Adelaide";
  let unitChoice = "standard";

  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unitChoice}&appid=${apiKey}`;

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // variables for items
      const roundTemp = Math.round(data.main.temp);
      const roundHumidity = Math.round(data.main.humidity);
      const roundWindSpeed = Math.round(data.wind.speed);
      const roundUV = Math.round(data.main.temp);
      
      let temperatureUnit;
      let windSpeedUnit;

      if (unitChoice == "metric"){
        temperatureUnit = units.temperature.metric;
        windSpeedUnit = units.windSpeed.metric;
      };
      if (unitChoice == "standard"){
        temperatureUnit = units.temperature.standard;
        windSpeedUnit = units.windSpeed.standard;
      };
      if (unitChoice == "imperial"){
        temperatureUnit = units.temperature.imperial;
       windSpeedUnit = units.windSpeed.imperial;
      };

      $('#temp-now').text(`Temperature: ${roundTemp}\xB0${temperatureUnit}`);
      $('#humidity-now').text(`Humidity: ${roundHumidity}%`);
      $('#wind-now').text(`Wind: ${data.wind.deg}\xB0T at ${roundWindSpeed} ${windSpeedUnit}`);
      $('#uv-now').text(`UV Index: ${roundUV} NEED TO FIX`);

      console.log(data)
      console.log('temp ' + data.main.temp)
      console.log('humidity ' + data.main.humidity)
      console.log('wind speed ' + data.wind.speed)
      console.log('UV index ' + data.main.humidity)

      displayForecastEl()
    });



};

// function to unhide forecast container elements
function displayForecastEl() {
  forecastContainerEl.removeClass('is-hidden');
  longRngForecastContainerEl.removeClass('is-hidden');
};

// event lister for 'search button' click
fetchButton.on('click', getAPI);