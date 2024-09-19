const { spawn } = require('node:child_process');
const S3 = require("@aws-sdk/client-s3");
const fs = require('fs');
const { putItemInDynamoDB } = require('./db');

// Creating a client for sending commands to S3
const s3Client = new S3.S3Client({ region: 'ap-southeast-2' });
const bucketName = 'n11092505-assessment-2';
// note: uses hashcat to crack the password for a given file

// crack (encrypted_file_id, res) returns (output)
const crackFile = async (folder, fileName, mask, res) => {
    const s3FileName = `${folder}/${fileName}`;
    const localInputFileName = `${folder}-${fileName}`;
    const localOutputFileName = `${folder}-${fileName}.cracked`;
    // the user will provide the encrypted file name
    // the server will download the files from s3
    const command = new S3.GetObjectCommand({
        Bucket: bucketName,
        Key: s3FileName,
    });
    const { Body } = await s3Client.send(command);

    await new Promise((resolve, reject) => {
        Body.pipe(fs.createWriteStream(localInputFileName))
          .on('error', err => reject(err))
          .on('close', () => resolve())
      })
    
    // api to crack a file using the following command
    // hashcat -a 3 -m 1700 --status --status-timer 10 --outfile outfile infile mask
    // the server will run the command
    const hashcat = spawn('hashcat', [
        '-a',
        '3',
        '-m',
        '1700',
        '-O',
        '--potfile-disable',
        '--status', 
        '--status-timer',
        '10',
        '--outfile',
        localOutputFileName,
        '--outfile-format',
        '2',
        localInputFileName,
        mask,
    ]);
    
    hashcat.stdout.on('data', (data) => {
        // stream to res 
        res.write(data);
        console.log(`stdout: ${data}`);
    });

    hashcat.stderr.on('data', (data) => {
        res.write(data);
        console.error(`stderr: ${data}`);
    });

    hashcat.on('close', async (code) => {
        res.end();
        console.log(`child process exited with code ${code}`);
        if (code === 0) {
            const crackedPassword = fs.readFileSync(localOutputFileName, 'utf8');
            await putItemInDynamoDB(folder, s3FileName, {
                password: crackedPassword,
                timeCracked: new Date().toISOString(),
            });
            // delete the local files
            fs.unlinkSync(localInputFileName);
            fs.unlinkSync(localOutputFileName);

        }
    });
    // the server will return the output
}

module.exports = {
    crackFile,
};