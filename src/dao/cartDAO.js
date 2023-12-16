const Cart = require('../models/cart.model');

async function createCart(user) {
    try {
        const cart = new Cart({ user, products: [] });
        return await cart.save();
    } catch (error) {
        throw new Error('Failed to create a new cart');
    }
}

async function findCartByUser(userId) {
    try {
        return await Cart.findOne({ user: userId });
    } catch (error) {
        throw new Error('Failed to find the user\'s cart');
    }
}

async function updateCartProducts(cartId, products) {
    try {
        // Update only the products field in the cart
        return await Cart.findByIdAndUpdate(cartId, { products }, { new: true });
    } catch (error) {
        throw new Error('Failed to update the cart\'s products');
    }
}

module.exports = {
    createCart,
    findCartByUser,
    updateCartProducts
};
