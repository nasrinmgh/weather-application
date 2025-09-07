import { showLoginForm, enabelSignUpForm } from "./forms.js";
import { auth } from "/APIs/firebase-config.js"; // Import auth
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { credentialCheck } from "./auth.js";

async function loadPage(page) {
  const response = await fetch(`/pages/${page}.html`);
  const html = await response.text();
  document.getElementById("app").innerHTML = html;

  if (page == "forms") {
    // Use event delegation - this works even if elements aren't ready yet
    document.getElementById("app").addEventListener("click", (e) => {
      e.preventDefault();

      if (e.target.id === "signUp") {
        enabelSignUpForm();
      } else if (e.target.id === "signIn") {
        loadPage("home");
      } else if (e.target.id === "createAccountBtn") {
        credentialCheck();
        const signUpForm = document.querySelector(".register-form form");
        signUpForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const successSignUp = await credentialCheck();
          if (successSignUp) {
            showWelcome();
          }
        });
      }
    });
  }
}

loadPage("forms");
