// src/routes/products.router.js
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

// Define routes for /api/products
router.get('/', ProductController.getAllProducts);
router.get('/:productId', ProductController.getProductById);
router.post('/', ProductController.createProduct);
router.put('/:productId', ProductController.updateProduct);


module.exports = router;
