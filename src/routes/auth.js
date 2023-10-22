const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');

// Authentication middleware
const jwtAuthMiddleware = passport.authenticate('jwt', { session: false });

// Define your authentication route using the imported middleware
router.post('/', jwtAuthMiddleware, authController.authenticateUser);

module.exports = router;
