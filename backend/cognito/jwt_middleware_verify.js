const { CognitoJwtVerifier } = require('aws-jwt-verify');

const userPoolId = 'ap-southeast-2_mur9gJo4c';
const clientId = '7outo577k5qf43qegboraga6kr';


const accessVerifier = CognitoJwtVerifier.create({
  userPoolId: userPoolId,
  tokenUse: 'access',
  clientId: clientId,
});

const authenticateMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header' });
  }
  const token = authHeader.split(' ')[1]; 
  try {
    const payload = await accessVerifier.verify(token);

    req.user = {
      sub: payload.sub,
      groups: payload['cognito:groups'] || [],
    };
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


module.exports = {
  authenticateMiddleware,
};
  