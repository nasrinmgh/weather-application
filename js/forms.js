// TO DISPLAY SIGN-UP FORM
export function enabelSignUpForm() {
  const loginForm = document.querySelector(".login-option");
  const registerForm = document.querySelector(".register-option");
  const resetPassForm = document.querySelector(".resetpass-option");

  registerForm.classList.add("active");
  loginForm.classList.remove("active");
  resetPassForm.classList.remove("active");
}

// TO DISPLAY LOGIN FORM AFTER REGISTER
export function showLoginForm() {
  const loginForm = document.querySelector(".login-option");
  const registerForm = document.querySelector(".register-option");
  const resetPassForm = document.querySelector(".resetpass-option");

  loginForm.classList.add("active");
  registerForm.classList.remove("active");
  resetPassForm.classList.remove("active");
}

// Forgot password form
export function goToResetForm() {
  const loginForm = document.querySelector(".login-option");
  const registerForm = document.querySelector(".register-option");
  const resetPassForm = document.querySelector(".resetpass-option");
  loginForm.classList.remove("active");
  registerForm.classList.remove("active");
  resetPassForm.classList.add("active");
}
