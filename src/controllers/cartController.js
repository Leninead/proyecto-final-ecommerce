// controllers/cartController.js
const Cart = require('../models/cart.model');
const CartRepository = require('../repositories/cart.repository'); // Import the CartRepository

const CartController = {
  addToCart: async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body; // Assuming request body contains user ID, product ID, and quantity

      // Check if userId, productId, and quantity are provided
      if (!userId || !productId || !quantity) {
        return res.status(400).json({ error: 'User ID, product ID, and quantity are required' });
      }

      // Use the CartRepository method to add the product to the user's cart
      const result = await CartRepository.addToCart(userId, productId, quantity);

      res.json({ message: 'Product added to cart', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getUserCart: async (req, res) => {
    try {
      const { userId } = req.body; // Assuming request body contains user ID

      // Check if userId is provided
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Use the CartRepository method to retrieve the user's cart
      const userCart = await CartRepository.getUserCart(userId);

      res.json(userCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  clearUserCart: async (userId) => {
    try {
      // Clear the user's cart by updating the 'products' field to an empty array
      const clearedCart = await Cart.findOneAndUpdate(
        { user: userId },
        { $set: { products: [] } },
        { new: true }
      );

      return clearedCart;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to clear user cart');
    }
  },
  removeFromCart: async (req, res) => {
    try {
      const { userId } = req.body; // Assuming request body contains user ID
      const { productId } = req.params; // Assuming request parameters contain product ID

      // Check if userId and productId are provided
      if (!userId || !productId) {
        return res.status(400).json({ error: 'User ID and Product ID are required' });
      }

      // Use the CartRepository method to remove the product from the user's cart
      const result = await CartRepository.removeFromCart(userId, productId);

      res.json({ message: 'Product removed from cart', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = CartController;
