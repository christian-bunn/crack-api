const express = require('express');
const bodyParser = require('body-parser');
const { signUpUser } = require('./cognito/signUp');
const { confirmSignUp } = require('./cognito/confirm');
const { authenticateUser } = require('./cognito/authenticate');

const app = express();
app.use(bodyParser.json());

// Manually set CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.static('frontend/http'));

// Sign-up API route
app.post('/cognito/signUp', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const response = await signUpUser(username, password, email);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirmation API route
app.post('/cognito/confirm', async (req, res) => {
  const { username, confirmationCode } = req.body;
  try {
    const response = await confirmSignUp(username, confirmationCode);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authentication API route
app.post('/cognito/authenticate', async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await authenticateUser(username, password);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Status endpoint to check if server is running
app.get('/status', (req, res) => {
  res.json({ status: "API Running" });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});