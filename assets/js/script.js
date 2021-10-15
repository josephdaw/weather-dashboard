// element variables
const fetchButton = $('#fetch-button');
const forecastContainerEl = $('#forecast-container');
const longRngForecastContainerEl = $('#long-range-forecast-container');

// variables for user selection of units and city selection
let unitChoice, cityName;

// apiKey 
const apiKey = "a1c1d7b47658fe7dae2174e70fccbcd7";

// object list with unit types based on user selection
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

// function to get information from the API
function getAPI() {
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unitChoice}&appid=${apiKey}`;

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      // call function to prepare weather data
      const weather = prepareWeather(data)

      // call function to get user selected units
      const selectedUnit = setUnits();

      $('#location-name').text(data.name);
      $('#temp-now').text(`Temperature: ${weather.temp}\xB0${selectedUnit.temperatureUnit}`);
      $('#humidity-now').text(`Humidity: ${weather.humidity}%`);
      $('#wind-now').text(`Wind: ${data.wind.deg}\xB0T at ${weather.windSpeed} ${selectedUnit.windSpeedUnit}`);
      // $('#uv-now').text(`UV Index: ${roundUV} NEED TO FIX`);

      displayForecastEl()

    });
};

function get5Day() {
  // console.log('get5Day start')
  const apiKey = "a1c1d7b47658fe7dae2174e70fccbcd7";
  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${unitChoice}&appid=${apiKey}`;

  clearForecastTiles()

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      // loop through weather forecast array
      for (i = 0; i < 5; i++) {
        const wxData = data.list[i];

        // call function to prepare weather data
        const weather = prepareWeather(wxData)

        // call function to get user selected units
        const selectedUnit = setUnits();

        // create parent elements
        const tileEL = $('<div class="tile is-parent">');
        const articleEL = $('<article class="tile is-child box">');
        const headingEl = $('<h2 class="subtitle">');
        const unorderListEl = $('<ul>');

        // create list elements
        const tempEl = $('<li>').text(`Temperature: ${weather.temp}\xB0${selectedUnit.temperatureUnit}`);
        const humidityEl = $('<li>').text(`Humidity: ${weather.humidity}%`);
        const windEl = $('<li>').text(`Wind: ${data.list[i].wind.deg}\xB0T at ${weather.windSpeed} ${selectedUnit.windSpeedUnit}`);

        // append list items
        unorderListEl.append(tempEl);
        unorderListEl.append(humidityEl);
        unorderListEl.append(windEl);

        // add elements to the page
        articleEL.append(headingEl);
        articleEL.append(unorderListEl)
        tileEL.append(articleEL);
        $("#long-range-forecast-container").append(tileEL);

      }; //END - for loop
    });
}; //END - get5Day()


// create a function to return an object of weather based on user units
function prepareWeather(data) {
  // define weather object
  const weather = {
    temp: Math.round(data.main.temp),
    humidity: Math.round(data.main.humidity),
    windSpeed: Math.round(data.wind.speed),
  };

  return weather;

};

// function to return the required units based on users selection
function setUnits() {
  // set unit values
  if (unitChoice == "metric") {
    return {
      temperatureUnit: units.temperature.metric,
      windSpeedUnit: units.windSpeed.metric
    }

  };
  if (unitChoice == "standard") {
    return {
      temperatureUnit: units.temperature.standard,
      windSpeedUnit: units.windSpeed.standard
    }
  };
  if (unitChoice == "imperial") {
    return {
      temperatureUnit: units.temperature.imperial,
      windSpeedUnit: units.windSpeed.imperial
    }
  };

};

// function to unhide forecast container elements
function displayForecastEl() {
  forecastContainerEl.removeClass('is-hidden');
  longRngForecastContainerEl.removeClass('is-hidden');
};

// function to remove previous long range forecasts
function clearForecastTiles() {
  longRngForecastContainerEl.empty()
};

// event lister for 'search button' click
fetchButton.on('click', getWeather);


// listen for change of 'unit' radio buttons
$(".unit").change(function () {
  if ($("#city-input").val()) { getWeather() };
}
);


// function linking all other functions together
function getWeather() {
  cityName = $("#city-input").val()
  console.log(cityName)
  unitChoice = $(".unit:checked").val();
  console.log(unitChoice);
  getAPI();
  get5Day();
};