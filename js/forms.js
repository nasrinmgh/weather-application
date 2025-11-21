// TO DISPLAY SIGN-UP FORM

export function enabelSignUpForm() {
  const loginForm = document.querySelector(".login-option");
  const registerForm = document.querySelector(".register-option");

  registerForm.classList.add("active");
  loginForm.classList.remove("active");
  //console.log("console log anabled");
}

// TO DISPLAY LOGIN FORM AFTER REGISTER
export function showLoginForm() {
  const loginForm = document.querySelector(".login-option");
  const registerForm = document.querySelector(".register-option");

  loginForm.classList.add("active");
  registerForm.classList.remove("active");
}
