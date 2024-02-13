import { Router } from 'express';

export default function cartsRouter(cartManager) {
    const router = Router();

  // Endpoint para crear un nuevo carrito
    router.post('/', async (req, res) => {
        try {
            const newCart = await cartManager.createCart();
            res.status(201).json(newCart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

  // Endpoint para agregar un producto al carrito
    router.post('/:cid/product/:pid', async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const quantity = req.body.quantity || 1; 
            await cartManager.addProductToCart(cid, pid, quantity);
            res.status(201).send('Producto agregado al carrito');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

 // Endpoint para buscar un carrito por ID
    router.get('/:cid', async (req, res) => {
        try {
            const cart = await cartManager.getCartById(req.params.cid);
            if (cart) {
                res.json(cart);
            } else {
                res.status(404).send('Carrito no encontrado');
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}