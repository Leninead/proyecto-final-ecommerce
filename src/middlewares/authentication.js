const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function authenticationMiddleware(req, res, next) {
  // Commenting out the token verification logic for testing
  // const authHeader = req.headers.authorization;
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   console.log('No Token Found - Unauthorized');
  //   return res.status(401).json({ message: 'Unauthorized' });
  // }
  // const token = authHeader.split(' ')[1];
  // console.log('Received Token:', token);

  // Uncomment the next line to mock a decoded user for testing
  // req.user = { userId: 'mockUserId', username: 'mockUsername' };

  // Commenting out the token verification logic for testing
  // jwt.verify(token, JWT_SECRET, (error, decodedUser) => {
  //   if (error) {
  //     console.log('Token Verification Failed - Unauthorized');
  //     return res.status(401).json({ message: 'Unauthorized' });
  //   }
  //   console.log('Decoded User:', decodedUser);
  //   req.user = decodedUser;
  //   next();
  // });

  // Mocking a decoded user for testing
  next();
}

module.exports = authenticationMiddleware;
