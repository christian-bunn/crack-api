require("dotenv").config();
const S3 = require("@aws-sdk/client-s3");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const S3Presigner = require("@aws-sdk/s3-request-presigner");
const bucketName = "n11092505-assessment-2";
const Memcached = require('memcached');
const memcached = new Memcached('n11092505-cache.km2jzi.0001.apse2.cache.amazonaws.com:11211');
const s3Client = new S3.S3Client({ region: "ap-southeast-2" });

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
    const presignedURL = await S3Presigner.getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    console.log("Pre-signed URL to put the object:");
    console.log(presignedURL);
    return presignedURL;
  } catch (err) {
    console.log(err);
  }
};

// download file (file id) returns (signed url)
// provide endpoint to download file from s3, send signed url to front end
// when the user requests a given {file id}, generate a signed url for the file at {user sub}/{file id}
const { promisify } = require('util');
const memcachedGet = promisify(memcached.get).bind(memcached);
const memcachedSet = promisify(memcached.set).bind(memcached);
const downloadFile = async (folder, fileName) => {
  const cacheKey = `${folder}/${fileName}`;

  // this checks if the signed url is in cache and that it hasn't expired
  try {
    const dataStr = await memcachedGet(cacheKey);
    if (dataStr) {
      const data = JSON.parse(dataStr);
      console.log('Returning cached presigned URL for:', cacheKey);
      return data.url;
    }
  } catch (err) {
    console.error('Error getting from memcached:', err);
    // proceed to generate a new url
  }

  // this trys to create a pre-signed URL for getting an object from s3
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

    // storing the url and expiry in cache
    try {
      await memcachedSet(cacheKey, JSON.stringify({ url: presignedURL }), expiresIn);
    } catch (err) {
      console.error('Error setting to memcached:', err);
      // even if setting to cache failed, the url can still be returned
    }

    return presignedURL;
  } catch (err) {
    console.log(err);
    throw err;
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
    console.error("Error listing files from S3:", err);
    throw err; // Re-throw the error to be handled by the caller
  }
};

// delete file (file id) returns ()
// provide endpoint to delete file from s3
// delete file at {user sub}/{file id} using the s3 sdk

module.exports = {
  uploadFile,
  downloadFile,
  listFiles,
};
