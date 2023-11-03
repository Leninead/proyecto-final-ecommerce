const express = require('express');
const router = express.Router();
const passport = require('../authController');

router.post('/authenticate', (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // If authentication is successful, you can generate a JWT token here and send it back to the client.
    // For generating a JWT token, you can use the 'jsonwebtoken' library.
    // Here's a simplified example:

    const token = jwt.sign({ user: user }, process.env.JWT_SECRET);

    // Return the token to the client
    return res.json({ token });
  })(req, res, next);
});

module.exports = router;
