const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authenticationMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No Token Found - Unauthorized');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  // Log the received token for debugging
  console.log('Received Token:', token);

  jwt.verify(token, JWT_SECRET, (error, decodedUser) => {
    if (error) {
      console.log('Token Verification Failed - Unauthorized');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Log the decoded user for debugging
    console.log('Decoded User:', decodedUser);

    req.user = decodedUser; // Set the decoded user in the request object
    next();
  });
}

module.exports = authenticationMiddleware;
