// src/routes/cart.router.js
const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

// Define routes for /api/cart
router.get('/', CartController.getUserCart);
router.post('/add', CartController.addToCart);
router.delete('/remove/:productId', CartController.removeFromCart);
router.delete('/clear', CartController.clearUserCart);


module.exports = router;
