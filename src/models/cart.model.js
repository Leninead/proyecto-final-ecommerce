const mongoose = require('mongoose');
const cartCollectionName = "carts"; // Collection name

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                default: 0
            }
        }
    ]
});

let Cart;

try {
  Cart = mongoose.model('Cart');
} catch (error) {
  Cart = mongoose.model('Cart', cartSchema, cartCollectionName);
}

module.exports = Cart;
