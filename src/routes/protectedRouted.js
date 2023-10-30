// protectedRoutes.js (for handling protected resources)
const express = require('express');
const router = express.Router();
const passport = require('passport');

// Authentication middleware
const jwtAuthMiddleware = passport.authenticate('jwt', { session: false });

// Protected route
router.get('/protected-resource', jwtAuthMiddleware, (req, res) => {
  // Your protected resource logic here
});

module.exports = router;
