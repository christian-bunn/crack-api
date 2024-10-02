const Cognito = require("@aws-sdk/client-cognito-identity-provider");

const clientId = "7outo577k5qf43qegboraga6kr";

async function signUpUser(username, password, email) {
  const client = new Cognito.CognitoIdentityProviderClient({ region: 'ap-southeast-2' });

  try {
    const command = new Cognito.SignUpCommand({
      ClientId: clientId,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    });
    const res = await client.send(command);
    console.log("Sign-up Success:", res);
    return res;
  } catch (error) {
    console.error("Error during sign-up:", error.message);
    throw new Error(error.message);
  }
}

module.exports = { signUpUser };