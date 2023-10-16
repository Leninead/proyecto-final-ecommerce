const productDAO = require('../dao/productDAO');

const getAllProducts = async () => {
  try {
    const products = await productDAO.getAllProducts();
    return products;
  } catch (error) {
    throw new Error('Error getting products: ' + error.message);
  }
};

const getProductById = async (productId) => {
  try {
    const product = await productDAO.getProductById(productId);
    return product;
  } catch (error) {
    throw new Error('Error getting product: ' + error.message);
  }
};

module.exports = {
  getAllProducts,
  getProductById,
};
