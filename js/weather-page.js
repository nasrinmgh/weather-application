//export function weatherInitialize() {
//getWeather();

//what to do if API did not work
// what to do it it did not show the city or other divs
//}

//Back home button
function backToHome() {
  const backHomeBtn = document.querySelector(".back-home");
  const weatherPage = document.querySelector(".weather-page");
  const homePage = document.querySelector(".home-page");
  backHomeBtn.addEventListener("click", () => {
    homePage.style.display = "flex";
    homePage.classList.add("fade-in");
    weatherPage.style.display = "none";
    weatherPage.classList.remove("fade-in");
  });
}

// Make sure listeners work even if API does not
export function setWeatherPageListeners() {
  const backHomeBtn = document.querySelector(".back-home");
  if (backHomeBtn) {
    backToHome();
  }
}

// Show loading state for users
export function showLoadingState() {
  const loadingPage = document.querySelector(".loading-page");
  const homePage = document.querySelector(".home-page");
  const weatherPage = document.querySelector(".weather-page");
  homePage.style.display = "none";
  weatherPage.style.display = "none";
  loadingPage.style.display = "flex";
  loadingPage.classList.add("fade-in");
}

// FETCH FROM WEATHER API ON LOCATION MANAGER PAGE
export async function getWeather() {
  const loadingPage = document.querySelector(".loading-page");
  const homePage = document.querySelector(".home-page");

  try {
    showLoadingState();
    const defaults = localStorage.getItem("defaultCity") || [];
    console.log(defaults);
    const cityName = defaults;
    //call forecast API
    const API_KEY = "da423d4208c663d2a79bfdb258836ed5";
    const WEATHER_API = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;
    const WEATHER_response = await fetch(WEATHER_API);
    const WEATHER_data = await WEATHER_response.json();

    //Pass the data to build cards
    //buildDailyCard(WEATHER_data);
    //buildHourlyCard(WEATHER_data);
    formatDate(WEATHER_data);
    //Manipulate DOM
    const cityNameDisplay = document.getElementById("cityDisplay");
    const currentTemp = document.getElementById("degree");
    const airCondition = document.getElementById("airCondition");
    const humidity = document.getElementById("humidity");
    const visibility = document.getElementById("visibility");

    cityNameDisplay.textContent = cityName;
    currentTemp.textContent = `${Math.round(
      WEATHER_data.list[0].main.temp - 273.15
    )}°C`;

    airCondition.textContent = WEATHER_data.list[0].weather[0].description;
    humidity.textContent = `H: ${WEATHER_data.list[0].main.humidity}%`;
    visibility.textContent = `V: ${WEATHER_data.list[0].visibility}m`;
  } catch (error) {
    console.error("Error fetching weather data", error);
    alert("Failed to fetch weather data");
  } finally {
    loadingPage.style.display = "none";
    homePage.style.display = "none";
    loadingPage.classList.remove("fade-in");
  }
}

// helper: format day/date
function formatDate(WEATHER_data) {
  const dt = WEATHER_data.list[0].dt;
  const date = new Date(dt * 1000);
  return {
    day: date.getDay(),
    month: date.getMonth(),
    weekday: date.toLocaleString("en-US", { weekday: "long" }),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
}
function buildCards() {}

function buildHourlyCard() {
  const hourlyCard = document.createElement("div");
  card.classList.add("hourly-card", "glass");
  hourlyCard.innerHTML = `
        <div class="hourly-time"></div>
        <div class="hourly-icon"></div>
        <div class="hourly-temp"></div>
        <div class="hourly-hum"></div>   
`;
}

function buildHourlyCard() {
  const hourlyContainer = document.querySelector(".hourly-forecast");
  hourlyContainer.innerHTML = "";
  WEATHER_data.list.forEach((entry) => {
    const hourlyCard = buildCards();
    const formattedDate = formatDate(WEATHER_data);
  });
}

//Toggle options
function buildDailyCard(WEATHER_data) {
  const slider = document.querySelector(".slider");
  const listOfDays = WEATHER_data.list;
  slider.addEventListener(
    "click",
    listOfDays.forEach((list) => {
      const dailyCard = document.createElement("div");
      dailyCard.classList.add("daily-card", "glass");
      dailyCard.innerHTML = `
        <div class="weather-info">
            <div id="nameOfDay"></div>
            <div id="date" class="semi-transparent"></div>
            <div class="temps-daily">
                <div id="maxTemp"></div>
                <div id="minTemp" class="semi-transparent"></div>
            </div>
            <div id="descriptionDaily"></div>
        </div>
        <div class="weather-icon">
            <div id="dailyIcon"></div>
            <div id="dailyPop"></div>
        </div>
    `;

      const nameOfDay = document.getElementById("nameOfDay");
      const dt = WEATHER_data.list[0].dt * 1000;
      const dateOfDay = new Date(dt);
      nameOfDay.textContent = dateOfDay.toLocaleDateString("en-US", {
        weekday: "long",
      });

      const date = document.getElementById("date");
      date.textContent = dateOfDay.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const dailyIcon = document.getElementById("dailyIcon");
      dailyIcon.textContent = WEATHER_data.list[0].weather[0].icon;

      const dailyPop = document.getElementById("dailyPop");
      dailyPop.textContent = WEATHER_data.list[0].pop;

      const maxTemp = document.getElementById("maxTemp");
      const minTemp = document.getElementById("minTemp");
      maxTemp.textContent = WEATHER_data.list[0].temp_max;
      minTemp.textContent = WEATHER_data.list[0].temp_min;

      const descriptionDaily = document.getElementById("descriptionDaily");
      descriptionDaily.textContent =
        WEATHER_data.list[0].weather[0].description;
    })
  );
}
