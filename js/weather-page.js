export function weatherInitialize() {
  // getWeather
  //what to do if API did not work
  // what to do it it did not show the city or other divs
}

//Back home button
function backToHome() {
  const backHomeBtn = document.querySelector(".back-home");
  const weatherPage = document.querySelector(".weather-page");
  const homePage = document.querySelector(".home-page");
  backHomeBtn.addEventListener("click", () => {
    //show home page
    homePage.style.display = "flex";
    homePage.classList.add("fade-in");
    weatherPage.style.display = "none";
    weatherPage.classList.remove("fade-in");
    //hide weather page
  });
}

// Make sure listeners work eve if API does not
export function setWeatherPageListeners() {
  const backHomeBtn = document.querySelector(".back-home");
  if (backHomeBtn) {
    backToHome();
  }
}
