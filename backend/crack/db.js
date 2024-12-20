require("dotenv").config();
const DynamoDB = require("@aws-sdk/client-dynamodb");
const DynamoDBLib = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDB.DynamoDBClient({ region: "ap-southeast-2" });
const docClient = DynamoDBLib.DynamoDBDocumentClient.from(client);
const tableName = 'n11092505-assessment3-job-metadata-v2';

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
        throw err;
      }
};

// function for making a query to dynamodb
const queryDynamoDB = async (sub, fileName) => {
  const command = new DynamoDBLib.GetCommand({
    TableName: tableName,
    Key: {
      user: sub,
      file: fileName,
    },
  });
  try {
    const response = await docClient.send(command);
    console.log("Get command response:", response);
    return response.Item;
  } catch (err) {
    console.log(err);
    throw err; 
  }
};

const randomId = function(length = 6) {
  return Math.random().toString(36).substring(2, length+2);
};

const queryUserJobsDynamoDB = async (user) => {
    // get document from dynamodb
    const command = new DynamoDBLib.ScanCommand({
      TableName: tableName, 
      FilterExpression: '#user = :user',
      ExpressionAttributeNames: {
        '#user': 'user',
      },
      ExpressionAttributeValues: {
        ':user': user,
      },
    });
    const response = await docClient.send(command);
    const job = response.Items;
    return job;
};

module.exports = {
    putJobInDynamoDB,
    queryDynamoDB,
    randomId,
    queryUserJobsDynamoDB,
};
