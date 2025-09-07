const homePage = document.querySelector(".home-page");
async function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    homePage.innerHTML = "Geolocation is unavalable";
  }
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  console.log(`User position = { lat: ${lat}, lon: ${lon}}`);
}

function error(error) {
  switch (error.code) {
    case 1: //error.PERMISSION_DENIED:
      homePage.innerHTML = "User denied the request to access location";
      break;
    case 2: //error.POSITION_UNAVAILABLE
      homePage.innerHTML = "Location information is not available";
      break;
    case 3: //error.TIMEOUT
      homePage.innerHTML = "The request to get user location timed out";
      break;
    case 4: //error.UNKNOWN_ERROR
      homePage.innerHTML = "An unknown error occured";
      break;
  }
  console.error(error);
  const alertForReload = document.createElement("div");
  alertForReload.textContent =
    "We can not get your current location, you will be guided to enter it manually within seconds.";
  alertForReload.classList.add("alert-for-reload");
  homePage.append(alertForReload);
  window.location.href = "/pages/location-manager.html";
}

getCurrentLocation();

// To get current location for the next times
let watchId;
async function startWatching() {
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

startWatching();
