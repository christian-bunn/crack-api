require("dotenv").config();
const S3 = require("@aws-sdk/client-s3");
const S3Presigner = require("@aws-sdk/s3-request-presigner");
const bucketName = 'n11092505-assessment-2'
const s3Client = new S3.S3Client({ region: 'ap-southeast-2' });

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
    // TODO: Implement the cache
    // check if signed url is in cache or expired already
    // if it is, return the signed url
    // if not, generate a new signed url
    // store the signed url in cache
    // return the signed url

    // Create a pre-signed URL for getting an object
    try {
        const command = new S3.GetObjectCommand({
                Bucket: bucketName,
                Key: `${folder}/${fileName}`,
            });
        const presignedURL = await S3Presigner.getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log('Pre-signed URL to get the object:')
        console.log(presignedURL);
        return presignedURL;
    } catch (err) {
        console.log(err);
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
