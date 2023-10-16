const cartDAO = require('../dao/cartDAO');

const getCartByUserId = async (userId) => {
  try {
    const cart = await cartDAO.getCartByUserId(userId);
    return cart;
  } catch (error) {
    throw new Error('Error getting cart: ' + error.message);
  }
};

const updateCart = async (userId, updatedProducts) => {
  try {
    await cartDAO.updateCart(userId, updatedProducts);
  } catch (error) {
    throw new Error('Error updating cart: ' + error.message);
  }
};

module.exports = {
  getCartByUserId,
  updateCart,
};
 