const express = require('express');
const { signUpUser } = require('./cognito/signUp');
const { confirmSignUp } = require('./cognito/confirm');
const { authenticateUser } = require('./cognito/authenticate');
const { uploadFile, downloadFile, listFiles } = require('./crack/s3');
const { authenticateMiddleware } = require('./cognito/jwt_middleware_verify');
const { crackFile } = require('./crack/crack');

const app = express();
app.use(express.json());

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

app.post('/upload', authenticateMiddleware, async (req, res) => {
  try {
    const { fileName, contentType } = req.body;
    const folder = req.user.sub;
    const url = await uploadFile(folder, fileName, contentType);
    res.json({ url });
  } catch (error) {
    console.error('Error uploading file', error);
    res.status(500).json({ message: 'Failed to upload file.' });
  }
});

app.get('/files', authenticateMiddleware, async (req, res) => {
  try {
    const folder = req.user.sub;
    const files = await listFiles(folder);
    const fileNames = files.map(file => file.Key.replace(`${folder}/`, ''));
    res.json(fileNames);
  } catch (error) {
    console.error('Error listing files', error);
    res.status(500).json({ message: 'Failed to list files.' });
  }
});


app.get('/download/:filename', authenticateMiddleware, async (req, res) => {
  try {
    const filename = req.params.filename;
    const folder = req.user.sub;
    const url = await downloadFile(folder, filename);
    res.json({ url });
  } catch (error) {
    console.error('Error generating download URL', error);
    res.status(500).json({ message: 'Failed to generate download URL.' });
  }
});

app.post('/crack/start', authenticateMiddleware, async (req, res) => {
  try {
    const folder = req.user.sub;
    const { fileName, mask } = req.body;
    await crackFile(folder, fileName, mask, res);
  } catch (error) {
    console.error('Error cracking', error);
    res.status(500).json({ message: 'Failed to crack' });
  }
});

// middleware function to check if user is an admin
function adminMiddleware(req, res, next) {
  if (req.user && req.user.groups && req.user.groups.includes('admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
}

// // exit endpoint to exit the server
app.post('/exit', authenticateMiddleware, adminMiddleware, (req, res) => {
  res.send('Server is exiting.');
  console.log('Server is exiting as per admin request.');
  process.exit(0); // Exit the server
});

// Status endpoint to check if server is running
app.get('/status', (req, res) => {
  res.json({ status: "API Running" });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});