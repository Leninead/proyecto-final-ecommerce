const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Authentication middleware
const authenticateUser = require('../middleware/authenticateUser');

// PUT endpoint to update product quantity in the cart
router.put('/update-cart/:productId', authenticateUser, cartController.updateCart);

// DELETE endpoint to remove a product from the cart
router.delete('/remove-from-cart/:productId', authenticateUser, cartController.removeFromCart);

// GET endpoint logic for viewing the cart
router.get('/view-cart', authenticateUser, cartController.viewCart);

module.exports = router;
