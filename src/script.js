//TODO: update the page with the current data
function refreshWeather(data) {
  console.log(data);
  let cityElement = document.querySelector("#city");
  let city = data.location.name;

  let timeElement = document.querySelector("#time");
  let date = new Date(data.location.localtime_epoch * 1000);

  let descriptionElement = document.querySelector("#description");
  let description = data.current.condition.text;

  let humidityElement = document.querySelector("#humidity");
  let humidity = `${data.current.humidity}%`;

  let windElement = document.querySelector("#wind-speed");
  let windSpeed = `${data.current.wind_kph} km/h`;

  let temperatureElement = document.querySelector("#temperature");
  let temperature = data.current.temp_c;

  let iconElement = document.querySelector("#icon");

  cityElement.innerHTML = city;
  timeElement.innerHTML = formatDate(date);
  descriptionElement.innerHTML = description;
  humidityElement.innerHTML = humidity;
  windElement.innerHTML = windSpeed;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="${data.current.condition.icon}" class="weather-app-icon"/>`;

  getForecast(city);
}

//TODO: search for the city's current weather
async function searchCity(city) {
  let apiKey = "c7ab33300b3c4c59ba1141915240209";
  let apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    refreshWeather(data);
  } catch (error) {
    console.log("Error fetching weather data:", error);
  }
}

function handelSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function formatDate(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  return `${day} ${hours}:${minutes}`;
}

//TODO:get forecast weather data
async function getForecast(city) {
  let apiKey = "c7ab33300b3c4c59ba1141915240209";
  let apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    console.log("Error fetching forecast data:", error);
  }
}

//TODO:get format day
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[(date.getDay() + 1) % 7]; // +1 to make sure the forecast start from the next day 'not today' and the %7 to  ensure that the day of the week wraps around to Sunday (0)
}

//TODO:build the forecast
function displayForecast(data) {
  let forecastHtml = "";
  data.forecast.forecastday.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml += `
    <div class="weather-forecast-day">
     <div class="weather-forecast-date">${formatDay(day.date_epoch)}
     </div>
     <div>
     <img src="${day.day.condition.icon}"
      class="weather-forecast-icon"/>
     </div>
     <div class="weather-forecast-temperatures">
       <div class="weather-forecast-temperature">
        <strong>${Math.round(day.day.maxtemp_c)}°</strong>
       </div>
       <div class="weather-forecast-temperature">
        ${Math.round(day.day.mintemp_c)}°
       </div>
      </div>
     </div>
    `;
    }
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handelSearchSubmit);
searchCity("Gent"); //by default the visible city is Gent
