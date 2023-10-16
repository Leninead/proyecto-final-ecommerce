const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define your authentication route using the imported middleware
router.post('/', authController.authenticateUser);

module.exports = router;
