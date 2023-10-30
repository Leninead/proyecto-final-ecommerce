const express = require('express');
const router = express.Router();
const authController = require('../authController');

// Route for user authentication
router.post('/authenticate', authController.authenticateUser);

module.exports = router;
