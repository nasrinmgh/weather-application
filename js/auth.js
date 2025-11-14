import { auth } from "../APIs/firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

export async function credentialCheck() {
  const email = document.getElementById("signEmail").value;
  const pass = document.getElementById("signPassword").value;
  const passConfirm = document.getElementById("passConfirm").value;
  const fullName = document.getElementById("fullName").value;
  const agreeCheck = document.getElementById("agreeCheck");

  if (passConfirm !== pass) {
    alert("Password confirm does not match");
    return false;
  }
  if (!agreeCheck.checked) {
    alert("Please agree with our terms");
    return false;
  }
  if (!fullName.trim()) {
    alert("Please enter your name");
    return false;
  }
  if (pass.length < 6) {
    alert("Password must be at least 6 characters");
    return false;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    return true;
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.code === "auth/weak-password") {
      alert("Use stronger password");
    } else if (error.code === "auth/email-already-in-use") {
      alert("This email is already in use");
    } else {
      alert("Sign up failed: " + error.message);
    }
    return false;
  }
}

// TO SIGN UP
// auth.js (change: export handler, do NOT attach listeners at module load)
export async function handleSignUpSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  try {
    const successSignUp = await credentialCheck();
    if (successSignUp) {
      return true;
    }
  } catch (err) {
    console.error("Sign-up error:", err);
    return false;
  }
}

// TO LOGIN
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error("Login error:", error);

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
    return false;
  }
}

export function showEnterStatus() {
  const oldMsg = document.querySelector(".msg-box");
  if (oldMsg) {
    oldMsg.remove();
  }
  let msgBox = document.createElement("div");
  msgBox.classList.add("msg-box", "box-anima", "glass");
  document.body.appendChild(msgBox);
  if (loginUser) {
    msgBox.textContent = `Logged in successfully!
  Welcome back!`;
    return;
  }
  if (credentialCheck) {
    msgBox.textContent = "";
    msgBox.innerHTML = `Account created successfully!
Welcome to Weather app!`;
    return;
  }
}
