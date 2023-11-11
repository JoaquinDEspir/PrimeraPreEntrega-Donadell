// En cart.model.js
import mongoose from 'mongoose';

const cartCollection = 'cart';

const productoSchema = new mongoose.Schema({
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product', // Nombre del modelo al que hace referencia (debes usar el mismo nombre que uses al definir tu modelo de productos)
    required: true,
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
