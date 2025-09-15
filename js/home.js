export function locationManagerInitialize() {
  const crossBtn = document.getElementById("crossBtn");
  crossBtn.addEventListener("click", () => {
    document.querySelector(".location-manager").classList.remove("show");
  });

  const doneBtn = document.getElementById("search-done-btn");
  doneBtn.addEventListener("click", () => {
    localStorage.getItem;
  });
}
