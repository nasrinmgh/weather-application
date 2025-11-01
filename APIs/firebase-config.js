export const firebaseConfig = {
  apiKey: "AIzaSyA-uBcLOvgIkx3FLggc_QqvgQWeMWMUw8o",
  authDomain: "weather-app-7db92.firebaseapp.com",
  projectId: "weather-app-7db92",
  storageBucket: "weather-app-7db92.firebasestorage.app",
  messagingSenderId: "1023227794846",
  appId: "1:1023227794846:web:e056eec8a9a53bd502b28f",
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
