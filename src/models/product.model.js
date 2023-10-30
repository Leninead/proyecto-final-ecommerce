const mongoose = require('mongoose');

const productCollectionName = "products"; // Collection name

const productSchema = new mongoose.Schema({
    // Your product schema fields
    // For example:
    name: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    quantity: {
      type: Number,
      default: 0, // Default quantity value if not provided
    },
});

let Product;

try {
  Product = mongoose.model('Product');
} catch (error) {
  Product = mongoose.model('Product', productSchema, productCollectionName);
}

module.exports = Product;
