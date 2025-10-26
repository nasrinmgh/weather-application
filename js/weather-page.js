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
    displayDailyCard(WEATHER_data);
    processDailyData(WEATHER_data);
    displayHourlyCard(WEATHER_data);
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
function formatDate(entry) {
  const dt = entry.dt;
  const date = new Date(dt * 1000);
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    weekday: date.toLocaleString("en-US", { weekday: "long" }),
    hour24: date.getHours(),
    hour12: (() => {
      const hour = date.getHours();
      if (hour === 0) return 12;
      if (hour > 12) return hour - 12;
      return hour;
    })(),
  };
}

// Build card
function buildHourlyCard() {
  const hourlyCard = document.createElement("div");
  hourlyCard.classList.add("hourly-card", "glass");
  hourlyCard.innerHTML = `
        <div class="hourly-time"></div>
        <div class="hourly-icon"></div>
        <div class="hourly-temp"></div>
        <div class="hourly-hum"></div>   
`;
  return hourlyCard;
}

// Hourly-forecast option
function displayHourlyCard(WEATHER_data) {
  const hourlyContainer = document.querySelector(".hourly-forecast");
  hourlyContainer.innerHTML = "";

  WEATHER_data.list.forEach((entry) => {
    const smallCard = buildHourlyCard();
    const formattedDate = formatDate(entry);

    // time
    const ampm = formattedDate.hour24 >= 12 ? "PM" : "AM";
    smallCard.querySelector(
      ".hourly-time"
    ).textContent = `${formattedDate.hour12} ${ampm}`;

    // icon
    const iconCode = entry.weather[0].icon;
    const desc = entry.weather[0].description;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    smallCard.querySelector(".hourly-icon").innerHTML = `
    <img src="${iconUrl}" alt="${desc}">`;

    // temp & humidity
    const hourlyTemp = Math.round(entry.main.temp - 273.15);
    smallCard.querySelector(".hourly-temp").textContent = `${hourlyTemp}°`;

    const hourlyHum = entry.main.humidity;
    smallCard.querySelector(".hourly-hum").innerHTML = `
    ${hourlyHum}%`;

    hourlyContainer.appendChild(smallCard);
  });
}

// Group data for daily cards
function processDailyData(WEATHER_data) {
  const entries = WEATHER_data.list;
  const dailyForecasts = {};

  entries.forEach((entry) => {
    const date = new Date(entry.dt * 1000).toLocaleDateString("en-US");
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        minTemps: [],
        maxTemps: [],
        descriptions: [],
        humidities: [],
        dateObj: new Date(entry.dt * 1000),
      };
    }

    dailyForecasts[date].minTemps.push(entry.main.temp_min);
    dailyForecasts[date].maxTemps.push(entry.main.temp_max);
    dailyForecasts[date].descriptions.push(entry.weather[0].description);
    dailyForecasts[date].humidities.push(entry.main.humidity);
  });

  return Object.values(dailyForecasts).map((day) => {
    const maxTemp = Math.max(...day.maxTemps);
    const minTemp = Math.min(...day.minTemps);

    const frequencyMAp = day.descriptions.reduce((count, description) => {
      count[description] = (count[description] || 0) + 1;
      return count;
    }, {});

    const mostFrequent = Object.keys(frequencyMAp).reduce((a, b) => {
      return frequencyMAp[a] > frequencyMAp[b] ? a : b;
    });

    const sumHums = day.humidities.reduce(
      (sum, currentHum) => sum + currentHum,
      0
    );
    const dailyHum = sumHums / day.humidities.length;

    return {
      weekday: day.dateObj.toLocaleDateString("en-US", { weekday: "long" }),
      date: day.dateObj.getDate(),
      month: day.dateObj.toLocaleDateString("en-US", { month: "short" }),
      high: Math.round(maxTemp),
      low: Math.round(minTemp),
      hum: Math.round(dailyHum),
      condition: mostFrequent,
    };
  });
}

// Daily forecast cards
function buildDailyCard() {
  const dailyCard = document.createElement("div");
  dailyCard.classList.add("daily-card", "glass");
  dailyCard.innerHTML = `
  <div class="left-info">
            <div class="daily-date">
                <div class="weekday"></div>
                <div class="date semi-transparent"></div>
            </div>
            <div class="daily-temps">
                <div class="max-temp"></div>
                <div class="min-temp semi-transparent"></div>
            </div>
            <div class="daily-desc"></div>
        </div>
        <div class="right-info">
            <div class="daily-icon"></div>
            <div class="daily-hum"></div>
        </div>`;
  return dailyCard;
}
// Display daily cards
function displayDailyCard(WEATHER_data) {
  const dailyContainer = document.querySelector(".daily-forecast");
  dailyContainer.innerHTML = "";

  const dailyData = processDailyData(WEATHER_data);
  dailyData.forEach((day) => {
    const largeCard = buildDailyCard();

    largeCard.querySelector(".weekday").textContent = day.weekday;
    largeCard.querySelector(".date").textContent = `${day.month} ${day.date}`;

    largeCard.querySelector(".max-temp").textContent = `${day.high}°C`;

    largeCard.querySelector(".min-temp").textContent = `${day.low}°C`;

    largeCard.querySelector(".daily-desc").textContent = day.condition;
    largeCard.querySelector(".daily-hum").textContent = `${day.hum}%`;

    dailyContainer.appendChild(largeCard);
  });
}

// To toggle daily-hourly forecasts
export function toggleCards() {
  const dailyContainer = document.querySelector(".daily-forecast");
  const hourlyContainer = document.querySelector(".hourly-forecast");
  dailyContainer.style.display = "none";

  const toggleDaily = document.getElementById("dailyToggle");
  toggleDaily.addEventListener("click", () => {
    hourlyContainer.style.display = "none";
    dailyContainer.style.display = "block";

    const toggleHourly = document.getElementById("hourlyToggle");
    toggleHourly.addEventListener("click", () => {
      hourlyContainer.style.display = "block";
      dailyContainer.style.display = "none";
    });
  });
}
