import express from 'express';
import ProductManager from '../dao/dbmanagers/product.manager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || '';
    const query = req.query.query || '';

    const options = {
      limit,
      page,
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : null,
    };


    const filter = query ? { category: query } : {};

    const products = await productManager.getProducts(filter, options);
    const totalProducts = await productManager.getTotalProducts(filter);

    const totalPages = Math.ceil(totalProducts / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const prevLink = hasPrevPage ? `/products?page=${page - 1}&limit=${limit}&sort=${sort}&query=${query}` : null;
    const nextLink = hasNextPage ? `/products?page=${page + 1}&limit=${limit}&sort=${sort}&query=${query}` : null;

    res.json({
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page - 1,
      nextPage: page + 1,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).json({ status: 'error', error: 'Error al obtener la lista de productos' });
  }
});


router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const product = await productManager.getById(id);
  res.json(product);
});

router.post('/', async (req, res) => {
  const newProduct = req.body;
  const product = await productManager.create(newProduct);
  res.json(product);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const updatedProduct = req.body;
  const product = await productManager.update(updatedProduct);
  res.json(product);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const success = await productManager.delete(id);
  res.json({ success });
});

export default router;
