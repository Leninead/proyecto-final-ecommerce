const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Define routes for cart-related operations
// Define a route handler with a callback function
router.get('/', (req, res) => {
    // Handle the GET request for this route
    res.send('Hello, this is the cart route.');
});

router.get('/:userId', cartController.getCart); // This line is added

router.post('/:cartId/products', cartController.addProductToCart);
router.put('/:cartId/products/:productId', cartController.updateProductQuantity);
router.delete('/:cartId/products/:productId', cartController.removeProductFromCart);
router.delete('/:cartId', cartController.clearCart);

module.exports = router;
