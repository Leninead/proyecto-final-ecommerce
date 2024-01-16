// controllers/productController.js
const Product = require('../models/product.model');
const ProductRepository = require('../repositories/product.repository'); // Add this import

const ProductController = {
  getProductById: async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await ProductRepository.getProductById(productId); // Use the repository method
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createProduct: async (req, res) => {
    try {
      const newProduct = req.body; // Assuming request body contains product details
      const createdProduct = await ProductRepository.createProduct(newProduct); // Use the repository method
      res.json(createdProduct);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const productId = req.params.productId;
      const updatedProduct = req.body; // Assuming request body contains updated product details
      const result = await ProductRepository.updateProduct(productId, updatedProduct); // Use the repository method
      if (!result) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      const products = await ProductRepository.getAllProducts(); // Use the repository method
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  // Add other product-related controller methods as needed
};

module.exports = ProductController;
