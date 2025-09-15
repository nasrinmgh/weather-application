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
    console.log(`City:${cityNAME}
      Latitude: ${latitude}
      Longitude: ${longitude}`);
  } catch (error) {
    console.error("Failed to fetch city:", error);
    alert("Can not find the city, please try again");
  }
}

function addCityToLocalStorage(cityName) {
  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  savedCities.push(cityName);
  localStorage.setItem("savedCities", JSON.stringify(savedCities));
}

function renderCities() {
  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  const list = document.querySelector(".saved-cities");
  savedCities.map((c) => {
    return `
  <div class="city-card">
    <div class="left-side">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z" />
      </svg>
      <h5>${c}</h5>
    </div>
    <div class="right-side">
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z"/>
     </svg>
     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
     </svg>
    </div>
  </div>

    `;
  });
}

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

const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", getWeather);
