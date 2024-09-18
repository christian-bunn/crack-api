require("dotenv").config();
const S3 = require("@aws-sdk/client-s3");
const S3Presigner = require("@aws-sdk/s3-request-presigner");

const bucketName = 'n11092505-assessment-2'
const objectKey = 'crack-bucket'

// Creating a client for sending commands to S3
const s3Client = new S3.S3Client({ region: 'ap-southeast-2' });

// note: store the files in s3 based on username ("sub": "d9ae4408-f031-7010-d902-7422e61d7ad2") - sub means subject and is the id of the user
// note: make sure public access to the s3 is disabled (block all public access)
// note: your application needs an IAM role with all permissions on the s3 bucket with a access key and secret key

// upload file () returns (signed url)
// provide endpoint to upload file to s3
// create id for file
// returns a signed url that the front end can use to upload the file direct to s3 at {user sub}/{file id}
const uploadFile = async (sub) => {
    const fileId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // Create a pre-signed URL for putting an object
    try {
        const command = new S3.PutObjectCommand({
                Bucket: bucketName,
                Key: `${sub}/${fileId}`,
            });
        const presignedURL = await S3Presigner.getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log('Pre-signed URL to put the object:')
        console.log(presignedURL);
        return presignedURL;
    } catch (err) {
        console.log(err);
    }
}


// download file (file id) returns (signed url)
// provide endpoint to download file from s3, send signed url to front end
// when the user requests a given {file id}, generate a signed url for the file at {user sub}/{file id}
const downloadFile = async (sub, fileId) => {
    // Create a pre-signed URL for getting an object
    try {
        const command = new S3.GetObjectCommand({
                Bucket: bucketName,
                Key: `${sub}/${fileId}`,
            });
        const presignedURL = await S3Presigner.getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log('Pre-signed URL to get the object:')
        console.log(presignedURL);
        return presignedURL;
    } catch (err) {
        console.log(err);
    }
}


// list files () returns (file ids)
// provide endpoint to list all files for that user
// list all files in {user sub} using the s3 sdk
const listFiles = async (sub) => {
    // Create a pre-signed URL for getting an object
    try {
        const command = new S3.ListObjectsCommand({
            'Bucket': bucketName,
            'Prefix': sub,
        });
        const response = await s3Client.send(command);
        return response.Contents;
    } catch (err) {
        console.log(err);
    }
}

// delete file (file id) returns ()
// provide endpoint to delete file from s3
// delete file at {user sub}/{file id} using the s3 sdk
