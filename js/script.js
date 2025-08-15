const API_KEY = 'da423d4208c663d2a79bfdb258836ed5';
const BASE_URL = 'http://api.openweathermap.org/';

async function getWeather() {
    const city = document.getElementById('searchInput').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (data.cod === '404') {
            alert('City not found');
            return;
        }

        document.getElementById('weatherResult').innerHTML = `
        <h2>${data.name}</h2>
        <p>${data.main.temp}°C</p>
        <p>${data.weather[0].description}</p>`;

    } catch (error) {
        console.error('Error fetching weather data', error);
        alert('Failed to fetch weather data');
    }

  }

const searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', getWeather);