const ProductRepository = require('../Repository/productRepository');
const productRepository = new ProductRepository();

class ProductController {
  async createProduct(req, res) {
    try {
      // Assuming you have validation middleware and user authentication before this point
      // You can access the authenticated user ID as req.user._id
  
      // Get the authenticated user's ID
      const userId = req.user._id;
  
      // Prepare the product data based on your schema, including quantity
      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        quantity: req.body.quantity, // Include quantity from the request body
      };
  
      // Add the product to the database by calling the repository method
      const product = await productRepository.createProduct(productData);
  
      // Return a response to the client with the created product
      res.status(201).json(product);
    } catch (error) {
      // Handle errors, such as validation errors or database issues
      res.status(500).json({ message: 'Error creating product', error: error.message });
    }
  }



  async addToCart(req, res) {
    try {
      // Extract the user ID, product ID, and quantity from the request body
      const { userId, productId, quantity } = req.body;
  
      // Call the repository function to add a product to the cart
      const updatedCart = await productRepository.addToCart(userId, productId, quantity);
  
      // Return a response to the client with the updated cart
      res.json(updatedCart);
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  async updateCartProductId(req, res) {
    try {
      // Extract the user ID, product ID, and new quantity from the request body
      const { userId, productId, newQuantity } = req.body;
  
      // Call the repository function to update a product in the cart by product ID
      const updatedCart = await productRepository.updateCartProductId(userId, productId, newQuantity);
  
      // Return a response to the client with the updated cart
      res.json(updatedCart);
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async updateQuantityProductId(req, res) {
    try {
      // Extract the product ID and new quantity from the request body
      const productId = req.params.productId;
      const newQuantity = req.body.newQuantity;
  
      // Call the repository function to update the product's quantity
      const updatedProduct = await productRepository.updateQuantityProductId(productId, newQuantity);
  
      // Return a response to the client with the updated product
      res.json(updatedProduct);
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getCartContents(req, res) {
    try {
      // Extract the user ID from the request body
      const userId = req.body.userId;
  
      // Call the repository function to get the user's cart contents
      const cartContents = await productRepository.getCartContents(userId);
  
      // Return a response to the client with the user's cart contents
      res.json(cartContents);
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
 
  async removeFromCartProductId(req, res) {
    try {
      // Extract the user ID and product ID from the request body
      const userId = req.body.userId;
      const productId = req.body.productId;
  
      // Call the repository function to remove a product from the user's cart by product ID
      const updatedCart = await productRepository.removeFromCartProductId(userId, productId);
  
      // Return a response to the client with the updated cart
      res.json(updatedCart);
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = ProductController;
