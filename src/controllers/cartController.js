const Cart = require('../models/cart.model')



const updateCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.params.productId;
        const updatedQuantity = req.body.quantity;

        // Find the cart for the user
        let cart = await Cart.findOne({ userId });

        // If the cart doesn't exist, create a new cart for the user
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }

        console.log('Cart:', cart);

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
}


const removeFromCart = async (req, res) => {
    // DELETE endpoint logic for removing a product from the cart

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
    console.error('Error removing product from cart:', error);
    res.status(500).json({ message: 'Internal server error.' });
}

};
const viewCart = async (req, res) => {
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
};

  
module.exports = {
    updateCart,
    removeFromCart,
    viewCart,
  };