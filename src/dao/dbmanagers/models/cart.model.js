import mongoose from 'mongoose';

const cartCollection = 'cart';

const productoSchema = new mongoose.Schema({
  codprod:{
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  products: [productoSchema], // Esto representa una matriz de objetos producto
});

export const cartModel = mongoose.model(cartCollection, cartSchema);