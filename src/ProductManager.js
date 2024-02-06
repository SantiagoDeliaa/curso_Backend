import fs from 'fs/promises';
import crypto from 'crypto';

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.init();
    }

    async init() {
        try {
            await fs.access(this.filePath);
        } catch (error) {
            await fs.writeFile(this.filePath, JSON.stringify([]));
        }
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || product.stock === undefined) {
            throw new Error('Todos los campos son obligatorios');
        }

        const products = await this.getProducts();
        if (products.some(prod => prod.code === product.code)) {
            throw new Error('Producto ya existente');
        }

        product.id = crypto.randomBytes(16).toString('hex');
        products.push(product);
        await fs.writeFile(this.filePath, JSON.stringify(products));
    }

    async getProducts() {
        const data = await fs.readFile(this.filePath, 'utf8');
        return JSON.parse(data);
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const product = products.find(prod => prod.id === id);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    }

    async updateProduct(id, newProductData) {
        const products = await this.getProducts();
        const index = products.findIndex(prod => prod.id === id);
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }
        products[index] = { ...products[index], ...newProductData };
        await fs.writeFile(this.filePath, JSON.stringify(products));
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        products = products.filter(prod => prod.id !== id);
        await fs.writeFile(this.filePath, JSON.stringify(products));
    }
}

export default ProductManager;

/*
//----------TESTING-----------
const manager = new ProductManager('./products.json');

async function testManager() {
    try {
    // Test para añadir producto
    console.log('Añadiendo producto...');
        await manager.addProduct({
            title: 'Cafetera',
            description: 'Cafetera automática.',
            price: 24000,
            thumbnail: 'url-de-la-imagen',
            code: 'CAF123',
            stock: 10
        });

    // Test para obtener todos los productos
    console.log('Obteniendo todos los productos...');
    let products = await manager.getProducts();
    console.log(products);

    // Test para buscar producto por ID
    console.log('Buscando producto por ID...');
    let product = await manager.getProductById(products[0].id);
    console.log(product);

    // Test para actualizar producto por ID
    console.log('Actualizando producto...');
    await manager.updateProduct(products[0].id, { price: 25000, stock: 8 });

    // Verificar producto actualizado
    console.log('Verificando producto actualizado...');
    product = await manager.getProductById(products[0].id);
    console.log(product);

    // Test para eliminar producto por ID
    console.log('Eliminando producto...');
    await manager.deleteProduct(products[0].id);

    // Ver lista de productos después de la eliminación
    console.log('Lista de productos después de eliminar:');
    products = await manager.getProducts();
    console.log(products);

    }catch (error) {
    console.error('Error durante las pruebas:', error.message);
    }
}
*/
