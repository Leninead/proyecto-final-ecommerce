// src/repositories/cart.repository.js
const Cart = require('../models/cart.model');

const CartRepository = {
  addToCart: async (userId, productId, quantity) => {
    try {
      // Assuming the Cart model has a user field referencing the User model
      const cart = await Cart.findOneAndUpdate(
        { user: userId, 'products.product': productId },
        {
          $inc: { 'products.$.quantity': quantity },
        },
        { new: true }
      );

      if (!cart) {
        // If the product is not in the cart, add it
        const updatedCart = await Cart.findOneAndUpdate(
          { user: userId },
          {
            $addToSet: { products: { product: productId, quantity } },
          },
          { new: true, upsert: true }
        );

        return updatedCart;
      }

      return cart;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to add to cart');
    }
  },
  getUserCart: async (userId) => {
    try {
      // Retrieve the user's cart by finding the cart with the specified user ID
      const userCart = await Cart.findOne({ user: userId });

      return userCart;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve user cart');
    }
  },


  clearUserCart: async (userId) => {
    try {
      const result = await Cart.updateOne({ user: userId }, { $set: { products: [] } });
      return result;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to clear user cart');
    }
  },
  removeFromCart: async (userId, productId) => {
    try {
      // Remove the specified product from the user's cart
      const updatedCart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { products: { product: productId } } },
        { new: true }
      );

      return updatedCart;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to remove product from user cart');
    }
  },


};

module.exports = CartRepository;
