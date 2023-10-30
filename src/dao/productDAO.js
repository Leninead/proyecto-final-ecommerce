const Product = require('../models/product.model');

class ProductDAO {
  static async createProduct(productData) {
    try {
      const newProduct = new Product(productData);
      return await newProduct.save();
    } catch (error) {
      throw error;
    }
  }

  static async getAllProducts() {
    try {
      return await Product.find();
    } catch (error) {
      throw error;
    }
  }

  static async getProductById(productId) {
    try {
      return await Product.findById(productId);
    } catch (error) {
      throw error;
    }
  }

  static async updateProduct(productId, updatedData) {
    try {
      return await Product.findByIdAndUpdate(productId, updatedData, { new: true });
    } catch (error) {
      throw error;
    }
  }

  static async deleteProduct(productId) {
    try {
      await Product.findByIdAndDelete(productId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductDAO;
