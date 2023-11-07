import { cartModel } from './models/cart.model.js';

export default class CartManager {
  constructor() {
    console.log('Working with carts in the database');
  }

  async create(newCart) {
    try {
      const cart = await cartModel.create(newCart);
      return cart;
    } catch (error) {
      console.error('Error al crear un nuevo carrito:', error);
      return null;
    }
  }

  async getAll() {
    try {
      const carts = await cartModel.find().lean();
      return carts;
    } catch (error) {
      console.error('Error fetching cart list:', error);
      return [];
    }
  }

  async save(cart) {
    try {
      const result = await cartModel.create(cart);
      return result;
    } catch (error) {
      console.error('Error creating a new cart:', error);
      return null;
    }
  }

  async update(id, updatedCart) {
    try {
      const result = await cartModel.updateOne({ _id: id }, updatedCart);
      return result.nModified > 0; // Verifica si se realizaron modificaciones
    } catch (error) {
      console.error('Error updating a cart:', error);
      return false;
    }
  }
}
