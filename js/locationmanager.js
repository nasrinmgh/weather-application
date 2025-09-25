export function locationManagerInitialize() {
  const crossBtn = document.getElementById("crossBtn");
  if (crossBtn) {
    crossBtn.addEventListener("click", function () {
      document.querySelector(".location-manager").classList.remove("show");
    });
  }

  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn) {
    searchBtn.addEventListener("click", getLocation);
  }

  document.querySelector(".saved-cities").addEventListener("click", (e) => {
    if (e.target.closest(".delete-city")) {
      deleteCityCard(e);
    } else if (e.target.closest(".choose-city")) {
      chooseDefaultCity(e);
    }
  });

  const doneBtn = document.getElementById("search-done-btn");
  if (doneBtn) {
    doneBtn.addEventListener("click", () => {
      const city = document.getElementById("searchInput").value.trim();
      if (!city) {
        return;
      }
      addCityToLocalStorage(city);
      renderCities();
    });
  }
  renderCities();
}

function deleteCityCard(event) {
  const clickedBtn = event.target;
  const parentCard = clickedBtn.closest(".city-card");
  const deletedCity = parentCard.querySelector(".city-card-name").textContent;
  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  savedCities = savedCities.filter((city) => city !== deletedCity);
  localStorage.setItem("savedCities", JSON.stringify(savedCities));
  console.log(savedCities);
  parentCard.remove();
}

function chooseDefaultCity(event) {
  let defaultSaved = localStorage.getItem("defaultCity");
  if (defaultSaved) {
    return;
  }
  const clicked = event.target;
  const defaultSign = document.createElement("div");
  defaultSign.classList.add("default-sign");
  defaultSign.textContent = "default";
  const parent = clicked.closest(".city-card");
  const defaultCity = parent.querySelector(".left-side .city-card-name");
  const defaultCityName = defaultCity.textContent;
  localStorage.setItem("defaultCity", defaultCityName);
  clicked.replaceWith(defaultSign);
}

// fetch city
async function getLocation() {
  let city = document.getElementById("searchInput").value.trim();
  const API_KEY = "da423d4208c663d2a79bfdb258836ed5";
  let input = document.getElementById("searchInput");

  if (!city) {
    input.value = "";
    alert("Please enter a city name");
    return;
  }

  let savedCities = JSON.parse(localStorage.getItem("savedCities"));
  if (
    savedCities.some(
      (c) => typeof c == "string" && c.toLowerCase() === city.toLowerCase()
    )
  ) {
    alert("You already saved this city");
    input.value = "";
    return;
  }

  try {
    const GEO_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`;
    const GEO_response = await fetch(GEO_URL);
    const GEO_data = await GEO_response.json();
    if (!GEO_data || GEO_data.length === 0) {
      alert("City not found");
      input.value = "";
      return;
    }

    let cityName = GEO_data[0].name;
    createCityCard(cityName);
    addCityToLocalStorage(cityName);
    console.log(`City:${cityName}`);
    console.log(savedCities);
  } catch (error) {
    console.error("Failed to fetch city:", error);
    alert("Can not find the city, please try again");
  }
}

function createCityCard(cityName) {
  const card = document.createElement("div");
  card.classList.add("city-card", "glass");

  if (!cityName) {
    return;
  }
  if (typeof cityName !== "string") {
    return;
  }
  card.innerHTML = `
  <div>
      <div class="left-side">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
         <path
         d="M128 252.6C128 148.4 214 64 320 64C426 64 512 148.4 512 252.6C512 371.9 391.8 514.9 341.6 569.4C329.8 582.2 310.1 582.2 298.3 569.4C248.1 514.9 127.9 371.9 127.9 252.6zM320 320C355.3 320 384 291.3 384 256C384 220.7 355.3 192 320 192C284.7 192 256 220.7 256 256C256 291.3 284.7 320 320 320z" />
         </svg>
        <h5 class="city-card-name"></h5>
      </div>
      <div class="right-side">
         <svg class="choose-city" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
         <path
         d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z" />
         </svg>
         <svg class="delete-city" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
         <path
         d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z" />
         </svg>
      </div>
  </div>
  `;

  const cardsContainer = document.querySelector(".saved-cities");
  const cityTitle = card.querySelector(".city-card-name");
  cityTitle.textContent = cityName;
  cardsContainer.prepend(card);
  const cityInput = document.getElementById("searchInput");
  cityInput.value = "";
}

function addCityToLocalStorage(cityName) {
  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  cityName = cityName.trim();
  if (!cityName) return;

  savedCities.push(cityName);
  localStorage.setItem("savedCities", JSON.stringify(savedCities));
}

export function renderCities() {
  let savedCities = JSON.parse(localStorage.getItem("savedCities")) || [];
  const cardsContainer = document.querySelector(".saved-cities");
  cardsContainer.innerHTML = "";
  savedCities.forEach((cityName) => {
    createCityCard(cityName);
  });
  let input = document.getElementById("searchInput");
  input.value = "";
}

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
