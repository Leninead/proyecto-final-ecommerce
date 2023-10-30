
const Cart = require('../models/cart.model');

module.exports = {
  createCart: async (cartData) => {
    const newCart = new Cart(cartData);
    return newCart.save();
  },
  getCartById: async (cartId) => {
    return Cart.findById(cartId);
  },

};
