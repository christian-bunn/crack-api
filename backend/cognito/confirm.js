const Cognito = require("@aws-sdk/client-cognito-identity-provider");

const clientId = "7outo577k5qf43qegboraga6kr";

async function confirmSignUp(username, confirmationCode) {
  const client = new Cognito.CognitoIdentityProviderClient({ region: 'ap-southeast-2' });

  try {
    const command = new Cognito.ConfirmSignUpCommand({
      ClientId: clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
    });

    const res = await client.send(command);
    console.log("Confirmation Success:", res);
    return res;
  } catch (error) {
    console.error("Error during confirmation:", error.message);
    throw new Error(error.message);
  }
}

module.exports = { confirmSignUp };
