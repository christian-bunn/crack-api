const API_BASE_URL = window.location.hostname === 'ilovequt.lol' ? `https://api.ilovequt.lol` : 'http://127.0.0.1:3000';

// Form submission for login
document.getElementById('loginForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const loginMessageDiv = document.getElementById('loginMessage');

    try {
        const response = await fetch(`${API_BASE_URL}/cognito/authenticate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (response.ok) {
            loginMessageDiv.textContent = "Login successful!";
            localStorage.setItem('accessToken', result.accessToken);
            // Redirect to another page or perform other actions upon successful login
        } else {
            loginMessageDiv.textContent = `Login failed: ${result.message}`;
        }
    } catch (error) {
        console.error('Error during login:', error);
        loginMessageDiv.textContent = "An error occurred during login.";
    }
});

// Form submission for signup
document.getElementById('signupForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('signupMessage');

    try {
        const response = await fetch(`${API_BASE_URL}/cognito/signUp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, email })
        });

        const result = await response.json();
        if (response.ok) {
            messageDiv.textContent = "Signup successful! Redirecting to confirmation page...";
            // Store the username in localStorage for use in the confirmation page
            localStorage.setItem('username', username);
            // Redirect to the confirmation page after a short delay
            setTimeout(() => {
                window.location.href = 'confirm.html';
            }, 2000);
        } else {
            messageDiv.textContent = `Signup failed: ${result.error}`;
        }
    } catch (error) {
        console.error('Error during signup:', error);
        messageDiv.textContent = "An error occurred during signup.";
    }
});

// Form submission for confirmation
document.getElementById('confirmForm')?.addEventListener('submit', async function(event) {
    event.preventDefault();

    const confirmationCode = document.getElementById('confirmationCode').value;
    const username = localStorage.getItem('username'); // Retrieve the username from localStorage
    const messageDiv = document.getElementById('confirmationMessage');

    try {
        const response = await fetch(`${API_BASE_URL}/cognito/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, confirmationCode })
        });

        const result = await response.json();
        if (response.ok) {
            messageDiv.textContent = "Confirmation successful! Redirecting to login page...";
            // Redirect to the login page after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            messageDiv.textContent = `Confirmation failed: ${result.error}`;
        }
    } catch (error) {
        console.error('Error during confirmation:', error);
        messageDiv.textContent = "An error occurred during confirmation.";
    }
});