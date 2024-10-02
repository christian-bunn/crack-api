const Cognito = require("@aws-sdk/client-cognito-identity-provider");

const client = new Cognito.CognitoIdentityProviderClient({ region: 'ap-southeast-2' });

async function associateSoftwareToken(session) {
  try {
    const command = new Cognito.AssociateSoftwareTokenCommand({
      Session: session,
    });

    const response = await client.send(command);
    return {
      Session: response.Session,
      SecretCode: response.SecretCode,
    };
  } catch (error) {
    console.error("Error during associateSoftwareToken:", error.message);
    throw new Error(error.message);
  }
}

async function verifySoftwareToken(session, totpCode, username) {
  try {
    const command = new Cognito.VerifySoftwareTokenCommand({
      Session: session,
      UserCode: totpCode,
      FriendlyDeviceName: 'My Device',
    });

    const response = await client.send(command);
    if (response.Status === 'SUCCESS') {
      // Respond to the next challenge to complete authentication
      const respondCommand = new Cognito.RespondToAuthChallengeCommand({
        ChallengeName: 'MFA_SETUP',
        Session: response.Session,
        ClientId: '7outo577k5qf43qegboraga6kr',
        ChallengeResponses: {
          USERNAME: username,
          ANSWER: 'SUCCESS', // had to include a success answer which I wans't doing
        },
      });

      const finalResponse = await client.send(respondCommand);

      // setting the user's MFA preferences 
      const accessToken = finalResponse.AuthenticationResult.AccessToken;
      await setUserMFAPreference(accessToken);

      return finalResponse;
    } else {
      throw new Error('MFA verification failed.');
    }
  } catch (error) {
    console.error("Error during verifySoftwareToken:", error.message);
    throw new Error(error.message);
  }
}

async function setUserMFAPreference(accessToken) {
  try {
    const command = new Cognito.SetUserMFAPreferenceCommand({
      AccessToken: accessToken,
      SoftwareTokenMfaSettings: {
        Enabled: true,
        PreferredMfa: true,
      },
    });

    const response = await client.send(command);
    console.log("MFA preferences set:", response);
    return response;
  } catch (error) {
    console.error("Error during setUserMFAPreference:", error.message);
    throw new Error(error.message);
  }
}

module.exports = {
  associateSoftwareToken,
  verifySoftwareToken,
  setUserMFAPreference,
};