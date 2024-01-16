// src/routes/users.router.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const ProductController = require('../controllers/productController');
const CartController = require('../controllers/cartController');

// Define routes for /api/users
router.get('/', UserController.getAllUsers);
router.delete('/deleteInactive', UserController.deleteInactiveUsers);
router.get('/:userId', UserController.getUserById); // Get a specific user by ID
router.put('/:userId', UserController.updateUser); // Update user information

// Define routes for /api/products
router.get('/products', ProductController.getAllProducts);

// Define routes for /api/cart
router.get('/cart', CartController.getUserCart);

module.exports = router;
