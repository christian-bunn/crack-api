const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:3000`;

// Form submission for login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async function(event) {
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
        if (result.status === 'MFA_REQUIRED') {
            // Prompt user for MFA code, passing password
            promptMfaCode(username, password, result.session);
        } else if (result.status === 'MFA_SETUP_REQUIRED') {
            // Redirect to MFA setup page
            localStorage.setItem('username', username);
            localStorage.setItem('session', result.session);
            window.location.href = 'mfa_setup.html';
        } else if (result.status === 'SUCCESS') {
            // Authentication successful
            loginMessageDiv.textContent = "Login successful!";
            localStorage.setItem('accessToken', result.accessToken);
            localStorage.setItem('idToken', result.idToken);
            // Redirect to cracker.html
            window.location.href = 'cracker.html';
        } else {
            loginMessageDiv.textContent = `Login failed: ${result.message}`;
        }
    } else {
        loginMessageDiv.textContent = `Login failed: ${result.error}`;
    }
    } catch (error) {
      console.error('Error during login:', error);
      loginMessageDiv.textContent = "An error occurred during login.";
    }
  });
}

// Form submission for signup
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async function(event) {
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
                localStorage.setItem('username', username);
                console.log({ result });
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
}

// Form submission for confirmation
const confirmForm = document.getElementById('confirmForm');
if (confirmForm) {
    confirmForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const confirmationCode = document.getElementById('confirmationCode').value;
        const username = localStorage.getItem('username');
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
                messageDiv.textContent = "Confirmation successful!";
                window.location.href = 'index.html';
            } else {
                messageDiv.textContent = `Confirmation failed: ${result.error}`;
            }
        } catch (error) {
            console.error('Error during confirmation:', error);
            messageDiv.textContent = "An error occurred during confirmation.";
        }
    });
}

// Upload file function
const uploadForm = document.getElementById('uploadForm');
if (uploadForm) {
  uploadForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const uploadMessage = document.getElementById('uploadMessage');

    // Retrieve the access token from localStorage
    const accessToken = localStorage.getItem('accessToken');

    // Check if accessToken exists
    if (!accessToken) {
      uploadMessage.textContent = 'You are not logged in. Please log in to upload files.';
      return;
    }

    try {
      // Getting presigned URL
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      });

      const result = await response.json();

      if (response.ok) {
        const presignedURL = result.url;

        // Uploading file to S3 through presigned URL
        const uploadResponse = await fetch(presignedURL, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });

        if (uploadResponse.ok) {
          uploadMessage.textContent = 'File uploaded successfully!';
          listFiles();
        } else {
          uploadMessage.textContent = 'Failed to upload file to S3.';
        }
      } else {
        uploadMessage.textContent = `Failed to get presigned URL: ${result.message}`;
      }
    } catch (error) {
      console.error('Error during file upload:', error);
      uploadMessage.textContent = 'An error occurred during file upload.';
    }
  });
}



// List files function
async function listFiles() {
    const fileList = document.getElementById('fileList');
    const crackFileSelect = document.getElementById('crackFileSelect');
    
    // If neither element exists, exit the function
    if (!fileList && !crackFileSelect) return;
  
    // Clear existing content
    if (fileList) fileList.innerHTML = '';
    if (crackFileSelect) crackFileSelect.innerHTML = '';
  
    const accessToken = localStorage.getItem('accessToken');
  
    try {
      const response = await fetch(`${API_BASE_URL}/files`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      });
  
      const files = await response.json();
  
      if (response.ok) {
        if (files.length === 0) {
          if (fileList) fileList.textContent = 'No files for this user.';
          if (crackFileSelect) {
            const option = document.createElement('option');
            option.textContent = 'No files available';
            option.disabled = true;
            crackFileSelect.appendChild(option);
          }
        } else {
          files.forEach(fileName => {
            // Populate fileList
            if (fileList) {
              const listItem = document.createElement('li');
              listItem.textContent = fileName;
  
              const downloadButton = document.createElement('button');
              downloadButton.textContent = 'Download';
              downloadButton.addEventListener('click', () => downloadFile(fileName));
              listItem.appendChild(document.createElement('br'));
              listItem.appendChild(downloadButton);
              fileList.appendChild(listItem);
            }
  
            // Populate crackFileSelect
            if (crackFileSelect) {
              const option = document.createElement('option');
              option.value = fileName;
              option.textContent = fileName;
              crackFileSelect.appendChild(option);
            }
          });
        }
      } else {
        if (fileList) fileList.textContent = 'Failed to retrieve files.';
        if (crackFileSelect) {
          const option = document.createElement('option');
          option.textContent = 'Failed to retrieve files';
          option.disabled = true;
          crackFileSelect.appendChild(option);
        }
      }
    } catch (error) {
      console.error('Error listing files:', error);
      if (fileList) fileList.textContent = 'An error occurred while listing files.';
      if (crackFileSelect) {
        const option = document.createElement('option');
        option.textContent = 'Error loading files';
        option.disabled = true;
        crackFileSelect.appendChild(option);
      }
    }
}

// Download file function
async function downloadFile(filename) {
  const accessToken = localStorage.getItem('accessToken');

  try {
      const response = await fetch(`${API_BASE_URL}/download/${filename}`, {
          method: 'GET',
          headers: {
              'Authorization': 'Bearer ' + accessToken,
          },
      });

      const result = await response.json();

      if (response.ok) {
          const presignedURL = result.url;

          // Create an anchor element and trigger the download
          const link = document.createElement('a');
          link.href = presignedURL;
          link.download = filename; // Set the filename
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

      } else {
          console.error('Error getting presigned URL:', result.message);
      }
  } catch (error) {
      console.error('Error downloading file:', error);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // check if we're on cracker.html by checking for a unique element
  const fileList = document.getElementById('fileList');
  if (fileList) {
      listFiles();
  }
  // code to check if the user is an admin
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
      const decodedToken = jwt_decode(accessToken);
      const groups = decodedToken['cognito:groups'] || [];
      if (groups.includes('admin')) {
          // User is admin, display the exit button
          const exitButton = document.createElement('button');
          const exitButtonTitle = document.createElement('h2');
          exitButtonTitle.textContent = 'Admin Controls:';
          exitButton.textContent = 'Exit Server';
          exitButton.addEventListener('click', () => {
              exitServer();
          });
          document.body.appendChild(exitButton);
      }
  }
  else {
      console.log('User is not an admin.');
  }
});


// function to call the /exit endpoint
function exitServer() {
  const accessToken = localStorage.getItem('accessToken');
  fetch(`${API_BASE_URL}/exit`, {
      method: 'POST',
      headers: {
          'Authorization': 'Bearer ' + accessToken,
      },
  })
  .then((response) => {
      if (response.ok) {
          alert('Server is exiting.');
      } else {
          alert('Failed to exit server.');
      }
  })
  .catch((error) => {
      console.error('Error exiting server:', error);
      alert('An error occurred while exiting the server.');
  });
}

const responseContainer = document.getElementById('crackOutput');
const crackForm = document.getElementById('crackForm');
if (crackForm) {
  crackForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    responseContainer.innerHTML = '';
    const crackFileSelect = document.getElementById('crackFileSelect');
    const crackMask = document.getElementById('crackMask');
    const mask = crackMask.value;
    const fileName = crackFileSelect.value;
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`${API_BASE_URL}/crack/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
        },
        body: JSON.stringify({ fileName, mask }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let done = false;
      while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          const chunk = decoder.decode(value, { stream: !done });
          responseContainer.innerHTML += chunk;
      }

      if (response.ok) {
        // this displays the cracking result to the user (completed or failed)
        console.warn(`Cracking completed:\n${result.result}`);
      } else {
        console.warn(`Cracking failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Error starting crack:', error);
      console.warn('An error occurred while starting the crack.');
    }
  });
}

// function to display the MFA setup form
async function initiateMfaSetup() {
  const username = localStorage.getItem('username');
  const session = localStorage.getItem('session');

  try {
    // call the /cognito/associateMFA endpoint
    const response = await fetch(`${API_BASE_URL}/cognito/associateMFA`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session })
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem('session', result.Session);
      displayMfaSetup(result);
    } else {
      console.error('Error during MFA association:', result.error);
    }
  } catch (error) {
    console.error('Error during MFA association:', error);
  }
}

// function to display the MFA setup form
function displayMfaSetup(mfaData) {
  const mfaSetupDiv = document.getElementById('mfaSetup');
  const qrCodeContainer = document.getElementById('qrCodeContainer');
  const secretKeyP = document.getElementById('secretKey');

  // generate QR code data
  const secretCode = mfaData.SecretCode;
  const username = localStorage.getItem('username');
  const qrCodeData = `otpauth://totp/FileCracker:${username}?secret=${secretCode}&issuer=FileCracker`;

  // clear any existing QR code
  qrCodeContainer.innerHTML = '';

  // generate QR code using QRCode.js
  new QRCode(qrCodeContainer, {
    text: qrCodeData,
    width: 200,
    height: 200,
  });

  // display the Secret Key
  secretKeyP.textContent = secretCode;

  // show the MFA setup section
  mfaSetupDiv.style.display = 'block';
}

// form submission for MFA verification in mfa_setup.html
const verifyMfaForm = document.getElementById('verifyMfaForm');
if (verifyMfaForm) {
  verifyMfaForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      const totpCode = document.getElementById('totpCode').value;
      const password = document.getElementById('password').value;
      const session = localStorage.getItem('session');
      const username = localStorage.getItem('username');
      const messageDiv = document.getElementById('mfaMessage');

      try {
          const response = await fetch(`${API_BASE_URL}/cognito/verifyMFA`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ totpCode, session, username }),
          });

          const result = await response.json();
          if (response.ok) {
              messageDiv.textContent = "MFA verification successful! Redirecting to File Cracking Service page...";
              // clear sensitive data
              localStorage.removeItem('session');
              localStorage.removeItem('username');
              localStorage.setItem('accessToken', result.accessToken);
              localStorage.setItem('idToken', result.idToken);
              console.log({ result });
              // redirect to login page with a wait
              setTimeout(() => {
                  window.location.href = 'cracker.html';
              }, 2000);
          } else {
              messageDiv.textContent = `MFA verification failed: ${result.error}`;
          }
      } catch (error) {
          console.error('Error during MFA verification:', error);
          messageDiv.textContent = "An error occurred during MFA verification.";
      }
  });
}


// function to prompt the user for MFA code
function promptMfaCode(username, password, session) {
  const loginForm = document.getElementById('loginForm');
  const loginMessageDiv = document.getElementById('loginMessage');

  // hide the login form
  loginForm.style.display = 'none';

  // create MFA code input form
  const mfaForm = document.createElement('form');
  mfaForm.id = 'mfaForm';

  const label = document.createElement('label');
  label.setAttribute('for', 'mfaCode');
  label.textContent = 'Enter MFA Code:';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'mfaCode';
  input.name = 'mfaCode';
  input.required = true;

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Verify';

  mfaForm.appendChild(label);
  mfaForm.appendChild(input);
  mfaForm.appendChild(button);

  document.body.appendChild(mfaForm);

  mfaForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const mfaCode = input.value;

    try {
      const response = await fetch(`${API_BASE_URL}/cognito/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, mfaCode, session })
      });

      const result = await response.json();
      if (response.ok) {
        loginMessageDiv.textContent = "Login successful!";
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('idToken', result.idToken);
        // Redirect to cracker.html
        window.location.href = 'cracker.html';
      } else {
        loginMessageDiv.textContent = `MFA verification failed: ${result.error}`;
      }
    } catch (error) {
      console.error('Error during MFA verification:', error);
      loginMessageDiv.textContent = "An error occurred during MFA verification.";
    }
  });
}

// Function to list user jobs
document.getElementById('refreshJobsButton').addEventListener('click', listUserJobs);
async function listUserJobs() {
  const jobList = document.getElementById('jobList'); // Ensure there's an element with this ID

  if (!jobList) return; // Exit if element does not exist

  jobList.innerHTML = ''; // Clear existing content

  const accessToken = localStorage.getItem('accessToken');
  
  try {
    const response = await fetch(`${API_BASE_URL}/userJobs`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
      },
    });

    const jobs = await response.json();

    if (response.ok) {
      if (jobs.length === 0) {
        jobList.textContent = 'No jobs found for this user.';
      } else {
        jobs.forEach(job => {
          const listItem = document.createElement('li');
          listItem.textContent = `Job ID: ${job.jobId}, File: ${job.file}, Mask: ${job.mask}, Status: ${job.status}`;
          jobList.appendChild(listItem);
        });
      }
    } else {
      jobList.textContent = 'Failed to retrieve user jobs.';
    }
  } catch (error) {
    console.error('Error listing user jobs:', error);
    jobList.textContent = 'An error occurred while listing user jobs.';
  }
}