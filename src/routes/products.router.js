import express from 'express';
import ProductManager from '../managers/product.manager.js';


const router = express.Router();
const productManager = new ProductManager('C:/Users/joaqu/Desktop/BackEnd/PrimeraPreEntrega/src/managers/files/productos.json')


router.get('/', async (req, res) => {
  const queryParams = req.query.limit;
  const products = await productManager.getAll();
  


  if (!queryParams || queryParams > products.length || queryParams <= 0) {
    return res.json(products);
  }
  
  const filteredLimit = products.slice(0, queryParams);
  res.json({ status: 'success', payload: filteredLimit });
});

router.get('/:pid', async (req, res) => {
    const pid = req.params.pid;
    const product = await productManager.getById(pid);
    console.log("anda inicio");
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  });

  router.post('/', async (req, res) => {
      const newProduct = req.body;
      console.log("anda inicio");
      if (!newProduct.title || !newProduct.description || !newProduct.code || newProduct.price === undefined || newProduct.stock === undefined || !newProduct.category || !newProduct.thumbnail) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      

    const products = await productManager.getAll();


    let maxId = 0;
    products.forEach((product) => {
      if (product.id > maxId) {
        maxId = product.id;
      }
    });


    newProduct.id = Number(maxId) + 1;


    products.push(newProduct);


    await productManager.save(products);
      res.json(newProduct); 
    });
router.put('/:pid', async (req, res) => {
    const productId = Number(req.params.pid);
    const updatedProduct = req.body;
    console.log("anda inicio");
    if (!updatedProduct.title || !updatedProduct.description || !updatedProduct.code || !updatedProduct.price || !updatedProduct.stock || !updatedProduct.category || !updatedProduct.thumbnail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    const products = await productManager.getAll();
  
    const index = products.findIndex((product) => product.id === productId);
  
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  
    products[index] = {
      ...updatedProduct,
      id: productId, 
    };
  

    await productManager.save(products);
  
    res.json(products[index]); 
  });

  router.delete('/:pid', async (req, res) => {
    const productId = Number(req.params.pid);
    console.log("anda inicio");
    const products = await productManager.getAll();
  
    const index = products.findIndex((product) => product.id === productId);
  
    if (index === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  
    products.splice(index, 1);
  
  
    await productManager.save(products);
  
    res.json({ message: 'Producto eliminado correctamente' });
  });
  export default router;