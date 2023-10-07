const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const cartCollectionName = "carts"; // Collection name

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  role: {
    type: String,
    default: 'user'
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
});

// Add pagination plugin to the cart schema
cartSchema.plugin(mongoosePaginate);

const Cart = mongoose.model('Cart', cartSchema); // Create the model

// Create the collection
mongoose.connection.once('open', () => {
  mongoose.connection.db.createCollection(cartCollectionName, (err, res) => {
    if (err) throw err;
    console.log(`Collection '${cartCollectionName}' created!`);
    mongoose.connection.close();
  });
});
