// authentication.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../generate-secret');

function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No Token Found - Unauthorized');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Received Token:', token);

  jwt.verify(token, jwtSecret, (error, decodedUser) => {
    if (error) {
      console.log('Token Verification Failed - Unauthorized');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log('Decoded User:', decodedUser);
    req.user = decodedUser;
    next();
  });
}

module.exports = authenticationMiddleware;
