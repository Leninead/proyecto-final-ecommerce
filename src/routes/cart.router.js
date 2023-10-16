const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// PUT endpoint to update product quantity in the cart
router.put('/update-cart/:productId', cartController.updateCart);

// DELETE endpoint to remove a product from the cart
router.delete('/remove-from-cart/:productId', cartController.removeFromCart);

// GET endpoint logic for viewing the cart
router.get('/view-cart', cartController.viewCart);

module.exports = router;

