const express = require('express');
const cors = require('cors');
const { signUpUser } = require('./cognito/signUp');
const { confirmSignUp } = require('./cognito/confirm');
const { authenticateUser } = require('./cognito/authenticate');
const { uploadFile, downloadFile, listFiles } = require('./crack/s3');
const { authenticateMiddleware } = require('./cognito/jwt_middleware_verify');
const { associateSoftwareToken, verifySoftwareToken, setUserMFAPreference } = require('./cognito/mfa');
const { addCrackjobToQueue } = require('./sqs/sqs');
const { randomId, putJobInDynamoDB } = require('./crack/db');
const { queryUserJobsDynamoDB } = require('./crack/db');
const { startCrackerTask } = require('./crack/ecs');

const app = express();
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: ['https://cracker.cab432.com', 'https://cracker.cab432.com:3000', 'http://127.0.0.1:8080'], // Replace with your frontend application's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// manually setting the headers for consistent cors behaviour
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.static('frontend/http'));

// sign-up API route
app.post('/cognito/signUp', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const response = await signUpUser(username, password, email);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// confirmation API route
app.post('/cognito/confirm', async (req, res) => {
  const { username, confirmationCode } = req.body;
  try {
    const response = await confirmSignUp(username, confirmationCode);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// authentication API route
app.post('/cognito/authenticate', async (req, res) => {
  const { username, password, mfaCode, session } = req.body;
  try {
    const response = await authenticateUser(username, password, mfaCode, session);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ error: error.message });
  }
});

// upload API route
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

// list files API route
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

// download API route
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

// crack API route
app.post('/crack/start', authenticateMiddleware, async (req, res) => {
  let job = null;
  try {
    const { fileName, mask } = req.body;
    const jobId = randomId(10);
    const user = req.user.sub;
    job = { 
      user: user,
      jobId: jobId,
      file: fileName,
      mask: mask,
      status: 'submitted'
    }
    await putJobInDynamoDB(job);
    await addCrackjobToQueue({ jobId, user });
    await startCrackerTask();
    res.status(200).json(job);
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

// endpoint to setup MFA
app.post('/cognito/setupMFA', authenticateMiddleware, async (req, res) => {
  const { username } = req.body;
  try {
    const response = await associateSoftwareToken(req.user.accessToken);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// endpoint to verify MFA
app.post('/cognito/verifyMFA', async (req, res) => {
  const { totpCode, session, username } = req.body;
  try {
    const response = await verifySoftwareToken(session, totpCode, username);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error during MFA verification:', error);
    res.status(500).json({ error: error.message });
  }
});


// endpoint to associate MFA
app.post('/cognito/associateMFA', async (req, res) => {
  const { session } = req.body;
  try {
    const response = await associateSoftwareToken(session);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error during MFA association:', error);
    res.status(500).json({ error: error.message });
  }
});

// user jobs API route
app.get('/userJobs', authenticateMiddleware, async (req, res) => {
  try {
    const user = req.user.sub;
    const jobs = await queryUserJobsDynamoDB(user);
    res.json(jobs);
  } catch (error) {
    console.error('Error retrieving user jobs:', error);
    res.status(500).json({ message: 'Failed to retrieve user jobs.' });
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