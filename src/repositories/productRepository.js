// src/repositories/product.repository.js
const Product = require('../models/product.model');

const ProductRepository = {
  getAllProducts: async () => {
    return Product.find({}, 'name price description');
  },

  getProductById: async (productId) => {
    return Product.findById(productId, 'name price description');
  },

  createProduct: async (newProductData) => {
    return Product.create(newProductData);
  },

  updateProduct: async (productId, updatedProductData) => {
    return Product.findByIdAndUpdate(productId, updatedProductData, { new: true });
  },

  
};

module.exports = ProductRepository;
