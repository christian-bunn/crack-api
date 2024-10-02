const Cognito = require("@aws-sdk/client-cognito-identity-provider");

const userPoolId = "ap-southeast-2_mur9gJo4c";
const clientId = "7outo577k5qf43qegboraga6kr";

async function authenticateUser(username, password, mfaCode, session) {
  const client = new Cognito.CognitoIdentityProviderClient({
    region: "ap-southeast-2",
  });
  console.log({
    username,
    password,
    mfaCode,
    session,
  })
  try {
    let response;

    if (mfaCode && session) {
      console.log("Responding to MFA challenge");
      const respondCommand = new Cognito.RespondToAuthChallengeCommand({
        ClientId: clientId,
        ChallengeName: 'SOFTWARE_TOKEN_MFA',
        Session: session,
        ChallengeResponses: {
          USERNAME: username,
          SOFTWARE_TOKEN_MFA_CODE: mfaCode,
        },
      });
      response = await client.send(respondCommand);
    } else {
      console.log("Starting authentication");
      // start of authentication
      let params = {
        AuthFlow: Cognito.AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
        ClientId: clientId,
      };

      const command = new Cognito.InitiateAuthCommand(params);
      response = await client.send(command);
    }

    console.log(JSON.stringify(response));

    // check if authentication was successful
    if (response.AuthenticationResult) {
      // authentication successful
      return {
        status: 'SUCCESS',
        accessToken: response.AuthenticationResult.AccessToken,
        idToken: response.AuthenticationResult.IdToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
      };
      // logic to determine what stage of MFA is required for the user
    } else if (response.ChallengeName === 'SOFTWARE_TOKEN_MFA') {
      return {
        status: 'MFA_REQUIRED',
        challengeName: response.ChallengeName,
        session: response.Session,
        message: 'MFA code required.',
      };
    } else if (response.ChallengeName === 'MFA_SETUP') {
      return {
        status: 'MFA_SETUP_REQUIRED',
        challengeName: response.ChallengeName,
        session: response.Session,
        message: 'MFA setup required.',
      };
    } else {
      throw new Error('Authentication failed.');
    }
  } catch (error) {
    console.error("Error during authentication:", error);
    throw new Error(error.message);
  }
}

module.exports = { authenticateUser };