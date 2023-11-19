const express = require('express');
const router = express.Router();
const passport = require('../controllers/authController');
const jwt = require('jsonwebtoken'); // Add this line
const secret = process.env.JWT_SECRET;

router.post('/login', (req, res, next) => {
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

    // Return the token to the client
    return res.json({ token });
  })(req, res, next);
});

router.post('/authenticate', (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // If authentication is successful, generate a JWT token
    const token = jwt.sign({ user: user }, process.env.JWT_SECRET);

    // Return the token to the client
    return res.json({ token });
  })(req, res, next);
});

module.exports = router;
