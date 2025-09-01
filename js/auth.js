import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';

// TO SIGN UP
const signUpForm = document.querySelector('.register-form form');
signUpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const successSignUp = await credentialCheck();
    if (successSignUp) {
        showWelcome();
    }
})

async function credentialCheck() {
    const email = document.getElementById('signEmail').value;
    const pass = document.getElementById('signPassword').value;

    try {
    const userCredit = await createUserWithEmailAndPassword(auth, email, pass);
     return true;
    } catch(error) {
        if (error.code === 'auth/weak-password') {
            alert('Use stronger password');
        } else if (error.code === 'auth/email-already-in-use') {
            alert('This email is already in use');
        } else {
            alert('Sign up failed:' + error.message)
        }
        return false;
    } 
}

function showWelcome() {
        const msgBox = document.createElement('div');
        msgBox.innerHTML = 'Signed up successfully!';
        const registerOption = document.querySelector('.register-option');
        registerOption.append(msgBox);

setTimeout( () => {
        msgBox.classList.add('msg-box');
}, 1000);
}

// TO LOGIN
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const loginEmail = document.getElementById('logEmail');
    const loginPass = document.getElementById('logPassword');
    try {
        const loginUser = await signInWithEmailAndPassword(auth, loginEmail, loginPass);
        if (loginUser) {
            showWelcome();
        }
    } catch (error) {
        if (error.code === 'auth/invalid-email') {
            alert('Enter a vlid email');
        } else if (error.code === 'auth/user-not-found') {
            alert('No user exists with this email');
        } else if (error.code === 'auth/wrong-password') {
            alert('Incorrect password');
        } else {
            alert('Login failed:' + error.message);
        }
        return false;
    }
})
