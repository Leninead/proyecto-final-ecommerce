// src/routes/cart.router.js
const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

// Define routes for /api/cart
router.get('/', CartController.getUserCart);
router.post('/add', CartController.addToCart);
router.delete('/remove/:productId', CartController.removeFromCart);
router.delete('/clear', CartController.clearUserCart);

// Fix the case for the import statement
router.post('/completePurchase', CartController.completePurchase);

module.exports = router;
