const SQS = require("@aws-sdk/client-sqs");
const sqsQueueUrl =
  "https://sqs.ap-southeast-2.amazonaws.com/901444280953/n11092505-crack-queue";
  const client = new SQS.SQSClient({
    region: "ap-southeast-2",
  });

const { queryJobDynamoDB} = require('./crack/db');
const { crackFile} = require('./crack/crack')

const runCrackJob = async () => {
  // check sqs for jobs (get 1 job)
  const receiveCommand = new SQS.ReceiveMessageCommand({
    MaxNumberOfMessages: 1,
    QueueUrl: sqsQueueUrl,
    WaitTimeSeconds: 20, // how long to wait for a message before returning if none.
    VisibilityTimeout: 20, // overrides the default for the queue?
  });
  const receiveResponse = await client.send(receiveCommand);
  console.log("Receiving a message", receiveResponse);

  // get id from sqs message
  const { jobId, user } = JSON.parse(
    receiveResponse?.Messages?.[0]?.Body || "{}"
  );
  if (!jobId) {
    console.log("no job id");
    process.exit(0);
  }
  if (!user) {
    console.log("no user");
    return;
  }
  const job = await queryJobDynamoDB(user, jobId);

  // set status of job to started and downloading file

  // download file from s3
  // crack file
  // store result in dynamodb
  await crackFile(job);

  // delete from sqs
  const deleteCommand = new SQS.DeleteMessageCommand({
    QueueUrl: sqsQueueUrl,
    ReceiptHandle: receiveResponse?.Messages?.[0].ReceiptHandle,
  });
  const deleteResponse = await client.send(deleteCommand);
  console.log("Deleted the message", deleteResponse);

};

async function main() {
  while (true) {
    // repeat until no jobs
    try {
      await runCrackJob();
    } catch (e) {
      console.error(e);
    }
  }
}

main();
