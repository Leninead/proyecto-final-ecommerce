const Cart = require('../models/cart.model');

module.exports = {
  createCart: async (cartData) => {
    try {
      const newCart = new Cart(cartData);
      return await newCart.save();
    } catch (error) {
      throw new Error('Failed to create a new cart');
    }
  },
  
  getCartById: async (cartId) => {
    try {
      return await Cart.findById(cartId);
    } catch (error) {
      throw new Error('Failed to find the cart by ID');
    }
  },
  
  removeCartById: async (cartId) => {
    try {
      const removedCart = await Cart.findByIdAndRemove(cartId);
      if (!removedCart) {
        throw new Error('Cart not found');
      }
      return removedCart;
    } catch (error) {
      throw new Error('Failed to remove the cart from the database');
    }
  },
};
