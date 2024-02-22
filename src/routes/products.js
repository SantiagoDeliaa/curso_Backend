import { Router } from 'express';

export default function productsRouter(manager, io) {
    const router = Router();

    // Endpoint para obtener todos los productos o un número limitado si se pasa el parámetro 'limit'
    router.get('/', async (req, res) => {
        try {
            let products = await manager.getProducts();
            if (req.query.limit) {
                products = products.slice(0, parseInt(req.query.limit));
            }
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Endpoint para buscar un producto por ID
    router.get('/:pid', async (req, res) => {
        try {
            const product = await manager.getProductById(req.params.pid);
            if (product) {
                res.json(product);
            } else {
                res.status(404).send('Producto no encontrado');
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Endpoint para agregar un producto nuevo
    router.post('/', async (req, res) => {
        try {
            await manager.addProduct(req.body);
            res.status(201).send('Producto agregado con éxito');
            io.emit('new-product', req.body); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Endpoint para actualizar un producto existente por ID
    router.put('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            await manager.updateProduct(pid, req.body);
            res.status(200).send('Producto actualizado con éxito');
            io.emit('update-product', { id: pid, ...req.body }); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // Endpoint para eliminar un producto por ID
    router.delete('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            await manager.deleteProduct(pid);
            res.status(200).send('Producto eliminado con éxito');
            io.emit('delete-product', pid); 
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}
