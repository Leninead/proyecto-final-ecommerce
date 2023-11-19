const express = require('express');
const router = express.Router();
const passport = require('../controllers/authController');
const jwt = require('jsonwebtoken'); // Add this line
const secret = process.env.JWT_SECRET;

// Middleware for generating JWT token after successful authentication
const generateToken = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // If authentication is successful, generate a JWT token here
    const payload = { userId: user._id, username: user.username };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    // Attach the token to the request object for further use if needed
    req.token = token;

    // Continue to the next middleware or route handler
    next();
  })(req, res, next);
};

router.post('/login', generateToken, (req, res) => {
  // Return the token to the client
  res.json({ token: req.token });
});

// You can keep the /authenticate route if needed for a different purpose

module.exports = router;
