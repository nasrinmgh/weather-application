// fetch city
export async function getLocation() {
  const city = document.getElementById("searchInput").value.trim();
  const API_KEY = "da423d4208c663d2a79bfdb258836ed5";
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  try {
    const GEO_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;
    const GEO_response = await fetch(GEO_URL);
    const GEO_data = await GEO_response.json();
    if (!GEO_data || GEO_data.length === 0) {
      alert("City not found");
      return;
    }

    let cityNAME = GEO_data[0].name;
    addCityToLocalStorage(cityNAME);

    console.log(`City:${cityNAME}`);
  } catch (error) {
    console.error("Failed to fetch city:", error);
    alert("Can not find the city, please try again");
  }
}

function addCityToLocalStorage(cityName) {
  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  savedCities.push(cityName);
  localStorage.setItem("savedCities", JSON.stringify(savedCities));
  console.log(`${savedCities}`);
}

function renderCities() {
  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  const cardTemplate = document.querySelector(".city-card");
  const cardsContainer = document.querySelector(".saved-cities");
  cardsContainer.innerHTML = "";
  savedCities.forEach((c) => {
    const cardCopy = cardTemplate.cloneNode(true);
    cardCopy.style.display = "flex";
    const cityCardName = cardCopy.querySelector("#cityCardName");
    cityCardName.textContent = c;
    cardsContainer.appendChild(cardCopy);
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
    const WEATHER_API = `http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}`;
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
