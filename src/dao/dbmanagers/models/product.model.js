import { Double } from 'mongodb';
import mongoose from 'mongoose';

const productsCollection = 'products';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  price: {
    type: Number, // Cambiado a Number
    required: true,
  },
  status: {
    type: Boolean, // Cambiado a Boolean
    required: true,
  },
  stock: {
    type: Number , // Cambiado a Number
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
});

export const productsModel = mongoose.model(productsCollection, productSchema);
