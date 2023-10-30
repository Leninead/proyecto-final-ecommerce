const ProductDAO = require('../dao/productDAO');

class ProductService {
  static async createProduct(productData) {
    try {
      return await ProductDAO.createProduct(productData);
    } catch (error) {
      throw error;
    }
  }

  static async getAllProducts() {
    try {
      return await ProductDAO.getAllProducts();
    } catch (error) {
      throw error;
    }
  }

  static async getProductById(productId) {
    try {
      return await ProductDAO.getProductById(productId);
    } catch (error) {
      throw error;
    }
  }

  static async updateProduct(productId, updatedData) {
    try {
      return await ProductDAO.updateProduct(productId, updatedData);
    } catch (error) {
      throw error;
    }
  }

  static async deleteProduct(productId) {
    try {
      return await ProductDAO.deleteProduct(productId);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductService;
