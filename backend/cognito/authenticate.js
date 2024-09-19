const Cognito = require("@aws-sdk/client-cognito-identity-provider");

const userPoolId = "ap-southeast-2_mur9gJo4c";
const clientId = "7outo577k5qf43qegboraga6kr";

async function authenticateUser(username, password) {
  const client = new Cognito.CognitoIdentityProviderClient({
    region: "ap-southeast-2",
  });

  try {
    const command = new Cognito.InitiateAuthCommand({
      AuthFlow: Cognito.AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
      },
      ClientId: clientId,
    });

    const res = await client.send(command);
    // Return the tokens as strings
    return {
      accessToken: res.AuthenticationResult.AccessToken,
      idToken: res.AuthenticationResult.IdToken,
    };
  } catch (error) {
    console.error("Error during authentication:", error.message);
    throw new Error(error.message);
  }
}

module.exports = { authenticateUser };