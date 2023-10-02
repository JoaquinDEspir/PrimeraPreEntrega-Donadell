import express from 'express';
import ProductManager from '../managers/product.manager.js';


const router = express.Router();
const productManager = new ProductManager('../managers/files/productos.json')

// La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior
router.get('/', async (req, res) => {
    const queryParams = req.query.limit;
    const products = await productManager.getAll();
    console.log("anda inicio");
    if (!queryParams || queryParams > products.length || queryParams <= 0) {
      return res.json(products);
    }
    
    const filteredLimit = products.slice(0, queryParams);
    res.json({ status: 'success', payload: filteredLimit });
  });

//La ruta GET /:pid deberá traer sólo el producto con el id proporcionado
router.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const product = await productManager.getProductsById(pid);
    console.log("anda inicio");
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  });
// La ruta raíz POST / deberá agregar un nuevo producto 
router.post('/', async (req, res) => {
    const newProduct = req.body;
    console.log("anda inicio");
    if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category || !newProduct.thumbnail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
  // Obtener la lista actual de productos
  const products = await productManager.getAll();

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
  await productManager.save(products);
    res.json(newProduct); // Devolver el nuevo producto
  });
//La ruta PUT /:pid deberá tomar un producto y actualizarlo
router.put('/:pid', async (req, res) => {
    const productId = Number(req.params.pid);
    const updatedProduct = req.body;
    console.log("anda inicio");
    if (!updatedProduct.title || !updatedProduct.description || !updatedProduct.code || !updatedProduct.price || !updatedProduct.stock || !updatedProduct.category || !updatedProduct.thumbnail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    // Obtener la lista actual de productos
    const products = await productManager.getAll();
  
    // Encontrar el índice del producto con el ID proporcionado
    const index = products.findIndex((product) => product.id === productId);
  
    // Si no se encontró el producto, devolver un error 404
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  
    // Actualizar el producto con los datos proporcionados
    products[index] = {
      ...updatedProduct,
      id: productId, // Asegurar que el ID no cambie
    };
  
    // Guardar los cambios en el archivo JSON
    await productManager.save(products);
  
    res.json(products[index]); // Devolver el producto actualizado
  });

  router.delete('/:pid', async (req, res) => {
    const productId = Number(req.params.pid);
    console.log("anda inicio");
    // Obtener la lista actual de productos
    const products = await productManager.getAll();
  
    // Encontrar el índice del producto con el ID proporcionado
    const index = products.findIndex((product) => product.id === productId);
  
    // Si no se encontró el producto, devolver un error 404
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  
    // Eliminar el producto del arreglo
    products.splice(index, 1);
  
    // Guardar los cambios en el archivo JSON
    await productManager.save(products);
  
    res.json({ message: 'Producto eliminado correctamente' });
  });
  export default router;