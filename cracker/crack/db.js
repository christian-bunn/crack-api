require("dotenv").config();
const DynamoDB = require("@aws-sdk/client-dynamodb");
const DynamoDBLib = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDB.DynamoDBClient({ region: "ap-southeast-2" });
const docClient = DynamoDBLib.DynamoDBDocumentClient.from(client);
const tableName = 'n11092505-assessment3-crack-job';

// function for putting an object in dynamodb
const putJobInDynamoDB = async (data) => {
    command = new DynamoDBLib.PutCommand({
        TableName: tableName,
        Item: {
          'qut-username': 'n11092505@qut.edu.au',
            ...data,
            
        },
      });
      try {
        const response = await docClient.send(command);
        console.log("Put command response:", response);
      } catch (err) {
        console.log(err);
      }
};

// function for making a query to dynamodb
const queryJobDynamoDB = async (user, jobId) => {
    // get document from dynamodb
    const command = new DynamoDBLib.ScanCommand({
      TableName: tableName,
      IndexName: 'user-jobId-index', // Specify the GSI name here
      FilterExpression: '#user = :user and #jobId = :jobId',
      ExpressionAttributeNames: {
        '#user': 'user',
        '#jobId': 'jobId',
      },
      ExpressionAttributeValues: {
        ':user': user,
        ':jobId': jobId,
      },
      Limit: 1, // Limit the results to 1 item
    });
    const response = await docClient.send(command);
    const job = response.Items?.[0];
    return job;
};

module.exports = {
    putJobInDynamoDB,
    queryJobDynamoDB,
};
