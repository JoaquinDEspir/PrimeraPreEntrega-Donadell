import { productsModel } from './models/product.model.js';

export default class ProductManager {
  async getAll() {
    try {
      const products = await productsModel.find();
      return products;
    } catch (error) {
      console.error('Error al obtener la lista de productos:', error);
      return [];
    }

  };
  async getProducts(filter, options) {
    // Realiza una consulta a la base de datos utilizando Mongoose u otro método que estés utilizando
    const products = await productsModel.find(filter)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit)
      .sort(options.sort)
      .lean(); // Asegúrate de usar .lean() si deseas obtener objetos JavaScript planos
  
    return products;
  }

  async getTotalProducts(filter) {
    // Realiza una consulta a la base de datos para contar el número total de productos
    const totalProducts = await productsModel.countDocuments(filter);
    return totalProducts;
  }
  async getById(id) {
    try {
      const product = await productsModel.findById(id);
      return product;
    } catch (error) {
      console.error('Error al obtener un producto por ID:', error);
      return null;
    }
  };

  async create(newProduct) {
    try {
      const product = await productsModel.create(newProduct);
      return product;
    } catch (error) {
      console.error('Error al crear un nuevo producto:', error);
      return null;
    }
  }

  async update(updatedProduct) {
    try {
      const product = await productsModel.findByIdAndUpdate(updatedProduct._id, updatedProduct, {
        new: true,
      });
      return product;
    } catch (error) {
      console.error('Error al actualizar un producto:', error);
      return null;
    }
  }

  async delete(id) {
    try {
      const result = await productsModel.findByIdAndRemove(id);
      return result !== null;
    } catch (error) {
      console.error('Error al eliminar un producto:', error);
      return false;
    }
  }
}
