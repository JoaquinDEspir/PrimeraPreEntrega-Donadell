import express from 'express';
import { productsModel } from '../dao/dbmanagers/models/product.model.js';
import { cartModel } from '../dao/dbmanagers/models/cart.model.js';

const router = express.Router();


router.get('/verproducts', async (req, res) => {
    const { limit = 10, page = 1, sort = 'asc', query } = req.query;
    const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate({}, {limit: 5, page, lean:true})

    res.render('verproducts', { products: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink });
  });



  router.get('/carts/:cartId', async (req, res) => {
    const cartId = req.params.cartId;
  
  
    res.render('cartDetails', { products, cartId });
  });
  
  export default router;