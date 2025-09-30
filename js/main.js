import { showLoginForm, enabelSignUpForm } from "./forms.js";
import { auth } from "/APIs/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { locationManagerInitialize } from "./locationmanager.js";

async function loadPage(page) {
  try {
    const response = await fetch(`/pages/${page}.html`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    document.getElementById("app").innerHTML = html;

    if (page === "forms") {
      setTimeout(() => {
        setupFormsEventListeners();
      }, 100);
    }
    if (page === "home") {
      loadHomePageScripts();
    }
    if (page === "weather-forecast") {
      loadWeatherForecast();
    }
  } catch (error) {
    console.error("Error loading page:", error);
    document.getElementById("app").innerHTML = `
      <div style="color: white; text-align: center; margin-top: 2rem;">
        <h2>Error loading page</h2>
        <p>Could not load ${page}.html</p>
      </div>
    `;
  }
}

function setupFormsEventListeners() {
  const signUpBtn = document.getElementById("signUp");
  const signInBtn = document.getElementById("signIn");
  const createAccountBtn = document.getElementById("createAccountBtn");
  const registerForm = document.querySelector(".register-form form");
  const loginForm = document.querySelector(".login-form form");
  const backToSignIn = document.getElementById("backToSignIn");

  // sign up link- switch to register form
  if (signUpBtn) {
    signUpBtn.addEventListener("click", (e) => {
      e.preventDefault();
      enabelSignUpForm();
    });
  }

  if (backToSignIn) {
    backToSignIn.addEventListener("click", (e) => {
      e.preventDefault();
      showLoginForm();
    });
  }

  // sign in btn- go to home page
  if (signInBtn) {
    signInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleLogin();
    });
  }

  // create account form submission
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await handleCreateAccount();
    });
  }

  // login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await handleLogin();
    });
  }
}

async function handleCreateAccount() {
  const email = document.getElementById("signEmail").value;
  const password = document.getElementById("signPassword").value;
  const passConfirm = document.getElementById("passConfirm").value;
  const fullName = document.getElementById("fullName").value;
  const agreeCheck = document.getElementById("agreeCheck");

  // Validation
  if (password !== passConfirm) {
    alert("Passwords don't match");
    return;
  }

  if (!agreeCheck.checked) {
    alert("Please agree to terms");
    return;
  }

  if (!fullName.trim()) {
    alert("Please enter your name");
    return;
  }

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User created:", userCredential.user);
    alert("Account created successfully!");

    // Show success message and switch back to login
    showWelcome();
    setTimeout(() => {
      showLoginForm();
    }, 2000);
  } catch (error) {
    console.error("Error creating account:", error);

    if (error.code === "auth/weak-password") {
      alert("Password is too weak");
    } else if (error.code === "auth/email-already-in-use") {
      alert("Email already in use");
    } else if (error.code === "auth/invalid-email") {
      alert("Invalid email address");
    } else {
      alert("Error creating account: " + error.message);
    }
  }
}

async function handleLogin() {
  const loginEmail = document.getElementById("logEmail")?.value;
  const loginPassword = document.getElementById("logPassword")?.value;

  if (!loginEmail || !loginPassword) {
    loadPage("home");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );
    console.log("User signed in:", userCredential.user);
    loadPage("home");
  } catch (error) {
    console.error("Error signing in:", error);

    if (error.code === "auth/invalid-email") {
      alert("Enter a valid email");
    } else if (error.code === "auth/user-not-found") {
      alert("No user exists with this email");
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password");
    } else if (error.code === "auth/invalid-credential") {
      alert("Invalid email or password");
    } else {
      alert("Login failed: " + error.message);
    }
  }
}

function showWelcome() {
  const msgBox = document.createElement("div");
  msgBox.innerHTML = "Account created successfully!";
  document.body.appendChild(msgBox);

  setTimeout(() => {
    msgBox.remove();
  }, 2000);
}

function loadWeatherForecast() {
  const weatherPage = document.querySelector(".weather-page");
  const homePage = document.querySelector(".home-page");
  weatherPage.classList.add("page-animate");
  homePage.style.display = "none";
}

function loadHomePageScripts() {
  const addLocationBtn = document.querySelector(".footer-btn");
  addLocationBtn.addEventListener("click", () => {
    const locationBox = document.querySelector(".location-manager");
    locationBox.classList.add("show");
    document.body.classList.add("noscroll");
    if (locationBox) {
      document
        .getElementById("search-done-btn")
        .addEventListener("click", () => {
          locationBox.classList.remove("show");
          loadWeatherForecast();
        });
    }
    locationManagerInitialize();
  });
}

loadPage("forms");
