const Product = require('../models/product.model'); 
const User = require('../models/user.model');
const { ObjectId } = require('mongoose').Types;

class ProductRepository {
  async createProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      throw error;
    }
  }
  async addToCart(userId, productId, quantity) {
    try {
      // Find the user by their ID
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Find the product by its ID
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('Product not found');
      }

      // Check if the product is already in the user's cart
      const cartProductIndex = user.cart.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (cartProductIndex >= 0) {
        // If the product is already in the cart, update its quantity
        user.cart[cartProductIndex].quantity += quantity;
      } else {
        // If the product is not in the cart, add it
        user.cart.push({
          productId: ObjectId(productId),
          quantity,
        });
      }

      // Save the user's updated cart
      await user.save();

      return user.cart; // Return the updated cart
    } catch (error) {
      throw new Error(`Error adding to cart: ${error.message}`);
    }
  }

  async updateCartProductId(userId, productId, newQuantity) {
    try {
      // Find the user by their ID
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Check if the product is already in the user's cart
      const cartProductIndex = user.cart.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (cartProductIndex < 0) {
        throw new Error('Product not found in cart');
      }

      // Update the quantity of the product in the cart
      user.cart[cartProductIndex].quantity = newQuantity;

      // Save the user's updated cart
      await user.save();

      return user.cart; // Return the updated cart
    } catch (error) {
      throw new Error(`Error updating cart product quantity: ${error.message}`);
    }
  }

  async updateQuantityProductId(userId, productId, newQuantity) {
    try {
      // Find the user by their ID
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Check if the product is already in the user's cart
      const cartProductIndex = user.cart.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (cartProductIndex < 0) {
        throw new Error('Product not found in cart');
      }

      // Update the quantity of the product in the cart
      user.cart[cartProductIndex].quantity = newQuantity;

      // Save the user's updated cart
      await user.save();

      return user.cart; // Return the updated cart
    } catch (error) {
      throw new Error(`Error updating cart product quantity: ${error.message}`);
    }
  }
  async getCartContents(userId) {
    try {
      // Find the user by their ID
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      return user.cart; // Return the user's cart contents
    } catch (error) {
      throw new Error(`Error retrieving cart contents: ${error.message}`);
    }
  }
  async removeFromCartProductId(userId, productId) {
    try {
      // Find the user by their ID
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      // Find the index of the product with the given ID in the user's cart
      const productIndex = user.cart.findIndex(
        (product) => product.productId.toString() === productId
      );

      if (productIndex === -1) {
        throw new Error('Product not found in the cart');
      }

      // Remove the product from the user's cart
      user.cart.splice(productIndex, 1);

      // Save the user's updated cart
      await user.save();

      return user.cart; // Return the updated cart
    } catch (error) {
      throw new Error(`Error removing product from cart: ${error.message}`);
    }
  }
}

module.exports = ProductRepository;


