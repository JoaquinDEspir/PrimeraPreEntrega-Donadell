    import CartManager from '../managers/cart.manager.js';
    import express from 'express';


    const router = express.Router();
    const cartManager = new CartManager('../managers/files/carrito.json')

    //La ruta raíz POST / deberá crear un nuevo carrito
    router.post('/', async (req, res) => {
        try {
            // Generar un ID único para el nuevo carrito
            const newCartId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

            // Objeto para almacenar el nuevo carrito
            const newCart = {
                id: newCartId,
                products: []
            };

            // Obtener la lista actual de carritos
            const carts = await cartManager.getAll();

            // Agregar el nuevo carrito al arreglo de carritos
            carts.push(newCart);

            // Guardar los cambios en el archivo JSON
            await cartManager.save(carts);

            res.json(newCart); // Devolver el nuevo carrito
        } catch (error) {
            console.error('Error al crear un carrito:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    //La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

    router.get('/:cid', async (req, res) => {
        const cartId = req.params.cid;

        try {
            // Obtener la lista actual de carritos
            const carts = await cartManager.getAll();

            // Buscar el carrito por su ID
            const cart = carts.find((c) => c.id === cartId);

            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }

            res.json(cart.products); // Devolver la lista de productos del carrito
        } catch (error) {
            console.error('Error al listar productos de un carrito:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    //La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto
    router.post('/:cid/product/:pid', async (req, res) => {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        try {
            // Obtener la lista actual de carritos
            const carts = await cartManager.getAll();

            // Buscar el carrito por su ID
            const cart = carts.find((c) => c.id === cartId);

            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }

            // Verificar si el producto ya está en el carrito
            const indexProductInCart = cart.products.findIndex((product) => product.id === productId);

            if (indexProductInCart !== -1) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                cart.products[indexProductInCart].quantity++;
            } else {
                // Si el producto no está en el carrito, agregarlo como nuevo objeto
                cart.products.push({ id: productId, quantity: 1 });
            }

            // Guardar los cambios en el archivo JSON
            await cartManager.save(carts);

            res.json(cart.products); // Devolver la lista de productos actualizada del carrito
        } catch (error) {
            console.error('Error al agregar un producto al carrito:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });
    export default router;