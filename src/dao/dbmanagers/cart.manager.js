import { cartModel } from './models/cart.model.js';
import { productsModel } from './models/product.model.js';
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
      const result = await cartModel.findByIdAndUpdate(id, { $set: { products: updatedCart.products } }, { new: true });
      return result !== null;
    } catch (error) {
      console.error('Error updating a cart:', error);
      return false;
    }
  }

  async delete(cartId) {
    try {
      const result = await cartModel.findByIdAndDelete(cartId);
      return result !== null;
    } catch (error) {
      console.error('Error deleting a cart:', error);
      return false;
    }
  }

  
  async addProduct(cartId, productId) {
    try {

      const cart = await cartModel.findById(cartId);

      if (!cart) {
        console.error('Cart not found');
        return false;
      }


      cart.products.push({ productId, quantity: 1 });
      await cart.save();

      return true;
    } catch (error) {
      console.error('Error adding product to cart:', error);
      return false;
    }
  }

  async removeProduct(cartId, productId) {
    try {
      const result = await cartModel.findByIdAndUpdate(
        cartId,
        { $pull: { products: { pid: productId } } },
        { new: true }
      );
      return result !== null;
    } catch (error) {
      console.error('Error removing a product from the cart:', error);
      return false;
    }
  }
  

  async updateProductQuantity(cartId, productCodprod, updatedQuantity) {
    try {
      const result = await cartModel.findOneAndUpdate(
        { _id: cartId, 'products.codprod': productCodprod },
        { $set: { 'products.$.quantity': updatedQuantity } },
        { new: true }
      );
      return result !== null;
    } catch (error) {
      console.error('Error updating product quantity in the cart:', error);
      return false;
    }
  }
  async getById(cartId) {
    try {
      const cart = await cartModel.findById(cartId).lean();
  
      if (!cart) {
        console.error('Cart not found');
        return null;
      }
  

      const populatedProducts = await Promise.all(
        cart.products.map(async (product) => {
          const productDetails = await productsModel.findById(product.pid).lean();
          return { ...product, details: productDetails };
        })
      );
  

      cart.products = populatedProducts;
  
      return cart;
    } catch (error) {
      console.error('Error fetching cart details:', error);
      throw error;
    }
  }
  async deleteAllProducts(cartId) {
    try {
      const result = await cartModel.findByIdAndUpdate(
        cartId,
        { $set: { products: [] } },
        { new: true }
      );
      return result !== null;
    } catch (error) {
      console.error('Error deleting all products from the cart:', error);
      return false;
    }
  }

}
