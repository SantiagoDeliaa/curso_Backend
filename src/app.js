import express from 'express';
import ProductManager from './ProductManager.js'; 

const app = express();
const port = 3000; 

const manager = new ProductManager('./products.json');

app.use(express.json());

// Endpoint para obtener todos los productos o un número limitado si se pasa el parámetro 'limit'
app.get('/products', async (req, res) => {
    try {
        let products = await manager.getProducts();
        if (req.query.limit) {
            products = products.slice(0, parseInt(req.query.limit));
        }
        res.json({ products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para buscar un producto por ID
app.get('/products/:pid', async (req, res) => {
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
app.post('/products', async (req, res) => {
    try {
        await manager.addProduct(req.body);
        res.status(201).send('Producto agregado con éxito');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`El servidor está escuchando en http://localhost:${port}`);
});