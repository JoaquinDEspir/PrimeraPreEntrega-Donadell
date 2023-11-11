import express from 'express';
import { productsModel } from '../dao/dbmanagers/models/product.model.js';
import CartManager from '../dao/dbmanagers/cart.manager.js';

const router = express.Router();
const cartManager = new CartManager(); 

router.get('/verproducts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const result = await productsModel.paginate({}, { limit, page, lean: true });
    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages } = result;

    const basePath = '/api/views'; 
    const prevLink = hasPrevPage ? `${basePath}/verproducts?page=${prevPage}` : null;
    const nextLink = hasNextPage ? `${basePath}/verproducts?page=${nextPage}` : null;
    
    res.render('verproducts', { products: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink });
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/carts/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;


    const cart = await cartManager.getById(cartId);
    

    const populatedCart = await Promise.all(cart.products.map(async (product) => {
      const populatedProduct = await productsModel.findById(product.pid).lean();

      const productDetails = await productsModel.findById(product.pid).lean();
  return { ...product, title: productDetails.title };
    }));

    cart.products = populatedCart;

    res.render('cart', { cart });
  } catch (error) {
    console.error('Error al obtener los productos del carrito:', error);
    res.status(500).send('Internal Server Error');
  }
});



export default router;
