import express from 'express';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import { engine } from 'express-handlebars';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketIO(httpServer);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const manager = new ProductManager('./products.json');
const cartManager = new CartManager('./carts.json');
app.use('/api/products', productsRouter(manager, io)); 
app.use('/api/carts', cartsRouter(cartManager, io));   

app.get('/realtimeproducts', (req, res) => {
    manager.getProducts().then(products => {
        res.render('realTimeProducts', { products });
    }).catch(error => {
        res.status(500).send(error.message);
    });
});

io.on('connection', (socket) => {
    console.log(`Cliente conectado [id=${socket.id}]`);

    socket.on('new-product', (product) => {
        socket.broadcast.emit('product-created', product);
    });

    socket.on('delete-product', (productId) => {
        io.emit('product-deleted', productId);
    });

    socket.on('disconnect', () => {
        console.log(`Cliente desconectado [id=${socket.id}]`);
    });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
    console.log(`El servidor está escuchando en http://localhost:${PORT}`);
});
