// cartService.js
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

// Update product quantity in the cart
async function updateProductQuantity(cartId, productId, newQuantity) {
    // Implement your logic to update the product quantity in the cart
    try {
        // Get the cart by ID
        const cart = await cartDAO.findCartById(cartId);

        // Find the product in the cart by ID
        const productToUpdate = cart.products.find(product => product.productId === productId);

        if (!productToUpdate) {
            throw new Error('Product not found in the cart');
        }

        // Update the product quantity
        productToUpdate.quantity = newQuantity;

        // Save the updated cart
        await cartDAO.updateCartProducts(cartId, cart.products);

        return cart; // You can return the updated cart if needed
    } catch (error) {
        throw error; // Handle errors appropriately
    }
}

// Remove a product from the cart
async function removeProductFromCart(cartId, productId) {
    // Implement your logic to remove the product from the cart
    // ...
    // You may use cartDAO methods to interact with the database
}

module.exports = {
    createCart,
    findCartByUser,
    updateCartProducts,
    updateProductQuantity,
    removeProductFromCart,
};
