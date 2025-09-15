// fetch city
async function getLocation() {
  const city = document.getElementById("searchInput").value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  try {
    const GEO_URL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    const GEO_response = await fetch(GEO_URL);
    const GEO_data = await GEO_response.json();
    if (!GEO_data.results || GEO_data.results.length === 0) {
      alert("City not found");
      return;
    }

    let cityNAME = GEO_data.results[0].name;
    let latitude = GEO_data.results[0].latitude;
    let longitude = GEO_data.results[0].longitude;
    addCityToLocalStorage();

    console.log(`City:${cityNAME}
      Latitude: ${latitude}
      Longitude: ${longitude}`);
  } catch (error) {
    console.error("Failed to fetch city:", error);
    alert("Can not find the city, please try again");
  }
}

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", () => {
  getLocation();
  renderCities();
});

function addCityToLocalStorage(cityName) {
  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  savedCities.push(cityName);
  localStorage.setItem("savedCities", JSON.stringify(savedCities));
}

function renderCities() {
  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  if (savedCities.length === 0) {
    return;
  }
  savedCities.map((c) => {
    const cityCard = document.getElementById(".city-card");
    cityCard.style.display = "flex";
    const cityCardName = document.getElementById("cityCardName");
    cityCardName.textContent = c;
  });
}

const doneBtn = document.getElementById("search-done-btn");
doneBtn.addEventListener("click", () => {
  renderCities();
});

// FETCH FROM WEATHER API ON LOCATION MANAGER PAGE
async function getWeather() {
  try {
    //call forecast API
    const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m,relative_humidity_2m,precipitation,cloud_cover,visibility,temperature_80m&current=temperature_2m,precipitation,cloud_cover,relative_humidity_2m`;
    const WEATHER_response = await fetch(WEATHER_API);
    const WEATHER_data = await WEATHER_response.json();

    //Manipulate DOM
    const cityNameDisplay = document.getElementById("city");
    const currentTemp = document.getElementById("temp");
    const humidity = document.getElementById("humidity");

    cityNameDisplay.textContent = cityNAME;
    currentTemp.textContent = `${WEATHER_data.current.temperature_2m}°C`;
    humidity.textContent = `${WEATHER_data.current.relative_humidity_2m}%`;
  } catch (error) {
    console.error("Error fetching weather data", error);
    alert("Failed to fetch weather data");
  }
}

searchBtn.addEventListener("click", getWeather);
