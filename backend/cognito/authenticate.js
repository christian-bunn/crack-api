const Cognito = require("@aws-sdk/client-cognito-identity-provider");
const jwt = require("aws-jwt-verify");

const userPoolId = "ap-southeast-2_mur9gJo4c"; // Obtain from AWS console
const clientId = "7outo577k5qf43qegboraga6kr"; // match signUp.js

const accessVerifier = jwt.CognitoJwtVerifier.create({
  userPoolId: userPoolId,
  tokenUse: "access",
  clientId: clientId,
});

const idVerifier = jwt.CognitoJwtVerifier.create({
  userPoolId: userPoolId,
  tokenUse: "id",
  clientId: clientId,
});

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
    const accessToken = await accessVerifier.verify(res.AuthenticationResult.AccessToken);
    const idToken = await idVerifier.verify(res.AuthenticationResult.IdToken);

    console.log("Access Token Verified:", accessToken);
    console.log("ID Token Verified:", idToken);

    return { accessToken, idToken };
  } catch (error) {
    console.error("Error during authentication:", error.message);
    throw new Error(error.message);
  }
}

module.exports = { authenticateUser };
