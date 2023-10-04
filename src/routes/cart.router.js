    import CartManager from '../managers/cart.manager.js';
    import express from 'express';


    const router = express.Router();
    const cartManager = new CartManager('C:/Users/joaqu/Desktop/BackEnd/PrimeraPreEntrega/src/managers/files/carrito.json')

    router.post('/', async (req, res) => {
        try {
            
            const newCartId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

            
            const newCart = {
                id: newCartId,
                products: []
            };

            
            const carts = await cartManager.getAll();

            
            carts.push(newCart);

            
            await cartManager.save(carts);

            res.json(newCart); 
        } catch (error) {
            console.error('Error al crear un carrito:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    router.get('/:cid', async (req, res) => {
        const cartId = req.params.cid;

        try {
            const carts = await cartManager.getAll();

            const cart = carts.find((c) => c.id === cartId);

            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }

            res.json(cart.products); 
        } catch (error) {
            console.error('Error al listar productos de un carrito:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });


    router.post('/:cid/product/:pid', async (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        try {

            const carts = await cartManager.getAll();


            const cart = carts.find((c) => c.id === cartId);

            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }


            const indexProductInCart = cart.products.findIndex((product) => product.id === productId);

            if (indexProductInCart !== -1) {

                cart.products[indexProductInCart].quantity++;
            } else {

                cart.products.push({ id: productId, quantity: 1 });
            }


            await cartManager.save(carts);

            res.json(cart.products); 
        } catch (error) {
            console.error('Error al agregar un producto al carrito:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
    export default router;