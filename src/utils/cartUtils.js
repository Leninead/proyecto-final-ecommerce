const CartRepository = require('../Repository/cartRepository');
const Product = require('../models/product.model');
const UserService = require('../services/userService');

async function calculateTotalCost(cart) {
    let totalCost = 0;

    // Loop through the products in the cart and calculate the cost of each item
    for (const item of cart) {
        // Assuming each product in the cart has a "price" and "quantity" field
        const itemCost = item.price * item.quantity;
        totalCost += itemCost;
    }

    return totalCost;
}

async function updateProductStock(products) {
    for (const product of products) {
        // Find the product in your inventory by its ID
        const existingProduct = await Product.findById(product.productId);

        if (existingProduct) {
            // Check if the stock is sufficient to fulfill the order
            if (existingProduct.stock >= product.quantity) {
                // Reduce the stock by the quantity from the cart
                existingProduct.stock -= product.quantity;

                // Save the updated product in the database
                await existingProduct.save();
            } else {
                // Handle insufficient stock (e.g., throw an error or log it)
                console.log(`Insufficient stock for product with ID ${product.productId}`);
            }
        } else {
            // Handle product not found (e.g., throw an error or log it)
            console.log(`Product with ID ${product.productId} not found in inventory`);
        }
    }
}

async function updateUserBalance(userId, totalCost) {
    try {
        // Fetch the user by their ID
        const user = await UserService.getUserById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // Check if the user has sufficient balance
        if (user.balance < totalCost) {
            throw new Error('Insufficient funds');
        }

        // Calculate the new balance
        const newBalance = user.balance - totalCost;

        // Update the user's balance in the database
        user.balance = newBalance;
        await user.save();

        // Return the updated user object (optional)
        return user;
    } catch (error) {
        throw error;
    }
}

async function clearCartItems(cartId) {
    try {
        // Find the cart by ID
        const cart = await CartRepository.getCartById(cartId);

        if (!cart) {
            throw new Error('Cart not found');
        }

        // Clear the products array in the cart
        cart.products = [];

        // Update the cart in the database
        await CartRepository.updateCart(cart);

        // You might also want to return a success message
        return 'Cart cleared successfully';
    } catch (error) {
        throw new Error('Failed to clear the cart');
    }
}

module.exports = {
    calculateTotalCost,
    updateProductStock,
    updateUserBalance,
    clearCartItems,
};
