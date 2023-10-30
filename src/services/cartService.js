const cartDAO = require('../dao/cartDAO');

// Create a new cart for a user
async function createCart(user) {
    return await cartDAO.createCart(user);
}

// Find a user's cart by user ID
async function findCartByUser(userId) {
    return await cartDAO.findCartByUser(userId);
}

// Update the cart's products
async function updateCartProducts(cartId, products) {
    return await cartDAO.updateCartProducts(cartId, products);
}

module.exports = {
    createCart,
    findCartByUser,
    updateCartProducts
};
