const AWS = require("aws-sdk");

AWS.config.update({ region: "ap-southeast-2" });

const ecs = new AWS.ECS();

const params = {
  cluster: "n11092505",
  taskDefinition: "cracker",
  count: 1,
  launchType: "FARGATE",
  networkConfiguration: {
    awsvpcConfiguration: {
      subnets: ["subnet-05a3b8177138c8b14"],
      assignPublicIp: "ENABLED",
    },
  },
};

const startCrackerTask = () =>
  new Promise((resolve, reject) => {
    ecs.runTask(params, (err, data) => {
      if (err) {
        console.error("Error starting task:", err);
        reject();
      } else {
        console.log("Task started successfully:", data);
        resolve();
      }
    });
  });

module.exports = {
  startCrackerTask,
};
