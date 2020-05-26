"use strict";

// api key : 82005d27a116c2880c8f0fcb866998a0

// SELECT ELEMENTS
const iconElement = document.querySelector(".wheather-icon");
const tempElement = document.querySelector(".temperature p");
const descElement = document.querySelector(".description p");
const locationElement = document.querySelector(".location p span");
const notificationElement = document.querySelector(".notification");
//SELECT FORECAST ALL ELEMENTS
const firstIcon = document.querySelectorAll(".day-icon");
const firstDay = document.querySelectorAll(".day-night .day");
const firstNight = document.querySelectorAll(".day-night .night");
const day = document.querySelectorAll(".first");

// DISPLAY FORECAST DAYS
let weekday = new Array(7);
weekday[0] = "Sun<span>day</span>";
weekday[1] = "Mon<span>day</span>";
weekday[2] = "Tue<span>sday</span>";
weekday[3] = "Wed<span>nesday</span>";
weekday[4] = "Thu<span>rsday</span>";
weekday[5] = "Fri<span>day</span>";
weekday[6] = "Sat<span>urday</span>";

let count = 0;

for (let d = 0; d < day.length; d++) {
  let dateObject = new Date();
  if (d == 0) {
    let today = weekday[new Date().getDay()];
    day[d].innerHTML = today;
  } else {
    count = count + 1;
    let nextDay =
      weekday[
        new Date(dateObject.getTime() + count * 24 * 60 * 60 * 1000).getDay()
      ];
    day[d].innerHTML = nextDay;
  }
}

// App data,
//weather - current weather object
//forecast - forecast days object
const weather = {};
const forecast = {};

weather.temperature = {
  unit: "celsius",
};

forecast.temperature = {
  unit: "celsius",
};

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEY
const key = "82005d27a116c2880c8f0fcb866998a0";

// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// SET USER'S POSITION
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}

// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude) {
  let api = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })

    .then(function (data) {
      //   console.log(data);
      let today = new Date();
      let year = today.getFullYear();
      let month = ((today.getMonth() + 1) / 100 + "").substring(2);
      let date = today.getDate();
      let currentDate = `${year}-${month}-${date}`;
      // console.log(currentDate);

      let nextDay = new Date();
      let tomorow = nextDay.setDate(nextDay.getDate() + 1);
      let nextday = nextDay.getDate();
      let nextDate = `${year}-${month}-${nextday}`;
      // console.log(nextDate);

      for (let c = 0; c < 5; c++) {
        for (let key in data.list) {
          weather.temperature.value = Math.floor(
            data.list[0].main.temp - KELVIN
          );
          weather.description = data.list[0].weather[0].description;
          weather.iconId = data.list[0].weather[0].icon;
          weather.city = data.city.name;
          weather.country = data.city.country;

          //Kai pirma diena ir data yra lygi šios dienos datai - 12val
          if (c == 0 && data.list[key].dt_txt == currentDate + " 12:00:00") {
            forecast.temperature.value = Math.floor(
              data.list[key].main.temp - KELVIN
            );
            forecast.iconId = data.list[key].weather[0].icon;
            firstIcon[
              c
            ].innerHTML = `<img src="assets/images/${forecast.iconId}.png"/>`;
            firstDay[c].innerHTML = `${forecast.temperature.value}&deg;C`;
            //Naktis bus +4 iteracijos
            forecast.temperature.value = Math.floor(
              data.list[key * 1 + 4].main.temp - KELVIN
            );
            firstNight[c].innerHTML = `${forecast.temperature.value}&deg;C`;

            //Patikrinam ar dabar rytas, ar po pietų. Jei rytas counter = 1, jei vakaras counter = 0. Jei rytas ir egzistuoja currentDate + " 12:00:00", vadinasi reikia neperrašyti duomenų ir palikti prieš tai buvusį IF, kuris įrašė duomenis.
          } else if (
            c == 0 &&
            data.list[key].dt_txt != currentDate + " 12:00:00" &&
            data.list[key].dt_txt != currentDate + " 03:00:00" &&
            data.list[key].dt_txt != currentDate + " 06:00:00" &&
            data.list[key].dt_txt != currentDate + " 09:00:00"
          ) {
            let counter = 0;
            for (let key in data.list) {
              if (data.list[key].dt_txt == currentDate + " 12:00:00") {
                counter = 1;
              }
            }
            if (counter != 1) {
              forecast.temperature.value = Math.floor(
                data.list[0].main.temp - KELVIN
              );
              forecast.iconId = data.list[0].weather[0].icon;
              firstIcon[
                c
              ].innerHTML = `<img src="assets/images/${forecast.iconId}.png"/>`;
              firstDay[c].innerHTML = `${forecast.temperature.value}&deg;C`;
              // Jei dabar yra naktis ir 24val
              if (data.list[key].dt_txt == currentDate + " 00:00:00") {
                forecast.temperature.value = Math.floor(
                  data.list[key].main.temp - KELVIN
                );
                firstNight[c].innerHTML = `${forecast.temperature.value}&deg;C`;
              }
              // Jei dabar yra 15val naktis bus po 3 iteraciju
              else if (
                c == 0 &&
                data.list[0].dt_txt == currentDate + " 15:00:00"
              ) {
                forecast.temperature.value = Math.floor(
                  data.list[3].main.temp - KELVIN
                );
                firstNight[c].innerHTML = `${forecast.temperature.value}&deg;C`;
              }
              // Jei dabar yra 18val naktis bus po 2 iteraciju
              else if (
                c == 0 &&
                data.list[0].dt_txt == currentDate + " 18:00:00"
              ) {
                forecast.temperature.value = Math.floor(
                  data.list[2].main.temp - KELVIN
                );
                firstNight[c].innerHTML = `${forecast.temperature.value}&deg;C`;
              }
              // Jei dabar yra 21val naktis bus po 1 iteraciju
              else if (
                c == 0 &&
                data.list[0].dt_txt == currentDate + " 21:00:00"
              ) {
                forecast.temperature.value = Math.floor(
                  data.list[1].main.temp - KELVIN
                );
                firstNight[c].innerHTML = `${forecast.temperature.value}&deg;C`;
              }
            }
          }
          //Kai antra diena ir data yra lygi šios dienos datai - 12val
          else if (c == 1 && data.list[key].dt_txt == nextDate + " 12:00:00") {
            forecast.temperature.value = Math.floor(
              data.list[key].main.temp - KELVIN
            );
            forecast.iconId = data.list[key].weather[0].icon;
            firstIcon[
              c
            ].innerHTML = `<img src="assets/images/${forecast.iconId}.png"/>`;
            firstDay[c].innerHTML = `${forecast.temperature.value}&deg;C`;
            //Naktis bus +4 iteracijos
            forecast.temperature.value = Math.floor(
              data.list[key * 1 + 4].main.temp - KELVIN
            );
            firstNight[c].innerHTML = `${forecast.temperature.value}&deg;C`;
          }
          //Kai antra diena ir data yra lygi šios dienos datai - 12val, tai kitos dienos data bus po +8 iteracijų
          else if (c == 2 && data.list[key].dt_txt == nextDate + " 12:00:00") {
            forecast.temperature.value = Math.floor(
              data.list[key * 1 + 8].main.temp - KELVIN
            );
            forecast.iconId = data.list[key * 1 + 8].weather[0].icon;
            firstIcon[
              c
            ].innerHTML = `<img src="assets/images/${forecast.iconId}.png"/>`;
            firstDay[c].innerHTML = `${forecast.temperature.value}&deg;C`;
            //Naktis bus +12 iteracijos
            forecast.temperature.value = Math.floor(
              data.list[key * 1 + 12].main.temp - KELVIN
            );
            firstNight[c].innerHTML = `${forecast.temperature.value}&deg;C`;
          }
          //Kai antra diena ir data yra lygi šios dienos datai - 12val, tai kitos dienos data bus po +16 iteracijų
          else if (c == 3 && data.list[key].dt_txt == nextDate + " 12:00:00") {
            forecast.temperature.value = Math.floor(
              data.list[key * 1 + 16].main.temp - KELVIN
            );
            forecast.iconId = data.list[key * 1 + 16].weather[0].icon;
            firstIcon[
              c
            ].innerHTML = `<img src="assets/images/${forecast.iconId}.png"/>`;
            firstDay[c].innerHTML = `${forecast.temperature.value}&deg;C`;
            //Naktis bus +12 iteracijos
            forecast.temperature.value = Math.floor(
              data.list[key * 1 + 20].main.temp - KELVIN
            );
            firstNight[c].innerHTML = `${forecast.temperature.value}&deg;C`;
          }
          //Kai antra diena ir data yra lygi šios dienos datai - 12val, tai dar kitos dienos data bus po +24 iteracijų
          else if (c == 4 && data.list[key].dt_txt == nextDate + " 12:00:00") {
            forecast.temperature.value = Math.floor(
              data.list[key * 1 + 24].main.temp - KELVIN
            );
            forecast.iconId = data.list[key * 1 + 16].weather[0].icon;
            firstIcon[
              c
            ].innerHTML = `<img src="assets/images/${forecast.iconId}.png"/>`;
            firstDay[c].innerHTML = `${forecast.temperature.value}&deg;C`;
            //Naktis bus +28 iteracijos
            forecast.temperature.value = Math.floor(
              data.list[key * 1 + 28].main.temp - KELVIN
            );
            firstNight[c].innerHTML = `${forecast.temperature.value}&deg;C`;
          }
        }
      }
    })
    .then(function () {
      displayWeather();
    });
}
// DISPLAY WEATHER TO UI
function displayWeather() {
  //Current day
  iconElement.innerHTML = `<img src="assets/images/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}&deg;C`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}
