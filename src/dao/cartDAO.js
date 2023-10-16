const Cart = require('../models/cart.model');

const getCartByUserId = async (userId) => {
  try {
    const cart = await Cart.findOne({ userId });
    return cart;
  } catch (error) {
    throw new Error('Error getting cart: ' + error.message);
  }
};

const updateCart = async (userId, updatedProducts) => {
  try {
    await Cart.updateOne({ userId }, { products: updatedProducts });
  } catch (error) {
    throw new Error('Error updating cart: ' + error.message);
  }
};

module.exports = {
  getCartByUserId,
  updateCart,
};
