import fs from 'fs';

export default class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      const carts = JSON.parse(data);
      return carts;
    } catch (error) {
      console.error('Error al obtener la lista de carritos:', error);
      return [];
    }
  }

  async save(carts) {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error al guardar los cambios en el archivo JSON de carritos:', error);
    }
  }

  async create() {
    try {
      const carts = await this.getAll();

      
      const newCartId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

      
      const newCart = {
        id: newCartId,
        products: [],
      };

      
      carts.push(newCart);

      
      await this.save(carts);

      return newCart;
    } catch (error) {
      console.error('Error al crear un nuevo carrito:', error);
      return null;
    }
  }

  async getById(id) {
    try {
      const carts = await this.getAll();
      const cart = carts.find((c) => c.id === id);
      return cart;
    } catch (error) {
      console.error('Error al obtener un carrito por ID:', error);
      return null;
    }
  }

  async addProduct(cartId, productId) {
    try {
      const carts = await this.getAll();
      const cart = carts.find((c) => c.id === cartId);

      if (!cart) {
        return false;
      }

      
      const existingProduct = cart.products.find((p) => p.id === productId);

      if (existingProduct) {
        existingProduct.quantity += 1; 
      } else {
        cart.products.push({ id: productId, quantity: 1 }); 
      }

      
      await this.save(carts);

      return true; 
    } catch (error) {
      console.error('Error al agregar un producto al carrito:', error);
      return false;
    }
  }
}