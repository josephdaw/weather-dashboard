
const fetchButton = $('#fetch-button');
const forecastContainerEl = $('#forecast-container');
const longRngForecastContainerEl = $('#long-range-forecast-container');

// variables for user selection of units and city selection
let unitChoice, cityName;

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
  console.log('getAPI start')
  const apiKey = "a1c1d7b47658fe7dae2174e70fccbcd7";
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${unitChoice}&appid=${apiKey}`;

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      // variables for items
      const roundTemp = Math.round(data.main.temp);
      const roundHumidity = Math.round(data.main.humidity);
      const roundWindSpeed = Math.round(data.wind.speed);
      const roundUV = Math.round(data.main.temp);

      let temperatureUnit;
      let windSpeedUnit;

      // set unit values
      if (unitChoice == "metric") {
        temperatureUnit = units.temperature.metric;
        windSpeedUnit = units.windSpeed.metric;
      };
      if (unitChoice == "standard") {
        temperatureUnit = units.temperature.standard;
        windSpeedUnit = units.windSpeed.standard;
      };
      if (unitChoice == "imperial") {
        temperatureUnit = units.temperature.imperial;
        windSpeedUnit = units.windSpeed.imperial;
      };

      $('#location-name').text(data.name);
      $('#temp-now').text(`Temperature: ${roundTemp}\xB0${temperatureUnit}`);
      $('#humidity-now').text(`Humidity: ${roundHumidity}%`);
      $('#wind-now').text(`Wind: ${data.wind.deg}\xB0T at ${roundWindSpeed} ${windSpeedUnit}`);
      $('#uv-now').text(`UV Index: ${roundUV} NEED TO FIX`);

      displayForecastEl()
    });
};

function get5Day() {
  console.log('get5Day start')
  const apiKey = "a1c1d7b47658fe7dae2174e70fccbcd7";
  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${unitChoice}&appid=${apiKey}`;

  clearForecastTiles()

  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      // console.log(data.list)

      for (i = 0; i < 5; i++) {
        console.log(data.list[i])
        // const data = data.list[i];
        const roundTemp = Math.round(data.list[i].main.temp);
        const roundHumidity = Math.round(data.list[i].main.humidity);
        const roundWindSpeed = Math.round(data.list[i].wind.speed);

        let temperatureUnit;
        let windSpeedUnit;

        // set unit values
        if (unitChoice == "metric") {
          temperatureUnit = units.temperature.metric;
          windSpeedUnit = units.windSpeed.metric;
        };
        if (unitChoice == "standard") {
          temperatureUnit = units.temperature.standard;
          windSpeedUnit = units.windSpeed.standard;
        };
        if (unitChoice == "imperial") {
          temperatureUnit = units.temperature.imperial;
          windSpeedUnit = units.windSpeed.imperial;
        };
        
        // create parent elements
        const tileEL = $('<div class="tile is-parent">');
        const articleEL = $('<article class="tile is-child box">');
        const headingEl = $('<h2 class="subtitle">');
        const unorderListEl = $('<ul>');

        // create list elements
        const tempEl = $('<li>').text(`Temperature: ${roundTemp}\xB0${temperatureUnit}`);
        const humidityEl = $('<li>').text(`Humidity: ${roundHumidity}%`);
        const windEl = $('<li>').text(`Wind: ${data.list[i].wind.deg}\xB0T at ${roundWindSpeed} ${windSpeedUnit}`);
        
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
$(".unit").change(getWeather);


// function linking all other functions together
function getWeather() {
  cityName = $("#city-input").val()
  console.log(cityName)
  unitChoice = $(".unit:checked").val();
  console.log(unitChoice);
  getAPI();
  get5Day();
};