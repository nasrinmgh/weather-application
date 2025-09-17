export function locationManagerInitialize() {
  const crossBtn = document.getElementById("crossBtn");
  crossBtn.addEventListener("click", () => {
    document.querySelector(".location-manager").classList.remove("show");
  });
}

import { getLocation } from "./locationmanager";
const searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", getLocation);
