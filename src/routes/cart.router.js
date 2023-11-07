import express from 'express';
import CartManager from '../dao/dbmanagers/cart.manager.js';



const router = express.Router();
const cartManager = new CartManager();

router.get('/', async (req, res) => {
  const carts = await cartManager.getAll();
  res.json(carts);
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const cart = await cartManager.getById(id);
  res.json(cart);
});

router.post('/', async (req, res) => {
  const newCart = req.body;
  const cart = await cartManager.create(newCart);
  res.json(cart);
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const updatedCart = req.body;
  const cart = await cartManager.update(id, updatedCart);
  res.json(cart);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const success = await cartManager.delete(id);
  res.json({ success });
});

router.post('/:cartId/products/:productId', async (req, res) => {
  const cartId = req.params.cartId;
  const productId = req.params.productId;
  const success = await cartManager.addProduct(cartId, productId);
  res.json({ success });
});

export default router;