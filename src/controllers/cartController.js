const Cart = require('../models/cart.model');
const CartRepository = require('../repositories/cartRepository'); // Import the CartRepository
const EmailSender = require('../utils/emailSender'); // Import the EmailSender

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
  clearUserCart: async (req, res) => {
    try {
      const { userId } = req.body; // Assuming request body contains user ID

      // Check if userId is provided
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Use the CartRepository method to clear the user's cart
      const clearedCart = await CartRepository.clearUserCart(userId);

      res.json({ message: 'User cart cleared', result: clearedCart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
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
  completePurchase: async (req, res) => {
    try {
      // Assuming you have user authentication middleware that attaches the user to the request
      const user = req.user;
  
      // Check if the user exists
      if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
  
      // Get the user's cart
      const userCart = await CartRepository.getUserCart(user.id);
  
      // Check if the cart is empty
      if (!userCart || !userCart.products || userCart.products.length === 0) {
        return res.status(400).json({ error: 'Cart is empty. Cannot complete purchase.' });
      }
  
      // Process the purchase (example: update database, generate order, etc.)
      // You can add your business logic for order processing here
  
      // Clear the user's cart after a successful purchase
      await CartRepository.clearUserCart(user.id);
  
      // Send a purchase confirmation email to the user
      const userEmail = user.email; // Replace with the actual user email retrieval logic
      await EmailSender.sendPurchaseConfirmation(userEmail);
  
      // Render a success page or redirect to a thank you page
    
res.render('purchase/success', { user, purchaseDetails: {} });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  
};

module.exports = CartController;
