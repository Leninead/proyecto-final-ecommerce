// cart.router.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const cartService = require('../services/cartService');

// Define your cart-related routes
router.post('/', cartController.createCart);
router.get('/:userId', cartController.getCart);
router.post('/:cartId/products', cartController.addProductToCart);

// Update the product quantity route
router.put('/:cartId/products/:productId', (req, res, next) => {
    const { cartId, productId } = req.params;
    const { newQuantity } = req.body;

    cartService.updateProductQuantity(cartId, productId, newQuantity)
        .then(updatedCart => {
            res.status(200).json(updatedCart);
        })
        .catch(error => {
            next(error);
        });
});


// Delete a specific product from the cart
router.delete('/:cartId/products/:productId', cartService.removeProductFromCart);

// Clear the entire cart
router.delete('/:cartId', cartController.clearCart);

// Add the purchase route
router.post('/:cid/purchase', cartController.purchaseCart);

module.exports = router;
