import express from 'express';
import CartManager from '../dao/dbmanagers/cart.manager.js';
import { productsModel } from '../dao/dbmanagers/models/product.model.js';


const router = express.Router();
const cartManager = new CartManager();

router.get('/', async (req, res) => {
  const carts = await cartManager.getAll();
  res.json(carts);
});

router.get('/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getById(cartId);


    const populatedCart = await Promise.all(cart.products.map(async (product) => {
      const populatedProduct = await productsModel.findById(product.pid).lean(); 
      return { ...product, product: populatedProduct }; 
    }));


    cart.products = populatedCart;

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/', async (req, res) => {
  const newCart = req.body;
  const cart = await cartManager.create(newCart);
  res.json(cart);
});

router.put('/:cid', async (req, res) => {
  const id = req.params.id;
  const updatedCart = req.body;
  const cart = await cartManager.update(id, updatedCart);
  res.json(cart);
});

router.delete('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const success = await cartManager.deleteAllProducts(cartId);
  
  res.json({ success });
});

router.post('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cartId;
  const productId = req.params.productId;
  const success = await cartManager.addProduct(cartId, productId);
  res.json({ success });
});
router.delete('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  const success = await cartManager.removeProduct(cartId, productId);
  res.json({ success });
});
router.put('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const updatedCart = req.body;

  const success = await cartManager.updateCart(cartId, updatedCart);
  res.json({ success });
});

router.put('/:cid/products/:pid', async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const updatedQuantity = req.body.quantity;

  const success = await cartManager.updateProductQuantity(cartId, productId, updatedQuantity);
  res.json({ success });
});

export default router;