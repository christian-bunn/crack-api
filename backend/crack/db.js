require("dotenv").config();
const DynamoDB = require("@aws-sdk/client-dynamodb");
const DynamoDBLib = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDB.DynamoDBClient({ region: "ap-southeast-2" });
const docClient = DynamoDBLib.DynamoDBDocumentClient.from(client);
const tableName = 'n11092505-assessment2-file-metadata';

// function for putting an object in dynamodb
const putItemInDynamoDB = async (sub, fileName, data) => {
    command = new DynamoDBLib.PutCommand({
        TableName: tableName,
        Item: {
            ...data,
            'qut-username': 'n11092505@qut.edu.au',
            user: sub,
            file: fileName
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
const queryDynamoDB = async (sub, fileName) => {
    command = new DynamoDBLib.GetCommand({
        TableName: tableName,
        Key: {
            user: sub,
            file: fileName
        },
      });
      try {
        const response = await docClient.send(command);
        console.log("Get command response:", response);
      } catch (err) {
        console.log(err);
      }
};

module.exports = {
    putItemInDynamoDB,
    queryDynamoDB,
};
