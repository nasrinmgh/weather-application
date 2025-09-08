export function initializeHomePage() {
  const homePage = document.querySelector(".home-page");
  if (!homePage) {
    console.error("Home page element not found");
    return;
  }
  console.log("Home page is getting ready");
  setTimeout(loadingSpinner, 1000);
  defaultContent();
  requestUserLocation();
}

function loadingSpinner() {
  const loading = document.createElement("div");
  loading.classList.add("loading");
  document.body.appendChild(loading);
}

function defaultContent() {
  const cityName = document.getElementById("cityName");
  const temp = document.getElementById("temp");
  const currentCondition = document.getElementById("currentCondition");
  const detail = document.querySelector(".weather-in-detail");

  if (cityName) cityName.textContent = "Getting your location";
  if (temp) temp.textContent = "--°";
  if (currentCondition) currentCondition.textContent = "Loading ...";
  if (detail) detail.textContent = "Loading more detail ...";
  console.log("Default content set!");
}

export function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    homePage.innerHTML = "Geolocation is unavailable";
    console.log("No Geolocation here");
  }
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  console.log(`User position = { lat: ${lat}, lon: ${lon}}`);
}

function error(error) {
  const homePage = document.querySelector(".home-page");

  switch (error.code) {
    case 1: //error.PERMISSION_DENIED:
      homePage.innerHTML = "User denied the request to access location";
      break;
    case 2: //error.POSITION_UNAVAILABLE
      homePage.innerHTML = "<p>Location information is not available</p>";
      break;
    case 3: //error.TIMEOUT
      homePage.innerHTML = "The request to get user location timed out";
      break;
    case 4: //error.UNKNOWN_ERROR
      homePage.innerHTML = "An unknown error occured";
      break;
  }
  console.error(error);

  const goToCitySearch = document.createElement("div");
  goToCitySearch.classList.add("go-to-city-search");
  goToCitySearch.innerHTML = `
  <p>We can not find your location!</p>
  <button id='goToSearchBtn'>Go to search your city</button>
  `;
  document.body.appendChild(goToCitySearch);
  document.getElementById("goToSearchBtn").addEventListener("click", () => {
    window.location.href = "/pages/location-manager.html";
  });
}

//getCurrentLocation();

// To get current location for the next times
let watchId;
export async function startWatching() {
  if (navigator.geolocation) {
    watchId = await navigator.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    });
  } else {
    homePage.innerHTML = "Location not supported";
  }
}

//startWatching();
