const express = require('express');
const router = express.Router();
const passport = require('../controllers/authController');
const jwt = require('jsonwebtoken'); // Add this line
const secret = process.env.JWT_SECRET;

// Middleware for generating JWT token after successful authentication
const generateToken = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const payload = { userId: user._id, username: user.username };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    req.token = token;
    next();
  })(req, res, next);
};

router.post('/login', generateToken, (req, res) => {
  res.json({ token: req.token });
});
module.exports = { generateToken };
