const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const productController = new ProductController();

// Define routes for product-related actions
router.post('/', productController.createProduct);
router.post('/addToCart', productController.addToCart);
router.put('/updateCartProduct/:productId', productController.updateCartProductId);
router.put('/updateQuantityProduct/:productId', productController.updateQuantityProductId);
router.get('/getCartContents', productController.getCartContents);
router.delete('/removeFromCart/:productId', productController.removeFromCartProductId);

module.exports = router;
