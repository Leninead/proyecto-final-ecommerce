const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');

// PUT endpoint to update product quantity in the cart
router.put('/update-quantity/:productId', async (req, res) => {
    try {
        const userId = req.user._id;  
        const productId = req.params.productId;
        const updatedQuantity = req.body.quantity;

        // Find the cart for the user
        const cart = await Cart.findOne({ userId });

        // Check if the product is in the cart
        const productIndex = cart.products.findIndex(product => product.productId === productId);

        if (productIndex !== -1) {
            // Update the quantity of the product
            cart.products[productIndex].quantity = updatedQuantity;
            await cart.save();

            res.status(200).json({ message: 'Cart updated.' });
        } else {
            res.status(404).json({ message: 'Product not found in the cart.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// DELETE endpoint to remove a product from the cart
router.delete('/remove-from-cart/:productId', async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;

        // Find the cart for the user
        const cart = await Cart.findOne({ userId });

        // Filter out the product to remove from the cart
        cart.products = cart.products.filter(product => product.productId !== productId);

        await cart.save();

        res.status(200).json({ message: 'Product removed from cart.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
