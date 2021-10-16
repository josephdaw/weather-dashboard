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

// variables for user selection of units and city selection
let unitChoice, cityName;

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

      // get UV index
      currentUV(lat, long)

      // call function to prepare weather data
      const weather = prepareWeather(data)

      // call function to get user selected units
      const selectedUnit = setUnits(unitChoice);

      // get current time
      const day = moment.unix(data.dt).format('MMMM Do YYYY, H:mm')

      $('#location-name').text(data.name);
      $('#date-now').text(day);
      $('#description-now').text(toTitleCase(weather.description));
      $('#icon-now').attr('src', `http://openweathermap.org/img/wn/${weather.icon}@2x.png`)
      $('#temp-now').text(`Temperature: ${weather.temp}\xB0${selectedUnit.temperatureUnit}`);
      $('#humidity-now').text(`Humidity: ${weather.humidity}%`);
      $('#wind-now').text(`Wind: ${data.wind.deg}\xB0T at ${weather.windSpeed} ${selectedUnit.windSpeedUnit}`);

    })

  displayForecastEl()
};

function get5DayForecast(location, unitChoice) {
  const apiKey = "a1c1d7b47658fe7dae2174e70fccbcd7";
  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=${unitChoice}&appid=${apiKey}`;

  clearForecastTiles()

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      // loop through weather forecast array
      for (i = 7; i < data.list.length; i += 8) {
        const wxData = data.list[i];
        console.log(wxData)

        // call function to prepare weather data
        const weather = prepareWeather(wxData)
        // call function to get user selected units
        const selectedUnit = setUnits(unitChoice);
        // format the date
        const day = moment.unix(wxData.dt).format('MMMM Do YYYY, H:mm')

        // create parent elements
        const tileEL = $('<div class="tile is-parent">');
        const articleEL = $('<article class="tile is-child box">');
        const headingEl = $('<h2 class="subtitle">');
        const descriptionEl = $('<p class="subtitle">')
        const iconEl = $('<img src="" alt="">')
        const unorderListEl = $('<ul>');

        // display date, description, and icon
        headingEl.text(day)
        descriptionEl.text(toTitleCase(weather.description));
        iconEl.attr('src', `http://openweathermap.org/img/wn/${weather.icon}@2x.png`)

        // create list elements
        const tempEl = $('<li>').text(`Temperature: ${weather.temp}\xB0${selectedUnit.temperatureUnit}`);
        const humidityEl = $('<li>').text(`Humidity: ${weather.humidity}%`);
        const windEl = $('<li>').text(`Wind: ${data.list[i].wind.deg}\xB0T at ${weather.windSpeed} ${selectedUnit.windSpeedUnit}`);

        // append list items
        unorderListEl.append(tempEl);
        unorderListEl.append(humidityEl);
        unorderListEl.append(windEl);

        // add elements to the page
        articleEL.append(headingEl, descriptionEl, iconEl);
        articleEL.append(unorderListEl)
        tileEL.append(articleEL);
        longRngForecastContainerEl.append(tileEL);

      }; //END - for loop
    });
}; //END - get5Day()

// function for UV index API
function currentUV(lat, long) {
  const exclude = "minutely,hourly,daily,alerts"
  const queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=${exclude}&appid=${apiKey}`

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      const uvIndex = data.current.uvi;

      uvIndexColour(uvIndex)

      $('#uv-now').text(`${uvIndex}`);
    })
};




// create a function to return an object of weather based on user units
function prepareWeather(data) {
  // define weather object
  const weather = {
    temp: Math.round(data.main.temp),
    humidity: Math.round(data.main.humidity),
    windSpeed: Math.round(data.wind.speed),
    description: data.weather[0].description,
    icon: data.weather[0].icon
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

// function to display 
function uvIndexColour(uvIndex) {
  const uvSpan = $('#uv-now');
  uvSpan.removeClass();

  if (uvIndex <= 2) { uvSpan.addClass('low') };
  if (uvIndex > 2) { uvSpan.addClass('moderate') };
  if (uvIndex > 5) { uvSpan.addClass('high') };
  if (uvIndex > 7) { uvSpan.addClass('very-high') };
  if (uvIndex > 10) { uvSpan.addClass('extreme') };
};


// function to store search history in local storage
function storeSearchHistory() {
  // check for a value in the input field
  if ($("#city-input").val()) {
    // convert user input to title case
    let location = toTitleCase($("#city-input").val());
    // check the location doens't already exist in history
    if (searchHistory.indexOf(location) === -1) {
      // store location in local storage
      searchHistory.push(location);
      // store the score history in local storage
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    };
  };
};

// function to render the stored searc history to the page
function renderSearchHistory() {
  clearRenderedSearchHistory()
  for (i = 0; i < searchHistory.length; i++) {
    const button = $('<button class="button">Button</button>');
    button.text(searchHistory[i]);
    button.attr('data-location', searchHistory[i]);

    $('#weather-section').append(button)

    button.on('click', function () {
      $("#city-input").val("")
      getWeather(button.attr('data-location'), $(".unit:checked").val())
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
});

// function linking all other functions together
function getWeather(location, unitChoice) {
  // get user input for location and unit
  cityName = $("#city-input").val()
  unitChoice = $(".unit:checked").val();

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