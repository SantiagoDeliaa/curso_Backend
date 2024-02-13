import express from 'express';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';
import productsRouter from './routes/products.js'
import cartsRouter from './routes/carts.js';


const app = express();
const port = 8080; 

const manager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');

app.use(express.json());

app.use('/api/products', productsRouter(manager));
app.use('/api/carts', cartsRouter(cartManager));

app.listen(port, () => {
    console.log(`El servidor está escuchando en http://localhost:${port}`);
});