const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const Cart = require('../models/cart.model'); // Adjust the path as needed



// Sample product data
const products = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
    // Add more products as needed
];

// Route to handle product listing with pagination, filtering, and sorting
router.get('/', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      const products = await Product.find()
        .skip((page - 1) * limit)
        .limit(limit);
  
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  // Route to view individual product details
router.get('/:productId', async (req, res) => {
    console.log('Received request to add a product:', req.body);
    const productId = req.params.productId;
  
    try {
      const product = await Product.findById(productId);
  
      if (product) {
        res.render('product-details', { product });
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.post('/add-product', async (req, res) => {
    console.log('Received request to add a product:', req.body);

    const { name, price, description, stock, quantity } = req.body;

    try {
        console.log('Creating a new product:', { name, price, description, stock, quantity });

        const newProduct = new Product({
            name,
            price,
            description,
            stock,
            quantity
        });

        await newProduct.save();

        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (error) {
        console.error('Error while adding a product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




router.post('/add-to-cart', async (req, res) => {
    // Assuming userId can be obtained from either request body or headers
    console.log('Received request to add to cart:', req.body);
    const userId = req.body.userId || req.headers['user-id'];

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    const productId = req.body.productId;
    const quantity = req.body.quantity;

    try {
        console.log('Adding product to cart:', { productId, quantity });
        // Check if the user already has a cart, if not, create a new one
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        // Check if the product already exists in the cart
        const existingProductIndex = cart.products.findIndex(product => product.productId === productId);

        if (existingProductIndex !== -1) {
            // Product exists, update the quantity
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            // Product doesn't exist, add it to the cart
            cart.products.push({ productId, quantity });
        }

        // Save the cart to the database
        await cart.save();

        res.status(200).json({ message: 'Product added to cart.', cart });
    } catch (error) {
        console.error('Error while adding to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// PUT endpoint to update product quantity in the cart
router.put('/update-cart/:productId', async (req, res) => {
    try {
        const userId = req.user._id;  
        const productId = req.params.productId;
        const updatedQuantity = req.body.quantity;

        // Find the cart for the user
        const cart = await Cart.findOne({ userId });

        // Check if the product is in the cart
        const productIndex = cart.products.findIndex(product => product.productId === productId);

        if (productIndex !== -1) {
            // Update the quantity of the product
            cart.products[productIndex].quantity = updatedQuantity;
            await cart.save();

            res.status(200).json({ message: 'Cart updated.' });
        } else {
            res.status(404).json({ message: 'Product not found in the cart.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
// PUT endpoint to update product quantity in the cart
router.put('/update-quantity/:productId', async (req, res) => {
    try {
        const userId = req.user._id;  
        const productId = req.params.productId;
        const updatedQuantity = req.body.quantity;

        console.log('Updating quantity for product:', productId);
        console.log('Updated quantity:', updatedQuantity);

        // Find the cart for the user
        const cart = await Cart.findOne({ userId });

        console.log('User cart:', cart);

        // Check if the product is in the cart
        const productIndex = cart.products.findIndex(product => product.productId === productId);

        if (productIndex !== -1) {
            // Update the quantity of the product
            cart.products[productIndex].quantity = updatedQuantity;
            await cart.save();

            console.log('Cart updated successfully.');

            res.status(200).json({ message: 'Cart updated.' });
        } else {
            console.log('Product not found in the cart.');
            res.status(404).json({ message: 'Product not found in the cart.' });
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


router.get('/view-cart', async (req, res) => {
    try {
        const userId = req.user._id;  // Assuming authenticated user

        // Find the cart for the user and populate the product details
        const cart = await Cart.findOne({ userId }).populate('products.productId');

        if (cart) {
            res.status(200).json({ cartContents: cart.products });
        } else {
            res.status(404).json({ message: 'Cart not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});
// DELETE endpoint to remove a product from the cart
router.delete('/remove-from-cart/:productId', async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;

        // Find the cart for the user
        const cart = await Cart.findOne({ userId });

        // Filter out the product to remove from the cart
        cart.products = cart.products.filter(product => product.productId !== productId);

        await cart.save();

        res.status(200).json({ message: 'Product removed from cart.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
});


module.exports = router;
