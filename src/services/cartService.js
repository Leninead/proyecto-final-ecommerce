const cartDAO = require('../dao/cartDAO');
const cartRepository = require('../Repository/cartRepository');

async function createCart(user) {
    return await cartDAO.createCart(user);
}

async function findCartByUser(userId) {
    return await cartDAO.findCartByUser(userId);
}

async function updateCartProducts(cartId, products) {
    return await cartDAO.updateCartProducts(cartId, products);
}

async function updateProductQuantity(cartId, productId, newQuantity) {
    try {
        const cart = await cartDAO.findCartById(cartId);
        const productToUpdate = cart.products.find(product => product.productId === productId);

        if (!productToUpdate) {
            throw new Error('Product not found in the cart');
        }

        productToUpdate.quantity = newQuantity;
        await cartDAO.updateCartProducts(cartId, cart.products);

        return cart;
    } catch (error) {
        throw error;
    }
}
async function removeProductFromCart(cartId, productId) {
    try {
        const cart = await cartDAO.findCartById(cartId);

        // Find the index of the product to remove in the cart's products array
        const productIndex = cart.products.findIndex(product => product.productId === productId);

        // Check if the product exists in the cart
        if (productIndex === -1) {
            throw new Error('Product not found in cart');
        }

        // Remove the product from the cart's products array
        cart.products.splice(productIndex, 1);

        // Update the cart in the database
        await cartDAO.updateCartProducts(cartId, cart.products);

        return cart;
    } catch (error) {
        throw error;
    }
}

async function removeCart(cartId) {
    try {
        // Implement your logic to remove the cart from the database
        // Use cartRepository method to interact with the database
        const removedCart = await cartRepository.removeCartById(cartId);

        // Alternatively, you can use cartDAO method to interact with the database
        // await cartDAO.removeCart(cartId);

        return removedCart;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createCart,
    findCartByUser,
    updateCartProducts,
    updateProductQuantity,
    removeProductFromCart,
    removeCart,
};