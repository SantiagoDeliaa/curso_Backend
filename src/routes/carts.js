import { Router } from 'express';

export default function cartsRouter(cartManager, io) {
    const router = Router();

    // Endpoint para crear un nuevo carrito
    router.post('/', async (req, res) => {
        try {
            const newCart = await cartManager.createCart();
            res.status(201).json(newCart);
            io.emit('new-cart', newCart); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Endpoint para agregar un producto al carrito
    router.post('/:cid/products/:pid', async (req, res) => {
        try {
            const { cid, pid } = req.params;
            const quantity = req.body.quantity || 1; 
            const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
            res.status(201).send('Producto agregado al carrito');
            io.emit('update-cart', updatedCart); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Endpoint para listar productos de un carrito por ID
    router.get('/:cid/products', async (req, res) => {
        try {
            const cartProducts = await cartManager.getCartProducts(req.params.cid);
            res.json(cartProducts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Endpoint para eliminar un carrito por ID
    router.delete('/:cid', async (req, res) => {
        try {
            await cartManager.deleteCart(req.params.cid);
            res.status(200).send('Carrito eliminado con éxito');
            io.emit('delete-cart', req.params.cid); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}
