# weather-application

This is modern weather application, featuring Firebase authentication and OpenWeather API integration. Users can create an account, log in securely, and manage favorite cities to quickly access weather updates.

## Features

User Authentication

- Sign up and log in using Firebase Authentication.
- Password validation and user feedback with alerts.
- Custom welcome message after registration.

City Management

- Add, delete, and set default cities with a clean UI.
- Cities are stored in LocalStorage for persistent access.
- Smart duplicate prevention and “default city” highlighting.

Weather Data

- Integrated with OpenWeather API for live location-based weather data.
- Displays hourly and daily forecasts (toggle supported).
- Loading states and smooth UI transitions for better UX.

### Tech Stack

- Frontend: HTML, CSS, JavaScript(Vanilla)
- APIs:
- Auth: Firebase Authentication
- Storage: Browser LocalStorage
- Architecture: Modular JavaScript (ES Modules)
