const express = require('express');
const router = express.Router();
const cartService = require('../services/cartService');
const CartRepository = require('../Repository/cartRepository');
const UserService = require('../services/userService');
const cartUtils = require('../utils/cartUtils');
// Create a new cart for a user
const createCart = async (req, res) => {
    const { userId } = req.body;

    try {
        const cart = await cartService.createCart(userId);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create cart' });
    }
};

// Get a user's cart by user ID
const getCart = async (req, res) => {
    const userId = req.params.userId;

    try {
        const cart = await cartService.findCartByUser(userId);
        if (cart) {
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve cart' });
    }
};

// Add a product to the cart
const addProductToCart = async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    try {
        const updatedCart = await cartService.addProductToCart(cartId, productId, quantity);
        if (updatedCart) {
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ message: 'Cart or product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update cart' });
    }
};

// Update product quantity in the cart
const updateProductQuantity = async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;

    try {
        // Find the cart by ID
        const cart = await cartService.findCartById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the product in the cart by product ID
        const productInCart = cart.products.find(product => product.productId === productId);
        if (!productInCart) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Update the product's quantity
        productInCart.quantity = quantity;

        // Update the cart in the database
        const updatedCart = await cartService.updateCart(cart);

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product quantity' });
    }
};

// Remove a specific product from the cart
// Remove a specific product from the cart
const removeProductFromCart = async (req, res) => {
    const { cartId, productId } = req.params;

    try {
        // Find the cart by ID
        const cart = await cartService.findCartById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the index of the product to remove in the cart's products array
        const productIndex = cart.products.findIndex(product => product.productId === productId);

        // Check if the product exists in the cart
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Remove the product from the cart's products array
        cart.products.splice(productIndex, 1);

        // Update the cart in the database
        const updatedCart = await cartService.updateCart(cart);

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove the product from the cart' });
    }
};

// Clear the entire cart
// Clear the entire cart
const clearCart = async (req, res) => {
    const { cartId } = req.params;

    try {
        // Find the cart by ID
        const cart = await cartService.findCartById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Clear the products array in the cart
        cart.products = [];

        // Update the cart in the database
        const updatedCart = await cartService.updateCart(cart);

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear the cart' });
    }
};


async function purchaseCart(req, res) {
    try {
        const cartId = req.params.cid;
        const userId = req.user._id; // Assuming user information is available through authentication

        const cart = await CartRepository.getCartById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Calculate the total cost of the items in the cart using cartUtils
        const totalCost = cartUtils.calculateTotalCost(cart.products);

        // Check if the user has sufficient funds
        const user = await UserService.getUserById(userId);

        if (user.balance < totalCost) {
            return res.status(403).json({ message: 'Insufficient funds' });
        }

        // Create and save tickets, update product stock, update user balance, and clear the cart
        const tickets = cartUtils.createTicketsFromCart(cart.products);
        cartUtils.updateProductStock(cart.products);
        cartUtils.updateUserBalance(userId, totalCost);
        cartUtils.clearCartItems(cartId);

        // Respond with a success message
        res.json({ message: 'Purchase successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}



module.exports = {
    createCart,
    getCart,
    addProductToCart,
    updateProductQuantity,
    removeProductFromCart,
    clearCart,
    purchaseCart,

};
