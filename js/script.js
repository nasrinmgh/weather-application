
function updateFormContainerHeight() {
    let formContainer = document.querySelector('.form-container');
    let activeForm = formContainer.querySelector('.active');
    let height = activeForm.scrollHeight;
    formContainer.style.height = height + 'px';
}

// TO DISPLAY SIGN-UP FORM
let signUp = document.getElementById('signUp');
let loginForm = document.querySelector('.login-option');
signUp.addEventListener('click', (event) => {
  event.preventDefault();
  let registerForm = document.querySelector('.register-option');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
  updateFormContainerHeight();
})

loginForm.classList.add('active');
updateFormContainerHeight();


// FETCH FROM WEATHER API ON LOCATION MANAGER PAGE
async function getWeather() {
    const city = document.getElementById('searchInput').value.trim();
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const GEO_URL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const GEO_response = await fetch(GEO_URL);
        const GEO_data = await GEO_response.json();
        if (!GEO_data.results || GEO_data.results.length === 0) {
            alert('City not found');
            return;
        }

        const cityNAME = GEO_data.results[0].name;
        const latitude = GEO_data.results[0].latitude;
        const longitude = GEO_data.results[0].longitude;

        //call forecast API
        const WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m,relative_humidity_2m,precipitation,cloud_cover,visibility,temperature_80m&current=temperature_2m,precipitation,cloud_cover,relative_humidity_2m`;
        const WEATHER_response = await fetch(WEATHER_API);
        const WEATHER_data = await WEATHER_response.json();

        //Manipulate DOM
        const cityNameDisplay = document.getElementById('city');
        const currentTemp = document.getElementById('temp');
        const humidity = document.getElementById('humidity');

        cityNameDisplay.textContent = cityNAME;
        currentTemp.textContent = `${WEATHER_data.current.temperature_2m}°C`;
        humidity.textContent = `${WEATHER_data.current.relative_humidity_2m}%`;

    } catch (error) {
        console.error('Error fetching weather data', error);
        alert('Failed to fetch weather data');
    }

  }

const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', getWeather);

let savedCities = [];

function createCityCard(cityName, ) {
}