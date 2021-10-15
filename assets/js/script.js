// element variables
const fetchButton = $('#fetch-button');
const forecastContainerEl = $('#forecast-container');
const longRngForecastContainerEl = $('#long-range-forecast-container');
const locationInput = $("#city-input");
const unitChecked = $(".unit:checked");

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

// variable to store search history
let searchHistory = [];


// function to get information from the API
function getCurrentWeather(location, unitChoice) {
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unitChoice}&appid=${apiKey}`;

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      // call function to prepare weather data
      const weather = prepareWeather(data)

      // call function to get user selected units
      const selectedUnit = setUnits(unitChoice);

      $('#location-name').text(data.name);
      $('#temp-now').text(`Temperature: ${weather.temp}\xB0${selectedUnit.temperatureUnit}`);
      $('#humidity-now').text(`Humidity: ${weather.humidity}%`);
      $('#wind-now').text(`Wind: ${data.wind.deg}\xB0T at ${weather.windSpeed} ${selectedUnit.windSpeedUnit}`);
      // $('#uv-now').text(`UV Index: ${roundUV} NEED TO FIX`);

      displayForecastEl()

    });
};

function get5DayForecast(location, unitChoice) {
  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=${unitChoice}&appid=${apiKey}`;

  clearForecastTiles()

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      // loop through weather forecast array
      for (i = 0; i < 5; i++) {
        const wxData = data.list[i];
        console.log(wxData)

        // call function to prepare weather data
        const weather = prepareWeather(wxData)

        // call function to get user selected units
        const selectedUnit = setUnits(unitChoice);

        const day = moment.unix(wxData.dt).format('MMMM Do YYYY, H:mm')
        //const day = 

        // create parent elements
        const tileEL = $('<div class="tile is-parent">');
        const articleEL = $('<article class="tile is-child box">');
        const headingEl = $('<h2 class="subtitle">');
        const unorderListEl = $('<ul>');

        // display date as heading
        headingEl.text(day)

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
        longRngForecastContainerEl.append(tileEL);

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
function setUnits(unitChoice) {
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

// function to title case - Ben Blank & RBizzle- https://stackoverflow.com/questions/5086390/jquery-title-case
function toTitleCase(string) {
  var lowerCaseString = string.toLowerCase();
  return lowerCaseString.replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
};




// function to store search history in local storage
function storeSearchHistory() {
  //check for a value in the input field
  if (locationInput.val()) {
    // convert user input to title case
    let location = toTitleCase(locationInput.val());
    // store location in local storage
    searchHistory.push(location);
    // store the score history in local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  };
};

// function to render the stored searc history to the page
function renderSearchHistory() {
  clearRenderedSearchHistory()
  for (i = 0; i < searchHistory.length; i++) {
    // create button with a data-attr = location name
    const button = $('<button class="button">Button</button>');
    button.text(searchHistory[i]);
    button.attr('data-location', searchHistory[i]);

    // append button to page
    $('#weather-section').append(button)

    // use data-attr of button to call API
    button.on('click', function () {
      locationInput.val("")
      getWeather(button.attr('data-location'), unitChecked.val())
    });

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

// function to remove previous search history results from page
function clearRenderedSearchHistory() {
  $('#weather-section').empty()
};

// event lister for 'search button' click
fetchButton.on('click', function () { getWeather(locationInput.val(), unitChecked.val()) });



// listen for change of 'unit' radio buttons
$(".unit").change(function () {
  // check that there is a information in location text field
  if (locationInput.val()) {
    getWeather(locationInput.val(), unitChecked.val())
  };
}
);


// function linking all other functions together
function getWeather(location, unitChoice) {

  storeSearchHistory()
  renderSearchHistory()

  getCurrentWeather(location, unitChoice);
  get5DayForecast(location, unitChoice);

};

// initialise function
function init() {
  // get any stored scores
  var storedSearchHistory = JSON.parse(localStorage.getItem("searchHistory"));

  // if there are stored values, save them to the variable
  if (storedSearchHistory !== null) {
    searchHistory = storedSearchHistory
  };

  renderSearchHistory();
};

init();