require("dotenv").config();
const S3 = require("@aws-sdk/client-s3");
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const S3Presigner = require("@aws-sdk/s3-request-presigner");
const bucketName = 'n11092505-assessment-2'
const s3Client = new S3.S3Client({ region: 'ap-southeast-2' });

const cache = {};

// note: store the files in s3 based on username ("sub": "d9ae4408-f031-7010-d902-7422e61d7ad2") - sub means subject and is the id of the user
// note: make sure public access to the s3 is disabled (block all public access)
// note: your application needs an IAM role with all permissions on the s3 bucket with a access key and secret key

// upload file () returns (signed url)
// provide endpoint to upload file to s3
// create id for file
// returns a signed url that the front end can use to upload the file direct to s3 at {user sub}/{file id}
const uploadFile = async (folder, fileName, contentType) => {
    try {
      const command = new S3.PutObjectCommand({
        Bucket: bucketName,
        Key: `${folder}/${fileName}`,
        ContentType: contentType,
      });
      const presignedURL = await S3Presigner.getSignedUrl(s3Client, command, { expiresIn: 3600 });
      console.log('Pre-signed URL to put the object:');
      console.log(presignedURL);
      return presignedURL;
    } catch (err) {
      console.log(err);
    }
};


// download file (file id) returns (signed url)
// provide endpoint to download file from s3, send signed url to front end
// when the user requests a given {file id}, generate a signed url for the file at {user sub}/{file id}
const downloadFile = async (folder, fileName) => {
  const cacheKey = `${folder}/${fileName}`;
  const currentTime = Date.now();

  // Check if signed URL is in cache and hasn't expired
  if (cache[cacheKey]) {
      if (cache[cacheKey].expiry > currentTime) {
          console.log('Returning cached presigned URL for:', cacheKey);
          return cache[cacheKey].url;
      } else {
          // Remove expired URL from cache
          delete cache[cacheKey];
      }
  }

  // Create a pre-signed URL for getting an object
  try {
      const command = new GetObjectCommand({
          Bucket: bucketName,
          Key: cacheKey,
          ResponseContentDisposition: `attachment; filename="${fileName}"`,
      });
      const expiresIn = 3600; // 1 hour
      const presignedURL = await getSignedUrl(s3Client, command, { expiresIn });
      console.log('Pre-signed URL to get the object:');
      console.log(presignedURL);

      // Store the URL and its expiry time in cache
      cache[cacheKey] = {
          url: presignedURL,
          expiry: currentTime + expiresIn * 1000, // expiry time in milliseconds
      };

      return presignedURL;
  } catch (err) {
      console.log(err);
      throw err; // Re-throw the error so the caller can handle it
  }
};


// list files () returns (file ids)
// provide endpoint to list all files for that user
// list all files in {user sub} using the s3 sdk
const listFiles = async (folder) => {
    try {
        const command = new S3.ListObjectsCommand({
        Bucket: bucketName,
        Prefix: folder,
      });
        const response = await s3Client.send(command);
        // Return an empty array if Contents is undefined
        return response.Contents || [];
    } catch (err) {
        console.error('Error listing files from S3:', err);
        throw err; // Re-throw the error to be handled by the caller
    }
  };

// delete file (file id) returns ()
// provide endpoint to delete file from s3
// delete file at {user sub}/{file id} using the s3 sdk


module.exports = {
    uploadFile,
    downloadFile,
    listFiles
};
