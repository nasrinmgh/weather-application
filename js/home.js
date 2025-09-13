export function addLocation() {
  const addLocationBtn = document.querySelector(".footer-btn");
  addLocationBtn.addEventListener("click"),
    () => {
      const locationBox = document.querySelector(".location-manager");
      locationBox.classList.remove("slide-up-hidden");
      locationBox.classList.add("slide-up");
    };
}
