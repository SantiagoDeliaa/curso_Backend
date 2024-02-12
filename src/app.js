import express from 'express';
import ProductManager from './ProductManager.js';
import productsRouter from './routes/products.js'

const app = express();
const port = 8080; 

const manager = new ProductManager('./products.json');

app.use(express.json());

app.use('/api/products', productsRouter(manager));

app.listen(port, () => {
    console.log(`El servidor está escuchando en http://localhost:${port}`);
});