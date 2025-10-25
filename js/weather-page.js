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
    <svg class="rainy-prob" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M160 384C107 384 64 341 64 288C64 245.5 91.6 209.4 129.9 196.8C128.6 190.1 128 183.1 128 176C128 114.1 178.1 64 240 64C283.1 64 320.5 88.3 339.2 124C353.9 106.9 375.7 96 400 96C444.2 96 480 131.8 480 176C480 181.5 479.4 186.8 478.4 192C478.9 192 479.5 192 480 192C533 192 576 235 576 288C576 341 533 384 480 384L160 384zM166.8 463.6L134.8 559.6C130.6 572.2 117 579 104.4 574.8C91.8 570.6 85 557 89.2 544.4L121.2 448.4C125.4 435.8 139 429 151.6 433.2C164.2 437.4 171 451 166.8 463.6zM286.8 463.6L254.8 559.6C250.6 572.2 237 579 224.4 574.8C211.8 570.6 205 557 209.2 544.4L241.2 448.4C245.4 435.8 259 429 271.6 433.2C284.2 437.4 291 451 286.8 463.6zM398.8 463.6L366.8 559.6C362.6 572.2 349 579 336.4 574.8C323.8 570.6 317 557 321.2 544.4L353.2 448.4C357.4 435.8 371 429 383.6 433.2C396.2 437.4 403 451 398.8 463.6zM518.8 463.6L486.8 559.6C482.6 572.2 469 579 456.4 574.8C443.8 570.6 437 557 441.2 544.4L473.2 448.4C477.4 435.8 491 429 503.6 433.2C516.2 437.4 523 451 518.8 463.6z"/></svg>
    ${hourlyHum}%`;

    hourlyContainer.appendChild(smallCard);
  });
}

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
                <div class="date"></div>
            </div>
            <div class="daily-temps">
                <div class="max-temp"></div>
                <div class="min-temp"></div>
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
