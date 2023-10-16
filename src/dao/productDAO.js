const Product = require('../models/product.model');

const getAllProducts = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (error) {
    throw new Error('Error getting products: ' + error.message);
  }
};

const getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    throw new Error('Error getting product: ' + error.message);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
};
