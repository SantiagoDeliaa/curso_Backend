import crypto from 'crypto'


class ProductManager {
    constructor() {
        this.products = []
    }

    addProduct(producto) {
        // Validacion de que todos los campos requeridos estén presentes
        if (!producto.title || !producto.description || !producto.price || !producto.thumbnail || !producto.code || producto.stock === undefined) {
            throw new Error('Todos los campos son obligatorios');
        }

        // Validacion para que el código del producto no se repita
        const existe = this.products.some(prod => prod.code === producto.code);
        if (existe) {
            return "Producto ya existente";
        } else {
          // Uso crypto para generar un id único
            producto.id = crypto.randomBytes(16).toString('hex'); 
            this.products.push(producto);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(code) {
        const product = this.products.find(product => product.code === code);
        if (!product) {
            console.error('Not found');
            return null;
        }
        return product;
    }
}

//----------TESTING-----------
const manager = new ProductManager();

try {
    manager.addProduct({
        title: 'Cafetera',
        description: 'Cafetera automática.',
        price: 24000,
        thumbnail: 'Sin imagen',
        code: 'CAF123',
        stock: 10
    });
    } catch (error) {
    console.error(error.message);
}

// Ver lista de productos
    const allProducts = manager.getProducts();
    console.log(allProducts);

// Buscar producto por codigo
    const product = manager.getProductById('CAF123');
    if (product) {
        console.log(product);
    } else {
        console.log('Producto no encontrado.');
    }