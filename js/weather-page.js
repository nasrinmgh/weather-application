export function weatherInitialize() {
  getWeather();
  //what to do if API did not work
  // what to do it it did not show the city or other divs
}

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

export function loadPageDom() {
  const loadingStateDom = document.querySelector(".loading-page");
  loadingStateDom.style.display = "block";
}

// Show loading state for users
export function showLoadingState() {
  const loadingPage = document.querySelector(".loading-page");
  const homePage = document.querySelector(".home-page");
  //homePage.style.display = "none";
  //loadingPage.style.display = "flex";
  loadingPage.classList.add("fade-in");
}

// FETCH FROM WEATHER API ON LOCATION MANAGER PAGE
async function getWeather() {
  try {
    const defaults = localStorage.getItem("defaultCity") || [];
    console.log(defaults);
    const cityName = defaults;

    //call forecast API
    const API_KEY = "da423d4208c663d2a79bfdb258836ed5";
    const WEATHER_API = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;
    const WEATHER_response = await fetch(WEATHER_API);
    const WEATHER_data = await WEATHER_response.json();

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
  }
}
