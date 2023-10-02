const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const cartCollection = "carts"
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
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

const cartsModel = mongoose.model(cartCollection, cartSchema);

module.exports = cartsModel;
