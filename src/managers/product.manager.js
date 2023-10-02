import fs from 'fs';

export default class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      console.error('Error al obtener la lista de productos:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      const products = await this.getAll();
      const product = products.find((p) => p.id === id);
      return product;
    } catch (error) {
      console.error('Error al obtener un producto por ID:', error);
      return null;
    }
  }

  async save(products) {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error al guardar los cambios en el archivo JSON de productos:', error);
    }
  }

  async create(newProduct) {
    try {
      const products = await this.getAll();

      // Encontrar el ID máximo actual entre los productos
      let maxId = 0;
      products.forEach((product) => {
        if (product.id > maxId) {
          maxId = product.id;
        }
      });

      // Generar un nuevo ID sumando 1 al ID máximo encontrado
      newProduct.id = maxId + 1;

      // Agregar el nuevo producto al arreglo de productos
      products.push(newProduct);

      // Guardar los cambios en el archivo JSON
      await this.save(products);

      return newProduct;
    } catch (error) {
      console.error('Error al crear un nuevo producto:', error);
      return null;
    }
  }

  async update(updatedProduct) {
    try {
      const products = await this.getAll();
      const index = products.findIndex((product) => product.id === updatedProduct.id);

      if (index === -1) {
        return null; // Producto no encontrado
      }

      // Actualizar el producto con los datos proporcionados
      products[index] = updatedProduct;

      // Guardar los cambios en el archivo JSON
      await this.save(products);

      return updatedProduct;
    } catch (error) {
      console.error('Error al actualizar un producto:', error);
      return null;
    }
  }

  async delete(id) {
    try {
      const products = await this.getAll();
      const index = products.findIndex((product) => product.id === id);

      if (index === -1) {
        return false; // Producto no encontrado
      }

      // Eliminar el producto del arreglo
      products.splice(index, 1);

      // Guardar los cambios en el archivo JSON
      await this.save(products);

      return true; // Producto eliminado correctamente
    } catch (error) {
      console.error('Error al eliminar un producto:', error);
      return false;
    }
  }
}