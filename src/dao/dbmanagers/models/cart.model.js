// En cart.model.js
import mongoose from 'mongoose';

const cartCollection = 'cart';

const productoSchema = new mongoose.Schema({
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product', 
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  products: [productoSchema],
});

export const cartModel = mongoose.model(cartCollection, cartSchema);
