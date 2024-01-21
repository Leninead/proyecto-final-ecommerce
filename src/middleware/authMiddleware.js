// authMiddleware.js

const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateUser(req, res, next) {
  // Get the token from the request header
  const token = req.header('x-auth-token');

  // Check if token is present
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Attach the user to the request
    req.user = decoded.user;

    // Move to the next middleware
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
}

module.exports = authenticateUser;
