// dao/productDAO.js
const Product = require('../models/product.model');

const ProductDAO = {
  getAllProducts: async () => {
    try {
      return await Product.find({}, 'name price description');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get products');
    }
  },

  getProductById: async (productId) => {
    try {
      return await Product.findById(productId, 'name price description');
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get product by ID');
    }
  },

  createProduct: async (newProductData) => {
    try {
      return await Product.create(newProductData);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create product');
    }
  },

  updateProduct: async (productId, updatedProductData) => {
    try {
      return await Product.findByIdAndUpdate(productId, updatedProductData, { new: true });
    } catch (error) {
      console.error(error);
      throw new Error('Failed to update product');
    }
  },

  // Add more methods as needed for product operations
};

module.exports = ProductDAO;
