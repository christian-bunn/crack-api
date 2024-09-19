const API_BASE_URL = window.location.hostname === 'ilovequt.lol' ? `https://api.ilovequt.lol` : 'http://127.0.0.1:3000';

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
                loginMessageDiv.textContent = "Login successful!";
                localStorage.setItem('accessToken', result.accessToken);
                // Redirect to cracker.html
                window.location.href = 'cracker.html';
            } else {
                loginMessageDiv.textContent = `Login failed: ${result.message}`;
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
                messageDiv.textContent = "Confirmation successful! Redirecting to login page...";
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
    if (!fileList) return;
  
    fileList.innerHTML = ''; // Clear existing list
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
          fileList.textContent = 'No files for this user.';
        } else {
          files.forEach(fileName => {
            const listItem = document.createElement('li');
            listItem.textContent = fileName;
  
            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download';
            downloadButton.addEventListener('click', () => downloadFile(fileName));
  
            listItem.appendChild(downloadButton);
            fileList.appendChild(listItem);
          });
        }
      } else {
        fileList.textContent = 'Failed to retrieve files.';
      }
    } catch (error) {
      console.error('Error listing files:', error);
      fileList.textContent = 'An error occurred while listing files.';
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
        // Redirect the user to the presigned URL
        window.open(presignedURL);
      } else {
        console.error('Error getting presigned URL:', result.message);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on cracker.html by checking for a unique element
    const fileList = document.getElementById('fileList');
    if (fileList) {
        listFiles();
    }
});