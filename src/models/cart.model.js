const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cartCollectionName = "carts"; // Collection name

const cartSchema = new mongoose.Schema({
    // Your cart schema fields
    // For example:
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 0
        }
    }]
});

// Add pagination plugin to the cart schema
cartSchema.plugin(mongoosePaginate);

let Cart;

try {
  Cart = mongoose.model('Cart');
} catch (error) {
  Cart = mongoose.model('Cart', cartSchema, cartCollectionName);
}

module.exports = Cart;
